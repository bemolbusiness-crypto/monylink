'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import { toEur, calculateFee, getCurrencyLabel } from '@/lib/utils/rates'
import { COUNTRIES, METHODS_BY_COUNTRY, METHOD_PROVIDER, type MobileMoneyMethod } from '@/types'
import { formatCurrency } from '@/lib/utils/format'
import { getIsDemoMode, DEMO_PROFILE } from '@/lib/demo/data'

type Step = 'amount' | 'method' | 'reference' | 'pending'

export default function TopupPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('amount')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [monylinkId, setMonylinkId] = useState<string>('')
  const [userCountry, setUserCountry] = useState<string>('CM')

  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<MobileMoneyMethod>('orange_money')
  const [reference, setReference] = useState<string>('')

  useEffect(() => {
    async function load() {
      if (getIsDemoMode()) {
        setUserId(DEMO_PROFILE.id)
        setMonylinkId(DEMO_PROFILE.monylink_id)
        setUserCountry(DEMO_PROFILE.country)
        setMethod(METHODS_BY_COUNTRY[DEMO_PROFILE.country]?.[0]?.method ?? 'orange_money')
        return
      }
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      const { data: prof } = await supabase.from('profiles').select('monylink_id, phone, country').eq('id', user.id).single()
      if (prof) {
        setMonylinkId(prof.monylink_id)
        setUserCountry(prof.country ?? 'CM')
        const methods = METHODS_BY_COUNTRY[prof.country] ?? METHODS_BY_COUNTRY['CM']
        setMethod(methods[0].method)
      }
    }
    load()
  }, [router])

  const country = COUNTRIES.find(c => c.code === userCountry) ?? COUNTRIES[0]
  const currency = country.currency
  const amountNum = parseFloat(amount) || 0
  const grossEur = toEur(amountNum, currency)
  const feeEur = calculateFee(grossEur)
  const netEur = grossEur - feeEur
  const availableMethods = METHODS_BY_COUNTRY[userCountry] ?? METHODS_BY_COUNTRY['CM']

  async function createPaymentRequest() {
    if (!userId || !amountNum) return
    setLoading(true)

    // Mode sandbox — simuler la génération de référence sans Supabase
    if (getIsDemoMode()) {
      await new Promise(r => setTimeout(r, 900))
      const ref = `${monylinkId}-DEMO-${Date.now().toString(36).toUpperCase()}`
      setReference(ref)
      setStep('reference')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const ref = `${monylinkId}-${Date.now()}`
    setReference(ref)
    const { data, error } = await supabase.from('payment_requests').insert({
      user_id: userId, reference: ref, amount_local: amountNum,
      currency_local: currency, provider: METHOD_PROVIDER[method], method,
    }).select().single()
    if (!error && data) setStep('reference')
    setLoading(false)
  }

  async function simulateWebhook() {
    setLoading(true)
    const res = await fetch('/api/webhooks/monetbil', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_ref: reference, amount: amountNum, currency, status: 'success', transaction_id: `SIM-${Date.now()}` }),
    })
    if (res.ok) setStep('pending')
    setLoading(false)
  }

  const methodInfo = availableMethods.find(m => m.method === method)
  const QUICK = currency === 'XAF' || currency === 'XOF' ? [5000,10000,25000,50000] : currency === 'NGN' ? [5000,10000,20000,50000] : [20,50,100,200]

  const stepIdx = ['amount','method','reference'].indexOf(step)

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg,var(--bg) 0%,#1a0d35 60%,var(--bg2) 100%)', padding: '48px 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => step === 'amount' ? router.back() : setStep(step === 'method' ? 'amount' : 'method')}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--w10)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 16, flexShrink: 0 }}>←</button>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800 }}>Envoyer via Mobile Money</h1>
            <div style={{ fontSize: 12, color: 'var(--w40)', marginTop: 2 }}>{country.flag} {getCurrencyLabel(currency)} → EUR</div>
          </div>
        </div>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['amount','method','reference'].map((_,i) => (
            <div key={i} style={{ height: 3, flex: 1, borderRadius: 4, background: stepIdx >= i ? 'var(--orange)' : 'var(--w10)', transition: 'background .3s' }} />
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>

        {/* STEP 1 — Montant */}
        {step === 'amount' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 16, fontWeight: 800 }}>Combien tu envoies ?</h2>
              <span style={{ fontSize: 13, background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 20, padding: '4px 12px', color: 'var(--w60)', fontWeight: 600 }}>{country.flag} {getCurrencyLabel(currency)}</span>
            </div>

            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border-p)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--w40)', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600 }}>Montant en {getCurrencyLabel(currency)}</div>
              <input type="number" style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 42, fontWeight: 800, letterSpacing: -2, color: '#fff', fontFamily: 'inherit' }}
                placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {QUICK.map(v => (
                <button key={v} onClick={() => setAmount(String(v))} style={{
                  flex: 1, padding: '9px 4px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .2s',
                  background: amount === String(v) ? 'rgba(249,115,22,.15)' : 'var(--bg2)',
                  border: `0.5px solid ${amount === String(v) ? 'var(--orange)' : 'var(--border)'}`,
                  color: amount === String(v) ? 'var(--orange)' : 'var(--w60)',
                }}>
                  {v >= 1000 ? `${v/1000}k` : v}
                </button>
              ))}
            </div>

            {amountNum > 0 && (
              <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                  <span style={{ color: 'var(--w60)' }}>Équivalent brut</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(grossEur,'EUR')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                  <span style={{ color: 'var(--w60)' }}>Frais MonyLink (2,5% + 0,50€)</span>
                  <span style={{ fontWeight: 600, color: 'var(--orange)' }}>-{formatCurrency(feeEur,'EUR')}</span>
                </div>
                <div style={{ height: '0.5px', background: 'var(--border)', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}>
                  <span>Crédité sur ton wallet</span>
                  <span style={{ color: 'var(--teal)' }}>{formatCurrency(netEur,'EUR')}</span>
                </div>
              </div>
            )}

            <button className="btn-primary" disabled={!amountNum || amountNum <= 0} onClick={() => setStep('method')}>
              Continuer →
            </button>
          </div>
        )}

        {/* STEP 2 — Méthode */}
        {step === 'method' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Avec quelle méthode ?</h2>
            {availableMethods.map(m => (
              <button key={m.method} onClick={() => setMethod(m.method)} style={{
                background: method===m.method ? 'rgba(249,115,22,.08)' : 'var(--bg2)',
                border: `0.5px solid ${method===m.method ? 'var(--orange)' : 'var(--border)'}`,
                borderRadius: 14, padding: '16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all .2s', width: '100%', textAlign: 'left' as const,
              }}>
                <span style={{ fontSize: 28 }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--w40)', marginTop: 2 }}>Via {METHOD_PROVIDER[m.method] === 'monetbil' ? 'Monetbil' : 'Flutterwave'}</div>
                </div>
                {method === m.method && <span style={{ color: 'var(--orange)', fontSize: 16 }}>✓</span>}
              </button>
            ))}
            <button className="btn-primary" style={{ marginTop: 4 }} disabled={loading} onClick={createPaymentRequest}>
              {loading ? 'Génération...' : 'Générer ma référence →'}
            </button>
          </div>
        )}

        {/* STEP 3 — Référence */}
        {step === 'reference' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>Effectue le paiement</h2>

            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border-p)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 14, color: 'var(--w60)' }}>
                Envoie exactement <strong style={{ color: '#fff' }}>{amountNum.toLocaleString('fr-FR')} {getCurrencyLabel(currency)}</strong> via {methodInfo?.label} au numéro :
              </div>
              <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' as const }}>
                <div style={{ fontSize: 11, color: 'var(--w40)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Numéro {methodInfo?.label}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>+237 690 000 000</div>
                <div style={{ fontSize: 11, color: 'var(--w40)', marginTop: 4 }}>Compte de collecte MonyLink</div>
              </div>

              {/* Référence obligatoire */}
              <div style={{ background: 'rgba(249,115,22,.08)', border: '0.5px solid rgba(249,115,22,.4)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange)', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 1 }}>⚠️ MOTIF OBLIGATOIRE</div>
                <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, textAlign: 'center' as const, padding: '10px 0', color: 'var(--orange)', letterSpacing: 2 }}>{reference}</div>
                <button onClick={() => navigator.clipboard.writeText(reference)} style={{ width: '100%', marginTop: 8, padding: '10px', borderRadius: 10, background: 'var(--orange)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                  📋 Copier la référence
                </button>
                <div style={{ fontSize: 11, color: 'var(--w40)', textAlign: 'center' as const, marginTop: 8 }}>Sans cette référence, ton paiement ne sera pas crédité</div>
              </div>

              <div style={{ background: 'rgba(34,211,176,.08)', border: '0.5px solid rgba(34,211,176,.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--teal)', display: 'flex', gap: 8 }}>
                <span>⚡</span><span>Ton wallet EUR sera crédité automatiquement en moins de 30 secondes.</span>
              </div>
            </div>

            {process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true' && (
              <div style={{ background: 'rgba(34,211,176,.06)', border: '0.5px solid rgba(34,211,176,.2)', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: 1 }}>🧪 MODE SANDBOX</div>
                <button onClick={simulateWebhook} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'var(--teal)', border: 'none', color: '#120d24', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {loading ? 'Simulation...' : `✓ Simuler paiement ${amountNum.toLocaleString()} ${getCurrencyLabel(currency)}`}
                </button>
              </div>
            )}

            <button onClick={() => router.push('/dashboard')} className="btn-secondary">
              Retourner au dashboard
            </button>
          </div>
        )}

        {/* STEP 4 — Succès */}
        {step === 'pending' && (
          <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,211,176,.15)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>✓</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Paiement confirmé !</h2>
            <p style={{ fontSize: 15, color: 'var(--w60)' }}>Ton wallet a été crédité de <strong style={{ color: 'var(--teal)' }}>{formatCurrency(netEur,'EUR')}</strong></p>
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 16, padding: 20, width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Payé', `${amountNum.toLocaleString()} ${getCurrencyLabel(currency)}`], ['Crédité', formatCurrency(netEur,'EUR')], ['Référence', reference]].map(([l,v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0', borderBottom: '0.5px solid var(--border)' }}>
                  <span style={{ color: 'var(--w60)' }}>{l}</span>
                  <span style={{ fontWeight: 700, fontFamily: l==='Référence'?'monospace':'inherit', fontSize: l==='Référence'?12:14, color: l==='Crédité'?'var(--teal)':'#fff' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button onClick={() => { setStep('amount'); setAmount(''); setReference('') }} className="btn-secondary" style={{ flex: 1 }}>Nouvel envoi</button>
              <button onClick={() => router.push('/withdraw')} className="btn-primary" style={{ flex: 1 }}>Retirer → RIB</button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
