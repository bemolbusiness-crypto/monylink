'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (err) { setError(err.message); setLoading(false); return }
    setDone(true)
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

          {!done ? (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>Mot de passe oublié</h1>
                <p style={{ fontSize: 14, color: 'var(--w40)', lineHeight: 1.6 }}>
                  Entre ton email. On t&apos;envoie un lien pour réinitialiser ton mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--w40)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Email
                  </label>
                  <input
                    className="ml-input"
                    type="email"
                    placeholder="ton@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && <div className="error-box">{error}</div>}

                <button type="submit" className="btn-primary" disabled={loading || !email}>
                  {loading ? 'Envoi...' : 'Envoyer le lien →'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Email envoyé !</h2>
              <p style={{ fontSize: 14, color: 'var(--w60)', lineHeight: 1.6, marginBottom: 4 }}>
                Un lien de réinitialisation a été envoyé à
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--orange)', marginBottom: 20 }}>{email}</p>
              <p style={{ fontSize: 12, color: 'var(--w40)', lineHeight: 1.6 }}>
                Vérifie tes spams si tu ne vois rien dans 2 minutes.
              </p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--w40)' }}>
            <Link href="/login" style={{ color: 'var(--orange)', fontWeight: 700, textDecoration: 'none' }}>
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
