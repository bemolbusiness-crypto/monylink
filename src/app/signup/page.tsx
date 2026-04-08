'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSignUp } from '@clerk/nextjs/legacy'
import { AFRICAN_COUNTRIES, EUROPEAN_COUNTRIES } from '@/types'

type Step = 'region' | 'country' | 'info' | 'otp' | 'done'

export default function SignupPage() {
  const router = useRouter()
  const { signUp, setActive, isLoaded } = useSignUp()

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
    if (!isLoaded || !signUp) return
    setLoading(true); setError('')
    try {
      if (region === 'africa') {
        await signUp.create({
          phoneNumber: phone.replace(/\s/g, ''),
          unsafeMetadata: { country, region: 'africa', full_name: fullName },
        })
        await signUp.preparePhoneNumberVerification({ strategy: 'phone_code' })
        setStep('otp')
      } else {
        if (!email || !password) { setError('Email et mot de passe requis'); setLoading(false); return }
        await signUp.create({
          emailAddress: email,
          password,
          firstName: fullName.split(' ')[0],
          lastName: fullName.split(' ').slice(1).join(' ') || '',
          unsafeMetadata: { country, region: 'europe', full_name: fullName },
        })
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        setStep('otp')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur inscription')
    } finally {
      setLoading(false)
    }
  }

  async function handleOtp() {
    if (!isLoaded || !signUp || !setActive) return
    setLoading(true); setError('')
    try {
      let result
      if (region === 'africa') {
        result = await signUp.attemptPhoneNumberVerification({ code: otpCode })
      } else {
        result = await signUp.attemptEmailAddressVerification({ code: otpCode })
      }
      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId })
        setStep('done')
        setTimeout(() => router.push('/dashboard'), 1200)
      } else {
        setError('Vérification incomplète')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Code invalide')
    } finally {
      setLoading(false)
    }
  }

  const S = {
    shell: { maxWidth: 430, margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' as const },
    inner: { flex: 1, padding: '0 20px 40px', display: 'flex', flexDirection: 'column' as const },
  }

  return (
    <div style={S.shell}>
      <div style={{ padding: '48px 20px 32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <path d="M6 15Q6 6 15 6Q18 6 18 12Q18 6 22 6Q30 6 30 15Q30 24 18 30Q6 24 6 15Z" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 22, fontWeight: 800 }}>Mony<span style={{ color: 'var(--purple)' }}>Link</span></span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--w40)' }}>Crée ton compte gratuitement</p>
      </div>

      <div style={S.inner}>
        {step === 'region' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Tu es où ?</h2>
            <button onClick={() => { setRegion('africa'); setStep('country') }} style={{ padding: '20px', borderRadius: 20, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', background: 'linear-gradient(135deg, rgba(249,115,22,.12), rgba(249,115,22,.05))', border: '1px solid rgba(249,115,22,.3)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🌍</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>J&apos;envoie depuis l&apos;Afrique</div>
              <div style={{ fontSize: 13, color: 'var(--w60)', lineHeight: 1.5 }}>Cameroun, Gabon · Connexion par SMS OTP</div>
              <div style={{ marginTop: 10, display: 'inline-flex', gap: 6, background: 'rgba(249,115,22,.15)', border: '0.5px solid rgba(249,115,22,.3)', borderRadius: 100, padding: '4px 12px', fontSize: 12, color: 'var(--orange)', fontWeight: 700 }}>📱 OTP SMS</div>
            </button>
            <button onClick={() => { setRegion('europe'); setStep('country') }} style={{ padding: '20px', borderRadius: 20, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', background: 'linear-gradient(135deg, rgba(139,92,246,.12), rgba(139,92,246,.05))', border: '1px solid rgba(139,92,246,.3)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🇪🇺</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>Je reçois en Europe</div>
              <div style={{ fontSize: 13, color: 'var(--w60)', lineHeight: 1.5 }}>France, Belgique, Allemagne, Suisse · Email</div>
              <div style={{ marginTop: 10, display: 'inline-flex', gap: 6, background: 'rgba(139,92,246,.15)', border: '0.5px solid rgba(139,92,246,.3)', borderRadius: 100, padding: '4px 12px', fontSize: 12, color: 'var(--purple)', fontWeight: 700 }}>📧 Email + mot de passe</div>
            </button>
            <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--w40)' }}>
              Déjà un compte ?{' '}
              <Link href="/login" style={{ color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
            </div>
          </div>
        )}

        {step === 'country' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <button onClick={() => setStep('region')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--w60)', fontFamily: 'inherit', fontSize: 14, padding: 0, marginBottom: 8 }}>← Retour</button>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Ton pays</h2>
            {countries.map(c => (
              <button key={c.code} onClick={() => { setCountry(c.code); setPhone(c.dialCode + ' '); setStep('info') }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 16, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', background: 'var(--bg2)', border: '0.5px solid var(--border)' }}>
                <span style={{ fontSize: 28 }}>{c.flag}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--w40)', marginTop: 2 }}>{c.dialCode} · {c.currency}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <button onClick={() => setStep('country')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--w60)', fontFamily: 'inherit', fontSize: 14, padding: 0, marginBottom: 8 }}>← Retour</button>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Tes informations</h2>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--w60)', marginBottom: 6 }}>Prénom et Nom</label>
              <input className="ml-input" placeholder="Jean Dupont" value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            {region === 'africa' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--w60)', marginBottom: 6 }}>Numéro de téléphone</label>
                <input className="ml-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            )}
            {region === 'europe' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--w60)', marginBottom: 6 }}>Email</label>
                  <input className="ml-input" type="email" placeholder="ton@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--w60)', marginBottom: 6 }}>Mot de passe</label>
                  <input className="ml-input" type="password" placeholder="8 caractères minimum" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </>
            )}
            {error && <div style={{ background: 'rgba(239,68,68,.1)', border: '0.5px solid rgba(239,68,68,.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#ef4444' }}>{error}</div>}
            <button className="btn-primary" disabled={loading || !fullName} onClick={handleSubmit} style={{ marginTop: 8 }}>
              {loading ? 'Envoi...' : 'Recevoir le code →'}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Code de vérification</h2>
            <p style={{ fontSize: 14, color: 'var(--w60)', lineHeight: 1.6 }}>
              {region === 'africa' ? `SMS envoyé au ${phone}` : `Email envoyé à ${email}`}
            </p>
            <input className="ml-input" type="text" inputMode="numeric" placeholder="123456" maxLength={6}
              value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
              style={{ fontSize: 28, fontWeight: 800, letterSpacing: 8, textAlign: 'center' }} />
            {error && <div style={{ background: 'rgba(239,68,68,.1)', border: '0.5px solid rgba(239,68,68,.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#ef4444' }}>{error}</div>}
            <button className="btn-primary" disabled={loading || otpCode.length < 6} onClick={handleOtp}>
              {loading ? 'Vérification...' : 'Vérifier →'}
            </button>
            <button onClick={() => setStep('info')} style={{ background: 'none', border: 'none', color: 'var(--w40)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>← Modifier</button>
          </div>
        )}

        {step === 'done' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, paddingTop: 40 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,211,176,.15)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>✓</div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Compte créé !</h2>
            <p style={{ fontSize: 14, color: 'var(--w60)' }}>Bienvenue sur MonyLink.</p>
          </div>
        )}
      </div>
    </div>
  )
}
