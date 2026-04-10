'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase injecte le token dans le hash — attendre que la session soit établie
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas'); return }
    if (password.length < 8) { setError('8 caractères minimum'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) { setError(err.message); setLoading(false); return }
    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2000)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, #F97316, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <circle cx="7" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
                <circle cx="13" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
              </svg>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800 }}>Mony<span style={{ color: 'var(--purple)' }}>Link</span></span>
          </Link>
        </div>

        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border-p)', borderRadius: 24, padding: '28px 24px' }}>

          {done ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,211,176,0.15)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>✓</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Mot de passe mis à jour !</h2>
              <p style={{ fontSize: 14, color: 'var(--w60)' }}>Redirection en cours...</p>
            </div>
          ) : !ready ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--orange)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ fontSize: 14, color: 'var(--w40)' }}>Vérification du lien...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>Nouveau mot de passe</h1>
                <p style={{ fontSize: 14, color: 'var(--w40)', lineHeight: 1.6 }}>Choisis un mot de passe sécurisé.</p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--w40)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Nouveau mot de passe
                  </label>
                  <input className="ml-input" type="password" placeholder="8 caractères minimum"
                    value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--w40)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Confirmer
                  </label>
                  <input className="ml-input" type="password" placeholder="Répète le mot de passe"
                    value={confirm} onChange={e => setConfirm(e.target.value)} required />
                </div>

                {error && <div className="error-box">{error}</div>}

                <button type="submit" className="btn-primary" disabled={loading || !password || !confirm}>
                  {loading ? 'Mise à jour...' : 'Confirmer →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
