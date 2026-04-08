'use client'

// Page /send — Afrique → Europe
// L'utilisateur africain entre le MLK-ID du destinataire,
// choisit le montant FCFA, initie le paiement Orange Money / MTN MoMo

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import { IS_DEMO, getDemoProfile } from '@/lib/demo/data'
import { MOBILE_MONEY_METHODS } from '@/types'

const RATE = 700

type Step = 'form' | 'confirm' | 'done'

export default function SendPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<{ id: string; region: string; phone: string; country: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<Step>('form')
  const [paying, setPaying] = useState(false)

  // Form state
  const [mlkId, setMlkId] = useState('')
  const [fcfa, setFcfa] = useState('')
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState('orange_money')
  const [paymentUrl, setPaymentUrl] = useState('')
  const [reference, setReference] = useState('')

  useEffect(() => {
    async function load() {
      if (IS_DEMO) {
        const p = getDemoProfile()
        setProfile({ id: p.id, region: p.region, phone: p.phone, country: p.country })
        setPhone(p.phone)
        setLoading(false)
        return
      }
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('id, region, phone, country').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setPhone(data.phone)
      }
      setLoading(false)
    }
    load()
  }, [router])

  const fcfaNum = parseFloat(fcfa.replace(/\s/g, '')) || 0
  const eurAmount = fcfaNum > 0 ? (fcfaNum / RATE).toFixed(2) : '0.00'
  const mlkIdClean = mlkId.toUpperCase().trim()
  const methods = MOBILE_MONEY_METHODS[profile?.country ?? 'CM'] ?? MOBILE_MONEY_METHODS['CM']

  async function handlePay() {
    if (!fcfaNum || !phone || !mlkIdClean) return
    setPaying(true)

    if (IS_DEMO) {
      await new Promise(r => setTimeout(r, 1500))
      setPaymentUrl('https://sandbox.monetbil.com/pay/demo')
      setReference(`${mlkIdClean}-DEMO-${Date.now().toString(36).toUpperCase()}`)
      setStep('done')
      setPaying(false)
      return
    }

    try {
      const res = await fetch('/api/public/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mlkId: mlkIdClean, amountXaf: fcfaNum, phone, method }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPaymentUrl(data.paymentUrl)
      setReference(data.reference)
      setStep('done')
    } catch (err) {
      console.error(err)
    }
    setPaying(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--w40)', fontSize: 14 }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg,var(--bg) 0%,#2d1a10 60%,var(--bg2) 100%)', padding: '48px 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <button onClick={() => step === 'confirm' ? setStep('form') : router.back()}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--w10)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 16, flexShrink: 0 }}>←</button>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800 }}>Envoyer en Europe</h1>
            <p style={{ fontSize: 12, color: 'var(--w40)', marginTop: 2 }}>Orange Money · MTN MoMo → EUR</p>
          </div>
        </div>
        {step !== 'done' && (
          <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
            {['form', 'confirm'].map((s, i) => (
              <div key={s} style={{ height: 3, flex: 1, borderRadius: 4, background: (step === 'form' ? i === 0 : true) ? 'var(--orange)' : 'var(--w10)', transition: 'background .3s' }} />
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '20px 16px' }}>

        {step === 'form' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* MLK-ID destinataire */}
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 10 }}>Identifiant du destinataire</div>
              <input
                className="ml-input"
                placeholder="MLK-A3F2"
                value={mlkId}
                onChange={e => setMlkId(e.target.value.toUpperCase())}
                style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' as const }}
              />
              <div style={{ fontSize: 12, color: 'var(--w40)', marginTop: 6 }}>Demande-le à la personne en Europe</div>
            </div>

            {/* Montant */}
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 10 }}>Montant à envoyer</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <input
                  type="number"
                  style={{ flex: 1, background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '14px', fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'inherit', outline: 'none' }}
                  placeholder="500 000"
                  value={fcfa}
                  onChange={e => setFcfa(e.target.value)}
                />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--w40)', flexShrink: 0 }}>FCFA</span>
              </div>
              {fcfaNum > 0 && (
                <div style={{ background: 'rgba(34,211,176,.08)', border: '0.5px solid rgba(34,211,176,.2)', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--teal)', marginBottom: 2 }}>Destinataire reçoit</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--teal)' }}>{eurAmount} €</div>
                  </div>
                  <div style={{ textAlign: 'right' as const }}>
                    <div style={{ fontSize: 11, color: 'var(--w40)', marginBottom: 2 }}>Taux</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>1 € = {RATE} FCFA</div>
                    <div style={{ fontSize: 11, color: 'var(--teal)' }}>⚡ Instantané</div>
                  </div>
                </div>
              )}
              {/* Presets */}
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {[50000, 100000, 200000, 500000].map(v => (
                  <button key={v} onClick={() => setFcfa(String(v))} style={{ flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: fcfa === String(v) ? 'rgba(249,115,22,.2)' : 'var(--bg3)', border: `0.5px solid ${fcfa === String(v) ? 'rgba(249,115,22,.5)' : 'var(--border)'}`, color: fcfa === String(v) ? 'var(--orange)' : 'var(--w40)', fontFamily: 'inherit' }}>
                    {v >= 1000 ? `${v / 1000}k` : v}
                  </button>
                ))}
              </div>
            </div>

            {/* Méthode */}
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 12 }}>Méthode de paiement</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, marginBottom: 14 }}>
                {methods.map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const, background: method === m.id ? 'rgba(249,115,22,.1)' : 'var(--bg3)', border: `0.5px solid ${method === m.id ? 'rgba(249,115,22,.4)' : 'var(--border)'}` }}>
                    <span style={{ fontSize: 22 }}>{m.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{m.label}</span>
                    {method === m.id && <span style={{ marginLeft: 'auto', color: 'var(--orange)' }}>✓</span>}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'var(--w40)', marginBottom: 6 }}>Ton numéro de téléphone</div>
              <input
                type="tel"
                className="ml-input"
                placeholder="+237 6XX XXX XXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <button
              className="btn-primary"
              disabled={!fcfaNum || !phone || !mlkIdClean || mlkIdClean.length < 8}
              onClick={() => setStep('confirm')}
            >
              Continuer →
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <>
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 20, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Récapitulatif</div>
              {[
                ['Destinataire', mlkIdClean],
                ['Montant envoyé', `${fcfaNum.toLocaleString('fr-FR')} FCFA`],
                ['Reçoit', `${eurAmount} €`],
                ['Méthode', methods.find(m => m.id === method)?.label ?? method],
                ['Ton numéro', phone],
                ['Taux', `1 € = ${RATE} FCFA`],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '0.5px solid var(--border)', fontSize: 14 }}>
                  <span style={{ color: 'var(--w60)' }}>{l}</span>
                  <span style={{ fontWeight: 600, fontFamily: l === 'Destinataire' ? 'monospace' : 'inherit', color: l === 'Reçoit' ? 'var(--teal)' : '#fff' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('form')} style={{ flex: 1, padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', background: 'var(--bg2)', border: '0.5px solid var(--border)', color: '#fff' }}>
                ← Modifier
              </button>
              <button disabled={paying} onClick={handlePay}
                style={{ flex: 2, padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', background: 'linear-gradient(90deg,#F97316,#ea6a0a)', border: 'none', color: '#fff', opacity: paying ? 0.7 : 1 }}>
                {paying ? 'Connexion...' : `Payer ${fcfaNum.toLocaleString('fr-FR')} FCFA`}
              </button>
            </div>
          </>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,211,176,.15)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>✓</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Paiement initié !</h2>
            <p style={{ fontSize: 14, color: 'var(--w60)', marginBottom: 8, lineHeight: 1.6 }}>
              Confirme le paiement sur ton téléphone.<br />
              Le destinataire recevra <strong style={{ color: 'var(--teal)' }}>{eurAmount} €</strong> instantanément.
            </p>
            {reference && (
              <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '10px 14px', fontSize: 12, fontFamily: 'monospace', color: 'var(--w60)', marginBottom: 20 }}>
                Réf : {reference}
              </div>
            )}
            {paymentUrl && paymentUrl !== 'https://sandbox.monetbil.com/pay/demo' && (
              <a href={paymentUrl} target="_blank" rel="noreferrer"
                style={{ display: 'block', padding: '16px', borderRadius: 14, fontSize: 15, fontWeight: 800, background: 'linear-gradient(90deg,#F97316,#ea6a0a)', color: '#fff', textDecoration: 'none', marginBottom: 16 }}>
                Confirmer le paiement →
              </a>
            )}
            {paymentUrl === 'https://sandbox.monetbil.com/pay/demo' && (
              <div style={{ background: 'rgba(34,211,176,.08)', border: '0.5px solid rgba(34,211,176,.2)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: 'var(--teal)', marginBottom: 20 }}>
                Mode sandbox — paiement simulé ✓
              </div>
            )}
            <button onClick={() => router.push('/dashboard')} className="btn-primary" style={{ width: '100%' }}>
              Retour au dashboard
            </button>
          </div>
        )}
      </div>

      <BottomNav region={profile?.region === 'africa' ? 'africa' : 'europe'} />
    </div>
  )
}
