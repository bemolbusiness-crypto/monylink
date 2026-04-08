// =============================================
// Swan Banking-as-a-Service — SEPA Instant
// Docs : https://docs.swan.io/
// GraphQL API + OAuth2 Client Credentials
// =============================================

const SWAN_API_URL = process.env.SWAN_API_URL ?? 'https://api.swan.io/sandbox/graphql'
const SWAN_CLIENT_ID = process.env.SWAN_CLIENT_ID ?? ''
const SWAN_CLIENT_SECRET = process.env.SWAN_CLIENT_SECRET ?? ''
const SWAN_ACCOUNT_ID = process.env.SWAN_ACCOUNT_ID ?? '' // IBAN pool MonyLink

export interface SwanTransferParams {
  amount: number           // EUR (net après frais)
  iban: string             // IBAN destinataire
  bic?: string
  beneficiaryName: string
  label?: string
  sepaRef: string          // référence interne MonyLink ex: MLK-WD-A3F2
}

export interface SwanTransferResult {
  success: boolean
  swanTransactionId?: string
  status?: 'Upcoming' | 'Booked' | 'Rejected' | 'Canceled'
  error?: string
}

// Obtenir un token OAuth2 Swan
async function getSwanToken(): Promise<string> {
  const res = await fetch('https://oauth.swan.io/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: SWAN_CLIENT_ID,
      client_secret: SWAN_CLIENT_SECRET,
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error(`Swan auth failed: ${JSON.stringify(data)}`)
  return data.access_token
}

// Initier un virement SEPA Instant via Swan
export async function initiateSEPATransfer(params: SwanTransferParams): Promise<SwanTransferResult> {
  // Mode sandbox / prototype : simuler la réponse
  if (process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true') {
    return {
      success: true,
      swanTransactionId: `SWAN-SIM-${Date.now()}`,
      status: 'Booked',
    }
  }

  try {
    const token = await getSwanToken()

    // Swan utilise GraphQL
    const mutation = `
      mutation InitiateSepaInstant($accountId: ID!, $amount: AmountInput!, $iban: String!, $bic: String, $name: String!, $label: String, $ref: String!) {
        initiateCreditTransfers(input: {
          accountId: $accountId
          creditTransfers: [{
            amount: $amount
            sepaBeneficiary: {
              iban: $iban
              bic: $bic
              name: $name
              save: false
            }
            label: $label
            reference: $ref
            mode: InstantWithFallback
          }]
        }) {
          ... on InitiateCreditTransfersSuccessPayload {
            creditTransfers {
              id
              statusInfo {
                status
              }
            }
          }
          ... on AccountNotFoundRejection { message }
          ... on ForbiddenRejection { message }
          ... on ValidationRejection { message fields { path message } }
        }
      }
    `

    const variables = {
      accountId: SWAN_ACCOUNT_ID,
      amount: { value: params.amount.toFixed(2), currency: 'EUR' },
      iban: params.iban,
      bic: params.bic ?? null,
      name: params.beneficiaryName,
      label: params.label ?? 'Transfert MonyLink',
      ref: params.sepaRef,
    }

    const res = await fetch(SWAN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: mutation, variables }),
    })

    const json = await res.json()
    const payload = json.data?.initiateCreditTransfers

    if (!payload) {
      return { success: false, error: json.errors?.[0]?.message ?? 'Swan GraphQL error' }
    }

    // Erreurs métier Swan
    if (payload.message) {
      return { success: false, error: payload.message }
    }

    const transfer = payload.creditTransfers?.[0]
    const status = transfer?.statusInfo?.status

    return {
      success: !!transfer,
      swanTransactionId: transfer?.id,
      status,
      error: transfer ? undefined : 'Aucun virement créé',
    }
  } catch (err) {
    console.error('Swan initiateSEPATransfer error:', err)
    return { success: false, error: 'Erreur connexion Swan' }
  }
}

// Vérifier le statut d'un virement Swan par ID
export async function checkSwanTransfer(swanTransactionId: string): Promise<{
  status: string | null
  bookedAt?: string
}> {
  if (process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true') {
    return { status: 'Booked', bookedAt: new Date().toISOString() }
  }

  try {
    const token = await getSwanToken()
    const query = `
      query GetTransfer($id: ID!) {
        transaction(id: $id) {
          statusInfo { status }
          ... on BookedTransaction { bookingDate }
        }
      }
    `
    const res = await fetch(SWAN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables: { id: swanTransactionId } }),
    })
    const json = await res.json()
    const tx = json.data?.transaction
    return {
      status: tx?.statusInfo?.status ?? null,
      bookedAt: tx?.bookingDate,
    }
  } catch {
    return { status: null }
  }
}

// =============================================
// Carte virtuelle Swan
// =============================================

export interface SwanCard {
  id: string
  cardNumber: string   // masqué sauf via PCI-DSS endpoint
  expiryDate: string   // MM/YY
  cvc: string          // masqué sauf via PCI-DSS endpoint
  status: 'Enabled' | 'Suspended' | 'Canceling' | 'Canceled'
  name: string
}

export interface SwanCardResult {
  success: boolean
  card?: SwanCard
  error?: string
}

// Créer une carte virtuelle pour un utilisateur
export async function createVirtualCard(params: {
  accountMembershipId: string
  cardHolderName: string
  spendingLimit?: number  // EUR/mois, défaut 1000€
}): Promise<SwanCardResult> {
  if (process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true') {
    return {
      success: true,
      card: {
        id: `CARD-SIM-${Date.now()}`,
        cardNumber: '4242 4242 4242 4242',
        expiryDate: '12/27',
        cvc: '123',
        status: 'Enabled',
        name: params.cardHolderName,
      },
    }
  }

  try {
    const token = await getSwanToken()
    const mutation = `
      mutation AddCard($input: AddVirtualCardInput!) {
        addVirtualCard(input: $input) {
          ... on AddVirtualCardSuccessPayload {
            card { id statusInfo { status } }
          }
          ... on ForbiddenRejection { message }
          ... on ValidationRejection { message }
        }
      }
    `
    const res = await fetch(SWAN_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            accountMembershipId: params.accountMembershipId,
            spendingLimits: params.spendingLimit ? [{
              amount: { value: String(params.spendingLimit), currency: 'EUR' },
              period: 'Monthly',
            }] : undefined,
            name: params.cardHolderName,
          },
        },
      }),
    })
    const json = await res.json()
    const payload = json.data?.addVirtualCard
    if (!payload || payload.message) return { success: false, error: payload?.message ?? 'Swan card error' }
    return { success: true, card: { id: payload.card.id, cardNumber: '•••• •••• •••• ••••', expiryDate: '••/••', cvc: '•••', status: payload.card.statusInfo.status, name: params.cardHolderName } }
  } catch (err) {
    return { success: false, error: 'Erreur connexion Swan' }
  }
}

// Obtenir les détails sensibles de la carte (PCI-DSS compliant)
export async function getCardSensitiveData(cardId: string): Promise<{ cardNumber: string; cvc: string; expiryDate: string } | null> {
  if (process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true') {
    return { cardNumber: '4242 4242 4242 4242', cvc: '123', expiryDate: '12/27' }
  }
  // En production : Swan utilise un iframe sécurisé pour afficher les données PCI
  // On ne renvoie jamais les données brutes côté serveur
  return null
}

// Bloquer / débloquer une carte
export async function updateCardStatus(cardId: string, action: 'suspend' | 'resume'): Promise<{ success: boolean }> {
  if (process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true') return { success: true }
  try {
    const token = await getSwanToken()
    const mutation = action === 'suspend'
      ? `mutation { suspendPhysicalCard(input: { cardId: "${cardId}" }) { ... on SuspendPhysicalCardSuccessPayload { card { id } } } }`
      : `mutation { resumePhysicalCard(input: { cardId: "${cardId}" }) { ... on ResumePhysicalCardSuccessPayload { card { id } } } }`
    await fetch(SWAN_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ query: mutation }),
    })
    return { success: true }
  } catch {
    return { success: false }
  }
}

// Vérifier la signature d'un webhook Swan
export function verifySwanWebhook(payload: string, signatureHeader: string): boolean {
  if (process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true') return true
  const crypto = require('crypto')
  const secret = process.env.SWAN_WEBHOOK_SECRET ?? ''
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  return `sha256=${expected}` === signatureHeader
}
