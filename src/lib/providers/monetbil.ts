// =============================================
// Monetbil API Client
// Agrégateur Mobile Money CEMAC (Orange Money CM, MTN MoMo CM)
// Docs : https://monetbil.com/api/
// =============================================

const MONETBIL_API_URL = 'https://api.monetbil.com/widget/v2.1'
const SERVICE_KEY = process.env.MONETBIL_SERVICE_KEY ?? 'sandbox_key'

export interface MonetbilPaymentParams {
  amount: number          // en XAF
  phone: string           // numéro du payeur ex: +237612345678
  reference: string       // identifiant unique MonyLink ex: MLK-A3F2-1712345678
  description?: string
}

export interface MonetbilResponse {
  success: boolean
  payment_url?: string    // URL de paiement à afficher à l'utilisateur
  payment_ref?: string    // référence Monetbil
  error?: string
}

// Initier un paiement Mobile Money via Monetbil
export async function initiateMonetbilPayment(params: MonetbilPaymentParams): Promise<MonetbilResponse> {
  // En sandbox/prototype : simuler la réponse
  if (process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true') {
    return {
      success: true,
      payment_url: `https://sandbox.monetbil.com/pay/${params.reference}`,
      payment_ref: `MON-${Date.now()}`,
    }
  }

  try {
    const body = new URLSearchParams({
      service_key: SERVICE_KEY,
      amount: String(params.amount),
      phone: params.phone,
      payment_ref: params.reference,
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/monetbil`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/topup/success?ref=${params.reference}`,
      description: params.description ?? 'Transfert MonyLink',
    })

    const res = await fetch(MONETBIL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })

    const data = await res.json()
    return {
      success: data.status === 'success',
      payment_url: data.payment_url,
      payment_ref: data.payment_ref,
      error: data.message,
    }
  } catch {
    return { success: false, error: 'Erreur connexion Monetbil' }
  }
}

// Vérifier le statut d'un paiement Monetbil
export async function checkMonetbilPayment(paymentRef: string): Promise<{ paid: boolean; tx_id?: string }> {
  if (process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true') {
    return { paid: true, tx_id: `MON-SIM-${Date.now()}` }
  }

  try {
    const res = await fetch(`https://api.monetbil.com/v1/payment/check/${paymentRef}`, {
      headers: { Authorization: `Bearer ${SERVICE_KEY}` },
    })
    const data = await res.json()
    return { paid: data.status === 'PAID', tx_id: data.transaction_id }
  } catch {
    return { paid: false }
  }
}

// Vérifier la signature d'un webhook Monetbil
export function verifyMonetbilWebhook(payload: Record<string, string>, signature: string): boolean {
  // En sandbox : toujours valide
  if (process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true') return true
  // Production : vérifier HMAC-SHA256
  const crypto = require('crypto')
  const expected = crypto
    .createHmac('sha256', SERVICE_KEY)
    .update(JSON.stringify(payload))
    .digest('hex')
  return expected === signature
}
