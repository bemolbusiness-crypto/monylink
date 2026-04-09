import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

// ── Security Headers ──────────────────────────────────────────────────────────
// Appliqués à toutes les routes.  Cloudflare Turnstile nécessite d'autoriser
// challenges.cloudflare.com en frame-src et connect-src.
const securityHeaders = [
  // Évite le clickjacking
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Empêche le MIME sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Referrer minimal
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // HTTPS strict (prod uniquement — Cloudflare gère le HTTPS en front)
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Désactiver les fonctionnalités inutiles pour une fintech
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // CSP — bloque les injections tout en autorisant Turnstile, Clerk, PostHog, Sentry
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts : Next.js inline scripts requis + CDNs nécessaires
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://*.clerk.com https://js.clerk.dev https://*.posthog.com https://browser.sentry-cdn.com",
      // Styles : Next.js inline + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images : data URIs + blob + tout HTTPS (avatars, etc.)
      "img-src 'self' data: blob: https:",
      // Connexions réseau : Supabase, Clerk, PostHog, Sentry, Turnstile
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.clerk.accounts.dev https://clerk.com https://*.posthog.com https://sentry.io https://*.sentry.io https://challenges.cloudflare.com",
      // Iframes : Turnstile + Clerk (modales auth)
      "frame-src https://challenges.cloudflare.com https://*.clerk.accounts.dev",
      // Workers (Next.js edge)
      "worker-src 'self' blob:",
      // Bloque les iframes embarquant notre app sur d'autres domaines
      "frame-ancestors 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
})
