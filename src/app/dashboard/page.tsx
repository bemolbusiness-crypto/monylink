'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import Logo from '@/components/layout/Logo'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import type { Profile, Wallet, Transfer } from '@/types'
import {
  getIsDemoMode, getDemoProfile, getDemoWallet,
  DEMO_TRANSFERS, DEMO_WALLET_USDC, DEMO_WALLET_XAF,
} from '@/lib/demo/data'

/* ── SVG Quick-Action Icons ── */
const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconArrowDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M6 13L12 19L18 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconCard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 15H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)
const IconConvert = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M16 3L21 8L16 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 8H9C6.2 8 4 10.2 4 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 21L3 16L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 16H15C17.8 16 20 13.8 20 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)
const IconWithdraw = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 19V5M6 11L12 5L18 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 19H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)
const IconHistory = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 7V12L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconTopup = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M2 11H22" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 3L12 6L15 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconCopy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [walletUsdc, setWalletUsdc] = useState<Wallet | null>(null)
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [liveRate, setLiveRate] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/rates').then(r => r.json()).then(d => setLiveRate(d.rates?.XAF ?? null)).catch(() => {})
  }, [])

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
        supabase.from('transfers').select('*')
          .or(`recipient_id.eq.${user.id},sender_id.eq.${user.id}`)
          .order('created_at', { ascending: false }).limit(5),
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
        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: '0 auto 14px',
          background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(139,92,246,0.15))',
          border: '0.5px solid var(--border-p)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--orange)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
        <p style={{ fontSize: 13, color: 'var(--w40)', fontWeight: 600 }}>Chargement...</p>
      </div>
    </div>
  )

  const isAfrica = profile?.region === 'africa'
  const balance = wallet?.balance ?? 0
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Utilisateur'

  const quickActionsAfrica = [
    { href: '/send',    label: 'Envoyer',    Icon: IconArrowRight, color: '#F97316',              bg: 'rgba(249,115,22,0.15)' },
    { href: '/topup',   label: 'Recharger',  Icon: IconTopup,      color: '#F97316',              bg: 'rgba(249,115,22,0.15)' },
    { href: '/card',    label: 'Carte',      Icon: IconCard,       color: '#8B5CF6',              bg: 'rgba(139,92,246,0.15)' },
    { href: '/history', label: 'Activité',   Icon: IconHistory,    color: 'rgba(255,255,255,0.6)', bg: 'rgba(255,255,255,0.07)' },
  ]
  const quickActionsEurope = [
    { href: '/receive',  label: 'Recevoir',  Icon: IconArrowDown,  color: '#22D3B0', bg: 'rgba(34,211,176,0.15)' },
    { href: '/card',     label: 'Carte',     Icon: IconCard,       color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
    { href: '/convert',  label: 'Crypto',    Icon: IconConvert,    color: '#22D3B0', bg: 'rgba(34,211,176,0.15)' },
    { href: '/withdraw', label: 'Retirer',   Icon: IconWithdraw,   color: 'rgba(255,255,255,0.6)', bg: 'rgba(255,255,255,0.07)' },
  ]
  const quickActions = isAfrica ? quickActionsAfrica : quickActionsEurope

  const statusColor: Record<string, string> = {
    completed: 'var(--teal)', pending: 'var(--orange)',
    failed: 'var(--red)', processing: 'var(--purple)',
  }
  const statusLabel: Record<string, string> = {
    completed: 'Reçu', pending: 'En attente',
    failed: 'Échoué', processing: 'En cours',
  }

  return (
    <div className="page-wrap">
      {/* ── TOP NAV ── */}
      <div className="page-header">
        <Logo size={30} fontSize={16} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: isAfrica ? 'rgba(249,115,22,0.1)' : 'rgba(139,92,246,0.1)',
            border: `0.5px solid ${isAfrica ? 'rgba(249,115,22,0.25)' : 'rgba(139,92,246,0.25)'}`,
            color: isAfrica ? 'var(--orange)' : 'var(--purple)',
            fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
          }}>
            {isAfrica ? '🌍 AFRIQUE' : '🇪🇺 EUROPE'}
          </div>
          <Link href="/profile" style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'var(--bg3)', border: '0.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textDecoration: 'none',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8"/>
              <path d="M4 20C4 16.7 7.6 14 12 14C16.4 14 20 16.7 20 20" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </Link>
        </div>
      </div>

      <div className="page-content" style={{ paddingBottom: 100 }}>

        {/* ── GREETING ── */}
        <div style={{ marginBottom: 16, paddingTop: 4 }}>
          <p style={{ fontSize: 13, color: 'var(--w40)', marginBottom: 2 }}>Bonjour,</p>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>{firstName} 👋</h1>
        </div>

        {/* ── BALANCE HERO CARD ── */}
        <div className="card-hero" style={{ marginBottom: 12 }}>
          {/* Decorative blobs */}
          <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Balance */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--w40)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
              {isAfrica ? 'Solde XAF' : 'Solde EUR'}
            </p>
            <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: -2, lineHeight: 1, marginBottom: 6 }}>
              {isAfrica
                ? <>{Math.round(balance).toLocaleString('fr-FR')} <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--w60)' }}>FCFA</span></>
                : formatCurrency(balance, 'EUR')
              }
            </div>
            {!isAfrica && (
              <p style={{ fontSize: 13, color: 'var(--w50)', marginBottom: 4 }}>
                ≈ {Math.round(balance * 700).toLocaleString('fr-FR')} FCFA
              </p>
            )}
            {!isAfrica && walletUsdc && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,211,176,0.1)', border: '0.5px solid rgba(34,211,176,0.2)', borderRadius: 100, padding: '4px 12px', marginBottom: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)' }} />
                <span style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700 }}>USDC {walletUsdc.balance.toFixed(2)}</span>
              </div>
            )}
            {isAfrica && <div style={{ marginBottom: 20 }} />}

            {/* Quick actions */}
            <div style={{ display: 'grid', gridTemplateColumns: isAfrica ? '1fr 1fr' : `repeat(${quickActions.length},1fr)`, gap: 8 }}>
              {quickActions.map((a) => (
                <Link key={a.href} href={a.href} style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: '12px 6px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color }}>
                    <a.Icon />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--w60)', letterSpacing: 0.2 }}>{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── MLK ID (Europe) ── */}
        {!isAfrica && (
          <button onClick={copyId} style={{
            width: '100%', background: 'var(--bg2)',
            border: `0.5px solid ${copied ? 'rgba(34,211,176,0.4)' : 'rgba(139,92,246,0.2)'}`,
            borderRadius: 16, padding: '14px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer', marginBottom: 12, fontFamily: 'inherit',
            transition: 'border-color 0.2s, background 0.2s',
          }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                Ton identifiant MonyLink
              </p>
              <p style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, letterSpacing: 3, color: copied ? 'var(--teal)' : 'var(--orange)' }}>
                {profile?.monylink_id}
              </p>
              <p style={{ fontSize: 11, color: 'var(--w40)', marginTop: 3 }}>
                Partage-le pour recevoir de l&apos;argent
              </p>
            </div>
            <div style={{ color: copied ? 'var(--teal)' : 'var(--w40)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700 }}>
              {copied ? <span style={{ fontSize: 16 }}>✓</span> : <IconCopy />}
              {copied ? 'Copié' : 'Copier'}
            </div>
          </button>
        )}

        {/* ── TAUX ── */}
        <div style={{
          background: 'var(--bg2)', border: '0.5px solid var(--border)',
          borderRadius: 14, padding: '12px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 20,
        }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>
              Taux MonyLink
            </p>
            <p style={{ fontWeight: 800, fontSize: 15 }}>1 EUR = 700 FCFA</p>
            {liveRate && (
              <p style={{ fontSize: 10, color: 'var(--w40)', marginTop: 2 }}>
                Marché : 1 EUR = {Math.round(liveRate)} FCFA
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--w40)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>
              Délai
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--teal)' }}>Instantané</span>
            </div>
          </div>
        </div>

        {/* ── RECENT ACTIVITY ── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800 }}>Activité récente</h2>
            <Link href="/history" style={{ fontSize: 12, color: 'var(--purple)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Tout voir →
            </Link>
          </div>

          {transfers.length === 0 ? (
            <div style={{
              background: 'var(--bg2)', border: '0.5px solid var(--border)',
              borderRadius: 18, padding: '36px 20px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💸</div>
              <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Aucun transfert</p>
              <p style={{ fontSize: 13, color: 'var(--w40)', marginBottom: 20, lineHeight: 1.6 }}>
                {isAfrica
                  ? 'Envoie de l\'argent à ta famille en Europe'
                  : 'Partage ton identifiant pour recevoir de l\'argent'}
              </p>
              <Link href={isAfrica ? '/send' : '/receive'} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'var(--orange)', color: '#fff',
                borderRadius: 12, padding: '10px 22px',
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
                boxShadow: 'var(--shadow-orange)',
              }}>
                {isAfrica ? 'Envoyer maintenant' : 'Recevoir de l\'argent'}
              </Link>
            </div>
          ) : (
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
              {transfers.slice(0, 5).map((t, i) => {
                const isSent = t.sender_id === profile?.id
                return (
                  <div key={t.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderBottom: i < Math.min(transfers.length, 5) - 1 ? '0.5px solid var(--border)' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 12,
                        background: isSent ? 'rgba(249,115,22,0.1)' : 'rgba(34,211,176,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, flexShrink: 0,
                      }}>
                        {isSent ? '→' : t.method === 'orange_money' ? '🟠' : '🟡'}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700 }}>
                          {isSent ? `→ ${t.recipient_mlk_id}` : t.sender_name}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--w40)', marginTop: 2 }}>
                          {formatDate(t.created_at)}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: isSent ? 'var(--orange)' : 'var(--teal)' }}>
                        {isSent
                          ? `${t.amount_xaf.toLocaleString('fr-FR')} FCFA`
                          : `+${formatCurrency(t.amount_eur, 'EUR')}`}
                      </p>
                      <p style={{
                        fontSize: 10, fontWeight: 700, marginTop: 3,
                        color: statusColor[t.status] ?? 'var(--w40)',
                      }}>
                        {statusLabel[t.status] ?? t.status}
                      </p>
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
