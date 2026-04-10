'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import { formatCurrency } from '@/lib/utils/format'
import { WITHDRAWAL_FEE_EUR } from '@/lib/utils/rates'
import { getIsDemoMode, DEMO_WALLET } from '@/lib/demo/data'

type Step = 'amount' | 'rib' | 'confirm' | 'success'

export default function WithdrawPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('amount')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)

  const [amount, setAmount] = useState('')
  const [iban, setIban] = useState('')
  const [bic, setBic] = useState('')
  const [beneficiaryName, setBeneficiaryName] = useState('')
  const [label, setLabel] = useState('')

  useEffect(() => {
    async function load() {
      if (getIsDemoMode()) {
        setUserId(DEMO_WALLET.user_id)
        setBalance(DEMO_WALLET.balance)
        return
      }
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      const { data } = await supabase.from('wallets').select('balance').eq('user_id', user.id).eq('currency', 'EUR').single()
      setBalance(data?.balance ?? 0)
    }
    load()
  }, [router])

  const amountNum = parseFloat(amount) || 0
  const netAmount = Math.max(0, amountNum - WITHDRAWAL_FEE_EUR)
  const sepaRef = `MLK-WD-${Date.now().toString(36).toUpperCase()}`

  async function handleWithdraw() {
    if (!userId || amountNum <= 0 || amountNum > balance) return
    setLoading(true)

    // Mode sandbox — simuler le virement sans appel SEPA réel
    if (getIsDemoMode()) {
      await new Promise(r => setTimeout(r, 1200))
      setBalance(b => Math.max(0, b - amountNum))
      setStep('success')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountNum, iban, bic, beneficiaryName, label }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur')
      setBalance(b => b - amountNum)
      setStep('success')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const stepIdx = ['amount','rib','confirm'].indexOf(step)

  return (
    <div className="page-wrap">

      {/* Header */}
      <div className="page-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12, padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <button onClick={() => step === 'amount' ? router.back() : setStep(step === 'rib' ? 'amount' : step === 'confirm' ? 'rib' : 'amount')} className="page-header-back" aria-label="Retour">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <div style={{ flex: 1 }}>
            <div className="page-title">Retirer vers mon RIB</div>
            <div style={{ fontSize: 11, color: 'var(--w40)', marginTop: 1 }}>Solde : <strong style={{ color: 'var(--teal)' }}>{formatCurrency(balance,'EUR')}</strong></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5, width: '100%' }}>
          {['amount','rib','confirm'].map((_,i) => (
            <div key={i} style={{ height: 3, flex: 1, borderRadius: 4, background: stepIdx >= i ? 'var(--orange)' : 'var(--bg4)', transition: 'background .3s' }} />
          ))}
        </div>
      </div>

      <div className="page-content" style={{ paddingBottom: 100 }}>

        {/* STEP 1 — Montant */}
        {step === 'amount' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>Combien retirer ?</h2>
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border-p)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--w40)', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600 }}>Montant EUR</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="number" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 42, fontWeight: 800, letterSpacing: -2, color: '#fff', fontFamily: 'inherit' }}
                  placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} />
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--w40)' }}>EUR</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {[10,25,50,100].map(v => (
                <button key={v} onClick={() => setAmount(String(Math.min(v, balance)))} style={{
                  flex: 1, padding: '9px 4px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .2s',
                  background: amount === String(v) ? 'rgba(249,115,22,.15)' : 'var(--bg2)',
                  border: `0.5px solid ${amount === String(v) ? 'var(--orange)' : 'var(--border)'}`,
                  color: amount === String(v) ? 'var(--orange)' : 'var(--w60)',
                }}>{v}€</button>
              ))}
            </div>

            {amountNum > 0 && (
              <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                  <span style={{ color: 'var(--w60)' }}>Frais SEPA</span>
                  <span style={{ fontWeight: 600, color: 'var(--orange)' }}>-{formatCurrency(WITHDRAWAL_FEE_EUR,'EUR')}</span>
                </div>
                <div style={{ height: '0.5px', background: 'var(--border)', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}>
                  <span>Reçu sur ton RIB</span>
                  <span style={{ color: 'var(--teal)' }}>{formatCurrency(netAmount,'EUR')}</span>
                </div>
                <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: 'var(--w40)' }}>⚡ SEPA Instant — moins de 10 secondes</div>
              </div>
            )}

            <button className="btn-primary" disabled={!amountNum || amountNum <= 0 || amountNum > balance} onClick={() => setStep('rib')}>
              {amountNum > balance ? 'Solde insuffisant' : 'Continuer →'}
            </button>
          </div>
        )}

        {/* STEP 2 — RIB */}
        {step === 'rib' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>Coordonnées bancaires</h2>
            {[
              { label: 'Nom du bénéficiaire', val: beneficiaryName, set: setBeneficiaryName, ph: 'Prénom Nom', type: 'text' },
              { label: 'IBAN', val: iban, set: (v: string) => setIban(v.toUpperCase()), ph: 'FR76 XXXX XXXX XXXX XXXX XXXX XXX', type: 'text', mono: true },
              { label: 'BIC / SWIFT (optionnel)', val: bic, set: (v: string) => setBic(v.toUpperCase()), ph: 'XXXXXXXX', type: 'text', mono: true },
              { label: 'Motif (optionnel)', val: label, set: setLabel, ph: 'Virement famille, loyer...', type: 'text' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--w60)', marginBottom: 6 }}>{f.label}</label>
                <input className="ml-input" style={f.mono ? { fontFamily: 'monospace', fontSize: 13 } : {}} type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} />
              </div>
            ))}
            <button className="btn-primary" disabled={!iban || !beneficiaryName} onClick={() => setStep('confirm')}>
              Confirmer les coordonnées →
            </button>
          </div>
        )}

        {/* STEP 3 — Confirmation */}
        {step === 'confirm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>Confirmer le virement</h2>
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border-p)', borderRadius: 16, padding: 20 }}>
              {[
                ['Bénéficiaire', beneficiaryName, false],
                ['IBAN', iban.replace(/(.{4})/g,'$1 ').trim(), true],
                ...(bic ? [['BIC', bic, true]] : []),
                ['Montant', formatCurrency(amountNum,'EUR'), false],
                ['Frais', formatCurrency(WITHDRAWAL_FEE_EUR,'EUR'), false],
                ['Reçu', formatCurrency(netAmount,'EUR'), false],
                ...(label ? [['Motif', label, false]] : []),
                ['Référence SEPA', sepaRef, true],
              ].map(([l,v,mono]) => (
                <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '9px 0', borderBottom: '0.5px solid var(--border)' }}>
                  <span style={{ color: 'var(--w60)' }}>{l}</span>
                  <span style={{ fontWeight: 600, fontFamily: mono ? 'monospace' : 'inherit', fontSize: (l==='IBAN'||l==='Référence SEPA') ? 11 : 14, color: l==='Reçu' ? 'var(--teal)' : '#fff', maxWidth: '55%', textAlign: 'right' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(34,211,176,.08)', border: '0.5px solid rgba(34,211,176,.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--teal)', display: 'flex', gap: 8 }}>
              <span>⚡</span><span>Virement SEPA Instant — fonds disponibles en moins de 10 secondes.</span>
            </div>
            <button className="btn-primary" disabled={loading} onClick={handleWithdraw}>
              {loading ? 'Traitement...' : `Virer ${formatCurrency(netAmount,'EUR')} →`}
            </button>
          </div>
        )}

        {/* STEP 4 — Succès */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,211,176,.15)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>✓</div>
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>Virement lancé !</h2>
            <p style={{ fontSize: 15, color: 'var(--w60)' }}><strong style={{ color: 'var(--teal)' }}>{formatCurrency(netAmount,'EUR')}</strong> vers {beneficiaryName}</p>
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, padding: 20, width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['IBAN', `${iban.slice(0,8)}...${iban.slice(-4)}`], ['Référence', sepaRef], ['Statut', 'En cours']].map(([l,v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0', borderBottom: '0.5px solid var(--border)' }}>
                  <span style={{ color: 'var(--w60)' }}>{l}</span>
                  <span style={{ fontWeight: 700, fontFamily: l!=='Statut'?'monospace':'inherit', fontSize: 13, color: l==='Statut'?'var(--purple)':'#fff' }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => router.push('/dashboard')} className="btn-primary">Retour au dashboard</button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
