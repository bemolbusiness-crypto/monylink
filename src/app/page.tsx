'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

/* ─── Fade-in observer ─── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }), { threshold: 0.1 })
    el.querySelectorAll('.fade-in').forEach(node => obs.observe(node))
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ─── Transfer Simulator ─── */
function TransferSimulator() {
  const [amount, setAmount] = useState(150000)
  const rate = 655.96
  const fee = Math.round(amount * 0.025 + 500)
  const euros = Math.round((amount - fee) / rate)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* FROM */}
      <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 16px' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Tu envoies</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'inherit', minWidth: 0 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 10, padding: '6px 12px', flexShrink: 0 }}>
            <span style={{ fontSize: 14 }}>🌍</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#F97316' }}>FCFA</span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <input type="range" min={50000} max={650000} step={5000} value={amount}
        onChange={e => setAmount(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#F97316', cursor: 'pointer', height: 3 }} />

      {/* Arrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F97316,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(249,115,22,0.3), inset 0 2px 3px rgba(255,255,255,0.2)', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M3 8l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
      </div>

      {/* TO */}
      <div style={{ background: 'rgba(34,211,176,0.06)', backdropFilter: 'blur(10px)', border: '1px solid rgba(34,211,176,0.2)', borderRadius: 16, padding: '14px 16px' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Destinataire reçoit</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#22D3B0' }}>{euros} €</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,211,176,0.15)', border: '1px solid rgba(34,211,176,0.3)', borderRadius: 10, padding: '6px 12px' }}>
            <span style={{ fontSize: 14 }}>🇪🇺</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#22D3B0' }}>EUR</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)', padding: '4px 2px' }}>
        <span>Frais : <span style={{ color: '#F97316', fontWeight: 700 }}>{fee.toLocaleString('fr-FR')} FCFA</span></span>
        <span style={{ color: '#22D3B0', fontWeight: 600 }}>⚡ Instantané</span>
      </div>

      <Link href="/signup" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(249,115,22,0.85)', backdropFilter: 'blur(4px)', color: '#fff', borderRadius: 14, padding: '13px', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: 'inset 0 3px 4px rgba(255,255,255,0.2), 0 4px 16px rgba(249,115,22,0.3)', transition: 'transform 0.2s' }}>
        Ouvrir un compte gratuit →
      </Link>
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

        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes floatY2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }
        @keyframes glow { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes orbit { from{transform:rotate(0deg) translateX(130px) rotate(0deg)} to{transform:rotate(360deg) translateX(130px) rotate(-360deg)} }
        @keyframes orbit2 { from{transform:rotate(220deg) translateX(100px) rotate(-220deg)} to{transform:rotate(580deg) translateX(100px) rotate(-580deg)} }
        @keyframes orbit3 { from{transform:rotate(120deg) translateX(160px) rotate(-120deg)} to{transform:rotate(480deg) translateX(160px) rotate(-480deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUpDelay { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .fade-in { opacity:0; transform:translateY(24px); transition:opacity 0.65s ease, transform 0.65s ease; }
        .fade-in.visible { opacity:1; transform:translateY(0); }

        .glass-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 60px rgba(0,0,0,0.3);
        }

        .feat-card {
          background: rgba(255,255,255,0.035);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 26px;
          transition: all 0.25s ease;
        }
        .feat-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(249,115,22,0.25);
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(249,115,22,0.08);
        }

        .glass-btn {
          display: inline-flex; align-items: center; gap: 9px;
          background: rgba(249,115,22,0.85);
          backdrop-filter: blur(4px);
          color: #fff; font-weight: 700; font-size: 15px;
          padding: 14px 26px; border-radius: 14px; border: none;
          text-decoration: none; cursor: pointer; font-family: inherit;
          box-shadow: inset 0 3px 5px rgba(255,255,255,0.22), 0 6px 20px rgba(249,115,22,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .glass-btn:hover { transform: scale(1.03); box-shadow: inset 0 3px 5px rgba(255,255,255,0.22), 0 10px 32px rgba(249,115,22,0.5); }

        .ghost-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.8); font-weight: 600; font-size: 15px;
          padding: 14px 26px; border-radius: 14px;
          text-decoration: none; cursor: pointer; font-family: inherit;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.06);
          transition: all 0.2s;
        }
        .ghost-btn:hover { background: rgba(255,255,255,0.1); transform: scale(1.01); }

        .nav-link { color: rgba(255,255,255,0.55); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; padding: 4px 0; }
        .nav-link:hover { color: #fff; }

        @media (max-width: 900px) {
          .nav-links-d { display: none !important; }
          .hero-grid { grid-template-columns: 1fr !important; padding: 32px 20px 48px !important; gap: 48px !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .how-grid { grid-template-columns: 1fr 1fr !important; }
          .personas-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .footer-inner { flex-direction: column !important; text-align: center !important; gap: 16px !important; }
          .section-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>

      {/* ── MESH BACKGROUND ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Main purple glow top-left */}
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 60%)', filter: 'blur(1px)', animation: 'glow 9s ease-in-out infinite' }} />
        {/* Orange glow top-right */}
        <div style={{ position: 'absolute', top: '-5%', right: '-15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 60%)', filter: 'blur(1px)', animation: 'glow 11s ease-in-out infinite 2s' }} />
        {/* Teal glow bottom */}
        <div style={{ position: 'absolute', bottom: '10%', left: '25%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,176,0.07) 0%, transparent 60%)', animation: 'glow 14s ease-in-out infinite 5s' }} />
        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)' }} />
      </div>

      {/* ── NAVBAR ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, padding: '16px 40px', display: 'flex', justifyContent: 'center' }}>
        <nav style={{
          display: 'flex', alignItems: 'center', gap: 36, padding: '10px 20px',
          background: scrolled ? 'rgba(8,6,20,0.75)' : 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.25)',
          transition: 'background 0.4s',
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#F97316,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 12px rgba(249,115,22,0.4)' }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="7" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
                <circle cx="13" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>Mony<span style={{ color: '#8B5CF6' }}>Link</span></span>
          </Link>

          <div className="nav-links-d" style={{ display: 'flex', gap: 28 }}>
            <a href="#features" className="nav-link">Fonctionnalités</a>
            <a href="#how" className="nav-link">Comment ça marche</a>
            <a href="#personas" className="nav-link">Pour qui</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/login" className="nav-link" style={{ padding: '7px 12px' }}>Connexion</Link>
            <Link href="/signup" style={{
              background: 'rgba(249,115,22,0.9)', color: '#fff', borderRadius: 10,
              padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none',
              boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.2), 0 4px 12px rgba(249,115,22,0.35)',
              display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(249,115,22,0.5)',
              transition: 'transform 0.15s',
            }}>
              S&apos;inscrire
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </nav>
      </div>

      {/* ── HERO ── */}
      <section className="hero-grid section-pad" style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 64, alignItems: 'center', padding: '56px 80px 80px', maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* LEFT */}
        <div style={{ animation: 'fadeUp 0.7s ease both' }}>
          {/* Rating badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '7px 16px', marginBottom: 28, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}>
            <span style={{ color: '#FF801E', fontSize: 12, letterSpacing: 2 }}>★★★★★</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Noté 4.9/5 · 2 700+ utilisateurs</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 74px)', fontWeight: 900, lineHeight: 1.03, letterSpacing: '-3px', marginBottom: 24 }}>
            De l&apos;<span style={{ color: '#8B5CF6', textShadow: '0 0 60px rgba(139,92,246,0.5)' }}>Afrique</span><br />
            vers l&apos;<span style={{ color: '#F97316', textShadow: '0 0 60px rgba(249,115,22,0.4)' }}>Europe</span><br />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>en 30 secondes</span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.72, color: 'rgba(255,255,255,0.5)', marginBottom: 36, maxWidth: 440, letterSpacing: '-0.3px' }}>
            Wallet multi-devises connecté à Orange Money, MTN MoMo et Wave. 2× moins cher que Western Union. Carte virtuelle Visa incluse.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
            <Link href="/signup" className="glass-btn">
              Créer un compte gratuit
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </Link>
            <Link href="/demo" className="ghost-btn">
              <span style={{ fontSize: 11 }}>▶</span> Essayer la démo
            </Link>
          </div>

          {/* Flags row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {['🇨🇲', '🇨🇮', '🇸🇳', '🇬🇦', '🇫🇷', '🇧🇪', '🇩🇪', '🇨🇭'].map(f => (
              <span key={f} style={{ fontSize: 20, lineHeight: 1 }}>{f}</span>
            ))}
            <span style={{ marginLeft: 8, fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>+15 pays</span>
          </div>
        </div>

        {/* RIGHT — Simulator Card */}
        <div style={{ position: 'relative', animation: 'fadeUp 0.8s ease 0.15s both' }}>
          {/* Glow behind card */}
          <div style={{ position: 'absolute', inset: -40, borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.25) 0%, rgba(249,115,22,0.15) 40%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none', animation: 'floatY 6s ease-in-out infinite' }} />

          {/* Orbiting badges */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, zIndex: 3 }}>
            <div style={{ position: 'absolute', animation: 'orbit 10s linear infinite' }}>
              <div style={{ transform: 'translateX(-50%)', background: 'rgba(249,115,22,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(249,115,22,0.35)', borderRadius: 100, padding: '6px 13px', fontSize: 11, fontWeight: 700, color: '#F97316', whiteSpace: 'nowrap', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.12)' }}>
                +€47,85 reçu ⚡
              </div>
            </div>
            <div style={{ position: 'absolute', animation: 'orbit2 13s linear infinite' }}>
              <div style={{ transform: 'translateX(-50%)', background: 'rgba(34,211,176,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(34,211,176,0.3)', borderRadius: 100, padding: '6px 13px', fontSize: 11, fontWeight: 700, color: '#22D3B0', whiteSpace: 'nowrap', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.08)' }}>
                🌍 → 🇪🇺 &lt;30s
              </div>
            </div>
            <div style={{ position: 'absolute', animation: 'orbit3 16s linear infinite' }}>
              <div style={{ transform: 'translateX(-50%)', background: 'rgba(139,92,246,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 100, padding: '6px 13px', fontSize: 11, fontWeight: 700, color: '#a78bfa', whiteSpace: 'nowrap', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.08)' }}>
                🔒 KYC vérifié
              </div>
            </div>
          </div>

          {/* Main glass card */}
          <div className="glass-card" style={{ borderRadius: 28, padding: 28, position: 'relative', zIndex: 2, animation: 'floatY 5s ease-in-out infinite' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Simulateur de transfert</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Calcule tes frais en temps réel</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#F97316,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.2)' }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <circle cx="7" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
                  <circle cx="13" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
                </svg>
              </div>
            </div>
            <TransferSimulator />
            {/* Bottom trust */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Données 100 % fictives · Aucune inscription requise
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <div style={{ padding: '24px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 18 }}>Connecté aux meilleurs acteurs</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {[['🟠','Orange Money'],['🟡','MTN MoMo'],['🔵','Wave'],['🏦','SEPA Instant'],['💳','Visa Virtual'],['₿','Crypto']].map(([icon,name]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '7px 16px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>
              <span style={{ fontSize: 15 }}>{icon}</span> {name}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="stats-grid section-pad" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 80px' }}>
        {[['2×','Moins cher que Western Union'],[ '+15','Pays africains couverts'],['<30s','Temps de transfert moyen']].map(([num, lbl], i) => (
          <div key={lbl} className="fade-in" style={{ padding: '48px 24px', textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: -3, background: 'linear-gradient(135deg,#F97316 0%,#8B5CF6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 8, lineHeight: 1 }}>{num}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="section-pad" style={{ padding: '80px 80px', maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#8B5CF6', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 18 }}>Pourquoi MonyLink</div>
        <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2px', marginBottom: 12, lineHeight: 1.05 }}>Tout en un seul wallet</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', marginBottom: 48, maxWidth: 480 }}>Multi-devises, bidirectionnel, carte virtuelle incluse.</p>
        <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { icon: '⚡', h: 'Transferts instantanés', p: "L'argent arrive en moins de 30 secondes sur Mobile Money ou l'IBAN.", c1: 'rgba(249,115,22,0.12)', c2: '#F97316' },
            { icon: '🔒', h: 'Sécurité renforcée', p: 'KYC biométrique, chiffrement bout-en-bout, conformité ACPR Europe.', c1: 'rgba(139,92,246,0.1)', c2: '#8B5CF6' },
            { icon: '💱', h: 'Taux transparents', p: '2,5 % de commission. Taux affiché avant confirmation. Zéro frais cachés.', c1: 'rgba(34,211,176,0.08)', c2: '#22D3B0' },
            { icon: '💰', h: 'Multi-devises', p: 'EUR, FCFA, USD, Crypto dans un seul portefeuille. Conversion en temps réel.', c1: 'rgba(249,115,22,0.12)', c2: '#F97316' },
            { icon: '💳', h: 'Carte virtuelle Visa', p: 'Compatible Apple Pay & Google Pay. Payez partout depuis l\'Afrique.', c1: 'rgba(139,92,246,0.1)', c2: '#8B5CF6' },
            { icon: '↔️', h: 'Bidirectionnel', p: 'Unique sur le marché : envois dans les deux sens. Freelances reçoivent en EUR.', c1: 'rgba(34,211,176,0.08)', c2: '#22D3B0' },
          ].map(f => (
            <div key={f.h} className="feat-card fade-in">
              <div style={{ width: 46, height: 46, borderRadius: 14, background: f.c1, border: `1px solid ${f.c2}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16, boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.05)' }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 9, color: '#fff', letterSpacing: '-0.3px' }}>{f.h}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{f.p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW ── */}
      <section id="how" className="section-pad" style={{ padding: '0 80px 80px', maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#F97316', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 18 }}>Comment ça marche</div>
        <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2px', marginBottom: 12, lineHeight: 1.05 }}>4 étapes, c&apos;est tout</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', marginBottom: 48 }}>De l&apos;inscription au premier transfert en moins de 5 minutes.</p>
        <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[
            { n: '01', h: 'Créez votre compte', p: 'Inscription en 2 min. KYC rapide via votre téléphone.' },
            { n: '02', h: 'Alimentez le wallet', p: 'IBAN, carte bancaire ou Mobile Money. Instantané.' },
            { n: '03', h: 'Choisissez le destinataire', p: "Numéro Mobile Money ou IBAN. Frais affichés avant." },
            { n: '04', h: 'Envoyez', p: 'Moins de 30 secondes. Notification immédiate.' },
          ].map((s, i) => (
            <div key={s.n} className="fade-in" style={{ padding: '28px 22px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 16, right: 18, fontSize: 42, fontWeight: 900, color: 'rgba(255,255,255,0.04)', letterSpacing: -2, lineHeight: 1 }}>{s.n}</div>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, rgba(249,115,22,${0.6 + i * 0.1}), rgba(139,92,246,${0.6 + i * 0.1}))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, margin: '0 0 16px', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)' }}>{i + 1}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#fff' }}>{s.h}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.65 }}>{s.p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PERSONAS ── */}
      <section id="personas" className="section-pad" style={{ padding: '0 80px 80px', maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,211,176,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,211,176,0.18)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#22D3B0', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 18 }}>Ils utilisent MonyLink</div>
        <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2px', marginBottom: 12, lineHeight: 1.05 }}>Fait pour vous</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', marginBottom: 48 }}>Diaspora, freelances, familles, étudiants.</p>
        <div className="personas-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { initials: 'KA', accent: '#8B5CF6', grad: 'linear-gradient(135deg,rgba(139,92,246,0.5),rgba(139,92,246,0.15))', name: 'Kevin, 27 ans · Douala', role: "Graphiste freelance · reçoit des paiements d'Europe", quote: '"PayPal bloque mon argent 21 jours. J\'ai besoin d\'un wallet pour recevoir mes euros de clients européens et retirer en FCFA sans perdre 8 %."' },
            { initials: 'JT', accent: '#F97316', grad: 'linear-gradient(135deg,rgba(249,115,22,0.5),rgba(249,115,22,0.15))', name: 'Jeanne, 52 ans · Yaoundé', role: 'Fonctionnaire · envoie à son fils en France', quote: '"Je veux envoyer 150 € à mon fils chaque mois depuis Orange Money, sans payer 12 % de frais et sans agence."' },
          ].map(p => (
            <div key={p.name} className="fade-in" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)', border: `1px solid ${p.accent}22`, borderRadius: 24, padding: 28, boxShadow: `0 0 60px ${p.accent}10` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0, boxShadow: `0 4px 16px ${p.accent}30, inset 0 2px 4px rgba(255,255,255,0.15)` }}>{p.initials}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{p.role}</div>
                </div>
              </div>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, fontStyle: 'italic' }}>{p.quote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMO CTA ── */}
      <section className="section-pad" style={{ padding: '0 80px 80px', maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(24px)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 32, padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.06), 0 0 100px rgba(139,92,246,0.08)' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 320, height: 320, background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 60%)', filter: 'blur(2px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 60%)', filter: 'blur(2px)', pointerEvents: 'none' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316', fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 100, marginBottom: 22, letterSpacing: 1 }}>🧪 SANDBOX SÉCURISÉ</div>
          <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2px', marginBottom: 16, lineHeight: 1.05 }}>
            Testez MonyLink<br /><span style={{ color: '#8B5CF6' }}>sans créer de compte</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 36, maxWidth: 460, margin: '0 auto 36px' }}>Explorez le wallet, simulez un vrai transfert Afrique → Europe et découvrez toutes les fonctionnalités.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 36 }}>
            {['Wallet simulé', 'Transfert A→E', 'Carte virtuelle', 'Historique'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
                <span style={{ color: '#22D3B0', fontWeight: 800, fontSize: 15 }}>✓</span> {item}
              </div>
            ))}
          </div>
          <Link href="/demo" className="glass-btn" style={{ fontSize: 16, padding: '15px 40px' }}>
            <span style={{ fontSize: 12 }}>▶</span> Essayer maintenant — c&apos;est gratuit
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 16 }}>Aucune inscription · Données 100 % fictives</div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="section-pad" style={{ padding: '28px 80px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
        <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>Mony<span style={{ color: '#8B5CF6' }}>Link</span></span>
          <span>© 2026 MonyLink SAS · Paris, France</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/cgu" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}>CGU</Link>
            <Link href="/confidentialite" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}>Confidentialité</Link>
            <a href="mailto:contact@monylink.com" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}>Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
