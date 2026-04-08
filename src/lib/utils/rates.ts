// =============================================
// Taux de change MonyLink
//
// TAUX CLIENT : ce que le client voit / reçoit
//   1 EUR = 700 XAF  (notre taux de vente)
//
// TAUX INTERBANCAIRE : taux réel du marché
//   1 EUR = 655.96 XAF
//
// Marge MonyLink : (700 - 655.96) / 700 = ~6.3%
// Pas de frais supplémentaires — le taux EST notre revenu
// =============================================

// Taux client (ce qu'on affiche et applique)
export const CLIENT_RATES_TO_EUR: Record<string, number> = {
  EUR: 1,
  XAF: 1 / 700,    // FCFA CEMAC — 700 FCFA = 1€
  XOF: 1 / 700,    // FCFA UEMOA — 700 FCFA = 1€
  NGN: 1 / 1750,   // Naira Nigeria
  GHS: 1 / 17.5,   // Cedi Ghana
  KES: 1 / 155,    // Shilling Kenya
  USD: 1 / 1.09,
}

// Taux interbancaire (notre coût réel, interne)
export const INTERBANK_RATES_TO_EUR: Record<string, number> = {
  EUR: 1,
  XAF: 1 / 655.96,
  XOF: 1 / 655.96,
  NGN: 1 / 1650,
  GHS: 1 / 16.5,
  KES: 1 / 145,
  USD: 1 / 1.09,
}

// Taux client affiché (FCFA par EUR)
export const DISPLAY_RATE: Record<string, number> = {
  XAF: 700, XOF: 700, NGN: 1750, GHS: 17.5, KES: 155,
}

// Convertir devise locale → EUR (taux client)
export function toEur(amount: number, currency: string): number {
  const rate = CLIENT_RATES_TO_EUR[currency] ?? 1
  return amount * rate
}

// Convertir EUR → devise locale (taux client)
export function fromEur(amount: number, currency: string): number {
  const rate = CLIENT_RATES_TO_EUR[currency] ?? 1
  return amount / rate
}

export function getRate(currency: string): number {
  return CLIENT_RATES_TO_EUR[currency] ?? 1
}

// Pas de frais séparés — le taux est notre marge
export function calculateFee(_amountEur: number): number {
  return 0
}

export function netAmountEur(grossEur: number): number {
  return grossEur
}

// Marge MonyLink sur une transaction (pour reporting interne)
export function calculateMargin(amountLocal: number, currency: string): number {
  const clientEur = amountLocal * (CLIENT_RATES_TO_EUR[currency] ?? 1)
  const interbankEur = amountLocal * (INTERBANK_RATES_TO_EUR[currency] ?? 1)
  return interbankEur - clientEur
}

// Frais retrait SEPA : 0.99€ fixe (seuls frais visibles)
export const WITHDRAWAL_FEE_EUR = 0.99

export function getCurrencyLabel(currency: string): string {
  const labels: Record<string, string> = {
    XAF: 'FCFA', XOF: 'FCFA', NGN: 'NGN', GHS: 'GHS', KES: 'KES', EUR: 'EUR', USD: 'USD'
  }
  return labels[currency] ?? currency
}

// Pour affichage : "500 000 FCFA → 714,29 €"
export function formatConversion(amountLocal: number, currency: string): { eur: number; rate: number; label: string } {
  const eur = toEur(amountLocal, currency)
  const rate = DISPLAY_RATE[currency] ?? 1
  return { eur, rate, label: getCurrencyLabel(currency) }
}
