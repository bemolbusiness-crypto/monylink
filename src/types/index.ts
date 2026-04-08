// =============================================
// MONYLINK Types
// Un seul compte, deux régions : Africa / Europe
// =============================================

export type Region = 'africa' | 'europe'
export type KycStatus = 'pending' | 'verified' | 'rejected'
export type TransferStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired'
export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type CardStatus = 'active' | 'frozen' | 'canceled'
export type PaymentProvider = 'monetbil' | 'flutterwave' | 'swan_sepa'

// Pays supportés
export const AFRICAN_COUNTRIES = [
  { code: 'CM', name: 'Cameroun',  flag: '🇨🇲', currency: 'XAF', dialCode: '+237' },
  { code: 'GA', name: 'Gabon',     flag: '🇬🇦', currency: 'XAF', dialCode: '+241' },
]

export const EUROPEAN_COUNTRIES = [
  { code: 'FR', name: 'France',    flag: '🇫🇷', currency: 'EUR', dialCode: '+33' },
  { code: 'BE', name: 'Belgique',  flag: '🇧🇪', currency: 'EUR', dialCode: '+32' },
  { code: 'CH', name: 'Suisse',    flag: '🇨🇭', currency: 'EUR', dialCode: '+41' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', currency: 'EUR', dialCode: '+49' },
]

export const ALL_COUNTRIES = [...AFRICAN_COUNTRIES, ...EUROPEAN_COUNTRIES]

export function getRegion(countryCode: string): Region {
  return AFRICAN_COUNTRIES.some(c => c.code === countryCode) ? 'africa' : 'europe'
}

// Méthodes Mobile Money disponibles par pays africain
export const MOBILE_MONEY_METHODS: Record<string, { id: string; label: string; icon: string; color: string }[]> = {
  CM: [
    { id: 'orange_money', label: 'Orange Money',  icon: '🟠', color: '#FF6600' },
    { id: 'mtn_momo',     label: 'MTN MoMo',      icon: '🟡', color: '#FFCC00' },
  ],
  GA: [
    { id: 'orange_money', label: 'Orange Money',  icon: '🟠', color: '#FF6600' },
    { id: 'airtel',       label: 'Airtel Money',  icon: '🔴', color: '#FF0000' },
  ],
}

// =============================================
// Profil utilisateur
// =============================================
export interface Profile {
  id: string
  phone: string
  country: string           // CM, GA, FR, BE...
  region: Region            // 'africa' | 'europe'
  full_name: string
  monylink_id: string       // MLK-A3F2 (unique, alphanum 4 chars)
  email?: string
  kyc_status: KycStatus
  created_at: string
}

// =============================================
// Wallets
// =============================================
export interface Wallet {
  id: string
  user_id: string
  currency: 'XAF' | 'EUR' | 'USDC'
  balance: number
  updated_at: string
}

// =============================================
// Transfer — flux principal Africa → Europe
// =============================================
export interface Transfer {
  id: string
  sender_id: string | null       // null si envoi via lien public (non-inscrit)
  sender_phone: string           // numéro expéditeur
  sender_name: string
  recipient_id: string           // utilisateur Europe
  recipient_mlk_id: string       // MLK-A3F2
  amount_xaf: number             // montant envoyé en FCFA
  amount_eur: number             // montant reçu en EUR
  rate: number                   // taux appliqué (700)
  method: string                 // orange_money | mtn_momo
  status: TransferStatus
  provider_tx_id: string | null
  payment_url: string | null
  reference: string              // MLK-A3F2-XXXXXX
  created_at: string
  completed_at: string | null
}

// =============================================
// Retrait SEPA (Europe → RIB)
// =============================================
export interface Withdrawal {
  id: string
  user_id: string
  amount_eur: number
  fee_eur: number
  net_eur: number
  iban: string
  bic: string | null
  beneficiary_name: string
  label: string | null
  status: WithdrawalStatus
  sepa_ref: string | null
  provider_tx_id: string | null
  created_at: string
}

// =============================================
// Carte virtuelle (Europe)
// =============================================
export interface Card {
  id: string
  user_id: string
  swan_card_id: string
  last4: string
  expiry: string
  holder_name: string
  status: CardStatus
  spending_limit_eur: number
  created_at: string
}

// =============================================
// Conversion crypto (Europe)
// =============================================
export interface CryptoConversion {
  id: string
  user_id: string
  from_currency: 'EUR'
  to_currency: 'USDC' | 'BTC'
  amount_from: number
  amount_to: number
  rate: number
  status: 'completed' | 'failed'
  created_at: string
}

// Legacy — conservé pour compatibilité webhooks
export type MobileMoneyMethod =
  | 'orange_money'
  | 'mtn_momo'
  | 'airtel'
  | 'mpesa'
  | 'wave'
  | 'mtn_ng'
  | 'sepa_credit'

export type Currency = 'EUR' | 'XAF' | 'XOF' | 'NGN' | 'GHS' | 'USD' | 'USDC'

export interface PaymentRequest {
  id: string
  user_id: string
  reference: string
  amount_local: number
  currency_local: Currency
  amount_eur: number | null
  exchange_rate: number | null
  fee_eur: number
  provider: PaymentProvider
  method: MobileMoneyMethod
  status: TransferStatus
  provider_tx_id: string | null
  expires_at: string
  created_at: string
}

export interface OutgoingTransfer {
  id: string
  user_id: string
  reference: string
  amount_eur: number
  fee_eur: number
  amount_local: number
  currency_local: string
  recipient_phone: string
  recipient_name: string
  method: MobileMoneyMethod
  country: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  provider_tx_id: string | null
  created_at: string
}

// Legacy compatibility
export const COUNTRIES = ALL_COUNTRIES
export const METHODS_BY_COUNTRY: Record<string, { method: MobileMoneyMethod; label: string; icon: string }[]> = {
  CM: [
    { method: 'orange_money', label: 'Orange Money', icon: '🟠' },
    { method: 'mtn_momo',     label: 'MTN MoMo',     icon: '🟡' },
  ],
  GA: [
    { method: 'orange_money', label: 'Orange Money', icon: '🟠' },
    { method: 'airtel',       label: 'Airtel Money',  icon: '🔴' },
  ],
}
export const METHOD_PROVIDER: Record<MobileMoneyMethod, PaymentProvider> = {
  orange_money: 'monetbil', mtn_momo: 'monetbil',
  wave: 'flutterwave', mtn_ng: 'flutterwave',
  airtel: 'flutterwave', mpesa: 'flutterwave',
  sepa_credit: 'swan_sepa',
}
