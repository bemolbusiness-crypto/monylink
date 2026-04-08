// =============================================
// Données démo MonyLink
// Deux utilisateurs : Amadou (CM) + Kevin (FR)
// NEXT_PUBLIC_DEMO_MODE=true
// =============================================
import type { Profile, Wallet, Transfer, Withdrawal, Card } from '@/types'

// ─── UTILISATEUR AFRIQUE ─────────────────────
export const DEMO_PROFILE_AFRICA: Profile = {
  id: 'demo-africa-001',
  phone: '+237 612 345 678',
  country: 'CM',
  region: 'africa',
  full_name: 'Amadou Mbarga',
  monylink_id: 'MLK-B7K1',
  kyc_status: 'verified',
  created_at: '2025-01-10T08:00:00Z',
}

export const DEMO_WALLET_XAF: Wallet = {
  id: 'wallet-xaf-001',
  user_id: 'demo-africa-001',
  currency: 'XAF',
  balance: 250000,
  updated_at: new Date().toISOString(),
}

// ─── UTILISATEUR EUROPE ──────────────────────
export const DEMO_PROFILE_EUROPE: Profile = {
  id: 'demo-europe-001',
  phone: '+33 6 12 34 56 78',
  country: 'FR',
  region: 'europe',
  full_name: 'Kevin Atangana',
  monylink_id: 'MLK-A3F2',
  kyc_status: 'verified',
  created_at: '2025-01-15T10:00:00Z',
}

export const DEMO_WALLET_EUR: Wallet = {
  id: 'wallet-eur-001',
  user_id: 'demo-europe-001',
  currency: 'EUR',
  balance: 247.50,
  updated_at: new Date().toISOString(),
}

export const DEMO_WALLET_USDC: Wallet = {
  id: 'wallet-usdc-001',
  user_id: 'demo-europe-001',
  currency: 'USDC',
  balance: 54.20,
  updated_at: new Date().toISOString(),
}

export const DEMO_CARD: Card = {
  id: 'demo-card-001',
  user_id: 'demo-europe-001',
  swan_card_id: 'SWAN-CARD-SIM',
  last4: '4242',
  expiry: '12/27',
  holder_name: 'Kevin Atangana',
  status: 'active',
  spending_limit_eur: 1000,
  created_at: '2025-01-20T10:00:00Z',
}

// ─── TRANSFERTS (Africa → Europe) ────────────
export const DEMO_TRANSFERS: Transfer[] = [
  {
    id: 'tr-001',
    sender_id: 'demo-africa-001',
    sender_phone: '+237 612 345 678',
    sender_name: 'Amadou Mbarga',
    recipient_id: 'demo-europe-001',
    recipient_mlk_id: 'MLK-A3F2',
    amount_xaf: 500000,
    amount_eur: 714.29,
    rate: 700,
    method: 'orange_money',
    status: 'completed',
    provider_tx_id: 'MON-8847291',
    payment_url: null,
    reference: 'MLK-A3F2-LK3M9',
    created_at: '2025-03-01T11:00:00Z',
    completed_at: '2025-03-01T11:00:42Z',
  },
  {
    id: 'tr-002',
    sender_id: null,
    sender_phone: '+237 699 876 543',
    sender_name: 'Marie Atangana',
    recipient_id: 'demo-europe-001',
    recipient_mlk_id: 'MLK-A3F2',
    amount_xaf: 200000,
    amount_eur: 285.71,
    rate: 700,
    method: 'mtn_momo',
    status: 'completed',
    provider_tx_id: 'MON-8841033',
    payment_url: null,
    reference: 'MLK-A3F2-MN4X1',
    created_at: '2025-03-10T14:30:00Z',
    completed_at: '2025-03-10T14:31:05Z',
  },
  {
    id: 'tr-003',
    sender_id: 'demo-africa-001',
    sender_phone: '+237 612 345 678',
    sender_name: 'Amadou Mbarga',
    recipient_id: 'demo-europe-001',
    recipient_mlk_id: 'MLK-A3F2',
    amount_xaf: 100000,
    amount_eur: 142.86,
    rate: 700,
    method: 'orange_money',
    status: 'pending',
    provider_tx_id: null,
    payment_url: 'https://sandbox.monetbil.com/pay/MLK-A3F2-PQ7R2',
    reference: 'MLK-A3F2-PQ7R2',
    created_at: new Date().toISOString(),
    completed_at: null,
  },
]

// Envois depuis l'Afrique (vue Amadou)
export const DEMO_SENT_TRANSFERS = DEMO_TRANSFERS.filter(
  t => t.sender_id === 'demo-africa-001'
)

// Reçus en Europe (vue Kevin)
export const DEMO_RECEIVED_TRANSFERS = DEMO_TRANSFERS

// ─── RETRAITS SEPA (Europe) ──────────────────
export const DEMO_WITHDRAWALS: Withdrawal[] = [
  {
    id: 'wd-001',
    user_id: 'demo-europe-001',
    amount_eur: 100,
    fee_eur: 0.99,
    net_eur: 99.01,
    iban: 'FR7630004000031234567890143',
    bic: 'BNPAFRPP',
    beneficiary_name: 'Kevin Atangana',
    label: 'Loyer',
    status: 'completed',
    sepa_ref: 'MLK-WD-LK2P8',
    provider_tx_id: 'SWAN-TX-001',
    created_at: '2025-02-20T09:15:00Z',
  },
]

// ─── HELPERS ─────────────────────────────────
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

// Profil actif en démo — basé sur NEXT_PUBLIC_DEMO_REGION
export function getDemoProfile(): Profile {
  const region = process.env.NEXT_PUBLIC_DEMO_REGION ?? 'europe'
  return region === 'africa' ? DEMO_PROFILE_AFRICA : DEMO_PROFILE_EUROPE
}

// Wallet principal selon la région
export function getDemoWallet(): Wallet {
  const region = process.env.NEXT_PUBLIC_DEMO_REGION ?? 'europe'
  return region === 'africa' ? DEMO_WALLET_XAF : DEMO_WALLET_EUR
}

// Alias pour compatibilité avec les pages existantes
export const DEMO_PROFILE = DEMO_PROFILE_EUROPE
export const DEMO_WALLET = DEMO_WALLET_EUR
export const DEMO_TOPUPS = DEMO_TRANSFERS.map(t => ({
  id: t.id,
  user_id: t.recipient_id,
  reference: t.reference,
  amount_local: t.amount_xaf,
  currency_local: 'XAF' as const,
  amount_eur: t.amount_eur,
  exchange_rate: t.rate,
  fee_eur: 0,
  provider: 'monetbil' as const,
  method: t.method as 'orange_money' | 'mtn_momo',
  status: t.status,
  provider_tx_id: t.provider_tx_id,
  expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  created_at: t.created_at,
}))
export const DEMO_OUTGOING: never[] = []
