'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import type { PaymentRequest, Withdrawal } from '@/types'
import { getIsDemoMode, DEMO_TOPUPS, DEMO_WITHDRAWALS } from '@/lib/demo/data'

type Item = { type: 'topup'; item: PaymentRequest } | { type: 'withdrawal'; item: Withdrawal }
type Filter = 'all' | 'topup' | 'withdrawal'

const STATUS_COLOR: Record<string, string> = { completed: 'var(--teal)', pending: 'var(--orange)', failed: 'var(--red)', processing: 'var(--purple)', expired: 'var(--w40)' }
const STATUS_BG: Record<string, string> = { completed: 'rgba(34,211,176,.12)', pending: 'rgba(249,115,22,.12)', failed: 'rgba(239,68,68,.12)', processing: 'rgba(139,92,246,.12)', expired: 'rgba(255,255,255,.06)' }
const STATUS_LABEL: Record<string, string> = { completed: 'Reçu', pending: 'En attente', failed: 'Échoué', processing: 'En cours', expired: 'Expiré' }

// SVG icon components
function IconPaperPlane({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function IconArrowDown({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  )
}

function IconBank({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  )
}

export default function HistoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Item | null>(null)

  useEffect(() => {
    async function load() {
      if (getIsDemoMode()) {
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

  const tabs: { key: Filter; label: string; count?: number }[] = [
    { key: 'all', label: 'Tout', count: items.length },
    { key: 'topup', label: 'Envois', count: items.filter(i => i.type === 'topup').length },
    { key: 'withdrawal', label: 'Retraits', count: items.filter(i => i.type === 'withdrawal').length },
  ]

  return (
    <div className="page-wrap">

      {/* Header */}
      <div className="page-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12, padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ flex: 1 }}>
            <div className="page-title">Historique</div>
            <div style={{ fontSize: 11, color: 'var(--w40)', marginTop: 1 }}>
              {items.length} transaction{items.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit',
                background: filter === tab.key ? 'var(--orange)' : 'var(--bg2)',
                border: `0.5px solid ${filter === tab.key ? 'var(--orange)' : 'var(--border)'}`,
                color: filter === tab.key ? '#fff' : 'var(--w60)',
                boxShadow: filter === tab.key ? '0 2px 12px rgba(249,115,22,.3)' : 'none',
              }}
            >
              {tab.key === 'topup' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
              {tab.key === 'withdrawal' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              )}
              {tab.label}
              {!loading && tab.count !== undefined && tab.count > 0 && (
                <span style={{ background: filter === tab.key ? 'rgba(255,255,255,.25)' : 'var(--bg3)', borderRadius: 100, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="page-content">

        {/* Loading state */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '60px 0' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--bg3)', borderTopColor: 'var(--orange)', animation: 'spin 0.8s linear infinite' }} />
            <div style={{ color: 'var(--w40)', fontSize: 14 }}>Chargement...</div>
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' as const, padding: '60px 20px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--bg2)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--w40)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="11" y2="17" />
              </svg>
            </div>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>
              {filter === 'all' ? 'Aucune transaction' : filter === 'topup' ? 'Aucun envoi' : 'Aucun retrait'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--w40)', lineHeight: 1.6, maxWidth: 240 }}>
              {filter === 'all'
                ? 'Tes transferts et retraits apparaîtront ici.'
                : filter === 'topup'
                  ? 'Tes envois depuis l\'Afrique apparaîtront ici.'
                  : 'Tes virements vers ton IBAN apparaîtront ici.'}
            </div>
          </div>
        )}

        {/* Transaction groups */}
        {Object.entries(groups).map(([date, entries]) => (
          <div key={date} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 8, padding: '0 4px' }}>
              {date}
            </div>
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
              {entries.map((entry, idx) => {
                const isLast = idx === entries.length - 1

                if (entry.type === 'topup') {
                  const t = entry.item
                  const status = t.status as string
                  return (
                    <button
                      key={`t-${idx}`}
                      onClick={() => setSelected(entry)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'transparent', cursor: 'pointer', textAlign: 'left' as const, fontFamily: 'inherit', borderLeft: 'none', borderRight: 'none', borderTop: 'none', borderBottom: isLast ? 'none' : '0.5px solid var(--border)' } as React.CSSProperties}
                    >
                      {/* Icon */}
                      <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(249,115,22,.12)', border: '0.5px solid rgba(249,115,22,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconPaperPlane size={17} color="var(--orange)" />
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Envoi Mobile Money</div>
                        <div style={{ fontSize: 12, color: 'var(--w40)' }}>{formatDate(t.created_at)}</div>
                      </div>
                      {/* Amounts + status */}
                      <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--teal)', marginBottom: 4 }}>
                          {t.amount_eur ? `+${formatCurrency(t.amount_eur, 'EUR')}` : formatCurrency(t.amount_local, t.currency_local)}
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: STATUS_BG[status] ?? 'var(--bg3)', borderRadius: 100, padding: '2px 8px' }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_COLOR[status] ?? 'var(--w40)', flexShrink: 0 }} />
                          <span style={{ fontSize: 11, fontWeight: 600, color: STATUS_COLOR[status] ?? 'var(--w40)' }}>{STATUS_LABEL[status] ?? status}</span>
                        </div>
                      </div>
                    </button>
                  )
                } else {
                  const w = entry.item
                  const statusColor = w.status === 'completed' ? 'var(--teal)' : 'var(--purple)'
                  const statusBg = w.status === 'completed' ? 'rgba(34,211,176,.12)' : 'rgba(139,92,246,.12)'
                  const statusLabel = w.status === 'completed' ? 'Viré' : 'En cours'
                  return (
                    <button
                      key={`w-${idx}`}
                      onClick={() => setSelected(entry)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'transparent', cursor: 'pointer', textAlign: 'left' as const, fontFamily: 'inherit', borderLeft: 'none', borderRight: 'none', borderTop: 'none', borderBottom: isLast ? 'none' : '0.5px solid var(--border)' } as React.CSSProperties}
                    >
                      {/* Icon */}
                      <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(139,92,246,.12)', border: '0.5px solid rgba(139,92,246,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconBank size={17} color="var(--purple)" />
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                          Retrait · {w.beneficiary_name}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--w40)' }}>{formatDate(w.created_at)}</div>
                      </div>
                      {/* Amount + status */}
                      <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--orange)', marginBottom: 4 }}>
                          -{formatCurrency(w.amount_eur, 'EUR')}
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: statusBg, borderRadius: 100, padding: '2px 8px' }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
                          <span style={{ fontSize: 11, fontWeight: 600, color: statusColor }}>{statusLabel}</span>
                        </div>
                      </div>
                    </button>
                  )
                }
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(4px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: 'var(--bg2)', borderRadius: '24px 24px 0 0', padding: '8px 20px 32px', border: '0.5px solid var(--border-p)' }}
          >
            {/* Drag handle */}
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--bg4)', margin: '12px auto 20px' }} />

            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Détails</div>
              <button
                onClick={() => setSelected(null)}
                style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg3)', border: '0.5px solid var(--border)', cursor: 'pointer', color: 'var(--w60)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {selected.type === 'topup' ? (() => {
              const t = selected.item
              const status = t.status as string
              return (
                <>
                  {/* Amount hero */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(249,115,22,.12)', border: '0.5px solid rgba(249,115,22,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <IconPaperPlane size={24} color="var(--orange)" />
                    </div>
                    <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--teal)' }}>
                      {t.amount_eur ? `+${formatCurrency(t.amount_eur, 'EUR')}` : formatCurrency(t.amount_local, t.currency_local)}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--w40)', marginTop: 4 }}>Envoi Mobile Money</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: STATUS_BG[status] ?? 'var(--bg3)', borderRadius: 100, padding: '4px 12px', marginTop: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[status] ?? 'var(--w40)' }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: STATUS_COLOR[status] ?? 'var(--w40)' }}>{STATUS_LABEL[status] ?? status}</span>
                    </div>
                  </div>
                  {/* Details list */}
                  <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
                    {[
                      ['Date', formatDate(t.created_at)],
                      ['Référence', t.reference],
                      ['Montant local', `${t.amount_local.toLocaleString('fr-FR')} ${t.currency_local}`],
                      ...(t.amount_eur ? [['Crédité EUR', formatCurrency(t.amount_eur, 'EUR')]] : []),
                    ].map(([l, v], i, arr) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderBottom: i < arr.length - 1 ? '0.5px solid var(--border)' : 'none', fontSize: 14 }}>
                        <span style={{ color: 'var(--w60)' }}>{l}</span>
                        <span style={{ fontWeight: 600, fontFamily: l === 'Référence' ? 'monospace' : 'inherit', fontSize: l === 'Référence' ? 11 : 14, color: l === 'Crédité EUR' ? 'var(--teal)' : '#fff', maxWidth: '55%', textAlign: 'right' as const }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </>
              )
            })() : (() => {
              const w = selected.item
              const statusColor = w.status === 'completed' ? 'var(--teal)' : 'var(--purple)'
              const statusBg = w.status === 'completed' ? 'rgba(34,211,176,.12)' : 'rgba(139,92,246,.12)'
              return (
                <>
                  {/* Amount hero */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(139,92,246,.12)', border: '0.5px solid rgba(139,92,246,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <IconBank size={24} color="var(--purple)" />
                    </div>
                    <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--orange)' }}>
                      -{formatCurrency(w.amount_eur, 'EUR')}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--w40)', marginTop: 4 }}>Retrait vers {w.beneficiary_name}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: statusBg, borderRadius: 100, padding: '4px 12px', marginTop: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: statusColor }}>{w.status === 'completed' ? 'Viré' : 'En cours'}</span>
                    </div>
                  </div>
                  {/* Details list */}
                  <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
                    {[
                      ['Date', formatDate(w.created_at)],
                      ['Bénéficiaire', w.beneficiary_name],
                      ['IBAN', `${w.iban.slice(0, 8)}...${w.iban.slice(-4)}`],
                      ['Reçu net', formatCurrency(w.net_eur, 'EUR')],
                      ...(w.sepa_ref ? [['Réf. SEPA', w.sepa_ref]] : []),
                    ].map(([l, v], i, arr) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderBottom: i < arr.length - 1 ? '0.5px solid var(--border)' : 'none', fontSize: 14 }}>
                        <span style={{ color: 'var(--w60)' }}>{l}</span>
                        <span style={{ fontWeight: 600, fontFamily: (l === 'Réf. SEPA' || l === 'IBAN') ? 'monospace' : 'inherit', fontSize: (l === 'Réf. SEPA' || l === 'IBAN') ? 11 : 14, color: l === 'Reçu net' ? 'var(--teal)' : '#fff', maxWidth: '55%', textAlign: 'right' as const }}>{v}</span>
                      </div>
                    ))}
                  </div>
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
