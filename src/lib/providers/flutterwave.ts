// =============================================
// Flutterwave API Client
// Pan-africain : Wave, MTN NG, Airtel, M-Pesa...
// Docs : https://developer.flutterwave.com/
// =============================================

const FLW_API_URL = 'https://api.flutterwave.com/v3'
const FLW_SECRET = process.env.FLUTTERWAVE_SECRET_KEY ?? 'sandbox_key'

export interface FlutterwaveChargeParams {
  amount: number          // en devise locale (XOF, NGN, GHS...)
  currency: string        // XOF | NGN | GHS | KES
  phone: string           // numéro du payeur
  reference: string       // tx_ref MonyLink unique
  method: string          // mobilemoneyfranco | mobilemoneyrwanda | mpesa...
  email?: string
  fullname?: string
}

export interface FlutterwaveResponse {
  success: boolean
  redirect_url?: string   // URL de paiement Wave / opérateur
  flw_ref?: string
  error?: string
}

// Mapping méthode MonyLink → type Flutterwave
const FLW_METHOD_MAP: Record<string, string> = {
  wave:    'mobilemoneyfranco',  // Wave SN/CI
  mtn_ng:  'mobilemoneynigeria',
  airtel:  'mobilemoneyzambia',
  mpesa:   'mpesa',
}

// Initier un paiement Mobile Money via Flutterwave
export async function initiateFlutterwavePayment(params: FlutterwaveChargeParams): Promise<FlutterwaveResponse> {
  if (process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true') {
    return {
      success: true,
      redirect_url: `https://ravemodal-dev.herokuapp.com/simulatetx?ref=${params.reference}`,
      flw_ref: `FLW-${Date.now()}`,
    }
  }

  try {
    const payload = {
      tx_ref: params.reference,
      amount: params.amount,
      currency: params.currency,
      payment_type: FLW_METHOD_MAP[params.method] ?? 'mobilemoneyfranco',
      phone_number: params.phone,
      email: params.email ?? 'user@monylink.app',
      fullname: params.fullname ?? 'MonyLink User',
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/topup/success?ref=${params.reference}`,
      meta: { monylink_ref: params.reference },
    }

    const res = await fetch(`${FLW_API_URL}/charges?type=${payload.payment_type}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${FLW_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    return {
      success: data.status === 'success',
      redirect_url: data.meta?.authorization?.redirect,
      flw_ref: data.data?.flw_ref,
      error: data.message,
    }
  } catch {
    return { success: false, error: 'Erreur connexion Flutterwave' }
  }
}

// =============================================
// Flutterwave Disbursements (envoi Mobile Money sortant vers Afrique)
// =============================================

export interface FlutterwaveDisbursementParams {
  amount: number        // en devise locale (XAF, XOF, NGN, KES...)
  currency: string
  phone: string         // numéro du destinataire
  network: string       // MTN | ORANGE | WAVE | MPESA...
  beneficiaryName: string
  reference: string     // référence unique MonyLink
  narration?: string
}

export interface FlutterwaveDisbursementResult {
  success: boolean
  transferId?: string
  status?: string
  error?: string
}

// Mapping réseau MonyLink → code Flutterwave
const NETWORK_MAP: Record<string, string> = {
  orange_money: 'ORANGE',
  mtn_momo:     'MTN',
  wave:         'WAVE',
  mtn_ng:       'MTN',
  airtel:       'AIRTEL',
  mpesa:        'MPESA',
}

export async function initiateDisbursement(params: FlutterwaveDisbursementParams): Promise<FlutterwaveDisbursementResult> {
  if (process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true') {
    return { success: true, transferId: `FLW-DIS-${Date.now()}`, status: 'PENDING' }
  }

  try {
    const res = await fetch(`${FLW_API_URL}/transfers`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${FLW_SECRET}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account_bank: NETWORK_MAP[params.network] ?? params.network,
        account_number: params.phone.replace(/\s|\+/g, ''),
        amount: params.amount,
        currency: params.currency,
        beneficiary_name: params.beneficiaryName,
        reference: params.reference,
        narration: params.narration ?? 'Transfert MonyLink',
        debit_currency: 'EUR',
      }),
    })
    const data = await res.json()
    return {
      success: data.status === 'success',
      transferId: data.data?.id,
      status: data.data?.status,
      error: data.message,
    }
  } catch {
    return { success: false, error: 'Erreur connexion Flutterwave' }
  }
}

// Vérifier une transaction Flutterwave par tx_ref
export async function verifyFlutterwaveTransaction(txRef: string): Promise<{ paid: boolean; amount?: number; currency?: string }> {
  if (process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true') {
    return { paid: true, amount: 50000, currency: 'XOF' }
  }

  try {
    const res = await fetch(`${FLW_API_URL}/transactions/verify_by_reference?tx_ref=${txRef}`, {
      headers: { Authorization: `Bearer ${FLW_SECRET}` },
    })
    const data = await res.json()
    const ok = data.status === 'success' && data.data?.status === 'successful'
    return {
      paid: ok,
      amount: data.data?.amount,
      currency: data.data?.currency,
    }
  } catch {
    return { paid: false }
  }
}
