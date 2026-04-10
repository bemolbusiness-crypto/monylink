'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import { getIsDemoMode, DEMO_PROFILE_EUROPE } from '@/lib/demo/data'

const RATE = 700

export default function ReceivePage() {
  const router = useRouter()
  const [mlkId, setMlkId] = useState('')
  const [fcfa, setFcfa] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (getIsDemoMode()) { setMlkId(DEMO_PROFILE_EUROPE.monylink_id); return }
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('monylink_id').eq('id', user.id).single()
      if (data) setMlkId(data.monylink_id)
    }
    load()
  }, [router])

  const fcfaNum = parseFloat(fcfa) || 0
  const eurAmount = fcfaNum > 0 ? (fcfaNum / RATE).toFixed(2) : ''
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://monylink.app'
  const shareLink = `${appUrl}/p/${mlkId}${fcfa ? `?montant=${fcfa}` : ''}`
  const whatsappText = encodeURIComponent(`Salut ! Envoie-moi de l'argent via MonyLink :\n👉 ${shareLink}\n\nTaux : 1€ = ${RATE} FCFA ⚡`)

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="page-wrap">

      {/* ── HEADER ── */}
      <div className="page-header">
        <button onClick={() => router.back()} className="page-header-back" aria-label="Retour">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span className="page-title">Recevoir de l&apos;argent</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="page-content" style={{ paddingBottom: 100 }}>

        {/* ── MLK ID HERO ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1a2a4a 0%, #16203a 40%, #1e1250 100%)',
          border: '0.5px solid rgba(139,92,246,0.2)', borderRadius: 22,
          padding: 22, marginBottom: 14, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Ton identifiant MonyLink
          </p>
          <div style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 800, letterSpacing: 4, color: 'var(--orange)', marginBottom: 6, lineHeight: 1 }}>
            {mlkId || '···'}
          </div>
          <p style={{ fontSize: 12, color: 'var(--w40)', marginBottom: 16, lineHeight: 1.5 }}>
            À communiquer à la personne qui t&apos;envoie de l&apos;argent depuis l&apos;Afrique
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => copy(mlkId, 'id')} style={{
              flex: 1, padding: '11px', borderRadius: 12,
              background: copied === 'id' ? 'rgba(34,211,176,0.15)' : 'rgba(255,255,255,0.08)',
              border: `0.5px solid ${copied === 'id' ? 'var(--teal)' : 'rgba(255,255,255,0.12)'}`,
              cursor: 'pointer', fontSize: 13, fontWeight: 700,
              color: copied === 'id' ? 'var(--teal)' : '#fff', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'all 0.2s',
            }}>
              {copied === 'id' ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copié</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5"/></svg> Copier l&apos;ID</>
              )}
            </button>
            <a href={`https://wa.me/?text=${whatsappText}`} target="_blank" rel="noreferrer"
              style={{
                flex: 1, padding: '11px', borderRadius: 12,
                background: 'rgba(37,211,102,0.1)', border: '0.5px solid rgba(37,211,102,0.25)',
                fontSize: 13, fontWeight: 700, color: '#25D366', textDecoration: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.998 2C6.48 2 2 6.48 2 12c0 1.847.494 3.58 1.358 5.073L2 22l5.11-1.34A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 11.998 2z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* ── SIMULATOR ── */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 18, padding: 18, marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Simulateur de conversion
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '4px 14px', marginBottom: 10 }}>
            <input type="number" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: 'inherit', padding: '10px 0' }}
              placeholder="500 000" value={fcfa} onChange={e => setFcfa(e.target.value)} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--w40)', flexShrink: 0 }}>FCFA</span>
          </div>
          {fcfaNum > 0 && (
            <div style={{ background: 'rgba(34,211,176,0.07)', border: '0.5px solid rgba(34,211,176,0.2)', borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Tu reçois</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--teal)' }}>{eurAmount} <span style={{ fontSize: 16 }}>€</span></p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, color: 'var(--w40)', marginBottom: 2 }}>Taux</p>
                <p style={{ fontSize: 13, fontWeight: 700 }}>1 € = {RATE} FCFA</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600 }}>Instantané</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── SHARE LINK ── */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 18, padding: 18, marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Lien de paiement personnalisé
          </p>
          <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 11, fontFamily: 'monospace', color: 'var(--w60)', marginBottom: 12, wordBreak: 'break-all', lineHeight: 1.6 }}>
            {shareLink}
          </div>
          <button onClick={() => copy(shareLink, 'link')} style={{
            width: '100%', padding: '12px', borderRadius: 12,
            background: copied === 'link' ? 'rgba(34,211,176,0.12)' : 'var(--bg3)',
            border: `0.5px solid ${copied === 'link' ? 'var(--teal)' : 'var(--border)'}`,
            cursor: 'pointer', fontSize: 13, fontWeight: 700,
            color: copied === 'link' ? 'var(--teal)' : 'var(--w60)', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.2s',
          }}>
            {copied === 'link' ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Lien copié !</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Copier le lien</>
            )}
          </button>
        </div>

        {/* ── MANUAL INSTRUCTIONS ── */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 18, padding: 18 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
            Instructions manuelles
          </p>
          {[
            { icon: '🟠', label: 'Orange Money Cameroun', number: '+237 6XX XXX XXX' },
            { icon: '🟡', label: 'MTN MoMo Cameroun',     number: '+237 6XX XXX XXX' },
          ].map(m => (
            <div key={m.label} style={{ background: 'var(--bg3)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>{m.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{m.label}</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--w80)', letterSpacing: 1 }}>{m.number}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 9, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>MOTIF</p>
                <p style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 800, color: 'var(--orange)', letterSpacing: 1 }}>{mlkId}</p>
              </div>
            </div>
          ))}
          <div style={{ background: 'rgba(249,115,22,0.07)', border: '0.5px solid rgba(249,115,22,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: 'var(--orange)', lineHeight: 1.6 }}>
            ⚠️ Le motif <strong>{mlkId}</strong> est obligatoire — sans lui le paiement ne peut pas être attribué.
          </div>
        </div>
      </div>

      <BottomNav region="europe" />
    </div>
  )
}
