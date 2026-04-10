'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import { COUNTRIES, type Profile } from '@/types'
import { getIsDemoMode, clearDemoSession, DEMO_PROFILE } from '@/lib/demo/data'

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
)

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPwModal, setShowPwModal] = useState(false)
  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNew, setPwNew] = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwDone, setPwDone] = useState(false)

  useEffect(() => {
    async function load() {
      if (getIsDemoMode()) { setProfile(DEMO_PROFILE); setLoading(false); return }
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [router])

  async function handleChangePassword() {
    if (!pwNew || pwNew !== pwConfirm) { setPwError('Les mots de passe ne correspondent pas'); return }
    if (pwNew.length < 8) { setPwError('8 caractères minimum'); return }
    setPwLoading(true); setPwError('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: pwNew })
    if (error) { setPwError(error.message); setPwLoading(false); return }
    setPwDone(true)
    setTimeout(() => { setShowPwModal(false); setPwDone(false); setPwNew(''); setPwConfirm(''); setPwCurrent('') }, 1500)
    setPwLoading(false)
  }

  async function handleLogout() {
    if (getIsDemoMode()) { clearDemoSession(); router.push('/'); return }
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const country = COUNTRIES.find(c => c.code === profile?.country)
  const kycConfig = {
    pending:  { color: 'var(--orange)', bg: 'rgba(249,115,22,0.1)',  label: 'En attente',  icon: '⏳' },
    verified: { color: 'var(--teal)',   bg: 'rgba(34,211,176,0.1)',  label: 'Vérifié',     icon: '✓' },
    rejected: { color: 'var(--red)',    bg: 'rgba(239,68,68,0.1)',   label: 'Rejeté',      icon: '✗' },
  }
  const kyc = kycConfig[profile?.kyc_status as keyof typeof kycConfig] ?? kycConfig.pending
  const initials = profile?.full_name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? '?'

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--bg3)', borderTopColor: 'var(--orange)', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div className="page-wrap">

      {/* ── MODAL CHANGER MOT DE PASSE ── */}
      {showPwModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowPwModal(false) }}>
          <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border-p)', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: 480 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)', margin: '0 auto 20px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Changer le mot de passe</h3>

            {pwDone ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>✓</div>
                <p style={{ fontWeight: 700, color: 'var(--teal)' }}>Mot de passe mis à jour !</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--w40)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Nouveau mot de passe</label>
                  <input className="ml-input" type="password" placeholder="8 caractères minimum"
                    value={pwNew} onChange={e => setPwNew(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--w40)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Confirmer</label>
                  <input className="ml-input" type="password" placeholder="Répète le mot de passe"
                    value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} />
                </div>
                {pwError && <div className="error-box">{pwError}</div>}
                <button className="btn-primary" disabled={pwLoading || !pwNew || !pwConfirm} onClick={handleChangePassword}>
                  {pwLoading ? 'Mise à jour...' : 'Confirmer →'}
                </button>
                <button onClick={() => setShowPwModal(false)} style={{ background: 'none', border: 'none', color: 'var(--w40)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(145deg, #1a2a4a 0%, #160e2e 50%, #1a1040 100%)',
        padding: '52px 20px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

        {/* Avatar */}
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: 'linear-gradient(135deg, #F97316, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, fontWeight: 800, margin: '0 auto 14px',
          boxShadow: '0 8px 24px rgba(139,92,246,0.3)',
          position: 'relative',
        }}>
          {initials}
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, letterSpacing: -0.3 }}>{profile?.full_name}</h1>
        <p style={{ fontSize: 13, color: 'var(--w40)', marginBottom: 14 }}>
          {profile?.email || profile?.phone}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: kyc.bg, border: `0.5px solid ${kyc.color}30`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: kyc.color }}>
            <span>{kyc.icon}</span> KYC {kyc.label}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--border)', borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: 'var(--w60)' }}>
            {profile?.region === 'africa' ? '🌍 Afrique' : '🇪🇺 Europe'}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── MLK ID ── */}
        {profile?.monylink_id && (
          <div style={{ background: 'var(--bg2)', border: '0.5px solid rgba(249,115,22,0.2)', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Identifiant MonyLink</p>
              <p style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, color: 'var(--orange)', letterSpacing: 2 }}>{profile.monylink_id}</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(profile.monylink_id)} style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(249,115,22,0.1)', border: '0.5px solid rgba(249,115,22,0.25)', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: 'var(--orange)', fontFamily: 'inherit' }}>
              Copier
            </button>
          </div>
        )}

        {/* ── INFO PERSO ── */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '0.5px solid var(--border)' }}>
            Informations personnelles
          </div>
          {[
            { label: 'Nom complet', value: profile?.full_name, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20C4 16.7 7.6 14 12 14C16.4 14 20 16.7 20 20"/></svg> },
            { label: 'Email', value: profile?.email, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/></svg> },
            { label: 'Téléphone', value: profile?.phone || '—', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
            { label: 'Pays', value: country ? `${country.flag} ${country.name}` : profile?.country, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
          ].map((item, i) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < 3 ? '0.5px solid var(--border)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--w40)', fontWeight: 600, marginBottom: 2 }}>{item.label}</p>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── KYC STATUS ── */}
        <div style={{ background: 'var(--bg2)', border: `0.5px solid ${kyc.color}20`, borderRadius: 16, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: kyc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
              {profile?.kyc_status === 'verified' ? '✅' : '⏳'}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                {profile?.kyc_status === 'verified' ? 'Identité vérifiée' : 'Vérification en cours'}
              </p>
              <p style={{ fontSize: 12, color: 'var(--w40)', lineHeight: 1.5 }}>
                {profile?.kyc_status === 'verified'
                  ? 'Toutes les fonctionnalités disponibles'
                  : 'Limite : 500 €/mois · Vérification requise'}
              </p>
            </div>
          </div>
        </div>

        {/* ── SÉCURITÉ ── */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '0.5px solid var(--border)' }}>Sécurité</div>

          {/* Changer mot de passe */}
          <button
            onClick={() => { if (!getIsDemoMode()) setShowPwModal(true) }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: '0.5px solid var(--border)', background: 'transparent', border: 'none', cursor: getIsDemoMode() ? 'not-allowed' : 'pointer', textAlign: 'left', fontFamily: 'inherit', opacity: getIsDemoMode() ? 0.5 : 1 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><circle cx="12" cy="16" r="1" fill="rgba(255,255,255,0.5)" stroke="none"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Changer le mot de passe</p>
              {getIsDemoMode() && <p style={{ fontSize: 11, color: 'var(--w40)', marginTop: 1 }}>Non disponible en démo</p>}
            </div>
            <ChevronRight />
          </button>

          {/* 2FA - coming soon */}
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: '0.5px solid var(--border)', background: 'transparent', border: 'none', cursor: 'default', textAlign: 'left', fontFamily: 'inherit', opacity: 0.5 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Authentification 2FA</p>
              <p style={{ fontSize: 11, color: 'var(--orange)', marginTop: 1 }}>Bientôt disponible</p>
            </div>
          </button>

          {/* Notifications */}
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: 'transparent', border: 'none', cursor: 'default', textAlign: 'left', fontFamily: 'inherit', opacity: 0.5 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Notifications push</p>
              <p style={{ fontSize: 11, color: 'var(--orange)', marginTop: 1 }}>Bientôt disponible</p>
            </div>
          </button>
        </div>

        {/* ── LÉGAL ── */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '0.5px solid var(--border)' }}>Légal</div>
          {[
            { label: "Conditions d'utilisation", href: '/cgu' },
            { label: 'Politique de confidentialité', href: '/confidentialite' },
            { label: 'Conformité AML/KYC', href: '/confidentialite#kyc', soon: true },
          ].map((item, i) => (
            <Link key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < 2 ? '0.5px solid var(--border)' : 'none', textDecoration: 'none' }}>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--w60)' }}>{item.label}</div>
              {item.soon
                ? <span style={{ fontSize: 10, color: 'var(--orange)', fontWeight: 700 }}>Bientôt</span>
                : <ChevronRight />}
            </Link>
          ))}
        </div>

        {/* ── DÉCONNEXION ── */}
        <button onClick={handleLogout} style={{
          width: '100%', padding: '14px', borderRadius: 14,
          background: 'rgba(239,68,68,0.07)', border: '0.5px solid rgba(239,68,68,0.2)',
          color: 'var(--red)', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Déconnexion
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--w20)' }}>MonyLink v0.1 · Prototype PSB M1 2025</p>
      </div>

      <BottomNav region={profile?.region ?? 'europe'} />
    </div>
  )
}
