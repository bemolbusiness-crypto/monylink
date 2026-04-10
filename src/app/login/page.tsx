'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'phone' | 'email'>('email')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    try {
      if (mode === 'phone') {
        const { error: err } = await supabase.auth.signInWithOtp({ phone: identifier.replace(/\s/g, '') })
        if (err) throw err
        setShowOtp(true)
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email: identifier, password })
        if (err) throw err
        router.push('/dashboard')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Identifiant ou mot de passe incorrect.')
    } finally { setLoading(false) }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    try {
      const { error: err } = await supabase.auth.verifyOtp({
        phone: identifier.replace(/\s/g, ''), token: otpCode, type: 'sms',
      })
      if (err) throw err
      router.push('/dashboard')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Code invalide.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', overflow: 'hidden' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:rotateX(10deg) rotateY(-15deg) translateY(0)} 50%{transform:rotateX(10deg) rotateY(-15deg) translateY(-12px)} }
        @keyframes orbit { from{transform:rotate(0deg) translateX(110px) rotate(0deg)} to{transform:rotate(360deg) translateX(110px) rotate(-360deg)} }
        @keyframes orbit2 { from{transform:rotate(180deg) translateX(82px) rotate(-180deg)} to{transform:rotate(540deg) translateX(82px) rotate(-540deg)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glowPulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.06)} }
        .login-left { display:flex; }
        .login-right { width:45%; }
        @media (max-width:768px) {
          .login-left { display:none !important; }
          .login-right { width:100% !important; padding:40px 24px !important; }
        }
      `}</style>

      {/* ── LEFT branding panel ── */}
      <div className="login-left" style={{
        width: '55%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(145deg, #0a071e 0%, #180d35 50%, #0e1828 100%)',
        padding: '60px 48px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.14) 0%,transparent 70%)', animation: 'glowPulse 6s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '-10%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo top-left */}
        <div style={{ position: 'absolute', top: 28, left: 36, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, #F97316, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(249,115,22,0.3)' }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="7" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
              <circle cx="13" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
            </svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.3 }}>
            Mony<span style={{ color: 'var(--purple)' }}>Link</span>
          </span>
        </div>

        {/* Phone mockup with orbiting badges */}
        <div style={{ position: 'relative', marginBottom: 48 }}>
          <div style={{ position: 'absolute', width: 0, height: 0, animation: 'orbit 9s linear infinite' }}>
            <div style={{ background: 'rgba(249,115,22,0.12)', border: '0.5px solid rgba(249,115,22,0.35)', borderRadius: 100, padding: '5px 13px', fontSize: 11, fontWeight: 700, color: 'var(--orange)', whiteSpace: 'nowrap', transform: 'translateX(-50%)' }}>+€47,85 reçu ⚡</div>
          </div>
          <div style={{ position: 'absolute', width: 0, height: 0, animation: 'orbit2 12s linear infinite' }}>
            <div style={{ background: 'rgba(34,211,176,0.12)', border: '0.5px solid rgba(34,211,176,0.35)', borderRadius: 100, padding: '5px 13px', fontSize: 11, fontWeight: 700, color: 'var(--teal)', whiteSpace: 'nowrap', transform: 'translateX(-50%)' }}>🌍 → 🇪🇺 30s</div>
          </div>

          {/* Phone */}
          <div style={{ animation: 'float 4.5s ease-in-out infinite', perspective: '1200px' }}>
            <div style={{ width: 220, height: 390, background: 'linear-gradient(160deg, #221848 0%, #16103a 100%)', border: '5px solid #2a1f50', borderRadius: 42, boxShadow: '0 48px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 56, height: 5, background: '#160e30', borderRadius: 3 }} />
              <div style={{ padding: '30px 14px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: -0.3 }}>Mony<span style={{ color: 'var(--purple)' }}>Link</span></span>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>👤</div>
                </div>
                {/* Balance card */}
                <div style={{ background: 'linear-gradient(135deg, #1a3052, #2a1848)', border: '0.5px solid rgba(139,92,246,0.2)', borderRadius: 16, padding: '14px' }}>
                  <div style={{ fontSize: 8, color: 'var(--w40)', marginBottom: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Solde EUR</div>
                  <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>€ 247,30</div>
                  <div style={{ fontSize: 9, color: 'var(--teal)', marginTop: 2, fontWeight: 700 }}>≈ 173 110 FCFA</div>
                </div>
                {/* MLK ID */}
                <div style={{ background: 'rgba(249,115,22,0.07)', border: '0.5px solid rgba(249,115,22,0.25)', borderRadius: 10, padding: '8px 10px' }}>
                  <div style={{ fontSize: 7, color: 'var(--w40)', fontWeight: 700, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.8 }}>Identifiant</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 800, color: 'var(--orange)', letterSpacing: 1 }}>MLK-A3F2</div>
                </div>
                {/* Mini actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {[['↓', 'Recevoir', 'var(--teal)'], ['⟳', 'Crypto', 'var(--purple)']].map(([icon, lbl, c]) => (
                    <div key={lbl} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <span style={{ fontSize: 14, color: c }}>{icon}</span>
                      <span style={{ fontSize: 8, color: 'var(--w40)', fontWeight: 700 }}>{lbl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', animation: 'slideUp 0.9s ease 0.3s both', position: 'relative' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.15, marginBottom: 12, letterSpacing: -0.5 }}>
            De l&apos;Afrique<br /><span style={{ color: 'var(--orange)' }}>vers l&apos;Europe</span><br />en 30 secondes
          </h2>
          <p style={{ fontSize: 14, color: 'var(--w40)', maxWidth: 280, margin: '0 auto', lineHeight: 1.65 }}>
            Orange Money, MTN MoMo — ton bénéficiaire reçoit sur son RIB via SEPA Instant.
          </p>
        </div>
      </div>

      {/* ── RIGHT form panel ── */}
      <div className="login-right" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px', borderLeft: '0.5px solid var(--border)',
      }}>
        <div style={{ width: '100%', maxWidth: 360, animation: 'slideUp 0.5s ease both' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>Bon retour 👋</h1>
          <p style={{ fontSize: 14, color: 'var(--w40)', marginBottom: 28, lineHeight: 1.6 }}>
            Connecte-toi à ton compte MonyLink
          </p>

          {/* Mode tabs */}
          <div style={{ display: 'flex', background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 14, padding: 4, marginBottom: 24, gap: 4 }}>
            {(['email', 'phone'] as const).map(m => (
              <button key={m} type="button"
                onClick={() => { setMode(m); setIdentifier(''); setShowOtp(false); setError('') }}
                style={{
                  flex: 1, padding: '9px', borderRadius: 11,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', border: 'none',
                  background: mode === m ? 'var(--orange)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--w40)',
                  transition: 'background 0.2s, color 0.2s',
                  boxShadow: mode === m ? 'var(--shadow-orange)' : 'none',
                }}>
                {m === 'phone' ? '📱 Téléphone' : '📧 Email'}
              </button>
            ))}
          </div>

          {!showOtp ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--w40)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {mode === 'phone' ? 'Numéro de téléphone' : 'Email'}
                </label>
                <input type={mode === 'phone' ? 'tel' : 'email'}
                  className="ml-input"
                  placeholder={mode === 'phone' ? '+237 6XX XXX XXX' : 'kevin@email.com'}
                  value={identifier} onChange={e => setIdentifier(e.target.value)} required />
              </div>
              {mode === 'email' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--w40)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Mot de passe
                  </label>
                  <input type="password" className="ml-input" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              )}
              {error && <div className="error-box">{error}</div>}
              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 4 }}>
                {loading ? 'Connexion...' : mode === 'phone' ? 'Recevoir le code SMS →' : 'Se connecter →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 14, color: 'var(--w60)', lineHeight: 1.6 }}>
                Code envoyé au <strong style={{ color: '#fff' }}>{identifier}</strong>
              </p>
              <input type="text" inputMode="numeric" className="ml-input"
                placeholder="123456"
                value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                style={{ fontSize: 28, fontWeight: 800, letterSpacing: 8, textAlign: 'center' }} />
              {error && <div className="error-box">{error}</div>}
              <button type="submit" className="btn-primary" disabled={loading || otpCode.length < 4}>
                {loading ? 'Vérification...' : 'Vérifier →'}
              </button>
              <button type="button"
                onClick={() => { setShowOtp(false); setOtpCode('') }}
                style={{ background: 'none', border: 'none', color: 'var(--w40)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                ← Modifier le numéro
              </button>
            </form>
          )}

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--w40)' }}>
            Pas encore de compte ?{' '}
            <Link href="/signup" style={{ fontWeight: 700, color: 'var(--orange)', textDecoration: 'none' }}>
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
