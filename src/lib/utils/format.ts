// Devises locales africaines sans support Intl natif
const LOCAL_CURRENCIES: Record<string, string> = {
  XAF: 'FCFA', XOF: 'FCFA', NGN: '₦', GHS: 'GH₵', KES: 'KSh'
}

export function formatCurrency(amount: number, currency: string): string {
  const localSymbol = LOCAL_CURRENCIES[currency]
  if (localSymbol) {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' ' + localSymbol
  }
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}
