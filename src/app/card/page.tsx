'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import { formatCurrency } from '@/lib/utils/format'
import { getIsDemoMode, DEMO_PROFILE, DEMO_WALLET } from '@/lib/demo/data'

interface Card {
  id: string
  last4: string
  expiry: string
  holder_name: string
  status: 'active' | 'frozen'
  spending_limit_eur: number
}

export default function CardPage() {
  const router = useRouter()
  const [card, setCard] = useState<Card | null>(null)
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    async function load() {
      if (getIsDemoMode()) {
        // Carte démo pré-activée
        setCard({ id: 'demo-card', last4: '4242', expiry: '12/27', holder_name: DEMO_PROFILE.full_name, status: 'active', spending_limit_eur: 1000 })
        setBalance(DEMO_WALLET.balance)
        setLoading(false)
        return
      }
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const [{ data: c }, { data: w }] = await Promise.all([
        supabase.from('cards').select('*').eq('user_id', user.id).single(),
        supabase.from('wallets').select('balance').eq('user_id', user.id).eq('currency', 'EUR').single(),
      ])
      setCard(c)
      setBalance(w?.balance ?? 0)
      setLoading(false)
    }
    load()
  }, [router])

  async function createCard() {
    setCreating(true)
    // Mode sandbox — créer une carte fictive sans appel Swan
    if (getIsDemoMode()) {
      await new Promise(r => setTimeout(r, 1000))
      setCard({ id: 'demo-card-new', last4: '4242', expiry: '12/27', holder_name: DEMO_PROFILE.full_name, status: 'active', spending_limit_eur: 1000 })
      setCreating(false)
      return
    }
    const res = await fetch('/api/card', { method: 'POST' })
    const data = await res.json()
    if (data.card) setCard(data.card)
    setCreating(false)
  }

  async function toggleFreeze() {
    if (!card) return
    setToggling(true)
    // Mode sandbox — basculer localement
    if (getIsDemoMode()) {
      await new Promise(r => setTimeout(r, 600))
      setCard(c => c ? { ...c, status: c.status === 'active' ? 'frozen' : 'active' } : c)
      setToggling(false)
      return
    }
    const action = card.status === 'active' ? 'suspend' : 'resume'
    const res = await fetch('/api/card', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const data = await res.json()
    if (data.status) setCard(c => c ? { ...c, status: data.status } : c)
    setToggling(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <p style={{ color: 'var(--w40)', fontSize: 14 }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg,var(--bg) 0%,#1a0d35 60%,var(--bg2) 100%)', padding: '48px 20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--w10)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 16, flexShrink: 0 }}>←</button>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>Ma carte</h1>
        </div>
        <div style={{ fontSize: 13, color: 'var(--w40)', marginLeft: 48 }}>Carte virtuelle MonyLink · Visa</div>
      </div>

      <div style={{ padding: '0 16px 24px' }}>

        {!card ? (
          /* ── PAS DE CARTE ── */
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            {/* Carte fantôme */}
            <div style={{ width: 300, height: 180, borderRadius: 20, background: 'linear-gradient(135deg,var(--bg2),var(--bg3))', border: '1px dashed var(--border)', margin: '0 auto 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 36 }}>💳</div>
              <div style={{ fontSize: 13, color: 'var(--w40)' }}>Aucune carte activée</div>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Obtenir ta carte virtuelle</h2>
            <p style={{ fontSize: 14, color: 'var(--w60)', marginBottom: 28, lineHeight: 1.6 }}>
              Une carte Visa virtuelle liée à ton wallet EUR.<br />Dépense partout dans le monde.
            </p>
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, padding: 16, marginBottom: 24, textAlign: 'left' }}>
              {[
                ['💳', 'Visa virtuelle internationale'],
                ['⚡', 'Activée instantanément'],
                ['🔒', 'Numéro unique, sécurisé'],
                ['💶', `Plafond mensuel : ${formatCurrency(1000, 'EUR')}`],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '0.5px solid var(--border)', fontSize: 13 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ color: 'var(--w80)' }}>{text}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" disabled={creating} onClick={createCard}>
              {creating ? 'Activation...' : 'Activer ma carte →'}
            </button>
          </div>

        ) : (
          /* ── CARTE ACTIVE ── */
          <>
            {/* Rendu carte physique */}
            <div style={{
              width: '100%', maxWidth: 340, height: 200, borderRadius: 20, margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #1a3a5c 0%, #1e1538 40%, #2d1a4a 70%, #3d1f5a 100%)',
              border: '0.5px solid rgba(139,92,246,.4)', position: 'relative', overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,.5)',
            }}>
              {/* Fond déco */}
              <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(249,115,22,.12)' }} />
              <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(139,92,246,.15)' }} />

              <div style={{ position: 'relative', padding: '22px 24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Header carte */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>Mony</span><span style={{ fontSize: 15, fontWeight: 800, color: 'var(--purple)' }}>Link</span>
                  </div>
                  <div style={{ display: 'flex', gap: -6 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(249,115,22,.7)', border: '1px solid rgba(0,0,0,.2)' }} />
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(249,115,22,.4)', marginLeft: -10, border: '1px solid rgba(0,0,0,.2)' }} />
                  </div>
                </div>

                {/* Numéro */}
                <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,.9)' }}>
                  {revealed ? `4242 4242 4242 ${card.last4}` : `•••• •••• •••• ${card.last4}`}
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: 1 }}>Titulaire</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{card.holder_name.toUpperCase()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: 1 }}>Expire</div>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace' }}>{revealed ? card.expiry : '••/••'}</div>
                  </div>
                  <div style={{ fontSize: 22, fontStyle: 'italic', fontWeight: 900, color: 'rgba(255,255,255,.8)' }}>VISA</div>
                </div>
              </div>

              {/* Badge frozen */}
              {card.status === 'frozen' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(18,13,36,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                  <div style={{ background: 'rgba(139,92,246,.3)', border: '1px solid var(--purple)', borderRadius: 100, padding: '8px 20px', fontSize: 14, fontWeight: 700, color: 'var(--purple)' }}>🔒 Carte bloquée</div>
                </div>
              )}
            </div>

            {/* Actions rapides */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              <button onClick={() => setRevealed(r => !r)} style={{ padding: '14px', borderRadius: 14, background: 'var(--bg2)', border: '0.5px solid var(--border)', cursor: 'pointer', color: '#fff', fontWeight: 600, fontSize: 14, fontFamily: 'inherit' }}>
                {revealed ? '🙈 Masquer' : '👁 Afficher'}
              </button>
              <button onClick={toggleFreeze} disabled={toggling} style={{ padding: '14px', borderRadius: 14, background: card.status === 'active' ? 'rgba(139,92,246,.1)' : 'rgba(249,115,22,.1)', border: `0.5px solid ${card.status === 'active' ? 'rgba(139,92,246,.4)' : 'rgba(249,115,22,.4)'}`, cursor: 'pointer', color: card.status === 'active' ? 'var(--purple)' : 'var(--orange)', fontWeight: 600, fontSize: 14, fontFamily: 'inherit' }}>
                {toggling ? '...' : card.status === 'active' ? '🔒 Bloquer' : '🔓 Débloquer'}
              </button>
            </div>

            {/* Infos carte */}
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase' as const, letterSpacing: 1, borderBottom: '0.5px solid var(--border)' }}>Détails</div>
              {[
                ['Solde disponible', formatCurrency(balance, 'EUR'), 'var(--teal)'],
                ['Plafond mensuel', formatCurrency(card.spending_limit_eur, 'EUR'), '#fff'],
                ['Type', 'Visa Virtuelle', '#fff'],
                ['Statut', card.status === 'active' ? '✓ Active' : '🔒 Bloquée', card.status === 'active' ? 'var(--teal)' : 'var(--purple)'],
              ].map(([l, v, c]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '0.5px solid var(--border)', fontSize: 14 }}>
                  <span style={{ color: 'var(--w60)' }}>{l}</span>
                  <span style={{ fontWeight: 700, color: c }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Où utiliser */}
            <div style={{ background: 'rgba(34,211,176,.06)', border: '0.5px solid rgba(34,211,176,.2)', borderRadius: 14, padding: '14px 16px', fontSize: 13, color: 'var(--teal)', lineHeight: 1.6 }}>
              💳 Utilisable partout où Visa est accepté — e-commerce, abonnements, paiements internationaux.
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
