import posthog from 'posthog-js'

export const Analytics = {
  signup: (p: { region: 'africa' | 'europe'; country: string }) =>
    posthog.capture('signup', p),

  transfer_initiated: (p: { amount_xaf: number; amount_eur: number; method: string }) =>
    posthog.capture('transfer_initiated', p),

  transfer_completed: (p: { amount_eur: number; reference: string }) =>
    posthog.capture('transfer_completed', p),

  withdrawal: (p: { amount_eur: number; net_eur: number }) =>
    posthog.capture('withdrawal', p),

  card_created: () => posthog.capture('card_created'),

  convert: (p: { amount_eur: number; amount_usdc: number; rate: number }) =>
    posthog.capture('convert', p),
}
