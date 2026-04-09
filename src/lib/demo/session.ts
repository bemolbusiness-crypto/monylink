// =============================================
// MonyLink Demo Session — détection runtime
// Cookie : ml-demo=1 (posé par /api/demo/verify après Turnstile)
// =============================================

export const DEMO_COOKIE_NAME = 'ml-demo'
export const DEMO_COOKIE_TTL  = 2 * 60 * 60 // 2h en secondes

/**
 * Détecte le mode démo au runtime (cookie + env var dev).
 * Appelable uniquement côté client (useEffect / gestionnaires d'événements).
 */
export function getIsDemoMode(): boolean {
  // Env var build-time — pratique en dev local
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') return true
  // Cookie runtime posé après passage du Turnstile
  if (typeof window !== 'undefined') {
    return document.cookie.split(';').some(c => c.trim().startsWith(`${DEMO_COOKIE_NAME}=`))
  }
  return false
}

/** Efface la session démo (logout du sandbox). */
export function clearDemoSession(): void {
  if (typeof window !== 'undefined') {
    document.cookie = `${DEMO_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Strict`
  }
}
