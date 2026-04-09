'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import type { Profile, Wallet, Transfer } from '@/types'
import { getIsDemoMode, getDemoProfile, getDemoWallet, DEMO_TRANSFERS, DEMO_WALLET_USDC, DEMO_WALLET_XAF } from '@/lib/demo/data'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [walletUsdc, setWalletUsdc] = useState<Wallet | null>(null)
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      if (getIsDemoMode()) {
        const p = getDemoProfile()
        setProfile(p)
        setWallet(getDemoWallet())
        if (p.region === 'europe') {
          setWalletUsdc(DEMO_WALLET_USDC)
          setTransfers(DEMO_TRANSFERS)
        } else {
          setTransfers(DEMO_TRANSFERS.filter(t => t.sender_id === p.id))
        }
        setLoading(false)
        return
      }
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const [{ data: prof }, { data: walls }, { data: txs }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('wallets').select('*').eq('user_id', user.id),
        supabase.from('transfers').select('*').or(`recipient_id.eq.${user.id},sender_id.eq.${user.id}`).order('created_at', { ascending: false }).limit(5),
      ])
      setProfile(prof)
      const mainCurrency = prof?.region === 'africa' ? 'XAF' : 'EUR'
      setWallet((walls ?? []).find((w: Wallet) => w.currency === mainCurrency) ?? null)
      setWalletUsdc((walls ?? []).find((w: Wallet) => w.currency === 'USDC') ?? null)
      setTransfers(txs ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  function copyId() {
    if (!profile?.monylink_id) return
    navigator.clipboard.writeText(profile.monylink_id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '0.5px solid var(--border-p)' }}>
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><path d="M6 15Q6 6 15 6Q18 6 18 12Q18 6 22 6Q30 6 30 15Q30 24 18 30Q6 24 6 15Z" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinejoin="round"/></svg>
        </div>
        <p style={{ fontSize: 14, color: 'var(--w40)' }}>Chargement...</p>
      </div>
    </div>
  )

  const isAfrica = profile?.region === 'africa'
  const balance = wallet?.balance ?? 0
  const currency = isAfrica ? 'XAF' : 'EUR'
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Utilisateur'

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 80 }}>

      {/* ── NAV ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg2)', border: '0.5px solid var(--border-p)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3 8Q3 3 8 3Q10 3 10 6.5Q10 3 12.5 3Q17 3 17 8Q17 13 10 17Q3 13 3 8Z" fill="none" stroke="#F97316" strokeWidth="1.7" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 800 }}>Mony<span style={{ color: 'var(--purple)' }}>Link</span></span>
          <span style={{ background: isAfrica ? 'rgba(249,115,22,.15)' : 'rgba(139,92,246,.15)', color: isAfrica ? 'var(--orange)' : 'var(--purple)', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: `0.5px solid ${isAfrica ? 'rgba(249,115,22,.3)' : 'rgba(139,92,246,.3)'}` }}>
            {isAfrica ? '🌍 AFRIQUE' : '🇪🇺 EUROPE'}
          </span>
        </div>
        <Link href="/profile" style={{ fontSize: 20, textDecoration: 'none' }}>👤</Link>
      </div>

      <div style={{ padding: '20px 16px 100px' }}>

        {/* ── BALANCE HERO ── */}
        <div style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #1e1538 50%, #2d1a4a 100%)', border: '0.5px solid var(--border-p)', borderRadius: 20, padding: 20, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'radial-gradient(circle,rgba(249,115,22,.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 13, color: 'var(--w60)' }}>Bonjour,</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{firstName} 👋</div>

          <div style={{ fontSize: 11, color: 'var(--w40)', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 4 }}>
            {isAfrica ? 'Solde XAF' : 'Solde EUR'}
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -2, marginBottom: 4 }}>
            {isAfrica
              ? `${Math.round(balance).toLocaleString('fr-FR')} FCFA`
              : formatCurrency(balance, 'EUR')}
          </div>
          {!isAfrica && (
            <div style={{ fontSize: 13, color: 'var(--w60)', marginBottom: 4 }}>
              ≈ {Math.round(balance * 700).toLocaleString('fr-FR')} FCFA
            </div>
          )}
          {!isAfrica && walletUsdc && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,211,176,.1)', border: '0.5px solid rgba(34,211,176,.2)', borderRadius: 100, padding: '3px 10px', marginBottom: 20 }}>
              <span style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700 }}>USDC {walletUsdc.balance.toFixed(2)}</span>
            </div>
          )}
          {isAfrica && <div style={{ marginBottom: 20 }} />}

          {/* Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: isAfrica ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 8 }}>
            {(isAfrica ? [
              { href: '/send', icon: '→', label: 'Envoyer', color: 'var(--orange)' },
              { href: '/history', icon: '≡', label: 'Historique', color: 'var(--w60)' },
            ] : [
              { href: '/receive', icon: '↓', label: 'Recevoir', color: 'var(--teal)' },
              { href: '/card', icon: '▣', label: 'Carte', color: 'var(--purple)' },
              { href: '/convert', icon: '⟳', label: 'Crypto', color: 'var(--teal)' },
              { href: '/withdraw', icon: '↑', label: 'Retirer', color: 'var(--w60)' },
            ]).map((a: { href: string; icon: string; label: string; color: string }) => (
              <Link key={a.href} href={a.href} style={{ background: 'rgba(255,255,255,.08)', borderRadius: 12, padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
                <span style={{ fontSize: 18, lineHeight: 1, color: a.color }}>{a.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--w60)' }}>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── MLK ID (Europe seulement) ── */}
        {!isAfrica && (
          <button onClick={copyId} style={{ width: '100%', background: 'var(--bg2)', border: `0.5px solid ${copied ? 'var(--teal)' : 'var(--border-p)'}`, borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 16, textAlign: 'left' as const, transition: 'border-color .2s', fontFamily: 'inherit' }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 4 }}>Ton identifiant MonyLink</div>
              <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, letterSpacing: 2, color: copied ? 'var(--teal)' : 'var(--orange)' }}>{profile?.monylink_id}</div>
              <div style={{ fontSize: 11, color: 'var(--w40)', marginTop: 3 }}>Partage-le pour recevoir de l&apos;argent</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: copied ? 'var(--teal)' : 'var(--w40)' }}>{copied ? '✓' : '📋'}</span>
          </button>
        )}

        {/* ── TAUX ── */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 14, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 3 }}>Taux MonyLink</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>1 EUR = 700 FCFA</div>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <div style={{ fontSize: 10, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 3 }}>Transfert</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--teal)' }}>Instantané ⚡</div>
          </div>
        </div>

        {/* ── ACTIVITÉ RÉCENTE ── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Activité récente</span>
            <Link href="/history" style={{ fontSize: 12, color: 'var(--purple)', fontWeight: 600, textDecoration: 'none' }}>Tout voir</Link>
          </div>

          {transfers.length === 0 ? (
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, padding: '36px 20px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>💸</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Aucun transfert</div>
              <div style={{ fontSize: 13, color: 'var(--w40)', marginBottom: 20 }}>
                {isAfrica ? 'Envoie de l\'argent à ta famille en Europe' : 'Partage ton identifiant pour recevoir de l\'argent'}
              </div>
              <Link href={isAfrica ? '/send' : '/receive'} style={{ display: 'inline-block', background: 'var(--orange)', color: '#fff', borderRadius: 10, padding: '10px 22px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                {isAfrica ? 'Envoyer maintenant' : 'Recevoir de l\'argent'}
              </Link>
            </div>
          ) : (
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, padding: '0 16px' }}>
              {transfers.slice(0, 5).map((t, i) => {
                const isSent = t.sender_id === profile?.id
                const statusColor: Record<string, string> = { completed: 'var(--teal)', pending: 'var(--orange)', failed: 'var(--red)', processing: 'var(--purple)' }
                const statusLabel: Record<string, string> = { completed: 'Reçu ✓', pending: 'En attente', failed: 'Échoué', processing: 'En cours' }
                return (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: i < Math.min(transfers.length, 5) - 1 ? '0.5px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                        {isSent ? '→' : t.method === 'orange_money' ? '🟠' : '🟡'}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{isSent ? `→ ${t.recipient_mlk_id}` : t.sender_name}</div>
                        <div style={{ fontSize: 11, color: 'var(--w40)', marginTop: 2 }}>{formatDate(t.created_at)}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' as const }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isSent ? 'var(--orange)' : 'var(--teal)' }}>
                        {isSent ? `${t.amount_xaf.toLocaleString('fr-FR')} FCFA` : `+${formatCurrency(t.amount_eur, 'EUR')}`}
                      </div>
                      <div style={{ fontSize: 10, color: statusColor[t.status], fontWeight: 600, marginTop: 2 }}>{statusLabel[t.status]}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav region={profile?.region ?? 'europe'} />
    </div>
  )
}
