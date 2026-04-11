'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }), { threshold: 0.08 })
    el.querySelectorAll('.fade-in').forEach(n => obs.observe(n))
    return () => obs.disconnect()
  }, [])
  return ref
}

function TransferSimulator() {
  const [amount, setAmount] = useState(150000)
  const RATE = 700
  const euros = Math.round(amount / RATE)
  const wuFees = Math.round(amount * 0.08)
  const wuEuros = Math.round((amount - wuFees) / 655.96)
  const savings = euros - wuEuros
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 16px' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Tu envoies (FCFA)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: 'inherit', minWidth: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 9, padding: '5px 11px', flexShrink: 0 }}>
            <span>🌍</span><span style={{ fontSize: 12, fontWeight: 700, color: '#F97316' }}>FCFA</span>
          </div>
        </div>
      </div>
      <input type="range" min={20000} max={1000000} step={10000} value={amount}
        onChange={e => setAmount(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#F97316', cursor: 'pointer' }} />
      {/* Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: 'rgba(34,211,176,0.07)', border: '1px solid rgba(34,211,176,0.2)', borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ fontSize: 9, color: '#22D3B0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>✓ MonyLink</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#22D3B0' }}>{euros} €</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Taux 1€ = 700 FCFA</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 14px', opacity: 0.65 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>✗ Western Union</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'rgba(255,255,255,0.5)' }}>{wuEuros} €</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>Frais ~8%</div>
        </div>
      </div>
      {savings > 0 && (
        <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F97316' }}>Tu économises <strong style={{ fontSize: 16 }}>{savings} €</strong> avec MonyLink 🎉</span>
        </div>
      )}
      <Link href="/signup" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(249,115,22,0.88)', color: '#fff', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: 'inset 0 3px 4px rgba(255,255,255,0.2), 0 6px 20px rgba(249,115,22,0.3)' }}>
        Commencer gratuitement →
      </Link>
    </div>
  )
}

function Phone3D() {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)', width: 220, height: 35, background: 'radial-gradient(ellipse, rgba(139,92,246,0.4) 0%, transparent 70%)', filter: 'blur(16px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: -50, background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.2) 0%, rgba(249,115,22,0.1) 40%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none', borderRadius: '50%' }} />
      <div style={{ width: 242, flexShrink: 0, transform: 'perspective(1000px) rotateX(6deg) rotateY(-14deg) rotateZ(1.5deg)', transformStyle: 'preserve-3d', animation: 'phoneFloat 5s ease-in-out infinite', position: 'relative', zIndex: 2 }}>
        <div style={{ background: 'linear-gradient(160deg,#1c1635 0%,#120d28 60%,#0e0a1f 100%)', borderRadius: 44, border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 60px 120px rgba(0,0,0,0.8),0 30px 60px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.12),4px 0 16px rgba(0,0,0,0.3)', padding: '14px 10px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg,rgba(255,255,255,0.04) 0%,transparent 100%)', borderRadius: '44px 0 0 44px', pointerEvents: 'none' }} />
          <div style={{ width: 70, height: 6, background: 'rgba(0,0,0,0.8)', borderRadius: 3, margin: '0 auto 12px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 6px' }}>
              <div><div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Bonjour,</div><div style={{ fontSize: 13, fontWeight: 800 }}>Aurélien 👋</div></div>
              <span style={{ fontSize: 13, fontWeight: 800 }}>Mony<span style={{ color: '#8B5CF6' }}>Link</span></span>
            </div>
            <div style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.45) 0%,rgba(249,115,22,0.3) 60%,rgba(34,211,176,0.2) 100%)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '14px 14px 12px', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Solde EUR</div>
              <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1 }}>€ 247,30</div>
              <div style={{ fontSize: 9, color: '#22D3B0', marginTop: 4, fontWeight: 700 }}>≈ 173 110 FCFA</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5, marginTop: 12 }}>
                {[['→','Envoyer','#F97316'],['↓','Recevoir','#22D3B0'],['↑','Recharger','#8B5CF6'],['▣','Carte','rgba(255,255,255,0.6)']].map(([icon,lbl,c]) => (
                  <div key={lbl} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '7px 3px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 12, color: c }}>{icon}</span>
                    <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(249,115,22,0.1)', border: '0.5px solid rgba(249,115,22,0.25)', borderRadius: 10, padding: '7px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><div style={{ fontSize: 7, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Identifiant</div><div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: '#F97316', letterSpacing: 2 }}>MLK-A3F2</div></div>
              <div style={{ fontSize: 9, background: 'rgba(249,115,22,0.15)', color: '#F97316', fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>Copier</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, padding: '0 2px' }}>Activité récente</div>
              {[
                { icon: '✓', bg: 'rgba(34,211,176,0.12)', name: 'Paiement reçu', sub: 'Client France · SEPA', amt: '+€230', c: '#22D3B0' },
                { icon: '→', bg: 'rgba(249,115,22,0.1)', name: 'Famille · Yaoundé', sub: 'Orange Money', amt: '-50k FCFA', c: '#F97316' },
                { icon: '₿', bg: 'rgba(139,92,246,0.1)', name: 'Conversion USDC', sub: 'EUR → USDC', amt: '+54.2', c: '#8B5CF6' },
              ].map(t => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>{t.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{t.sub}</div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: t.c, flexShrink: 0 }}>{t.amt}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>Taux MonyLink</div><div style={{ fontSize: 11, fontWeight: 800 }}>1 EUR = 700 FCFA</div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22D3B0', animation: 'pulse 2s infinite' }} /><span style={{ fontSize: 9, fontWeight: 700, color: '#22D3B0' }}>Live</span></div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '10%', right: -28, background: 'rgba(8,6,20,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(34,211,176,0.3)', borderRadius: 14, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', animation: 'floatNotif1 4s ease-in-out infinite', zIndex: 5, whiteSpace: 'nowrap' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(34,211,176,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚡</div>
        <div><div style={{ fontSize: 11, fontWeight: 700 }}>+€47,85 reçu</div><div style={{ fontSize: 9, color: '#22D3B0', fontWeight: 600 }}>Instantané · 28s</div></div>
      </div>
      <div style={{ position: 'absolute', bottom: '20%', left: -34, background: 'rgba(8,6,20,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 14, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', animation: 'floatNotif2 5s ease-in-out infinite 1.5s', zIndex: 5, whiteSpace: 'nowrap' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🟠</div>
        <div><div style={{ fontSize: 11, fontWeight: 700 }}>Orange Money</div><div style={{ fontSize: 9, color: '#F97316', fontWeight: 600 }}>150 000 FCFA crédités</div></div>
      </div>
      <div style={{ position: 'absolute', top: '50%', right: -36, background: 'rgba(8,6,20,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 14, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', animation: 'floatNotif1 6s ease-in-out infinite 3s', zIndex: 5, whiteSpace: 'nowrap' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>💳</div>
        <div><div style={{ fontSize: 11, fontWeight: 700 }}>Carte Visa activée</div><div style={{ fontSize: 9, color: '#8B5CF6', fontWeight: 600 }}>Apple Pay · Google Pay</div></div>
      </div>
    </div>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const items = [
    { q: "C'est légal ?", a: "Oui. MonyLink opère en conformité avec la réglementation financière européenne (ACPR) et les régulations télécoms africaines pour Orange Money, MTN MoMo et Wave. Toutes les transactions sont traçables et déclarées." },
    { q: "Comment fonctionne exactement le taux 1€ = 700 FCFA ?", a: "Notre taux client est fixé à 700 FCFA pour 1 EUR. Le taux interbancaire réel est d'environ 656 FCFA. C'est cet écart (le spread) qui constitue notre seul revenu. Aucun frais supplémentaire n'est appliqué." },
    { q: "Combien de temps prend un transfert ?", a: "Les transferts sont traités en moins de 30 secondes dans la grande majorité des cas. Le temps dépend de la disponibilité du réseau Mobile Money. En cas de délai, le paiement est garanti sous 24h." },
    { q: "Mon argent est-il sécurisé ?", a: "Oui. Les fonds sont ségrégués dans des comptes dédiés (jamais mélangés avec les fonds opérationnels de MonyLink). Chiffrement bout-en-bout, authentification KYC obligatoire, et conformité RGPD pour toutes les données." },
    { q: "Quels pays sont couverts ?", a: "Côté Afrique : Cameroun, Côte d'Ivoire, Sénégal, Gabon, Mali, Burkina Faso et d'autres pays CEMAC/UEMOA. Côté Europe : France, Belgique, Suisse, Allemagne et tous les pays SEPA. La liste s'agrandit chaque mois." },
    { q: "C'est quoi l'identifiant MLK ?", a: "C'est votre adresse de paiement unique (ex: MLK-A3F2). Partagez-le à vos proches ou clients pour recevoir de l'argent sans donner votre IBAN ou numéro de téléphone." },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ background: open === i ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${open === i ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => setOpen(open === i ? null : i)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', gap: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: open === i ? '#fff' : 'rgba(255,255,255,0.75)', letterSpacing: -0.2 }}>{item.q}</span>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: open === i ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
              <span style={{ color: open === i ? '#F97316' : 'rgba(255,255,255,0.4)', fontSize: 16, lineHeight: 1, transform: open === i ? 'rotate(45deg)' : 'none', display: 'block', transition: 'transform 0.2s' }}>+</span>
            </div>
          </div>
          {open === i && (
            <div style={{ padding: '0 20px 16px', fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>{item.a}</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function LandingPage() {
  const pageRef = useFadeIn()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div ref={pageRef} style={{ background: '#080614', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', WebkitFontSmoothing: 'antialiased', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes phoneFloat{0%,100%{transform:perspective(1000px) rotateX(6deg) rotateY(-14deg) rotateZ(1.5deg) translateY(0)}50%{transform:perspective(1000px) rotateX(6deg) rotateY(-14deg) rotateZ(1.5deg) translateY(-14px)}}
        @keyframes floatNotif1{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes floatNotif2{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
        @keyframes glow{0%,100%{opacity:0.55;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .fade-in{opacity:0;transform:translateY(22px);transition:opacity 0.65s ease,transform 0.65s ease}
        .fade-in.visible{opacity:1;transform:translateY(0)}
        .feat-card{background:rgba(255,255,255,0.03);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.07);border-radius:22px;padding:26px;transition:all 0.25s ease}
        .feat-card:hover{background:rgba(255,255,255,0.055);border-color:rgba(249,115,22,0.22);transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,0.25)}
        .glass-btn{display:inline-flex;align-items:center;gap:10px;background:rgba(249,115,22,0.88);backdrop-filter:blur(4px);color:#fff;font-weight:700;font-size:15px;padding:15px 28px;border-radius:14px;border:none;text-decoration:none;cursor:pointer;font-family:inherit;box-shadow:inset 0 3px 5px rgba(255,255,255,0.22),0 6px 24px rgba(249,115,22,0.38);transition:transform 0.2s,box-shadow 0.2s;white-space:nowrap}
        .glass-btn:hover{transform:scale(1.03);box-shadow:inset 0 3px 5px rgba(255,255,255,0.22),0 12px 36px rgba(249,115,22,0.55)}
        .ghost-btn{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.8);font-weight:600;font-size:15px;padding:15px 28px;border-radius:14px;text-decoration:none;cursor:pointer;font-family:inherit;box-shadow:inset 0 2px 4px rgba(255,255,255,0.06);transition:all 0.2s;white-space:nowrap}
        .ghost-btn:hover{background:rgba(255,255,255,0.1);transform:scale(1.01)}
        .nav-link{color:rgba(255,255,255,0.6);text-decoration:none;font-size:14px;font-weight:500;transition:color 0.2s}
        .nav-link:hover{color:#fff}
        .pill{display:inline-flex;align-items:center;gap:6px;backdrop-filter:blur(12px);border-radius:100px;padding:5px 14px;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase}
        @media(max-width:960px){
          .nav-links-d{display:none!important}
          .hero-grid{grid-template-columns:1fr!important;padding:32px 20px 56px!important;gap:32px!important}
          .phone-wrap{display:flex;justify-content:center!important;padding-right:0!important;overflow:hidden!important}
          .feat-grid{grid-template-columns:1fr 1fr!important}
          .how-grid{grid-template-columns:1fr 1fr!important}
          .personas-grid{grid-template-columns:1fr!important}
          .stats-grid{grid-template-columns:1fr!important}
          .pricing-grid{grid-template-columns:1fr!important}
          .footer-inner{flex-direction:column!important;text-align:center!important;gap:14px!important}
          .sec{padding-left:20px!important;padding-right:20px!important}
          .sim-grid{grid-template-columns:1fr!important;gap:20px!important}
          .sim-text{display:none!important}
        }
        @media(max-width:540px){
          .feat-grid{grid-template-columns:1fr!important}
          .how-grid{grid-template-columns:1fr!important}
          .cta-btns{flex-direction:column!important}
          .cta-btns a{width:100%!important;justify-content:center!important}
          .trust-pills{gap:8px!important}
        }
      `}</style>

      {/* BG */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-15%', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.16) 0%,transparent 60%)', filter: 'blur(2px)', animation: 'glow 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '-10%', right: '-20%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.11) 0%,transparent 60%)', filter: 'blur(2px)', animation: 'glow 12s ease-in-out infinite 3s' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,211,176,0.06) 0%,transparent 60%)', animation: 'glow 15s ease-in-out infinite 6s' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)', backgroundSize: '56px 56px', maskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%,black 30%,transparent 100%)' }} />
      </div>

      {/* NAVBAR */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, padding: '14px 24px', display: 'flex', justifyContent: 'center' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '10px 18px', background: scrolled ? 'rgba(8,6,20,0.85)' : 'rgba(255,255,255,0.055)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09),0 8px 32px rgba(0,0,0,0.25)', transition: 'background 0.35s', width: '100%', maxWidth: 900 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#F97316,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 12px rgba(249,115,22,0.4)' }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="7" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/><circle cx="13" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/></svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>Mony<span style={{ color: '#8B5CF6' }}>Link</span></span>
          </Link>
          <div className="nav-links-d" style={{ display: 'flex', gap: 24, flex: 1 }}>
            <a href="#features" className="nav-link">Fonctionnalités</a>
            <a href="#how" className="nav-link">Comment ça marche</a>
            <a href="#pricing" className="nav-link">Tarifs</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <Link href="/login" className="nav-link nav-links-d" style={{ padding: '7px 12px' }}>Connexion</Link>
            <Link href="/signup" style={{ background: 'rgba(249,115,22,0.9)', color: '#fff', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none', boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.2),0 4px 12px rgba(249,115,22,0.35)', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(249,115,22,0.45)' }}>
              S&apos;inscrire
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="nav-links-mobile" style={{ display: 'none', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: '#fff' }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </nav>
        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ position: 'absolute', top: '100%', left: 16, right: 16, background: 'rgba(8,6,20,0.97)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '12px', marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 200 }}>
            {[['#features','Fonctionnalités'],['#how','Comment ça marche'],['#pricing','Tarifs'],['#faq','FAQ'],['/login','Connexion'],['/signup','S\'inscrire']].map(([href,label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} style={{ padding: '12px 16px', borderRadius: 10, fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', background: 'transparent', transition: 'background 0.15s' }}>
                {label}
              </a>
            ))}
          </div>
        )}
      </div>

      <style>{`.nav-links-mobile{display:none!important}@media(max-width:960px){.nav-links-mobile{display:flex!important}}`}</style>

      {/* HERO */}
      <section className="hero-grid sec" style={{ display: 'grid', gridTemplateColumns: '1fr 500px', gap: 40, alignItems: 'center', padding: '48px 80px 80px', maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ animation: 'fadeUp 0.65s ease both' }}>
          <div className="pill" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)', marginBottom: 26, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}>
            <span style={{ color: '#FF801E', letterSpacing: 2 }}>★★★★★</span>
            Noté 4.9/5 · 2 700+ utilisateurs
          </div>
          <h1 style={{ fontSize: 'clamp(40px,5.5vw,78px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-3.5px', marginBottom: 22 }}>
            De l&apos;<span style={{ color: '#8B5CF6', textShadow: '0 0 80px rgba(139,92,246,0.55)' }}>Afrique</span><br />
            vers l&apos;<span style={{ color: '#F97316', textShadow: '0 0 80px rgba(249,115,22,0.45)' }}>Europe</span><br />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>en 30 secondes</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.72, color: 'rgba(255,255,255,0.55)', marginBottom: 36, maxWidth: 430, letterSpacing: '-0.2px' }}>
            Wallet multi-devises connecté à Orange Money, MTN MoMo et Wave. <strong style={{ color: '#fff', fontWeight: 700 }}>2× moins cher que Western Union.</strong> Carte virtuelle Visa incluse.
          </p>
          <div className="cta-btns" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
            <Link href="/signup" className="glass-btn">
              Créer un compte gratuit
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </Link>
            <Link href="/demo" className="ghost-btn"><span style={{ fontSize: 10 }}>▶</span> Essayer la démo</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            {['🇨🇲','🇨🇮','🇸🇳','🇬🇦','🇫🇷','🇧🇪','🇩🇪','🇨🇭'].map(f => <span key={f} style={{ fontSize: 20 }}>{f}</span>)}
            <span style={{ marginLeft: 8, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>+15 pays couverts</span>
          </div>
        </div>
        <div className="phone-wrap" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 50, animation: 'fadeUp 0.75s ease 0.15s both' }}>
          <Phone3D />
        </div>
      </section>

      {/* TRUSTED BY */}
      <div style={{ padding: '20px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Connecté aux meilleurs acteurs</div>
        <div className="trust-pills" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          {[['🟠','Orange Money'],['🟡','MTN MoMo'],['🔵','Wave'],['🏦','SEPA Instant'],['💳','Visa Virtual'],['₿','Crypto']].map(([icon,name]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '7px 14px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>
              <span style={{ fontSize: 14 }}>{icon}</span>{name}
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 40px' }}>
        {[['2×','Moins cher que Western Union'],['+15','Pays africains couverts'],['<30s','Temps de transfert moyen']].map(([n,l],i) => (
          <div key={l} className="fade-in" style={{ padding: '44px 20px', textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2.5, background: 'linear-gradient(135deg,#F97316,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 8, lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section id="features" className="sec" style={{ padding: '80px 80px', maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="pill" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#8B5CF6', marginBottom: 18 }}>Pourquoi MonyLink</div>
        <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 12, lineHeight: 1.03 }}>Tout en un seul wallet</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 48, maxWidth: 500 }}>La première fintech qui connecte vraiment l&apos;Afrique et l&apos;Europe — dans les deux sens.</p>
        <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[
            { icon: '⚡', h: 'Transferts instantanés', p: "L'argent arrive en moins de 30 secondes sur Mobile Money ou l'IBAN du destinataire.", c: 'rgba(249,115,22,0.1)', b: 'rgba(249,115,22,0.25)' },
            { icon: '🔒', h: 'Sécurité bancaire', p: 'KYC biométrique, fonds ségrégués, chiffrement bout-en-bout, conformité ACPR Europe.', c: 'rgba(139,92,246,0.1)', b: 'rgba(139,92,246,0.25)' },
            { icon: '💱', h: 'Taux transparent', p: '1 EUR = 700 FCFA. Notre seul revenu : le spread. Aucun frais supplémentaire, jamais.', c: 'rgba(34,211,176,0.07)', b: 'rgba(34,211,176,0.25)' },
            { icon: '💰', h: 'Multi-devises', p: 'EUR, FCFA, USDC dans un seul portefeuille. Conversion automatique en temps réel.', c: 'rgba(249,115,22,0.1)', b: 'rgba(249,115,22,0.25)' },
            { icon: '💳', h: 'Carte virtuelle Visa', p: 'Compatible Apple Pay & Google Pay. Payez partout dans le monde depuis l\'Afrique.', c: 'rgba(139,92,246,0.1)', b: 'rgba(139,92,246,0.25)' },
            { icon: '↔️', h: 'Bidirectionnel', p: 'Afrique → Europe et Europe → Afrique. Freelances, familles, étudiants : tous couverts.', c: 'rgba(34,211,176,0.07)', b: 'rgba(34,211,176,0.25)' },
          ].map(f => (
            <div key={f.h} className="feat-card fade-in">
              <div style={{ width: 46, height: 46, borderRadius: 14, background: f.c, border: `1px solid ${f.b}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 9, letterSpacing: '-0.3px' }}>{f.h}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{f.p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="sec" style={{ padding: '0 80px 80px', maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="pill" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316', marginBottom: 18 }}>Comment ça marche</div>
        <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 12, lineHeight: 1.03 }}>4 étapes, c&apos;est tout</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 48 }}>De l&apos;inscription au premier transfert en moins de 5 minutes.</p>
        <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {[
            { n: 1, h: 'Créez votre compte', p: 'Inscription email en 2 min. Vérification KYC rapide via téléphone.' },
            { n: 2, h: 'Alimentez le wallet', p: 'Via Mobile Money (Orange, MTN), IBAN ou carte bancaire. Fonds instantanés.' },
            { n: 3, h: 'Choisissez le destinataire', p: "Entrez le MLK ID, le numéro Mobile Money ou l'IBAN. Frais affichés avant." },
            { n: 4, h: 'Envoyez', p: 'Transfert en moins de 30 secondes. Notification immédiate des deux côtés.' },
          ].map((s, i) => (
            <div key={s.n} className="fade-in" style={{ padding: '26px 22px', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 14, right: 16, fontSize: 44, fontWeight: 900, color: 'rgba(255,255,255,0.035)', letterSpacing: -2, lineHeight: 1 }}>0{i+1}</div>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,rgba(249,115,22,${0.7+i*0.07}),rgba(139,92,246,${0.7+i*0.07}))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, margin: '0 0 16px', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.22)' }}>{s.n}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.2px' }}>{s.h}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.65 }}>{s.p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SIMULATOR */}
      <section className="sec" style={{ padding: '0 80px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="sim-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div className="sim-text">
            <div className="pill" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316', marginBottom: 18 }}>💱 Simulateur</div>
            <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 14 }}>Compare les frais<br /><span style={{ color: '#F97316' }}>en temps réel</span></h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 24 }}>Aucune surprise. Notre seul revenu est le spread de taux (700 FCFA vs ~656 FCFA marché). Pas de commission supplémentaire.</p>
            <div style={{ display: 'flex', gap: 28 }}>
              {[['700','FCFA = 1€'],['0','frais cachés'],['<30s','délai']].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -1.5, background: 'linear-gradient(135deg,#F97316,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{n}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 28, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)' }}>
            <TransferSimulator />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="sec" style={{ padding: '0 80px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="pill" style={{ background: 'rgba(34,211,176,0.07)', border: '1px solid rgba(34,211,176,0.18)', color: '#22D3B0', marginBottom: 18 }}>Tarifs</div>
        <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 12, lineHeight: 1.03 }}>Simple et transparent</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 40 }}>Un seul mécanisme de revenu : le spread de taux.</p>
        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'MonyLink', rate: '1€ = 700 FCFA', fee: 'Aucun frais', total: '€ 214', highlight: true, badge: '✓ Recommandé' },
            { label: 'Western Union', rate: '1€ ≈ 607 FCFA', fee: '+ frais ~8%', total: '€ 184', highlight: false },
            { label: 'Transfert bancaire', rate: '1€ ≈ 620 FCFA', fee: '+ frais fixes ~15€', total: '€ 176', highlight: false },
          ].map(p => (
            <div key={p.label} className="fade-in" style={{ background: p.highlight ? 'rgba(249,115,22,0.08)' : 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)', border: `1px solid ${p.highlight ? 'rgba(249,115,22,0.35)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 22, padding: '28px 24px', position: 'relative', boxShadow: p.highlight ? '0 0 60px rgba(249,115,22,0.1)' : 'none' }}>
              {p.badge && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#F97316', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(249,115,22,0.4)' }}>{p.badge}</div>}
              <div style={{ fontSize: 14, fontWeight: 700, color: p.highlight ? '#F97316' : 'rgba(255,255,255,0.5)', marginBottom: 16 }}>{p.label}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>Taux : <strong style={{ color: p.highlight ? '#fff' : 'rgba(255,255,255,0.7)' }}>{p.rate}</strong></div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>Frais : <strong style={{ color: p.highlight ? '#22D3B0' : 'rgba(239,68,68,0.8)' }}>{p.fee}</strong></div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Pour 150 000 FCFA envoyés</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: p.highlight ? '#22D3B0' : 'rgba(255,255,255,0.45)', letterSpacing: -1 }}>{p.total}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>reçus par le destinataire</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(34,211,176,0.06)', border: '1px solid rgba(34,211,176,0.15)', borderRadius: 16, padding: '16px 24px', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
          💡 <strong style={{ color: '#22D3B0' }}>Exemple concret :</strong> Pour envoyer 150 000 FCFA depuis Douala à Paris — MonyLink te donne <strong style={{ color: '#fff' }}>30 € de plus</strong> que Western Union.
        </div>
      </section>

      {/* PERSONAS */}
      <section id="personas" className="sec" style={{ padding: '0 80px 80px', maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="pill" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)', color: '#8B5CF6', marginBottom: 18 }}>Ils utilisent MonyLink</div>
        <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 12, lineHeight: 1.03 }}>Fait pour vous</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 48 }}>Diaspora, freelances, familles, étudiants.</p>
        <div className="personas-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { initials: 'KA', accent: '#8B5CF6', grad: 'linear-gradient(135deg,rgba(139,92,246,0.55),rgba(139,92,246,0.15))', name: 'Kevin, 27 ans · Douala', role: "Graphiste freelance · reçoit des paiements d'Europe", quote: '"Avant, PayPal bloquait mes paiements 21 jours et prenait 8 %. Maintenant je reçois mes euros en 30 secondes sur mon wallet et je retire en FCFA au taux le plus bas du marché."' },
            { initials: 'JT', accent: '#F97316', grad: 'linear-gradient(135deg,rgba(249,115,22,0.55),rgba(249,115,22,0.15))', name: 'Jeanne, 52 ans · Yaoundé', role: 'Fonctionnaire · envoie à son fils en France', quote: '"J\'envoie 150 € à mon fils chaque mois depuis Orange Money. Ça prend 30 secondes, il reçoit sur son compte bancaire français, et je ne paie plus les 12 % de Western Union."' },
          ].map(p => (
            <div key={p.name} className="fade-in" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)', border: `1px solid ${p.accent}20`, borderRadius: 24, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0, boxShadow: `0 4px 16px ${p.accent}28,inset 0 2px 4px rgba(255,255,255,0.12)` }}>{p.initials}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 3 }}>{p.role}</div>
                </div>
              </div>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.58)', lineHeight: 1.75, fontStyle: 'italic' }}>{p.quote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST & SECURITY */}
      <section className="sec" style={{ padding: '0 80px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 28, padding: '48px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(34,211,176,0.1)', border: '1px solid rgba(34,211,176,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔐</div>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-1px', marginBottom: 2 }}>Votre argent est protégé</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Sécurité de niveau bancaire, transparence totale</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              { icon: '🏛️', title: 'Conforme ACPR', desc: 'MonyLink opère sous cadre réglementaire européen. Toutes les transactions sont déclarées et tracées.' },
              { icon: '🔒', title: 'Fonds ségrégués', desc: 'Vos fonds sont stockés séparément des fonds opérationnels de MonyLink, dans des comptes dédiés.' },
              { icon: '🛡️', title: 'KYC obligatoire', desc: 'Vérification d\'identité pour chaque utilisateur. Protection contre la fraude et le blanchiment.' },
              { icon: '🔑', title: 'Chiffrement E2E', desc: 'Toutes les données transitent chiffrées. Authentification 2FA disponible sur le compte.' },
            ].map(t => (
              <div key={t.title} style={{ display: 'flex', gap: 14, padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{t.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO CTA */}
      <section className="sec" style={{ padding: '0 80px 80px', maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(24px)', border: '1px solid rgba(139,92,246,0.18)', borderRadius: 32, padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.05)' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 350, height: 350, background: 'radial-gradient(circle,rgba(249,115,22,0.09) 0%,transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, background: 'radial-gradient(circle,rgba(139,92,246,0.09) 0%,transparent 60%)', pointerEvents: 'none' }} />
          <div className="pill" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316', marginBottom: 22 }}>🧪 Sandbox sécurisé</div>
          <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 16, lineHeight: 1.03 }}>Testez sans créer de compte<br /><span style={{ color: '#8B5CF6' }}>— c&apos;est entièrement gratuit</span></h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 36, maxWidth: 460, margin: '0 auto 36px' }}>Explorez le wallet, simulez un vrai transfert Afrique → Europe et découvrez toutes les fonctionnalités.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 36 }}>
            {['Wallet simulé','Transfert Afrique → Europe','Carte virtuelle','Historique complet'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, color: 'rgba(255,255,255,0.48)' }}>
                <span style={{ color: '#22D3B0', fontWeight: 800 }}>✓</span> {item}
              </div>
            ))}
          </div>
          <Link href="/demo" className="glass-btn" style={{ fontSize: 16, padding: '15px 40px' }}>
            <span>▶</span> Essayer maintenant
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', marginTop: 16 }}>Aucune inscription requise · Données 100 % fictives</div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="sec" style={{ padding: '0 80px 80px', maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="pill" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', marginBottom: 18 }}>Questions fréquentes</div>
        <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 12, lineHeight: 1.03 }}>Tout ce que vous voulez savoir</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 40 }}>Des réponses claires à vos vraies questions.</p>
        <FAQ />
      </section>

      {/* FOOTER */}
      <footer className="sec" style={{ padding: '28px 80px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
        <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>Mony<span style={{ color: '#8B5CF6' }}>Link</span></span>
          <span>© 2026 MonyLink SAS · Paris, France</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/cgu" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>CGU</Link>
            <Link href="/confidentialite" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Confidentialité</Link>
            <a href="mailto:contact@monylink.com" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
