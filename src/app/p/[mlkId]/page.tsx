// Page publique — pas besoin de compte
// monylink.app/p/MLK-A3F2?montant=500000
// Vu par la famille en Afrique qui clique le lien WhatsApp

'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

const RATE = 700

interface RecipientInfo {
  full_name: string
  monylink_id: string
  country: string
}

export default function PublicPayPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const mlkId = (params.mlkId as string ?? '').toUpperCase()
  const defaultAmount = searchParams.get('montant') ?? ''

  const [recipient, setRecipient] = useState<RecipientInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [fcfa, setFcfa] = useState(defaultAmount)
  const [phone, setPhone] = useState('+237 ')
  const [method, setMethod] = useState('orange_money')
  const [step, setStep] = useState<'info' | 'pay' | 'done'>('info')
  const [paying, setPaying] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState('')

  useEffect(() => {
    async function load() {
      // En mode démo, simuler un bénéficiaire
      if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || mlkId === 'MLK-A3F2') {
        setRecipient({ full_name: 'Kevin Atangana', monylink_id: 'MLK-A3F2', country: 'FR' })
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/recipient/${mlkId}`)
        if (!res.ok) { setNotFound(true); setLoading(false); return }
        const data = await res.json()
        setRecipient(data)
      } catch {
        setNotFound(true)
      }
      setLoading(false)
    }
    load()
  }, [mlkId])

  const fcfaNum = parseFloat(fcfa.replace(/\s/g, '')) || 0
  const eurAmount = fcfaNum > 0 ? (fcfaNum / RATE).toFixed(2) : '0.00'

  async function handlePay() {
    if (!fcfaNum || !phone) return
    setPaying(true)
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      await new Promise(r => setTimeout(r, 1500))
      setPaymentUrl('https://sandbox.monetbil.com/pay/demo')
      setStep('done')
      setPaying(false)
      return
    }
    try {
      const res = await fetch('/api/public/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mlkId, amountXaf: fcfaNum, phone, method }),
      })
      const data = await res.json()
      if (data.paymentUrl) { setPaymentUrl(data.paymentUrl); setStep('done') }
    } catch { /* silent */ }
    setPaying(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', background: '#120d24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>💸</div>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 14 }}>Chargement...</p>
      </div>
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100dvh', background: '#120d24', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Identifiant introuvable</h2>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14 }}>Le lien est peut-être expiré ou incorrect.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100dvh', background: '#120d24', color: '#fff', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '32px 20px' }}>

        {/* Header MonyLink */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <svg width="22" height="22" viewBox="0 0 36 36" fill="none"><path d="M6 15Q6 6 15 6Q18 6 18 12Q18 6 22 6Q30 6 30 15Q30 24 18 30Q6 24 6 15Z" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 18, fontWeight: 800 }}>Mony<span style={{ color: '#8B5CF6' }}>Link</span></span>
          </div>
        </div>

        {step === 'info' && (
          <>
            {/* Bénéficiaire */}
            <div style={{ background: 'rgba(255,255,255,.05)', border: '0.5px solid rgba(255,255,255,.1)', borderRadius: 20, padding: 24, marginBottom: 20, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(249,115,22,.2)', border: '2px solid rgba(249,115,22,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px' }}>
                {recipient?.full_name?.[0] ?? '?'}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{recipient?.full_name}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#F97316', fontWeight: 700 }}>{mlkId}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>🇫🇷 France</div>
            </div>

            {/* Montant */}
            <div style={{ background: 'rgba(255,255,255,.05)', border: '0.5px solid rgba(255,255,255,.1)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 10 }}>Montant à envoyer</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <input type="number" style={{ flex: 1, background: 'rgba(255,255,255,.08)', border: '0.5px solid rgba(255,255,255,.15)', borderRadius: 12, padding: '14px', fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'inherit', outline: 'none' }}
                  placeholder="500 000" value={fcfa} onChange={e => setFcfa(e.target.value)} />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,.4)', flexShrink: 0 }}>FCFA</span>
              </div>
              {fcfaNum > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(34,211,176,.08)', border: '0.5px solid rgba(34,211,176,.2)', borderRadius: 12, padding: '12px 16px' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#22D3B0', marginBottom: 2 }}>Reçoit</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#22D3B0' }}>{eurAmount} €</div>
                  </div>
                  <div style={{ textAlign: 'right' as const }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 2 }}>Taux</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>1 € = {RATE} FCFA</div>
                    <div style={{ fontSize: 11, color: '#22D3B0' }}>⚡ Instantané</div>
                  </div>
                </div>
              )}
              {/* Présets */}
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {[50000, 100000, 200000, 500000].map(v => (
                  <button key={v} onClick={() => setFcfa(String(v))} style={{ flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: fcfa === String(v) ? 'rgba(249,115,22,.2)' : 'rgba(255,255,255,.05)', border: `0.5px solid ${fcfa === String(v) ? 'rgba(249,115,22,.5)' : 'rgba(255,255,255,.1)'}`, color: fcfa === String(v) ? '#F97316' : 'rgba(255,255,255,.5)', fontFamily: 'inherit' }}>
                    {v >= 1000 ? `${v/1000}k` : v}
                  </button>
                ))}
              </div>
            </div>

            {/* Méthode */}
            <div style={{ background: 'rgba(255,255,255,.05)', border: '0.5px solid rgba(255,255,255,.1)', borderRadius: 20, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 12 }}>Méthode de paiement</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, marginBottom: 14 }}>
                {[
                  { id: 'orange_money', label: 'Orange Money', icon: '🟠' },
                  { id: 'mtn_momo',     label: 'MTN MoMo',     icon: '🟡' },
                ].map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const, background: method === m.id ? 'rgba(249,115,22,.1)' : 'rgba(255,255,255,.04)', border: `0.5px solid ${method === m.id ? 'rgba(249,115,22,.4)' : 'rgba(255,255,255,.08)'}` }}>
                    <span style={{ fontSize: 22 }}>{m.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{m.label}</span>
                    {method === m.id && <span style={{ marginLeft: 'auto', color: '#F97316' }}>✓</span>}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>Ton numéro de téléphone</div>
              <input type="tel" style={{ width: '100%', background: 'rgba(255,255,255,.08)', border: '0.5px solid rgba(255,255,255,.15)', borderRadius: 12, padding: '12px 14px', fontSize: 16, color: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
                placeholder="+237 6XX XXX XXX" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>

            <button disabled={!fcfaNum || !phone || paying} onClick={() => setStep('pay')}
              style={{ width: '100%', padding: '16px', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', background: (!fcfaNum || !phone) ? 'rgba(255,255,255,.1)' : 'linear-gradient(90deg,#F97316,#ea6a0a)', border: 'none', color: '#fff', marginBottom: 16 }}>
              Continuer →
            </button>
          </>
        )}

        {step === 'pay' && (
          <>
            <div style={{ background: 'rgba(255,255,255,.05)', border: '0.5px solid rgba(255,255,255,.1)', borderRadius: 20, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Récapitulatif</div>
              {[
                ['Bénéficiaire', recipient?.full_name ?? ''],
                ['Montant envoyé', `${fcfaNum.toLocaleString('fr-FR')} FCFA`],
                ['Reçoit', `${eurAmount} €`],
                ['Méthode', method === 'orange_money' ? '🟠 Orange Money' : '🟡 MTN MoMo'],
                ['Ton numéro', phone],
                ['Taux', `1 € = ${RATE} FCFA`],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '0.5px solid rgba(255,255,255,.06)', fontSize: 14 }}>
                  <span style={{ color: 'rgba(255,255,255,.5)' }}>{l}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('info')} style={{ flex: 1, padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(255,255,255,.08)', border: '0.5px solid rgba(255,255,255,.15)', color: '#fff' }}>
                ← Modifier
              </button>
              <button disabled={paying} onClick={handlePay}
                style={{ flex: 2, padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', background: 'linear-gradient(90deg,#F97316,#ea6a0a)', border: 'none', color: '#fff' }}>
                {paying ? 'Connexion...' : `Payer ${fcfaNum.toLocaleString('fr-FR')} FCFA`}
              </button>
            </div>
          </>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,211,176,.15)', border: '2px solid #22D3B0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>✓</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Paiement initié !</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', marginBottom: 24, lineHeight: 1.6 }}>
              Confirme le paiement sur ton téléphone.<br />
              <strong style={{ color: '#fff' }}>{recipient?.full_name}</strong> recevra <strong style={{ color: '#22D3B0' }}>{eurAmount} €</strong> instantanément.
            </p>
            {paymentUrl && paymentUrl !== 'https://sandbox.monetbil.com/pay/demo' && (
              <a href={paymentUrl} target="_blank" rel="noreferrer"
                style={{ display: 'block', padding: '16px', borderRadius: 14, fontSize: 15, fontWeight: 800, background: 'linear-gradient(90deg,#F97316,#ea6a0a)', color: '#fff', textDecoration: 'none', marginBottom: 16 }}>
                Confirmer le paiement →
              </a>
            )}
            {paymentUrl === 'https://sandbox.monetbil.com/pay/demo' && (
              <div style={{ background: 'rgba(34,211,176,.08)', border: '0.5px solid rgba(34,211,176,.2)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#22D3B0' }}>
                Mode sandbox — paiement simulé ✓
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: 'rgba(255,255,255,.25)' }}>
          Propulsé par <strong style={{ color: 'rgba(255,255,255,.4)' }}>MonyLink</strong> · Transfert sécurisé
        </div>
      </div>
    </div>
  )
}
