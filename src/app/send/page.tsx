'use client'

// Page /send — Afrique → Europe
// L'utilisateur africain entre le MLK-ID du destinataire,
// choisit le montant FCFA, initie le paiement Orange Money / MTN MoMo

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/layout/BottomNav'
import { getIsDemoMode, getDemoProfile } from '@/lib/demo/data'
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
      if (getIsDemoMode()) {
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

    if (getIsDemoMode()) {
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--bg3)', borderTopColor: 'var(--orange)', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--w40)', fontSize: 14 }}>Chargement...</p>
      </div>
    </div>
  )

  return (
    <div className="page-wrap">

      {/* Header */}
      <div className="page-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: step !== 'done' ? 12 : 0, padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <button
            onClick={() => step === 'confirm' ? setStep('form') : router.back()}
            className="page-header-back"
            aria-label="Retour"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div style={{ flex: 1 }}>
            <div className="page-title">Envoyer en Europe</div>
            <div style={{ fontSize: 11, color: 'var(--w40)', marginTop: 1 }}>Mobile Money → EUR</div>
          </div>
          {step !== 'done' && (
            <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: 'var(--w40)' }}>
              {step === 'form' ? '1' : '2'}/2
            </div>
          )}
        </div>
        {step !== 'done' && (
          <div style={{ display: 'flex', gap: 5, width: '100%' }}>
            <div style={{ height: 3, flex: 1, borderRadius: 4, background: 'var(--orange)' }} />
            <div style={{ height: 3, flex: 1, borderRadius: 4, background: step === 'confirm' ? 'var(--orange)' : 'var(--bg4)', transition: 'background .3s' }} />
          </div>
        )}
      </div>

      <div className="page-content">

        {/* ── STEP: FORM ── */}
        {step === 'form' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Recipient ID */}
            <div className="card" style={{ borderRadius: 18, padding: 20 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 10 }}>
                Identifiant du destinataire
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '4px 14px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--w40)', flexShrink: 0 }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  className="ml-input"
                  placeholder="MLK-A3F2"
                  value={mlkId}
                  onChange={e => setMlkId(e.target.value.toUpperCase())}
                  style={{ flex: 1, background: 'transparent', border: 'none', padding: '10px 0', fontFamily: 'monospace', fontSize: 20, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' as const }}
                />
              </div>
              <div style={{ fontSize: 12, color: 'var(--w40)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Demande-le à la personne en Europe
              </div>
            </div>

            {/* Amount */}
            <div className="card" style={{ borderRadius: 18, padding: 20 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 10 }}>
                Montant à envoyer
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '4px 14px', marginBottom: 10 }}>
                <input
                  type="number"
                  style={{ flex: 1, background: 'transparent', border: 'none', padding: '10px 0', fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'inherit', outline: 'none' }}
                  placeholder="500 000"
                  value={fcfa}
                  onChange={e => setFcfa(e.target.value)}
                />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--w40)', flexShrink: 0, paddingRight: 4 }}>FCFA</span>
              </div>

              {/* Quick presets */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {[50000, 100000, 200000, 500000].map(v => (
                  <button key={v} onClick={() => setFcfa(String(v))} style={{ flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: fcfa === String(v) ? 'rgba(249,115,22,.18)' : 'var(--bg3)', border: `0.5px solid ${fcfa === String(v) ? 'rgba(249,115,22,.5)' : 'var(--border)'}`, color: fcfa === String(v) ? 'var(--orange)' : 'var(--w40)', fontFamily: 'inherit', transition: 'all .15s' }}>
                    {v >= 1000 ? `${v / 1000}k` : v}
                  </button>
                ))}
              </div>

              {/* Conversion preview */}
              {fcfaNum > 0 && (
                <div style={{ background: 'rgba(34,211,176,.07)', border: '0.5px solid rgba(34,211,176,.2)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--teal)', marginBottom: 3, fontWeight: 600 }}>Destinataire reçoit</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--teal)' }}>{eurAmount} <span style={{ fontSize: 16 }}>€</span></div>
                    </div>
                    <div style={{ textAlign: 'right' as const }}>
                      <div style={{ fontSize: 11, color: 'var(--w40)', marginBottom: 3 }}>Taux appliqué</div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>1 € = {RATE} FCFA</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--teal)">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        <span style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600 }}>Instantané</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="card" style={{ borderRadius: 18, padding: 20 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--w40)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 12 }}>
                Méthode de paiement
              </label>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, marginBottom: 16 }}>
                {methods.map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const, background: method === m.id ? 'rgba(249,115,22,.1)' : 'var(--bg3)', border: `0.5px solid ${method === m.id ? 'rgba(249,115,22,.5)' : 'var(--border)'}`, transition: 'all .15s' }}>
                    <span style={{ fontSize: 22 }}>{m.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', flex: 1 }}>{m.label}</span>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${method === m.id ? 'var(--orange)' : 'var(--border)'}`, background: method === m.id ? 'var(--orange)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>
                      {method === m.id && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--w60)', marginBottom: 8, fontWeight: 600 }}>
                Ton numéro de téléphone
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '4px 14px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--w40)', flexShrink: 0 }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <input
                  type="tel"
                  className="ml-input"
                  placeholder="+237 6XX XXX XXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', padding: '10px 0' }}
                />
              </div>
            </div>

            <button
              className="btn-primary"
              disabled={!fcfaNum || !phone || !mlkIdClean || mlkIdClean.length < 8}
              onClick={() => setStep('confirm')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              Continuer
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* ── STEP: CONFIRM ── */}
        {step === 'confirm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Amount hero */}
            <div style={{ background: 'linear-gradient(135deg, rgba(249,115,22,.12), rgba(139,92,246,.08))', border: '0.5px solid rgba(249,115,22,.25)', borderRadius: 18, padding: '24px 20px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 12, color: 'var(--w40)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Tu envoies</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{fcfaNum.toLocaleString('fr-FR')}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--w60)', marginTop: 4 }}>FCFA</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                <div style={{ height: 1, flex: 1, background: 'var(--border)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                  </svg>
                  <span style={{ fontSize: 12, color: 'var(--w40)', fontWeight: 600 }}>à 1 € = {RATE} FCFA</span>
                </div>
                <div style={{ height: 1, flex: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600, marginTop: 12 }}>Destinataire reçoit</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--teal)', lineHeight: 1.1 }}>{eurAmount} <span style={{ fontSize: 20 }}>€</span></div>
            </div>

            {/* Details card */}
            <div className="card" style={{ borderRadius: 18, padding: '4px 0', overflow: 'hidden' }}>
              {[
                {
                  label: 'Destinataire',
                  value: mlkIdClean,
                  mono: true,
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                },
                {
                  label: 'Méthode',
                  value: methods.find(m => m.id === method)?.label ?? method,
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                },
                {
                  label: 'Ton numéro',
                  value: phone,
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                },
              ].map(({ label, value, mono, icon }, idx, arr) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: idx < arr.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
                  <div style={{ color: 'var(--w40)', flexShrink: 0 }}>{icon}</div>
                  <span style={{ fontSize: 14, color: 'var(--w60)', flex: 1 }}>{label}</span>
                  <span style={{ fontWeight: 700, fontFamily: mono ? 'monospace' : 'inherit', fontSize: mono ? 13 : 14, color: '#fff' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setStep('form')}
                style={{ flex: 1, padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', background: 'var(--bg2)', border: '0.5px solid var(--border)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Modifier
              </button>
              <button
                disabled={paying}
                onClick={handlePay}
                className="btn-primary"
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: paying ? 0.7 : 1 }}
              >
                {paying ? (
                  <>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                    Connexion...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Payer {fcfaNum.toLocaleString('fr-FR')} FCFA
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: DONE ── */}
        {step === 'done' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' as const, padding: '20px 0' }}>

            {/* Success icon */}
            <div style={{ position: 'relative', marginBottom: 28 }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(34,211,176,.1)', border: '2px solid rgba(34,211,176,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: '50%', background: 'var(--orange)', border: '3px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#fff" stroke="none" />
                </svg>
              </div>
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Paiement initié !</h2>
            <p style={{ fontSize: 14, color: 'var(--w60)', lineHeight: 1.7, marginBottom: 24, maxWidth: 280 }}>
              Confirme sur ton téléphone. Le destinataire recevra{' '}
              <strong style={{ color: 'var(--teal)' }}>{eurAmount} €</strong> instantanément.
            </p>

            {/* Amount pill */}
            <div style={{ background: 'rgba(34,211,176,.08)', border: '0.5px solid rgba(34,211,176,.2)', borderRadius: 14, padding: '16px 24px', marginBottom: 20, width: '100%' }}>
              <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Montant crédité</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--teal)' }}>{eurAmount} <span style={{ fontSize: 18 }}>€</span></div>
            </div>

            {/* Reference */}
            {reference && (
              <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '12px 16px', width: '100%', marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: 'var(--w40)', marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: 0.8 }}>Référence</div>
                <div style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--w60)', wordBreak: 'break-all' as const }}>{reference}</div>
              </div>
            )}

            {/* Pay button (real mode) */}
            {paymentUrl && paymentUrl !== 'https://sandbox.monetbil.com/pay/demo' && (
              <a
                href={paymentUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '16px', borderRadius: 14, fontSize: 15, fontWeight: 800, background: 'linear-gradient(90deg,#F97316,#ea6a0a)', color: '#fff', textDecoration: 'none', marginBottom: 12, boxShadow: '0 4px 20px rgba(249,115,22,.35)' }}
              >
                Confirmer le paiement
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}

            {/* Sandbox notice */}
            {paymentUrl === 'https://sandbox.monetbil.com/pay/demo' && (
              <div style={{ background: 'rgba(34,211,176,.07)', border: '0.5px solid rgba(34,211,176,.2)', borderRadius: 12, padding: '12px 16px', width: '100%', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600 }}>Mode sandbox — paiement simulé avec succès</span>
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
