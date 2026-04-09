'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import { COUNTRIES, type Profile } from '@/types'
import { getIsDemoMode, clearDemoSession, DEMO_PROFILE } from '@/lib/demo/data'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

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

  async function handleLogout() {
    if (getIsDemoMode()) {
      clearDemoSession()
      router.push('/')
      return
    }
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const country = COUNTRIES.find(c => c.code === profile?.country)
  const kycColor = { pending: 'var(--orange)', verified: 'var(--teal)', rejected: 'var(--red)' }[profile?.kyc_status ?? 'pending']
  const kycLabel = { pending: 'En attente', verified: 'Vérifié ✓', rejected: 'Rejeté' }[profile?.kyc_status ?? 'pending']

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <p style={{ color: 'var(--w40)', fontSize: 14 }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 80 }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1a3a5c 0%,#1e1538 50%,#2d1a4a 100%)', padding: '56px 20px 32px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,.1)', border: '0.5px solid var(--border-p)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto 12px' }}>👤</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{profile?.full_name}</h1>
        <div style={{ fontSize: 13, color: 'var(--w40)', marginBottom: 12 }}>{profile?.email}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.08)', border: '0.5px solid var(--border)', borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 600 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: kycColor }} />
          KYC {kycLabel}
        </div>
      </div>

      <div style={{ padding: '20px 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Infos */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase' as const, letterSpacing: 1, borderBottom: '0.5px solid var(--border)' }}>Informations personnelles</div>
          {[
            { icon: '👤', label: 'Nom', value: profile?.full_name },
            { icon: '📧', label: 'Email', value: profile?.email },
            { icon: '📱', label: 'Téléphone', value: profile?.phone || '—' },
            { icon: '🌍', label: 'Pays', value: country ? `${country.flag} ${country.name}` : profile?.country },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: '0.5px solid var(--border)' }}>
              <span style={{ fontSize: 16, width: 24, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: 'var(--w40)', fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* KYC */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, background: profile?.kyc_status === 'verified' ? 'rgba(34,211,176,.1)' : 'rgba(249,115,22,.1)' }}>
              {profile?.kyc_status === 'verified' ? '✅' : '⏳'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{profile?.kyc_status === 'verified' ? 'Identité vérifiée' : 'Vérification en cours'}</div>
              <div style={{ fontSize: 12, color: 'var(--w40)', marginTop: 2 }}>
                {profile?.kyc_status === 'verified' ? 'Toutes les fonctionnalités disponibles' : "Limite d'envoi : 500€/mois en attente"}
              </div>
            </div>
          </div>
        </div>

        {/* Sécurité */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase' as const, letterSpacing: 1, borderBottom: '0.5px solid var(--border)' }}>Sécurité</div>
          {[
            { icon: '🔑', label: 'Changer le mot de passe' },
            { icon: '📱', label: 'Authentification 2FA', sub: 'Activée' },
            { icon: '🔔', label: 'Notifications', sub: 'Activées' },
          ].map(item => (
            <button key={item.label} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: '0.5px solid var(--border)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' as const, fontFamily: 'inherit' }}>
              <span style={{ fontSize: 16, width: 24, flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{item.label}</div>
                {item.sub && <div style={{ fontSize: 11, color: 'var(--teal)', marginTop: 1 }}>{item.sub}</div>}
              </div>
              <span style={{ color: 'var(--w40)', fontSize: 16 }}>›</span>
            </button>
          ))}
        </div>

        {/* Légal */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase' as const, letterSpacing: 1, borderBottom: '0.5px solid var(--border)' }}>Informations légales</div>
          {["Conditions d'utilisation", 'Politique de confidentialité', 'Conformité AML/KYC'].map(item => (
            <button key={item} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: '0.5px solid var(--border)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' as const, fontFamily: 'inherit' }}>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--w60)' }}>{item}</div>
              <span style={{ color: 'var(--w40)', fontSize: 16 }}>›</span>
            </button>
          ))}
        </div>

        <button onClick={handleLogout} style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'rgba(239,68,68,.08)', border: '0.5px solid rgba(239,68,68,.3)', color: 'var(--red)', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
          Déconnexion
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--w20)' }}>MonyLink v0.1 · Prototype éducatif PSB M1 2025</p>
      </div>

      <BottomNav />
    </div>
  )
}
