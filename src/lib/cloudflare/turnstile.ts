// =============================================
// Cloudflare Turnstile — vérification serveur
// Docs : https://developers.cloudflare.com/turnstile/
//
// Clés de test Cloudflare (fonctionnent sans compte) :
//   Site key  : 1x00000000000000000000AA  (toujours OK)
//   Secret    : 1x0000000000000000000000000000000AA
// =============================================

import { DEMO_COOKIE_NAME, DEMO_COOKIE_TTL } from '@/lib/demo/session'

const CF_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * Vérifie un token Turnstile côté serveur.
 * Utilise les clés de test Cloudflare si les variables d'env sont absentes.
 */
export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret =
    process.env.CF_TURNSTILE_SECRET_KEY ||
    '1x0000000000000000000000000000000AA' // clé test — passe toujours

  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.append('remoteip', ip)

  try {
    const res = await fetch(CF_VERIFY_URL, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      // Timeout 5s pour ne pas bloquer l'UX
      signal: AbortSignal.timeout(5000),
    })
    const data: { success: boolean; 'error-codes'?: string[] } = await res.json()
    return data.success === true
  } catch {
    // En cas d'erreur réseau, on laisse passer en dev, on bloque en prod
    return process.env.NODE_ENV !== 'production'
  }
}

/**
 * Génère le header Set-Cookie pour la session démo.
 * Cookie non-httpOnly pour que le client puisse le lire (getIsDemoMode).
 */
export function buildDemoCookieHeader(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${DEMO_COOKIE_NAME}=1; Path=/; Max-Age=${DEMO_COOKIE_TTL}; SameSite=Strict${secure}`
}
