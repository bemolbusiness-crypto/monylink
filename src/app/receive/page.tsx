'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import { IS_DEMO, DEMO_PROFILE_EUROPE } from '@/lib/demo/data'

const MONYLINK_OM_NUMBER = '+237 6XX XXX XXX'
const MONYLINK_MTN_NUMBER = '+237 6XX XXX XXX'
const RATE = 700

export default function ReceivePage() {
  const router = useRouter()
  const [mlkId, setMlkId] = useState('')
  const [fcfa, setFcfa] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (IS_DEMO) { setMlkId(DEMO_PROFILE_EUROPE.monylink_id); return }
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
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 80 }}>

      <div style={{ background: 'linear-gradient(160deg,var(--bg) 0%,#1a0d35 60%,var(--bg2) 100%)', padding: '48px 20px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Recevoir de l&apos;argent</h1>
        <p style={{ fontSize: 13, color: 'var(--w60)' }}>Partage ton lien — ta famille paie depuis l&apos;Afrique</p>
      </div>

      <div style={{ padding: '20px 16px' }}>

        {/* Identifiant */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border-p)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 8 }}>Ton identifiant</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 800, letterSpacing: 3, color: 'var(--orange)' }}>{mlkId || '...'}</div>
            <button onClick={() => copy(mlkId, 'id')} style={{ padding: '8px 14px', borderRadius: 10, background: copied === 'id' ? 'rgba(34,211,176,.15)' : 'var(--bg3)', border: `0.5px solid ${copied === 'id' ? 'var(--teal)' : 'var(--border)'}`, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: copied === 'id' ? 'var(--teal)' : 'var(--w60)', fontFamily: 'inherit' }}>
              {copied === 'id' ? '✓ Copié' : 'Copier'}
            </button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--w40)', marginTop: 6 }}>À mettre dans le motif du paiement</div>
        </div>

        {/* Simulateur */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 12 }}>Simulateur de conversion</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <input type="number" style={{ flex: 1, background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '12px 14px', fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: 'inherit', outline: 'none' }}
              placeholder="500 000" value={fcfa} onChange={e => setFcfa(e.target.value)} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--w40)', flexShrink: 0 }}>FCFA</span>
          </div>
          {fcfaNum > 0 && (
            <div style={{ background: 'rgba(34,211,176,.08)', border: '0.5px solid rgba(34,211,176,.25)', borderRadius: 14, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700, marginBottom: 4 }}>TU REÇOIS</div>
                <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--teal)' }}>{eurAmount} €</div>
              </div>
              <div style={{ textAlign: 'right' as const }}>
                <div style={{ fontSize: 11, color: 'var(--w40)', marginBottom: 4 }}>TAUX</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>1 € = {RATE} FCFA</div>
                <div style={{ fontSize: 11, color: 'var(--teal)', marginTop: 2 }}>⚡ Instantané</div>
              </div>
            </div>
          )}
        </div>

        {/* Lien de paiement */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 12 }}>Lien à partager</div>
          <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: '10px 14px', fontSize: 12, fontFamily: 'monospace', color: 'var(--w60)', marginBottom: 12, wordBreak: 'break-all' as const }}>
            {shareLink}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => copy(shareLink, 'link')} style={{ flex: 1, padding: '13px', borderRadius: 12, background: 'var(--bg3)', border: `0.5px solid ${copied === 'link' ? 'var(--teal)' : 'var(--border)'}`, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: copied === 'link' ? 'var(--teal)' : 'var(--w60)', fontFamily: 'inherit' }}>
              {copied === 'link' ? '✓ Copié' : '🔗 Copier le lien'}
            </button>
            <a href={`https://wa.me/?text=${whatsappText}`} target="_blank" rel="noreferrer"
              style={{ flex: 1, padding: '13px', borderRadius: 12, background: 'rgba(37,211,102,.12)', border: '0.5px solid rgba(37,211,102,.3)', fontSize: 13, fontWeight: 700, color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              📱 WhatsApp
            </a>
          </div>
        </div>

        {/* Instructions manuelles */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 20, padding: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 14 }}>Instructions manuelles</div>
          {[
            { icon: '🟠', label: 'Orange Money Cameroun', number: MONYLINK_OM_NUMBER },
            { icon: '🟡', label: 'MTN MoMo Cameroun',     number: MONYLINK_MTN_NUMBER },
          ].map(m => (
            <div key={m.label} style={{ background: 'var(--bg3)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span>{m.icon}</span><span style={{ fontSize: 13, fontWeight: 700 }}>{m.label}</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--w80)' }}>{m.number}</div>
              </div>
              <div style={{ textAlign: 'right' as const }}>
                <div style={{ fontSize: 10, color: 'var(--w40)', marginBottom: 4 }}>MOTIF</div>
                <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 800, color: 'var(--orange)' }}>{mlkId}</div>
              </div>
            </div>
          ))}
          <div style={{ background: 'rgba(249,115,22,.08)', border: '0.5px solid rgba(249,115,22,.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: 'var(--orange)', lineHeight: 1.6 }}>
            ⚠️ Le motif <strong>{mlkId}</strong> est obligatoire sinon le paiement ne peut pas être attribué.
          </div>
        </div>
      </div>

      <BottomNav region="europe" />
    </div>
  )
}
