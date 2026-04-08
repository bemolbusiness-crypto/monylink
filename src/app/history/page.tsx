'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import type { PaymentRequest, Withdrawal } from '@/types'
import { IS_DEMO, DEMO_TOPUPS, DEMO_WITHDRAWALS } from '@/lib/demo/data'

type Item = { type: 'topup'; item: PaymentRequest } | { type: 'withdrawal'; item: Withdrawal }
type Filter = 'all' | 'topup' | 'withdrawal'

const STATUS_COLOR: Record<string, string> = { completed: 'var(--teal)', pending: 'var(--orange)', failed: 'var(--red)', processing: 'var(--purple)', expired: 'var(--w40)' }
const STATUS_LABEL: Record<string, string> = { completed: 'Reçu', pending: 'En attente', failed: 'Échoué', processing: 'En cours', expired: 'Expiré' }

export default function HistoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Item | null>(null)

  useEffect(() => {
    async function load() {
      if (IS_DEMO) {
        const merged: Item[] = [
          ...DEMO_TOPUPS.map(t => ({ type: 'topup' as const, item: t })),
          ...DEMO_WITHDRAWALS.map(w => ({ type: 'withdrawal' as const, item: w })),
        ].sort((a, b) => new Date(b.item.created_at).getTime() - new Date(a.item.created_at).getTime())
        setItems(merged)
        setLoading(false)
        return
      }
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const [{ data: topups }, { data: withdrawals }] = await Promise.all([
        supabase.from('payment_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('withdrawals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])
      const merged: Item[] = [
        ...(topups ?? []).map(t => ({ type: 'topup' as const, item: t })),
        ...(withdrawals ?? []).map(w => ({ type: 'withdrawal' as const, item: w })),
      ].sort((a, b) => new Date(b.item.created_at).getTime() - new Date(a.item.created_at).getTime())
      setItems(merged)
      setLoading(false)
    }
    load()
  }, [router])

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)
  const groups: Record<string, Item[]> = {}
  filtered.forEach(i => {
    const date = new Date(i.item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    if (!groups[date]) groups[date] = []
    groups[date].push(i)
  })

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg,var(--bg) 0%,#1a0d35 60%,var(--bg2) 100%)', padding: '48px 20px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Historique</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {([{ key: 'all', label: 'Tout' }, { key: 'topup', label: '💰 Envois' }, { key: 'withdrawal', label: '🏦 Retraits' }] as { key: Filter; label: string }[]).map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '7px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
              background: filter === f.key ? 'var(--orange)' : 'var(--bg2)',
              border: `0.5px solid ${filter === f.key ? 'var(--orange)' : 'var(--border)'}`,
              color: filter === f.key ? '#fff' : 'var(--w60)',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 16px' }}>
        {loading && <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--w40)' }}>Chargement...</div>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Aucune transaction</div>
            <div style={{ fontSize: 13, color: 'var(--w40)' }}>Tes transferts apparaîtront ici</div>
          </div>
        )}

        {Object.entries(groups).map(([date, entries]) => (
          <div key={date} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, padding: '0 4px' }}>{date}</div>
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              {entries.map((entry, idx) => {
                const isLast = idx === entries.length - 1
                if (entry.type === 'topup') {
                  const t = entry.item
                  const icon = t.method === 'orange_money' ? '🟠' : t.method === 'mtn_momo' || t.method === 'mtn_ng' ? '🟡' : t.method === 'wave' ? '🔵' : t.method === 'mpesa' ? '🟢' : '💰'
                  return (
                    <button key={`t-${idx}`} onClick={() => setSelected(entry)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', borderLeft: 'none', borderRight: 'none', borderTop: 'none', borderBottom: isLast ? 'none' : '0.5px solid var(--border)' } as React.CSSProperties}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{icon}</div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Envoi Mobile Money</div>
                        <div style={{ fontSize: 11, color: 'var(--w40)', marginTop: 2 }}>{formatDate(t.created_at)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal)' }}>
                          {t.amount_eur ? `+${formatCurrency(t.amount_eur, 'EUR')}` : formatCurrency(t.amount_local, t.currency_local)}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: STATUS_COLOR[t.status], marginTop: 2 }}>{STATUS_LABEL[t.status]}</div>
                      </div>
                    </button>
                  )
                } else {
                  const w = entry.item
                  return (
                    <button key={`w-${idx}`} onClick={() => setSelected(entry)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', borderLeft: 'none', borderRight: 'none', borderTop: 'none', borderBottom: isLast ? 'none' : '0.5px solid var(--border)' } as React.CSSProperties}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏦</div>
                      <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Retrait · {w.beneficiary_name}</div>
                        <div style={{ fontSize: 11, color: 'var(--w40)', marginTop: 2 }}>{formatDate(w.created_at)}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--orange)' }}>-{formatCurrency(w.amount_eur, 'EUR')}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: w.status === 'completed' ? 'var(--teal)' : 'var(--purple)', marginTop: 2 }}>{w.status === 'completed' ? 'Viré' : 'En cours'}</div>
                      </div>
                    </button>
                  )
                }
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal détail */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', background: 'rgba(0,0,0,.6)' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: 'var(--bg2)', borderRadius: '24px 24px 0 0', padding: '24px 20px', border: '0.5px solid var(--border-p)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Détails</div>
              <button onClick={() => setSelected(null)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg3)', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            {selected.type === 'topup' ? (() => {
              const t = selected.item
              return (
                <>
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--teal)' }}>{t.amount_eur ? `+${formatCurrency(t.amount_eur, 'EUR')}` : formatCurrency(t.amount_local, t.currency_local)}</div>
                    <div style={{ fontSize: 13, color: 'var(--w40)', marginTop: 4 }}>Envoi Mobile Money</div>
                  </div>
                  {[
                    ['Date', formatDate(t.created_at)],
                    ['Référence', t.reference],
                    ['Montant local', `${t.amount_local.toLocaleString('fr-FR')} ${t.currency_local}`],
                    ...(t.amount_eur ? [['Crédité EUR', formatCurrency(t.amount_eur, 'EUR')]] : []),
                    ['Statut', STATUS_LABEL[t.status]],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid var(--border)', fontSize: 14 }}>
                      <span style={{ color: 'var(--w60)' }}>{l}</span>
                      <span style={{ fontWeight: 600, fontFamily: l === 'Référence' ? 'monospace' : 'inherit', fontSize: l === 'Référence' ? 11 : 14, color: l === 'Statut' ? STATUS_COLOR[t.status] : '#fff', maxWidth: '55%', textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </>
              )
            })() : (() => {
              const w = selected.item
              return (
                <>
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--orange)' }}>-{formatCurrency(w.amount_eur, 'EUR')}</div>
                    <div style={{ fontSize: 13, color: 'var(--w40)', marginTop: 4 }}>Retrait vers {w.beneficiary_name}</div>
                  </div>
                  {[
                    ['Date', formatDate(w.created_at)],
                    ['Bénéficiaire', w.beneficiary_name],
                    ['IBAN', `${w.iban.slice(0, 8)}...${w.iban.slice(-4)}`],
                    ['Reçu net', formatCurrency(w.net_eur, 'EUR')],
                    ...(w.sepa_ref ? [['Réf. SEPA', w.sepa_ref]] : []),
                    ['Statut', w.status === 'completed' ? 'Viré ✓' : 'En cours'],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid var(--border)', fontSize: 14 }}>
                      <span style={{ color: 'var(--w60)' }}>{l}</span>
                      <span style={{ fontWeight: 600, fontFamily: (l === 'Réf. SEPA' || l === 'IBAN') ? 'monospace' : 'inherit', fontSize: (l === 'Réf. SEPA' || l === 'IBAN') ? 11 : 14, color: l === 'Reçu net' ? 'var(--teal)' : '#fff', maxWidth: '55%', textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </>
              )
            })()}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
