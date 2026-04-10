'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

/* ─── Transfer simulator ─── */
function TransferSimulator() {
  const [amount, setAmount] = useState(131000)
  const rate = 655.96
  const fee = Math.round(amount * 0.025 + 500)
  const euros = Math.round((amount - fee) / rate)
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 16, marginTop: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Simuler un transfert</div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 11, padding: '13px 14px', marginBottom: 7 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Vous envoyez (Afrique)</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{amount.toLocaleString('fr-FR')} FCFA</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>🌍 FCFA</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '5px 0' }}>
        <div style={{ width: 28, height: 28, background: '#F97316', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M3 8l4 4 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 11, padding: '13px 14px', marginBottom: 7 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Reçu en Europe</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#22D3B0' }}>{euros} €</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>🇪🇺 EUR</span>
        </div>
      </div>
      <input type="range" min={50000} max={650000} step={10000} value={amount}
        onChange={e => setAmount(Number(e.target.value))}
        style={{ width: '100%', marginTop: 12, accentColor: '#F97316', cursor: 'pointer' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, paddingTop: 9, borderTop: '0.5px solid rgba(255,255,255,0.08)', marginTop: 9 }}>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>Frais MonyLink</span>
        <span style={{ color: '#F97316', fontWeight: 700 }}>{fee.toLocaleString('fr-FR')} FCFA</span>
        <span style={{ background: 'rgba(34,211,176,0.15)', color: '#22D3B0', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20 }}>⚡ Instantané</span>
      </div>
      <Link href="/signup" style={{ display: 'block', width: '100%', background: 'rgba(249,115,22,0.85)', backdropFilter: 'blur(2px)', color: '#fff', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 12, textAlign: 'center', textDecoration: 'none' }}>
        Recevoir en euros →
      </Link>
    </div>
  )
}

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

/* ─── Waitlist form ─── */
function SignupForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  function handleSubmit(e: React.FormEvent) { e.preventDefault(); if (!email.includes('@')) return; setDone(true); setEmail('') }
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
      <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)}
        style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '14px 20px', fontSize: 15, color: '#fff', fontFamily: 'inherit', width: 280, outline: 'none', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.05)' }} />
      <button type="submit" style={{ background: done ? 'rgba(34,211,176,0.8)' : 'rgba(249,115,22,0.85)', backdropFilter: 'blur(2px)', color: done ? '#0d0920' : '#fff', border: 'none', borderRadius: 14, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: 'inset 0 3px 4px rgba(255,255,255,0.2)' }}>
        {done ? '✓ Confirmé !' : 'Rejoindre →'}
      </button>
    </form>
  )
}

export default function LandingPage() {
  const pageRef = useFadeIn()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div ref={pageRef} style={{ background: '#0d0920', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── LIQUID GLASS NAVBAR ── */
        .glass-nav {
          position: sticky; top: 20px; z-index: 100;
          width: fit-content; margin: 0 auto;
          display: flex; align-items: center; gap: 32px;
          padding: 10px 18px;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(50px); -webkit-backdrop-filter: blur(50px);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: inset 0px 4px 4px 0px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.3);
          transition: background 0.3s, box-shadow 0.3s;
        }
        .glass-nav.scrolled {
          background: rgba(13,9,32,0.7);
          box-shadow: inset 0px 4px 4px 0px rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.5);
        }

        /* ── LIQUID GLASS CARD ── */
        .glass-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.2);
          border-radius: 24px;
        }

        /* ── GLASS BUTTON ── */
        .glass-btn {
          background: rgba(249,115,22,0.8);
          backdrop-filter: blur(2px);
          border: none; border-radius: 14px;
          padding: 13px 24px;
          color: #fff; font-weight: 700; font-size: 15px;
          cursor: pointer; font-family: inherit;
          box-shadow: inset 0px 4px 4px 0px rgba(255,255,255,0.25), 0 4px 16px rgba(249,115,22,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none;
        }
        .glass-btn:hover { transform: scale(1.02); box-shadow: inset 0px 4px 4px 0px rgba(255,255,255,0.25), 0 8px 28px rgba(249,115,22,0.45); }

        .glass-btn-ghost {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px; padding: 13px 24px;
          color: rgba(255,255,255,0.8); font-weight: 600; font-size: 15px;
          cursor: pointer; font-family: inherit;
          box-shadow: inset 0px 2px 4px rgba(255,255,255,0.08);
          transition: transform 0.2s, background 0.2s;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
        }
        .glass-btn-ghost:hover { background: rgba(255,255,255,0.11); transform: scale(1.01); }

        /* ── ORB GLOW ── */
        @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1.15)} 50%{transform:translateY(-18px) scale(1.18)} }
        @keyframes orb2Float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(12px)} }
        @keyframes glowPulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.08)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes orbit { from{transform:rotate(0deg) translateX(120px) rotate(0deg)} to{transform:rotate(360deg) translateX(120px) rotate(-360deg)} }
        @keyframes orbit2 { from{transform:rotate(180deg) translateX(88px) rotate(-180deg)} to{transform:rotate(540deg) translateX(88px) rotate(-540deg)} }

        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }

        .nav-link { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }

        /* ── FEATURE CARD ── */
        .feat-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 24px;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .feat-card:hover {
          border-color: rgba(249,115,22,0.3);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(249,115,22,0.08);
        }

        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .hero-grid { grid-template-columns: 1fr !important; padding: 32px 16px 40px !important; gap: 32px !important; }
          .hero-right { display: none !important; }
          .features-grid { grid-template-columns: 1fr !important; padding: 48px 16px !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .how-grid { grid-template-columns: 1fr 1fr !important; }
          .personas-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .nav-wrap { padding: 16px !important; }
          .footer-inner { flex-direction: column !important; text-align: center !important; }
        }
      `}</style>

      {/* ── BACKGROUND GLOWS ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)', animation: 'glowPulse 8s ease-in-out infinite', filter: 'blur(2px)' }} />
        <div style={{ position: 'absolute', top: '5%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 65%)', animation: 'glowPulse 10s ease-in-out infinite 2s', filter: 'blur(2px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,176,0.06) 0%, transparent 65%)', animation: 'glowPulse 12s ease-in-out infinite 4s' }} />
      </div>

      {/* ── NAVBAR ── */}
      <div className="nav-wrap" style={{ padding: '20px 40px', position: 'sticky', top: 0, zIndex: 100 }}>
        <nav className={`glass-nav${scrolled ? ' scrolled' : ''}`}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, #F97316, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(249,115,22,0.35)' }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="7" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
                <circle cx="13" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>Mony<span style={{ color: '#8B5CF6' }}>Link</span></span>
          </Link>

          {/* Links */}
          <div className="nav-links-desktop" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#features" className="nav-link">Fonctionnalités</a>
            <a href="#how" className="nav-link">Comment ça marche</a>
            <a href="#personas" className="nav-link">Pour qui</a>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/login" className="nav-link" style={{ padding: '8px 12px', fontSize: 14 }}>Connexion</Link>
            <Link href="/signup" style={{
              background: 'rgba(249,115,22,0.85)', backdropFilter: 'blur(2px)',
              color: '#fff', borderRadius: 10, padding: '8px 16px',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              border: '1px solid rgba(249,115,22,0.4)',
              boxShadow: 'inset 0px 3px 3px rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              S&apos;inscrire
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </nav>
      </div>

      {/* ── HERO ── */}
      <section className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', padding: '60px 40px 80px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* LEFT */}
        <div style={{ animation: 'fadeUp 0.7s ease both' }}>
          {/* Social proof */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100, padding: '6px 14px', marginBottom: 24, boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.08)' }}>
            <span style={{ color: '#FF801E', letterSpacing: -1, fontSize: 13 }}>★★★★★</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Noté 4.9/5 par 2 700+ utilisateurs</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 68px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 20 }}>
            De l&apos;<span style={{ color: '#8B5CF6' }}>Afrique</span><br />
            vers l&apos;<span style={{ color: '#F97316' }}>Europe</span><br />
            en 30 secondes
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', marginBottom: 32, maxWidth: 480, letterSpacing: '-0.5px' }}>
            Wallet multi-devises connecté à Orange Money, MTN MoMo et Wave. 2× moins cher que Western Union. Carte virtuelle incluse, transferts instantanés.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            <Link href="/signup" className="glass-btn">
              Créer un compte gratuit
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4M8 12h8"/></svg>
            </Link>
            <Link href="/demo" className="glass-btn-ghost">
              ▶ Essayer la démo
            </Link>
          </div>

          {/* Flags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            {['🇨🇲', '🇨🇮', '🇸🇳', '🇬🇦', '🇫🇷', '🇧🇪', '🇩🇪', '🇨🇭'].map(f => <span key={f} style={{ fontSize: 18 }}>{f}</span>)}
            <span style={{ marginLeft: 6 }}>+15 pays couverts</span>
          </div>
        </div>

        {/* RIGHT — Glassy Orb + Phone mockup */}
        <div className="hero-right" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 540 }}>
          {/* Orb glow */}
          <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, rgba(139,92,246,0.35) 0%, rgba(249,115,22,0.2) 45%, transparent 70%)', filter: 'blur(40px)', animation: 'orbFloat 6s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle at 60% 60%, rgba(34,211,176,0.15) 0%, transparent 60%)', filter: 'blur(30px)', animation: 'orb2Float 8s ease-in-out infinite', pointerEvents: 'none' }} />

          {/* Orbiting badges */}
          <div style={{ position: 'absolute', width: 0, height: 0, animation: 'orbit 9s linear infinite' }}>
            <div style={{ background: 'rgba(249,115,22,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 100, padding: '6px 14px', fontSize: 11, fontWeight: 700, color: '#F97316', whiteSpace: 'nowrap', transform: 'translateX(-50%)', boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.1)' }}>
              +€47,85 reçu ⚡
            </div>
          </div>
          <div style={{ position: 'absolute', width: 0, height: 0, animation: 'orbit2 12s linear infinite' }}>
            <div style={{ background: 'rgba(34,211,176,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(34,211,176,0.3)', borderRadius: 100, padding: '6px 14px', fontSize: 11, fontWeight: 700, color: '#22D3B0', whiteSpace: 'nowrap', transform: 'translateX(-50%)', boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.08)' }}>
              🌍 → 🇪🇺 30s
            </div>
          </div>

          {/* Phone mockup */}
          <div style={{ position: 'relative', zIndex: 2, width: 230, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 40, padding: '18px 14px', boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.6)', animation: 'orbFloat 5s ease-in-out infinite' }}>
            <div style={{ width: 50, height: 5, background: 'rgba(255,255,255,0.15)', borderRadius: 3, margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 800 }}>Mony<span style={{ color: '#8B5CF6' }}>Link</span></span>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>👤</div>
            </div>
            {/* Balance */}
            <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(249,115,22,0.3))', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Solde EUR</div>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1 }}>€ 247,30</div>
              <div style={{ fontSize: 10, color: '#22D3B0', marginTop: 2, fontWeight: 700 }}>≈ 173 110 FCFA</div>
            </div>
            {/* MLK ID */}
            <div style={{ background: 'rgba(249,115,22,0.1)', border: '0.5px solid rgba(249,115,22,0.25)', borderRadius: 10, padding: '8px 10px', marginBottom: 10 }}>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Identifiant</div>
              <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 800, color: '#F97316', letterSpacing: 2 }}>MLK-A3F2</div>
            </div>
            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[['→', 'Envoyer', '#F97316'], ['↓', 'Recevoir', '#22D3B0']].map(([icon, lbl, c]) => (
                <div key={lbl} style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <span style={{ fontSize: 14, color: c }}>{icon}</span>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{lbl}</span>
                </div>
              ))}
            </div>
            <TransferSimulator />
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <div style={{ padding: '28px 40px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 20 }}>Connecté aux meilleurs acteurs</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {[
            { icon: '🟠', name: 'Orange Money' },
            { icon: '🟡', name: 'MTN MoMo' },
            { icon: '🔵', name: 'Wave' },
            { icon: '🏦', name: 'SEPA Instant' },
            { icon: '💳', name: 'Visa Virtual' },
          ].map(p => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, padding: '7px 16px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ fontSize: 16 }}>{p.icon}</span> {p.name}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', maxWidth: 1200, margin: '0 auto', gap: 1, position: 'relative', zIndex: 1, padding: '0 40px' }}>
        {[
          { num: '2×', lbl: 'Moins cher que Western Union' },
          { num: '+15', lbl: 'Pays africains couverts' },
          { num: '<30s', lbl: 'Temps de transfert moyen' },
        ].map((s, i) => (
          <div key={s.lbl} className="fade-in" style={{ padding: '40px 24px', textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -2, background: 'linear-gradient(135deg, #F97316, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 6 }}>{s.num}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="features-grid" style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#8B5CF6', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Pourquoi MonyLink</div>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 10, lineHeight: 1.1 }}>Tout en un seul wallet</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 44 }}>Multi-devises, bidirectionnel, carte virtuelle incluse.</p>
        <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[
            { icon: '⚡', h: 'Transferts instantanés', p: "L'argent arrive en moins de 30 secondes sur Mobile Money ou l'IBAN du destinataire.", color: 'rgba(249,115,22,0.15)', iconColor: '#F97316' },
            { icon: '🔒', h: 'Sécurité renforcée', p: 'KYC biométrique, chiffrement bout-en-bout, conformité ACPR Europe.', color: 'rgba(139,92,246,0.12)', iconColor: '#8B5CF6' },
            { icon: '💱', h: 'Taux transparents', p: '2,5 % de commission. Taux affiché avant confirmation. Zéro frais cachés.', color: 'rgba(34,211,176,0.1)', iconColor: '#22D3B0' },
            { icon: '💰', h: 'Multi-devises', p: 'EUR, FCFA, USD, Crypto dans un seul portefeuille. Conversion en temps réel.', color: 'rgba(249,115,22,0.15)', iconColor: '#F97316' },
            { icon: '💳', h: 'Carte virtuelle', p: 'Compatible Apple Pay & Google Pay. Payez partout dans le monde depuis l\'Afrique.', color: 'rgba(139,92,246,0.12)', iconColor: '#8B5CF6' },
            { icon: '↔️', h: 'Bidirectionnel', p: 'Envois dans les deux sens. Freelances et PME reçoivent en euros directement.', color: 'rgba(34,211,176,0.1)', iconColor: '#22D3B0' },
          ].map(f => (
            <div key={f.h} className="feat-card fade-in">
              <div style={{ width: 44, height: 44, borderRadius: 13, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14, boxShadow: `inset 0 2px 4px rgba(255,255,255,0.06)` }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#fff' }}>{f.h}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{f.p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: '0 40px 80px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#F97316', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Comment ça marche</div>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 10, lineHeight: 1.1 }}>4 étapes, c&apos;est tout</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 44 }}>De l&apos;inscription au premier transfert en moins de 5 minutes.</p>
        <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {[
            { n: 1, h: 'Créez votre compte', p: 'Inscription en 2 min. Vérification KYC rapide via votre téléphone.' },
            { n: 2, h: 'Alimentez votre wallet', p: 'Virement IBAN, carte bancaire ou Mobile Money. Fonds disponibles instantanément.' },
            { n: 3, h: 'Choisissez le destinataire', p: "Entrez le numéro Mobile Money ou l'IBAN. Frais affichés avant confirmation." },
            { n: 4, h: 'Confirmez et envoyez', p: 'Transfert en moins de 30 secondes. Notification immédiate des deux côtés.' },
          ].map(s => (
            <div key={s.n} className="fade-in" style={{ textAlign: 'center', padding: '28px 20px', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(249,115,22,0.8), rgba(139,92,246,0.8))', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, margin: '0 auto 14px', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)' }}>{s.n}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#fff' }}>{s.h}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{s.p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PERSONAS ── */}
      <section id="personas" style={{ padding: '0 40px 80px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,211,176,0.08)', border: '1px solid rgba(34,211,176,0.2)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#22D3B0', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Ils utilisent MonyLink</div>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 10, lineHeight: 1.1 }}>Fait pour vous</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 36 }}>Diaspora, freelances, familles, étudiants.</p>
        <div className="personas-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { initials: 'KA', grad: 'linear-gradient(135deg,rgba(139,92,246,0.6),rgba(139,92,246,0.2))', border: 'rgba(139,92,246,0.3)', name: 'Kevin, 27 ans · Douala', role: "Graphiste freelance · reçoit des paiements d'Europe", quote: '"PayPal bloque mon argent 21 jours. J\'ai besoin d\'un wallet pour recevoir mes euros de clients européens et retirer en FCFA sans perdre 8 %."' },
            { initials: 'JT', grad: 'linear-gradient(135deg,rgba(249,115,22,0.6),rgba(249,115,22,0.2))', border: 'rgba(249,115,22,0.3)', name: 'Jeanne, 52 ans · Yaoundé', role: 'Fonctionnaire · envoie à son fils en France', quote: '"Je veux envoyer 150 € à mon fils chaque mois depuis Orange Money, sans payer 12 % de frais et sans me déplacer jusqu\'à une agence."' },
          ].map(p => (
            <div key={p.name} className="fade-in" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', border: `1px solid ${p.border}`, borderRadius: 20, padding: 24, boxShadow: `0 8px 32px ${p.border}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0, boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1)' }}>{p.initials}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{p.role}</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontStyle: 'italic' }}>{p.quote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMO CTA ── */}
      <section style={{ padding: '0 40px 80px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 28, padding: '56px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.04), 0 0 80px rgba(139,92,246,0.08)' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, background: 'radial-gradient(circle,rgba(249,115,22,0.12) 0%,transparent 65%)', pointerEvents: 'none', filter: 'blur(2px)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, background: 'radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 65%)', pointerEvents: 'none', filter: 'blur(2px)' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(249,115,22,0.25)', color: '#F97316', fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 100, marginBottom: 20, letterSpacing: 1 }}>🧪 SANDBOX SÉCURISÉ</div>
          <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 14, lineHeight: 1.1 }}>Testez MonyLink<br /><span style={{ color: '#8B5CF6' }}>sans créer de compte</span></h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>Explorez le wallet, simulez un vrai transfert Afrique → Europe et découvrez toutes les fonctionnalités.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
            {['Wallet simulé', 'Transfert Afrique → Europe', 'Carte virtuelle', 'Historique'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ color: '#22D3B0', fontWeight: 700 }}>✓</span> {item}
              </div>
            ))}
          </div>
          <Link href="/demo" className="glass-btn" style={{ fontSize: 16, padding: '15px 36px' }}>
            ▶ &nbsp;Essayer maintenant
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 14 }}>Aucune inscription requise · Données 100 % fictives</div>
        </div>
      </section>

      {/* ── WAITLIST CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, rgba(30,15,58,0.8), rgba(15,10,30,0.9))', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(139,92,246,0.2)', borderBottom: '1px solid rgba(139,92,246,0.2)', padding: '88px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 14, position: 'relative' }}>Prêt à recevoir vos euros ?</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', marginBottom: 36, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', position: 'relative' }}>
          Rejoignez la liste d&apos;attente. Accès prioritaire + 3 premiers transferts offerts.
        </p>
        <div style={{ position: 'relative' }}><SignupForm /></div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginTop: 18 }}>Aucune carte requise · Accès gratuit au lancement · Données 100 % sécurisées</p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '24px 40px', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
        <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.35)', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>Mony<span style={{ color: '#8B5CF6' }}>Link</span></span>
          <span>© 2026 MonyLink SAS · Paris, France</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/cgu" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>CGU</Link>
            <Link href="/confidentialite" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Confidentialité</Link>
            <a href="mailto:contact@monylink.com" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
