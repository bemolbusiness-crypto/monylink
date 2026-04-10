'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AFRICAN_COUNTRIES, EUROPEAN_COUNTRIES } from '@/types'

type Step = 'region' | 'country' | 'info' | 'otp' | 'done'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('region')
  const [region, setRegion] = useState<'africa' | 'europe' | null>(null)
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const countries = region === 'africa' ? AFRICAN_COUNTRIES : EUROPEAN_COUNTRIES

  async function handleSubmit() {
    setLoading(true); setError('')
    const supabase = createClient()
    try {
      if (!email || !password) { setError('Email et mot de passe requis'); setLoading(false); return }
      const { error: err } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName, country, region: region ?? 'europe' }, emailRedirectTo: undefined },
      })
      if (err) throw err
      setStep('otp')
    } catch (e: unknown) {
      console.error('Signup error:', e)
      setError(e instanceof Error ? e.message : JSON.stringify(e))
    } finally { setLoading(false) }
  }

  async function handleOtp() {
    setLoading(true); setError('')
    const supabase = createClient()
    try {
      const { error: err } = await supabase.auth.verifyOtp({ email, token: otpCode, type: 'signup' })
      if (err) throw err
      setStep('done')
      setTimeout(() => router.push('/dashboard'), 1200)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Code invalide')
    } finally { setLoading(false) }
  }

  // Progress indicator
  const steps: Step[] = ['region', 'country', 'info', 'otp']
  const stepIdx = steps.indexOf(step)

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes checkPop { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        .region-card { padding:20px; border-radius:20px; cursor:pointer; text-align:left; font-family:inherit; transition:transform 0.15s, border-color 0.15s; }
        .region-card:hover { transform:translateY(-2px); }
      `}</style>

      {/* Header */}
      <div style={{ padding: '36px 24px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg, #F97316, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(249,115,22,0.3)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <circle cx="7" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
              <circle cx="13" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
            </svg>
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>
            Mony<span style={{ color: 'var(--purple)' }}>Link</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--w40)' }}>Crée ton compte gratuitement</p>

        {/* Progress bar */}
        {step !== 'done' && stepIdx >= 0 && (
          <div style={{ display: 'flex', gap: 5, marginTop: 20, justifyContent: 'center' }}>
            {steps.map((s, i) => (
              <div key={s} style={{
                height: 3, borderRadius: 2, flex: 1, maxWidth: 60,
                background: i <= stepIdx ? 'var(--orange)' : 'var(--bg3)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, padding: '0 20px 60px' }}>

        {/* ── STEP: REGION ── */}
        {step === 'region' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: -0.3 }}>Tu es où ?</h2>
            <p style={{ fontSize: 14, color: 'var(--w40)', marginBottom: 8, lineHeight: 1.6 }}>
              Choisis ton profil pour configurer ton compte.
            </p>

            <button className="region-card"
              onClick={() => { setRegion('africa'); setStep('country') }}
              style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.03))', border: '1px solid rgba(249,115,22,0.25)' }}>
              <div style={{ fontSize: 34, marginBottom: 10 }}>🌍</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>J&apos;envoie depuis l&apos;Afrique</div>
              <div style={{ fontSize: 13, color: 'var(--w60)', lineHeight: 1.5, marginBottom: 12 }}>
                Cameroun, Gabon · Orange Money, MTN MoMo
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.12)', border: '0.5px solid rgba(249,115,22,0.25)', borderRadius: 100, padding: '4px 12px', fontSize: 11, color: 'var(--orange)', fontWeight: 700 }}>
                📱 Connexion par SMS OTP
              </div>
            </button>

            <button className="region-card"
              onClick={() => { setRegion('europe'); setStep('country') }}
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.03))', border: '1px solid rgba(139,92,246,0.25)' }}>
              <div style={{ fontSize: 34, marginBottom: 10 }}>🇪🇺</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>Je reçois en Europe</div>
              <div style={{ fontSize: 13, color: 'var(--w60)', lineHeight: 1.5, marginBottom: 12 }}>
                France, Belgique, Allemagne, Suisse
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '0.5px solid rgba(139,92,246,0.25)', borderRadius: 100, padding: '4px 12px', fontSize: 11, color: 'var(--purple)', fontWeight: 700 }}>
                📧 Email + mot de passe
              </div>
            </button>

            <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--w40)', marginTop: 8 }}>
              Déjà un compte ?{' '}
              <Link href="/login" style={{ color: 'var(--orange)', fontWeight: 700, textDecoration: 'none' }}>
                Se connecter
              </Link>
            </div>
          </div>
        )}

        {/* ── STEP: COUNTRY ── */}
        {step === 'country' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => setStep('region')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--w60)', fontFamily: 'inherit', fontSize: 14, padding: 0, marginBottom: 8, width: 'fit-content' }}>
              ← Retour
            </button>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3, marginBottom: 4 }}>Ton pays</h2>
            {countries.map(c => (
              <button key={c.code}
                onClick={() => { setCountry(c.code); setPhone(c.dialCode + ' '); setStep('info') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 18px', borderRadius: 16, cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left',
                  background: 'var(--bg2)', border: '0.5px solid var(--border)',
                  transition: 'border-color 0.15s, background 0.15s',
                }}>
                <span style={{ fontSize: 30 }}>{c.flag}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--w40)', marginTop: 2 }}>{c.dialCode} · {c.currency}</div>
                </div>
                <div style={{ marginLeft: 'auto', color: 'var(--w40)' }}>→</div>
              </button>
            ))}
          </div>
        )}

        {/* ── STEP: INFO ── */}
        {step === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button onClick={() => setStep('country')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--w60)', fontFamily: 'inherit', fontSize: 14, padding: 0, marginBottom: 4, width: 'fit-content' }}>
              ← Retour
            </button>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3, marginBottom: 4 }}>Tes informations</h2>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--w40)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Prénom et Nom
              </label>
              <input className="ml-input" placeholder="Jean Dupont" value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--w40)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Email
              </label>
              <input className="ml-input" type="email" placeholder="ton@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--w40)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Mot de passe
              </label>
              <input className="ml-input" type="password" placeholder="8 caractères minimum" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            {error && <div className="error-box">{error}</div>}

            <button className="btn-primary" disabled={loading || !fullName} onClick={handleSubmit} style={{ marginTop: 4 }}>
              {loading ? 'Envoi...' : 'Recevoir le code →'}
            </button>
          </div>
        )}

        {/* ── STEP: OTP ── */}
        {step === 'otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>Code de vérification</h2>
            <p style={{ fontSize: 14, color: 'var(--w60)', lineHeight: 1.65 }}>
              Email envoyé à <strong style={{ color: '#fff' }}>{email}</strong>
            </p>
            <input className="ml-input" type="text" inputMode="text"
              placeholder="Code reçu"
              value={otpCode} onChange={e => setOtpCode(e.target.value.trim())}
              style={{ fontSize: 20, fontWeight: 800, letterSpacing: 5, textAlign: 'center', padding: '18px' }} />
            {error && <div className="error-box">{error}</div>}
            <button className="btn-primary" disabled={loading || otpCode.length < 4} onClick={handleOtp}>
              {loading ? 'Vérification...' : 'Vérifier →'}
            </button>
            <button onClick={() => setStep('info')}
              style={{ background: 'none', border: 'none', color: 'var(--w40)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              ← Modifier
            </button>
          </div>
        )}

        {/* ── STEP: DONE ── */}
        {step === 'done' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 18, paddingTop: 32 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(34,211,176,0.12)', border: '2px solid var(--teal)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34,
              animation: 'checkPop 0.5s ease both',
            }}>✓</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Compte créé !</h2>
            <p style={{ fontSize: 14, color: 'var(--w60)', lineHeight: 1.6 }}>
              Bienvenue sur MonyLink.<br />Redirection en cours...
            </p>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--orange)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}
      </div>
    </div>
  )
}
