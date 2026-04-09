'use client'

// Page /convert — Conversion EUR → USDC
// Disponible uniquement pour les utilisateurs Europe

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import { getIsDemoMode, DEMO_WALLET_EUR, DEMO_WALLET_USDC } from '@/lib/demo/data'

const EUR_USDC_RATE = 1.09 // 1 EUR ≈ 1.09 USDC (USDC ≈ USD)

export default function ConvertPage() {
  const router = useRouter()
  const [balanceEur, setBalanceEur] = useState(0)
  const [balanceUsdc, setBalanceUsdc] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [converting, setConverting] = useState(false)
  const [done, setDone] = useState(false)
  const [resultUsdc, setResultUsdc] = useState(0)

  useEffect(() => {
    async function load() {
      if (getIsDemoMode()) {
        setBalanceEur(DEMO_WALLET_EUR.balance)
        setBalanceUsdc(DEMO_WALLET_USDC.balance)
        setUserId(DEMO_WALLET_EUR.user_id)
        setLoading(false)
        return
      }
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      const { data: wallets } = await supabase.from('wallets').select('currency, balance').eq('user_id', user.id)
      if (wallets) {
        setBalanceEur(wallets.find(w => w.currency === 'EUR')?.balance ?? 0)
        setBalanceUsdc(wallets.find(w => w.currency === 'USDC')?.balance ?? 0)
      }
      setLoading(false)
    }
    load()
  }, [router])

  const amountNum = parseFloat(amount) || 0
  const usdcOut = amountNum > 0 ? (amountNum * EUR_USDC_RATE).toFixed(2) : '0.00'
  const canConvert = amountNum > 0 && amountNum <= balanceEur

  async function handleConvert() {
    if (!canConvert || !userId) return
    setConverting(true)

    if (getIsDemoMode()) {
      await new Promise(r => setTimeout(r, 1200))
      const usdc = parseFloat(usdcOut)
      setBalanceEur(b => Math.round((b - amountNum) * 100) / 100)
      setBalanceUsdc(b => Math.round((b + usdc) * 100) / 100)
      setResultUsdc(usdc)
      setDone(true)
      setConverting(false)
      return
    }

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountEur: amountNum }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResultUsdc(data.amountUsdc)
      setBalanceEur(b => Math.round((b - amountNum) * 100) / 100)
      setBalanceUsdc(b => Math.round((b + data.amountUsdc) * 100) / 100)
      setDone(true)
    } catch (err) {
      console.error(err)
    }
    setConverting(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--w40)', fontSize: 14 }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg,var(--bg) 0%,#0d2a35 60%,var(--bg2) 100%)', padding: '48px 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => done ? setDone(false) : router.back()}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--w10)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 16, flexShrink: 0 }}>←</button>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800 }}>Crypto</h1>
            <p style={{ fontSize: 12, color: 'var(--w40)', marginTop: 2 }}>EUR → USDC instantané</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>

        {!done ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Balances */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Solde EUR', value: `${balanceEur.toFixed(2)} €`, color: 'var(--purple)' },
                { label: 'Solde USDC', value: `${balanceUsdc.toFixed(2)} USDC`, color: 'var(--teal)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Swap UI */}
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 14 }}>Convertir</div>

              {/* FROM */}
              <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 14, padding: '14px 16px', marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--w40)', marginBottom: 6 }}>Tu donnes</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="number"
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 32, fontWeight: 800, color: '#fff', fontFamily: 'inherit' }}
                    placeholder="0"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,.15)', border: '0.5px solid rgba(139,92,246,.3)', borderRadius: 10, padding: '6px 12px' }}>
                    <span style={{ fontSize: 16 }}>💶</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--purple)' }}>EUR</span>
                  </div>
                </div>
                {amountNum > 0 && (
                  <button onClick={() => setAmount(String(balanceEur))} style={{ marginTop: 6, fontSize: 11, color: 'var(--purple)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', fontWeight: 600 }}>
                    Max : {balanceEur.toFixed(2)} €
                  </button>
                )}
              </div>

              {/* Arrow */}
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: 'var(--bg3)', border: '0.5px solid var(--border)', fontSize: 14 }}>⟳</div>
              </div>

              {/* TO */}
              <div style={{ background: 'rgba(34,211,176,.06)', border: `0.5px solid ${amountNum > 0 ? 'rgba(34,211,176,.3)' : 'var(--border)'}`, borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--w40)', marginBottom: 6 }}>Tu reçois</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, fontSize: 32, fontWeight: 800, color: amountNum > 0 ? 'var(--teal)' : 'var(--w40)' }}>{usdcOut}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,211,176,.15)', border: '0.5px solid rgba(34,211,176,.3)', borderRadius: 10, padding: '6px 12px' }}>
                    <span style={{ fontSize: 16 }}>🔵</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal)' }}>USDC</span>
                  </div>
                </div>
              </div>

              {/* Rate info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--w40)', marginBottom: 16 }}>
                <span>Taux : 1 EUR = {EUR_USDC_RATE} USDC</span>
                <span style={{ color: 'var(--teal)' }}>Frais : 0 €</span>
              </div>

              {/* Presets */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {[10, 50, 100, 200].map(v => (
                  <button key={v} onClick={() => setAmount(String(Math.min(v, balanceEur)))} style={{ flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: amount === String(v) ? 'rgba(34,211,176,.15)' : 'var(--bg3)', border: `0.5px solid ${amount === String(v) ? 'var(--teal)' : 'var(--border)'}`, color: amount === String(v) ? 'var(--teal)' : 'var(--w40)', fontFamily: 'inherit' }}>
                    {v}€
                  </button>
                ))}
              </div>

              <button
                className="btn-primary"
                disabled={!canConvert || converting}
                onClick={handleConvert}
                style={{ width: '100%', opacity: !canConvert ? 0.5 : 1 }}
              >
                {converting ? 'Conversion...' : !canConvert && amountNum > balanceEur ? 'Solde insuffisant' : `Convertir ${amountNum > 0 ? amountNum + ' €' : ''} →`}
              </button>
            </div>

            {/* Info USDC */}
            <div style={{ background: 'rgba(34,211,176,.06)', border: '0.5px solid rgba(34,211,176,.15)', borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)', marginBottom: 6 }}>🔵 Qu&apos;est-ce que l&apos;USDC ?</div>
              <p style={{ fontSize: 12, color: 'var(--w60)', lineHeight: 1.6, margin: 0 }}>
                USDC est un stablecoin indexé sur le dollar américain. 1 USDC = 1 USD. Idéal pour épargner sans volatilité ou envoyer à l&apos;international.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,211,176,.15)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>✓</div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Conversion réussie !</h2>
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, padding: 20, width: '100%' }}>
              {[
                ['Débité', `${amountNum} EUR`],
                ['Reçu', `${resultUsdc} USDC`],
                ['Taux appliqué', `1 EUR = ${EUR_USDC_RATE} USDC`],
                ['Nouveau solde EUR', `${balanceEur.toFixed(2)} €`],
                ['Nouveau solde USDC', `${balanceUsdc.toFixed(2)} USDC`],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '9px 0', borderBottom: '0.5px solid var(--border)' }}>
                  <span style={{ color: 'var(--w60)' }}>{l}</span>
                  <span style={{ fontWeight: 700, color: l === 'Reçu' ? 'var(--teal)' : '#fff' }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => router.push('/dashboard')} className="btn-primary" style={{ width: '100%' }}>
              Retour au dashboard
            </button>
          </div>
        )}
      </div>

      <BottomNav region="europe" />
    </div>
  )
}
