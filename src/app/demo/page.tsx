'use client'

// =============================================
// /demo — Entrée du sandbox sécurisé MonyLink
// Cloudflare Turnstile gate → cookie ml-demo=1 → /dashboard
// =============================================

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
          theme?: 'dark' | 'light' | 'auto'
        }
      ) => string
      reset: (widgetId: string) => void
    }
  }
}

const FEATURES = [
  { icon: '📊', label: 'Tableau de bord wallet' },
  { icon: '↔️', label: 'Transfert Afrique → Europe' },
  { icon: '💳', label: 'Carte virtuelle Visa' },
  { icon: '📜', label: 'Historique des transactions' },
  { icon: '⟳',  label: 'Conversion EUR → USDC' },
  { icon: '↑',  label: 'Retrait SEPA simulé' },
]

export default function DemoPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const pendingToken = useRef<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [region, setRegion] = useState<'africa' | 'europe'>('europe')
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    // Si déjà en mode démo → rediriger directement
    if (document.cookie.includes('ml-demo=1')) {
      router.replace('/dashboard')
      return
    }

    // Charger le script Turnstile (render=explicit pour contrôler le moment du rendu)
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => renderWidget()
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function renderWidget() {
    if (!containerRef.current || !window.turnstile) return
    // Clé de test Cloudflare (toujours OK) si pas de clé configurée
    const sitekey =
      process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

    widgetId.current = window.turnstile.render(containerRef.current, {
      sitekey,
      theme: 'dark',
      callback: handleToken,
      'error-callback': () => setError('Erreur de vérification. Réessaie.'),
      'expired-callback': () => setError('Session expirée. Réessaie.'),
    })
  }

  function handleToken(token: string) {
    // Stocker le token mais ne pas rediriger automatiquement
    pendingToken.current = token
    setVerified(true)
  }

  async function handleEnter() {
    if (!pendingToken.current) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/demo/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: pendingToken.current }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Vérification échouée')
        if (widgetId.current) window.turnstile?.reset(widgetId.current)
        setVerified(false)
        pendingToken.current = null
        setLoading(false)
        return
      }
      sessionStorage.setItem('ml-demo-region', region)
      router.replace('/dashboard')
    } catch {
      setError('Erreur réseau. Réessaie.')
      if (widgetId.current) window.turnstile?.reset(widgetId.current)
      setVerified(false)
      pendingToken.current = null
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg2)', border: '0.5px solid var(--border-p)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M3 8Q3 3 8 3Q10 3 10 6.5Q10 3 12.5 3Q17 3 17 8Q17 13 10 17Q3 13 3 8Z" fill="none" stroke="#F97316" strokeWidth="1.7" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 22, fontWeight: 800 }}>Mony<span style={{ color: 'var(--purple)' }}>Link</span></span>
        </Link>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.12)', border: '0.5px solid rgba(249,115,22,0.3)', color: 'var(--orange)', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 100, letterSpacing: '0.5px', marginBottom: 16 }}>
          🧪 SANDBOX SÉCURISÉ
        </div>

        <h1 style={{ fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 10 }}>
          Essaie MonyLink<br />
          <span style={{ color: 'var(--orange)' }}>sans créer de compte</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--w60)', lineHeight: 1.6, maxWidth: 340 }}>
          Données fictives · aucun paiement réel · aucune inscription requise.
        </p>
      </div>

      {/* Fonctionnalités disponibles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24, width: '100%', maxWidth: 360 }}>
        {FEATURES.map(f => (
          <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '9px 12px', fontSize: 12, color: 'var(--w60)' }}>
            <span style={{ fontSize: 15 }}>{f.icon}</span> {f.label}
          </div>
        ))}
      </div>

      {/* Sélection région */}
      <div style={{ width: '100%', maxWidth: 360, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, textAlign: 'center' }}>
          Choisir un profil démo
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button
            onClick={() => setRegion('africa')}
            style={{ padding: '14px 10px', borderRadius: 14, cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', background: region === 'africa' ? 'linear-gradient(135deg,rgba(249,115,22,.18),rgba(249,115,22,.06))' : 'var(--bg2)', border: `1px solid ${region === 'africa' ? 'rgba(249,115,22,.5)' : 'var(--border)'}`, transition: 'all .2s' }}
          >
            <div style={{ fontSize: 22, marginBottom: 5 }}>🌍</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: region === 'africa' ? 'var(--orange)' : '#fff' }}>Amadou</div>
            <div style={{ fontSize: 11, color: 'var(--w40)', marginTop: 2 }}>Cameroun · FCFA</div>
          </button>
          <button
            onClick={() => setRegion('europe')}
            style={{ padding: '14px 10px', borderRadius: 14, cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', background: region === 'europe' ? 'linear-gradient(135deg,rgba(139,92,246,.18),rgba(139,92,246,.06))' : 'var(--bg2)', border: `1px solid ${region === 'europe' ? 'rgba(139,92,246,.5)' : 'var(--border)'}`, transition: 'all .2s' }}
          >
            <div style={{ fontSize: 22, marginBottom: 5 }}>🇫🇷</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: region === 'europe' ? 'var(--purple)' : '#fff' }}>Kevin</div>
            <div style={{ fontSize: 11, color: 'var(--w40)', marginTop: 2 }}>France · EUR</div>
          </button>
        </div>
      </div>

      {/* Turnstile widget + CTA */}
      <div style={{ width: '100%', maxWidth: 360, background: 'var(--bg2)', border: '0.5px solid var(--border-p)', borderRadius: 20, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: 12, color: 'var(--w40)', textAlign: 'center' }}>
          Vérification anti-bot requise
        </div>

        {/* Conteneur Turnstile */}
        <div ref={containerRef} style={{ minHeight: 65, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />

        {verified && !loading && (
          <button onClick={handleEnter} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            Entrer dans la démo {region === 'africa' ? '🌍' : '🇫🇷'} →
          </button>
        )}

        {loading && (
          <div style={{ fontSize: 13, color: 'var(--w60)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--orange)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
            Ouverture du sandbox...
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,.1)', border: '0.5px solid rgba(239,68,68,.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#ef4444', textAlign: 'center', width: '100%' }}>
            {error}
          </div>
        )}

        <div style={{ fontSize: 11, color: 'var(--w20)', textAlign: 'center' }}>
          Protégé par Cloudflare Turnstile · Données 100 % fictives
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <p style={{ fontSize: 12, color: 'var(--w20)', marginTop: 20 }}>
        Déjà un compte ?{' '}
        <Link href="/login" style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: 600 }}>
          Se connecter
        </Link>
      </p>
    </div>
  )
}
