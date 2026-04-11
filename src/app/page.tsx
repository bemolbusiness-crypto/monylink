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
  const CLIENT_RATE = 700 // 1 EUR = 700 FCFA (notre taux — la marge est dans le spread)
  const euros = Math.round(amount / CLIENT_RATE)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 16px' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Tu envoies</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: 'inherit', minWidth: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 9, padding: '5px 11px', flexShrink: 0 }}>
            <span>🌍</span><span style={{ fontSize: 12, fontWeight: 700, color: '#F97316' }}>FCFA</span>
          </div>
        </div>
      </div>
      <input type="range" min={20000} max={650000} step={5000} value={amount}
        onChange={e => setAmount(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#F97316', cursor: 'pointer' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#F97316,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(249,115,22,0.35), inset 0 2px 3px rgba(255,255,255,0.2)', flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M3 8l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
      </div>
      <div style={{ background: 'rgba(34,211,176,0.06)', border: '1px solid rgba(34,211,176,0.2)', borderRadius: 14, padding: '14px 16px' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Reçoit</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: '#22D3B0', flex: 1 }}>{euros} €</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,211,176,0.15)', border: '1px solid rgba(34,211,176,0.3)', borderRadius: 9, padding: '5px 11px' }}>
            <span>🇪🇺</span><span style={{ fontSize: 12, fontWeight: 700, color: '#22D3B0' }}>EUR</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.35)', padding: '2px 2px' }}>
        <span>Taux : <span style={{ color: '#fff', fontWeight: 700 }}>1 EUR = {CLIENT_RATE} FCFA</span></span>
        <span style={{ color: '#22D3B0', fontWeight: 600 }}>⚡ Instantané</span>
      </div>
      <Link href="/signup" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(249,115,22,0.85)', color: '#fff', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: 'inset 0 3px 4px rgba(255,255,255,0.2), 0 6px 20px rgba(249,115,22,0.3)' }}>
        Ouvrir un compte gratuit →
      </Link>
    </div>
  )
}

/* ── 3D Phone Mockup ── */
function Phone3D() {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* Shadow floor */}
      <div style={{ position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)', width: 260, height: 40, background: 'radial-gradient(ellipse, rgba(139,92,246,0.35) 0%, transparent 70%)', filter: 'blur(18px)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Glow behind phone */}
      <div style={{ position: 'absolute', inset: -60, background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.22) 0%, rgba(249,115,22,0.12) 40%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none', borderRadius: '50%' }} />

      {/* Phone outer shell */}
      <div style={{
        width: 248, flexShrink: 0,
        transform: 'perspective(1000px) rotateX(6deg) rotateY(-14deg) rotateZ(1.5deg)',
        transformStyle: 'preserve-3d',
        animation: 'phoneFloat 5s ease-in-out infinite',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Chassis */}
        <div style={{
          background: 'linear-gradient(160deg, #1c1635 0%, #120d28 60%, #0e0a1f 100%)',
          borderRadius: 44,
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: `
            0 60px 120px rgba(0,0,0,0.8),
            0 30px 60px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.12),
            inset 0 -1px 0 rgba(0,0,0,0.4),
            4px 0 16px rgba(0,0,0,0.3),
            -1px 0 0 rgba(255,255,255,0.06)
          `,
          padding: '14px 10px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Side shine */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, transparent 100%)', borderRadius: '44px 0 0 44px', pointerEvents: 'none' }} />

          {/* Notch */}
          <div style={{ width: 72, height: 6, background: 'rgba(0,0,0,0.8)', borderRadius: 3, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
          </div>

          {/* ── SCREEN CONTENT ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 6px' }}>
              <div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Bonjour,</div>
                <div style={{ fontSize: 13, fontWeight: 800 }}>Aurélien 👋</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800 }}>Mony<span style={{ color: '#8B5CF6' }}>Link</span></span>
            </div>

            {/* Balance hero card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.45) 0%, rgba(249,115,22,0.3) 60%, rgba(34,211,176,0.2) 100%)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
              padding: '14px 14px 12px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
            }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Solde EUR</div>
              <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1 }}>€ 247,30</div>
              <div style={{ fontSize: 9, color: '#22D3B0', marginTop: 4, fontWeight: 700 }}>≈ 173 110 FCFA</div>

              {/* Actions row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5, marginTop: 12 }}>
                {[['→','Envoyer','#F97316'],['↓','Recevoir','#22D3B0'],['↑','Recharger','#8B5CF6'],['▣','Carte','rgba(255,255,255,0.6)']].map(([icon,lbl,c]) => (
                  <div key={lbl} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', borderRadius: 10, padding: '7px 3px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 12, color: c }}>{icon}</span>
                    <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MLK ID pill */}
            <div style={{ background: 'rgba(249,115,22,0.1)', border: '0.5px solid rgba(249,115,22,0.25)', borderRadius: 10, padding: '7px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Identifiant</div>
                <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: '#F97316', letterSpacing: 2 }}>MLK-A3F2</div>
              </div>
              <div style={{ fontSize: 9, background: 'rgba(249,115,22,0.15)', color: '#F97316', fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>Copier</div>
            </div>

            {/* Transactions */}
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 7, padding: '0 2px' }}>Activité récente</div>
              {[
                { icon: '✓', bg: 'rgba(34,211,176,0.12)', name: 'Paiement reçu', sub: 'Client France · SEPA', amt: '+€230', c: '#22D3B0' },
                { icon: '→', bg: 'rgba(249,115,22,0.1)', name: 'Famille · Yaoundé', sub: 'Orange Money', amt: '-50k FCFA', c: '#F97316' },
                { icon: '₿', bg: 'rgba(139,92,246,0.1)', name: 'Conversion USDC', sub: 'EUR → USDC', amt: '+54.2 USDC', c: '#8B5CF6' },
              ].map(t => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 4px', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{t.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{t.sub}</div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: t.c, flexShrink: 0 }}>{t.amt}</div>
                </div>
              ))}
            </div>

            {/* Taux bar */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
              <div>
                <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>Taux MonyLink</div>
                <div style={{ fontSize: 11, fontWeight: 800 }}>1 EUR = 700 FCFA</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22D3B0' }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: '#22D3B0' }}>Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification cards */}
      <div style={{ position: 'absolute', top: '12%', right: -30, background: 'rgba(13,9,32,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(34,211,176,0.3)', borderRadius: 14, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)', animation: 'floatNotif1 4s ease-in-out infinite', zIndex: 5, whiteSpace: 'nowrap' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(34,211,176,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚡</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700 }}>+€47,85 reçu</div>
          <div style={{ fontSize: 9, color: '#22D3B0', fontWeight: 600 }}>Instantané · 28s</div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '18%', left: -36, background: 'rgba(13,9,32,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 14, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)', animation: 'floatNotif2 5s ease-in-out infinite 1.5s', zIndex: 5, whiteSpace: 'nowrap' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🟠</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700 }}>Orange Money</div>
          <div style={{ fontSize: 9, color: '#F97316', fontWeight: 600 }}>150 000 FCFA envoyés</div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '52%', right: -40, background: 'rgba(13,9,32,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 14, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)', animation: 'floatNotif1 6s ease-in-out infinite 3s', zIndex: 5, whiteSpace: 'nowrap' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>💳</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700 }}>Carte Visa activée</div>
          <div style={{ fontSize: 9, color: '#8B5CF6', fontWeight: 600 }}>Apple Pay · Google Pay</div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const pageRef = useFadeIn()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div ref={pageRef} style={{ background: '#080614', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes phoneFloat {
          0%,100% { transform: perspective(1000px) rotateX(6deg) rotateY(-14deg) rotateZ(1.5deg) translateY(0); }
          50% { transform: perspective(1000px) rotateX(6deg) rotateY(-14deg) rotateZ(1.5deg) translateY(-14px); }
        }
        @keyframes floatNotif1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes floatNotif2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        @keyframes glow { 0%,100%{opacity:0.55;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }

        .fade-in { opacity:0; transform:translateY(22px); transition:opacity 0.65s ease, transform 0.65s ease; }
        .fade-in.visible { opacity:1; transform:translateY(0); }

        .feat-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 22px; padding: 26px;
          transition: all 0.25s ease;
        }
        .feat-card:hover {
          background: rgba(255,255,255,0.055);
          border-color: rgba(249,115,22,0.22);
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.25);
        }

        .glass-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(249,115,22,0.88);
          backdrop-filter: blur(4px);
          color: #fff; font-weight: 700; font-size: 15px;
          padding: 15px 28px; border-radius: 14px; border: none;
          text-decoration: none; cursor: pointer; font-family: inherit;
          box-shadow: inset 0 3px 5px rgba(255,255,255,0.22), 0 6px 24px rgba(249,115,22,0.38);
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .glass-btn:hover { transform: scale(1.03); box-shadow: inset 0 3px 5px rgba(255,255,255,0.22), 0 12px 36px rgba(249,115,22,0.55); }

        .ghost-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.06); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.8); font-weight: 600; font-size: 15px;
          padding: 15px 28px; border-radius: 14px;
          text-decoration: none; cursor: pointer; font-family: inherit;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.06);
          transition: all 0.2s; white-space: nowrap;
        }
        .ghost-btn:hover { background: rgba(255,255,255,0.1); transform: scale(1.01); }

        .nav-link { color: rgba(255,255,255,0.52); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }

        .pill-badge {
          display: inline-flex; align-items: center; gap: 6px;
          backdrop-filter: blur(12px);
          border-radius: 100px; padding: 5px 14px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase;
        }

        @media (max-width: 960px) {
          .nav-links-d { display: none !important; }
          .hero-grid { grid-template-columns: 1fr !important; padding: 32px 20px 56px !important; gap: 56px !important; }
          .phone-col { justify-content: center !important; }
          .feat-grid { grid-template-columns: 1fr 1fr !important; }
          .how-grid { grid-template-columns: 1fr 1fr !important; }
          .personas-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .footer-inner { flex-direction: column !important; text-align: center !important; gap: 14px !important; }
          .sec { padding: 60px 20px !important; }
        }
        @media (max-width: 540px) {
          .feat-grid { grid-template-columns: 1fr !important; }
          .how-grid { grid-template-columns: 1fr !important; }
          .cta-btns { flex-direction: column !important; }
        }
      `}</style>

      {/* ── BG MESH ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-15%', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 60%)', filter: 'blur(2px)', animation: 'glow 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '-10%', right: '-20%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.11) 0%, transparent 60%)', filter: 'blur(2px)', animation: 'glow 12s ease-in-out infinite 3s' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,176,0.06) 0%, transparent 60%)', animation: 'glow 15s ease-in-out infinite 6s' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)', backgroundSize: '56px 56px', maskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, black 30%, transparent 100%)' }} />
      </div>

      {/* ── NAVBAR ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, padding: '16px 40px', display: 'flex', justifyContent: 'center' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '10px 20px', background: scrolled ? 'rgba(8,6,20,0.8)' : 'rgba(255,255,255,0.055)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09), 0 8px 32px rgba(0,0,0,0.25)', transition: 'background 0.35s' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#F97316,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 12px rgba(249,115,22,0.4)' }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="7" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/><circle cx="13" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/></svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>Mony<span style={{ color: '#8B5CF6' }}>Link</span></span>
          </Link>
          <div className="nav-links-d" style={{ display: 'flex', gap: 26 }}>
            <a href="#features" className="nav-link">Fonctionnalités</a>
            <a href="#how" className="nav-link">Comment ça marche</a>
            <a href="#personas" className="nav-link">Pour qui</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/login" className="nav-link" style={{ padding: '7px 12px' }}>Connexion</Link>
            <Link href="/signup" style={{ background: 'rgba(249,115,22,0.9)', color: '#fff', borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none', boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.2), 0 4px 12px rgba(249,115,22,0.35)', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(249,115,22,0.45)', transition: 'transform 0.15s' }}>
              S&apos;inscrire
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </nav>
      </div>

      {/* ── HERO ── */}
      <section className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 520px', gap: 40, alignItems: 'center', padding: '48px 80px 80px', maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* LEFT */}
        <div style={{ animation: 'fadeUp 0.65s ease both' }}>
          <div className="pill-badge" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', marginBottom: 26, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}>
            <span style={{ color: '#FF801E', letterSpacing: 2 }}>★★★★★</span>
            Noté 4.9/5 · 2 700+ utilisateurs
          </div>

          <h1 style={{ fontSize: 'clamp(42px, 5.5vw, 80px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-3.5px', marginBottom: 22 }}>
            De l&apos;<span style={{ color: '#8B5CF6', textShadow: '0 0 80px rgba(139,92,246,0.55)' }}>Afrique</span><br />
            vers l&apos;<span style={{ color: '#F97316', textShadow: '0 0 80px rgba(249,115,22,0.45)' }}>Europe</span><br />
            <span style={{ color: 'rgba(255,255,255,0.88)' }}>en 30 secondes</span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.72, color: 'rgba(255,255,255,0.48)', marginBottom: 36, maxWidth: 430, letterSpacing: '-0.2px' }}>
            Wallet multi-devises connecté à Orange Money, MTN MoMo et Wave. 2× moins cher que Western Union. Carte virtuelle Visa incluse.
          </p>

          <div className="cta-btns" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
            <Link href="/signup" className="glass-btn">
              Créer un compte gratuit
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </Link>
            <Link href="/demo" className="ghost-btn">
              <span style={{ fontSize: 10 }}>▶</span> Essayer la démo
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            {['🇨🇲', '🇨🇮', '🇸🇳', '🇬🇦', '🇫🇷', '🇧🇪', '🇩🇪', '🇨🇭'].map(f => <span key={f} style={{ fontSize: 20 }}>{f}</span>)}
            <span style={{ marginLeft: 8, fontSize: 12, color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>+15 pays couverts</span>
          </div>
        </div>

        {/* RIGHT — 3D Phone */}
        <div className="phone-col" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 60, animation: 'fadeUp 0.75s ease 0.15s both' }}>
          <Phone3D />
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <div style={{ padding: '22px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 18 }}>Connecté aux meilleurs acteurs</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          {[['🟠','Orange Money'],['🟡','MTN MoMo'],['🔵','Wave'],['🏦','SEPA Instant'],['💳','Visa Virtual'],['₿','Crypto']].map(([icon,name]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '7px 15px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>
              <span style={{ fontSize: 14 }}>{icon}</span>{name}
            </div>
          ))}
        </div>
      </div>

      {/* ── SIMULATOR SECTION ── */}
      <section className="sec" style={{ padding: '80px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div className="pill-badge" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316', marginBottom: 18 }}>💱 Simulateur</div>
            <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 14 }}>Calcule tes frais<br /><span style={{ color: '#F97316' }}>en temps réel</span></h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 24 }}>Aucune surprise. Notre seul revenu : l&apos;écart de taux (700 FCFA vs marché). Zéro commission cachée, zéro frais supplémentaires.</p>
            <div style={{ display: 'flex', gap: 20 }}>
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

      {/* ── STATS ── */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 80px' }}>
        {[['2×','Moins cher que Western Union'],['+15','Pays africains couverts'],['<30s','Temps de transfert']].map(([n,l],i) => (
          <div key={l} className="fade-in" style={{ padding: '44px 20px', textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2.5, background: 'linear-gradient(135deg,#F97316,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 8, lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', lineHeight: 1.5 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="sec" style={{ padding: '80px 80px', maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="pill-badge" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#8B5CF6', marginBottom: 18 }}>Pourquoi MonyLink</div>
        <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 12, lineHeight: 1.03 }}>Tout en un seul wallet</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.38)', marginBottom: 48, maxWidth: 440 }}>Multi-devises, bidirectionnel, carte virtuelle incluse.</p>
        <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[
            { icon: '⚡', h: 'Transferts instantanés', p: "L'argent arrive en moins de 30 secondes sur Mobile Money ou l'IBAN du destinataire.", c: 'rgba(249,115,22,0.1)', b: 'rgba(249,115,22,0.2)' },
            { icon: '🔒', h: 'Sécurité renforcée', p: 'KYC biométrique, chiffrement bout-en-bout, conformité ACPR Europe.', c: 'rgba(139,92,246,0.1)', b: 'rgba(139,92,246,0.2)' },
            { icon: '💱', h: 'Taux transparents', p: '1 EUR = 700 FCFA. Notre marge est dans le spread, pas en frais. Taux affiché avant confirmation.', c: 'rgba(34,211,176,0.07)', b: 'rgba(34,211,176,0.2)' },
            { icon: '💰', h: 'Multi-devises', p: 'EUR, FCFA, USD, Crypto dans un seul portefeuille. Conversion en temps réel.', c: 'rgba(249,115,22,0.1)', b: 'rgba(249,115,22,0.2)' },
            { icon: '💳', h: 'Carte virtuelle Visa', p: 'Compatible Apple Pay & Google Pay. Payez partout dans le monde depuis l\'Afrique.', c: 'rgba(139,92,246,0.1)', b: 'rgba(139,92,246,0.2)' },
            { icon: '↔️', h: 'Bidirectionnel', p: 'Unique sur le marché : envois dans les deux sens. Freelances reçoivent en EUR.', c: 'rgba(34,211,176,0.07)', b: 'rgba(34,211,176,0.2)' },
          ].map(f => (
            <div key={f.h} className="feat-card fade-in">
              <div style={{ width: 46, height: 46, borderRadius: 14, background: f.c, border: `1px solid ${f.b}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16, boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.06)' }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 9, letterSpacing: '-0.3px' }}>{f.h}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>{f.p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW ── */}
      <section id="how" className="sec" style={{ padding: '0 80px 80px', maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="pill-badge" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316', marginBottom: 18 }}>Comment ça marche</div>
        <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 12, lineHeight: 1.03 }}>4 étapes, c&apos;est tout</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.38)', marginBottom: 48 }}>De l&apos;inscription au premier transfert en moins de 5 minutes.</p>
        <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {[
            { n: '01', h: 'Créez votre compte', p: 'Inscription en 2 min. KYC rapide via votre téléphone.' },
            { n: '02', h: 'Alimentez le wallet', p: 'IBAN, carte bancaire ou Mobile Money. Instantané.' },
            { n: '03', h: 'Choisissez le destinataire', p: "Numéro Mobile Money ou IBAN. Frais affichés avant." },
            { n: '04', h: 'Envoyez', p: 'Moins de 30 secondes. Notification immédiate.' },
          ].map((s, i) => (
            <div key={s.n} className="fade-in" style={{ padding: '26px 22px', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 14, right: 16, fontSize: 44, fontWeight: 900, color: 'rgba(255,255,255,0.035)', letterSpacing: -2, lineHeight: 1, userSelect: 'none' }}>{s.n}</div>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,rgba(249,115,22,${0.6+i*0.1}),rgba(139,92,246,${0.6+i*0.1}))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, margin: '0 0 16px', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.22)' }}>{i+1}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.2px' }}>{s.h}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.36)', lineHeight: 1.65 }}>{s.p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PERSONAS ── */}
      <section id="personas" className="sec" style={{ padding: '0 80px 80px', maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="pill-badge" style={{ background: 'rgba(34,211,176,0.07)', border: '1px solid rgba(34,211,176,0.18)', color: '#22D3B0', marginBottom: 18 }}>Ils utilisent MonyLink</div>
        <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 12, lineHeight: 1.03 }}>Fait pour vous</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.38)', marginBottom: 48 }}>Diaspora, freelances, familles, étudiants.</p>
        <div className="personas-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { initials: 'KA', accent: '#8B5CF6', grad: 'linear-gradient(135deg,rgba(139,92,246,0.55),rgba(139,92,246,0.15))', name: 'Kevin, 27 ans · Douala', role: "Graphiste freelance · reçoit des paiements d'Europe", quote: '"PayPal bloque mon argent 21 jours. J\'ai besoin d\'un wallet pour recevoir mes euros de clients européens et retirer en FCFA sans perdre 8 %."' },
            { initials: 'JT', accent: '#F97316', grad: 'linear-gradient(135deg,rgba(249,115,22,0.55),rgba(249,115,22,0.15))', name: 'Jeanne, 52 ans · Yaoundé', role: 'Fonctionnaire · envoie à son fils en France', quote: '"Je veux envoyer 150 € à mon fils chaque mois depuis Orange Money, sans payer 12 % de frais et sans me déplacer jusqu\'à une agence."' },
          ].map(p => (
            <div key={p.name} className="fade-in" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)', border: `1px solid ${p.accent}20`, borderRadius: 24, padding: 28, boxShadow: `0 0 60px ${p.accent}08` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0, boxShadow: `0 4px 16px ${p.accent}28, inset 0 2px 4px rgba(255,255,255,0.12)` }}>{p.initials}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.33)', marginTop: 3 }}>{p.role}</div>
                </div>
              </div>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.52)', lineHeight: 1.75, fontStyle: 'italic' }}>{p.quote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMO CTA ── */}
      <section className="sec" style={{ padding: '0 80px 80px', maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(24px)', border: '1px solid rgba(139,92,246,0.18)', borderRadius: 32, padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.05)' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 350, height: 350, background: 'radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 60%)', filter: 'blur(2px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 60%)', filter: 'blur(2px)', pointerEvents: 'none' }} />
          <div className="pill-badge" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316', marginBottom: 22 }}>🧪 Sandbox sécurisé</div>
          <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 16, lineHeight: 1.03 }}>
            Testez MonyLink<br /><span style={{ color: '#8B5CF6' }}>sans créer de compte</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.42)', marginBottom: 36, maxWidth: 460, margin: '0 auto 36px' }}>Explorez le wallet, simulez un vrai transfert Afrique → Europe et découvrez toutes les fonctionnalités.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 36 }}>
            {['Wallet simulé', 'Transfert A→E', 'Carte virtuelle', 'Historique'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, color: 'rgba(255,255,255,0.42)' }}>
                <span style={{ color: '#22D3B0', fontWeight: 800 }}>✓</span> {item}
              </div>
            ))}
          </div>
          <Link href="/demo" className="glass-btn" style={{ fontSize: 16, padding: '15px 40px' }}>
            <span>▶</span> Essayer maintenant — c&apos;est gratuit
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 16 }}>Aucune inscription · Données 100 % fictives</div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="sec" style={{ padding: '24px 80px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
        <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.28)' }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>Mony<span style={{ color: '#8B5CF6' }}>Link</span></span>
          <span>© 2026 MonyLink SAS · Paris, France</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/cgu" style={{ color: 'rgba(255,255,255,0.28)', textDecoration: 'none' }}>CGU</Link>
            <Link href="/confidentialite" style={{ color: 'rgba(255,255,255,0.28)', textDecoration: 'none' }}>Confidentialité</Link>
            <a href="mailto:contact@monylink.com" style={{ color: 'rgba(255,255,255,0.28)', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
