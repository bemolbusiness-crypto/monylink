'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()

  const [mode, setMode] = useState<'phone' | 'email'>('phone')
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
        const { error: err } = await supabase.auth.signInWithOtp({
          phone: identifier.replace(/\s/g, ''),
        })
        if (err) throw err
        setShowOtp(true)
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        })
        if (err) throw err
        router.push('/dashboard')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Identifiant ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    try {
      const { error: err } = await supabase.auth.verifyOtp({
        phone: identifier.replace(/\s/g, ''),
        token: otpCode,
        type: 'sms',
      })
      if (err) throw err
      router.push('/dashboard')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Code invalide.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', overflow: 'hidden' }}>
      <style>{`
        @keyframes float { 0%,100% { transform: rotateX(12deg) rotateY(-18deg) translateY(0px); } 50% { transform: rotateX(12deg) rotateY(-18deg) translateY(-14px); } }
        @keyframes glow-pulse { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.08); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes orbit { from { transform: rotate(0deg) translateX(110px) rotate(0deg); } to { transform: rotate(360deg) translateX(110px) rotate(-360deg); } }
        @keyframes orbit2 { from { transform: rotate(180deg) translateX(80px) rotate(-180deg); } to { transform: rotate(540deg) translateX(80px) rotate(-540deg); } }
        .phone-wrap { animation: float 4s ease-in-out infinite; perspective: 1000px; }
        .login-left { display: flex; }
        @media (max-width: 768px) { .login-left { display: none; } .login-right { width: 100% !important; } }
        .field-label { display: block; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.4); margin-bottom: 6px; letter-spacing: 0.5px; text-transform: uppercase; }
        .form-input-dark { width: 100%; background: rgba(255,255,255,0.05); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px; font-size: 15px; color: #fff; font-family: inherit; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .form-input-dark::placeholder { color: rgba(255,255,255,0.25); }
        .form-input-dark:focus { border-color: rgba(139,92,246,0.7); background: rgba(255,255,255,0.07); }
        .btn-login { width: 100%; background: var(--orange); color: #fff; border: none; border-radius: 12px; padding: 15px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.2s, transform 0.15s; }
        .btn-login:hover { background: #ea6a0a; transform: translateY(-1px); }
        .btn-login:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
      `}</style>

      {/* ── LEFT branding ── */}
      <div className="login-left" style={{ width: '55%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d0920 0%, #1a0d35 50%, #0f1a30 100%)', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'repeating-linear-gradient(45deg,#F97316 0,#F97316 1px,transparent 0,transparent 50%)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'absolute', top: '15%', left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', animation: 'glow-pulse 5s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 32, left: 40, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 19, fontWeight: 800 }}><span style={{ color: '#fff' }}>Mony</span><span style={{ color: 'var(--purple)' }}>Link</span></span>
        </div>
        <div style={{ position: 'relative', marginBottom: 48 }}>
          <div style={{ position: 'absolute', width: 0, height: 0, animation: 'orbit 8s linear infinite' }}>
            <div style={{ background: 'rgba(249,115,22,0.15)', border: '0.5px solid rgba(249,115,22,0.4)', borderRadius: 100, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: 'var(--orange)', whiteSpace: 'nowrap', transform: 'translateX(-50%)' }}>+€47,85 reçu</div>
          </div>
          <div style={{ position: 'absolute', width: 0, height: 0, animation: 'orbit2 11s linear infinite' }}>
            <div style={{ background: 'rgba(34,211,176,0.15)', border: '0.5px solid rgba(34,211,176,0.4)', borderRadius: 100, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: 'var(--teal)', whiteSpace: 'nowrap', transform: 'translateX(-50%)' }}>⚡ 30s</div>
          </div>
          <div className="phone-wrap">
            <div style={{ width: 220, height: 380, background: 'linear-gradient(160deg, #2a1f4a 0%, #1a1538 100%)', border: '6px solid #2d2250', borderRadius: 40, boxShadow: '0 40px 80px rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 60, height: 6, background: '#1a1538', borderRadius: 3 }} />
              <div style={{ padding: '28px 14px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>Mony<span style={{ color: 'var(--purple)' }}>Link</span></span>
                  <span style={{ fontSize: 16 }}>👤</span>
                </div>
                <div style={{ background: 'linear-gradient(135deg,#1a3a5c,#2d1a4a)', border: '0.5px solid var(--border-p)', borderRadius: 16, padding: '14px' }}>
                  <div style={{ fontSize: 9, color: 'var(--w40)', marginBottom: 3 }}>Solde EUR</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>€ 247,30</div>
                  <div style={{ fontSize: 9, color: 'var(--teal)', marginTop: 2 }}>≈ 173 110 FCFA</div>
                </div>
                <div style={{ background: 'rgba(249,115,22,.08)', border: '0.5px solid rgba(249,115,22,.3)', borderRadius: 10, padding: '8px 10px' }}>
                  <div style={{ fontSize: 8, color: 'var(--w40)', fontWeight: 600, marginBottom: 2 }}>IDENTIFIANT</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: 'var(--orange)' }}>MLK-A3F2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', animation: 'slide-up 0.8s ease 0.3s both' }}>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 10, lineHeight: 1.1 }}>De l&apos;Afrique<br /><span style={{ color: 'var(--orange)' }}>vers l&apos;Europe</span><br />en 30 secondes</div>
          <div style={{ fontSize: 14, color: 'var(--w40)', maxWidth: 280, margin: '0 auto', lineHeight: 1.6 }}>Orange Money, MTN MoMo — ton bénéficiaire reçoit sur son RIB via SEPA Instant.</div>
        </div>
      </div>

      {/* ── RIGHT form ── */}
      <div className="login-right" style={{ width: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', borderLeft: '0.5px solid var(--border)' }}>
        <div style={{ width: '100%', maxWidth: 360, animation: 'slide-up 0.6s ease both' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>Bon retour 👋</h1>
          <p style={{ fontSize: 14, color: 'var(--w40)', marginBottom: 24 }}>Connecte-toi à ton compte MonyLink</p>

          <div style={{ display: 'flex', background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}>
            {(['phone', 'email'] as const).map(m => (
              <button key={m} type="button" onClick={() => { setMode(m); setIdentifier(''); setShowOtp(false); setError('') }}
                style={{ flex: 1, padding: '9px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: mode === m ? 'var(--orange)' : 'transparent', color: mode === m ? '#fff' : 'var(--w40)' }}>
                {m === 'phone' ? '📱 Téléphone' : '📧 Email'}
              </button>
            ))}
          </div>

          {!showOtp ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="field-label">{mode === 'phone' ? 'Numéro de téléphone' : 'Email'}</label>
                <input type={mode === 'phone' ? 'tel' : 'email'} className="form-input-dark"
                  placeholder={mode === 'phone' ? '+237 6XX XXX XXX' : 'kevin@email.com'}
                  value={identifier} onChange={e => setIdentifier(e.target.value)} required />
              </div>
              {mode === 'email' && (
                <div>
                  <label className="field-label">Mot de passe</label>
                  <input type="password" className="form-input-dark" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              )}
              {error && <div style={{ background: 'rgba(239,68,68,.1)', border: '0.5px solid rgba(239,68,68,.3)', borderRadius: 10, padding: '11px 14px', fontSize: 13, color: 'var(--red)' }}>{error}</div>}
              <button type="submit" className="btn-login" disabled={loading} style={{ marginTop: 4 }}>
                {loading ? 'Connexion...' : mode === 'phone' ? 'Recevoir le code SMS →' : 'Se connecter →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 14, color: 'var(--w60)' }}>Code envoyé au <strong style={{ color: '#fff' }}>{identifier}</strong></p>
              <input type="text" inputMode="numeric" className="form-input-dark" placeholder="123456" maxLength={6}
                value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                style={{ fontSize: 28, fontWeight: 800, letterSpacing: 8, textAlign: 'center' }} />
              {error && <div style={{ background: 'rgba(239,68,68,.1)', border: '0.5px solid rgba(239,68,68,.3)', borderRadius: 10, padding: '11px 14px', fontSize: 13, color: 'var(--red)' }}>{error}</div>}
              <button type="submit" className="btn-login" disabled={loading || otpCode.length < 6}>
                {loading ? 'Vérification...' : 'Vérifier →'}
              </button>
              <button type="button" onClick={() => { setShowOtp(false); setOtpCode('') }} style={{ background: 'none', border: 'none', color: 'var(--w40)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                ← Modifier le numéro
              </button>
            </form>
          )}

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--w40)' }}>
            Pas encore de compte ?{' '}
            <Link href="/signup" style={{ fontWeight: 700, color: 'var(--orange)', textDecoration: 'none' }}>S&apos;inscrire</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
