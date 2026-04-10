'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

/* ─── Transfer simulator (client-side only) ─── */
function TransferSimulator() {
  const [amount, setAmount] = useState(131000)
  const rate = 655.96
  const fee = Math.round(amount * 0.025 + 500)
  const euros = Math.round((amount - fee) / rate)

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--border)', borderRadius: 14, padding: 16, marginTop: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--w40)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Simuler un transfert</div>
      {/* From */}
      <div style={{ background: 'var(--w06)', borderRadius: 11, padding: '13px 14px', marginBottom: 7 }}>
        <div style={{ fontSize: 10, color: 'var(--w40)', marginBottom: 4, fontWeight: 500 }}>Vous envoyez (Afrique)</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 800 }}>{amount.toLocaleString('fr-FR')} FCFA</span>
          <span style={{ background: 'var(--w10)', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>🌍 FCFA</span>
        </div>
      </div>
      {/* Arrow */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '5px 0' }}>
        <div style={{ width: 28, height: 28, background: 'var(--orange)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M3 8l4 4 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
      {/* To */}
      <div style={{ background: 'var(--w06)', borderRadius: 11, padding: '13px 14px', marginBottom: 7 }}>
        <div style={{ fontSize: 10, color: 'var(--w40)', marginBottom: 4, fontWeight: 500 }}>Reçu en Europe</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--teal)' }}>{euros} €</span>
          <span style={{ background: 'var(--w10)', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>🇪🇺 EUR</span>
        </div>
      </div>
      <input
        type="range"
        min={50000} max={650000} step={10000}
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
        style={{ width: '100%', marginTop: 12, accentColor: 'var(--orange)', cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, paddingTop: 9, borderTop: '0.5px solid var(--border)', marginTop: 9 }}>
        <span style={{ color: 'var(--w40)' }}>Frais MonyLink</span>
        <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{fee.toLocaleString('fr-FR')} FCFA</span>
        <span style={{ background: 'rgba(34,211,176,0.15)', color: 'var(--teal)', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20 }}>⚡ Instantané</span>
      </div>
      <Link href="/signup" style={{ display: 'block', width: '100%', background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 12, textAlign: 'center', textDecoration: 'none', transition: 'background 0.2s' }}>
        Recevoir en euros →
      </Link>
    </div>
  )
}

/* ─── Fade-in observer ─── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    el.querySelectorAll('.fade-in').forEach(node => obs.observe(node))
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ─── Signup form (CTA section) ─── */
function SignupForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    setDone(true)
    setEmail('')
  }
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      <input
        type="email"
        placeholder="votre@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          background: 'rgba(255,255,255,0.07)', border: '0.5px solid var(--w20)',
          borderRadius: 12, padding: '15px 20px', fontSize: 16, color: '#fff',
          fontFamily: 'inherit', width: 300, outline: 'none', transition: 'border-color 0.2s',
        }}
      />
      <button type="submit" style={{
        background: done ? 'var(--teal)' : 'var(--orange)',
        color: done ? '#120d24' : '#fff',
        border: 'none', borderRadius: 12, padding: '15px 32px',
        fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
      }}>
        {done ? '✓ Inscription confirmée !' : 'Rejoindre →'}
      </button>
    </form>
  )
}

export default function LandingPage() {
  const pageRef = useFadeIn()

  return (
    <div ref={pageRef} style={{ background: 'var(--bg)', color: '#fff', fontFamily: 'inherit' }}>

      <style>{`
        @media (max-width: 768px) {
          .lp-nav-links { display: none !important; }
          .lp-nav-cta span { display: none; }
          .lp-hero { grid-template-columns: 1fr !important; padding: 32px 20px 40px !important; gap: 32px !important; }
          .lp-mockup { display: none !important; }
          .lp-features { grid-template-columns: 1fr !important; padding: 48px 20px !important; }
          .lp-features-grid { grid-template-columns: 1fr !important; }
          .lp-how { padding: 0 20px 48px !important; }
          .lp-how-grid { grid-template-columns: 1fr 1fr !important; }
          .lp-personas { padding: 0 20px 48px !important; }
          .lp-personas-grid { grid-template-columns: 1fr !important; }
          .lp-demo { padding: 40px 20px !important; }
          .lp-cta { padding: 60px 20px !important; }
          .lp-footer { padding: 20px !important; flex-direction: column !important; text-align: center !important; }
          .lp-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '0.5px solid var(--border)',
        position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 100,
      }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg, #F97316 0%, #8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(249,115,22,0.3)' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <circle cx="7" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
              <circle cx="13" cy="10" r="3.6" stroke="white" strokeWidth="1.7" fill="none"/>
            </svg>
          </div>
          <span className="wordmark"><span className="mony">Mony</span><span className="link">Link</span></span>
        </a>
        <ul className="lp-nav-links" style={{ display: 'flex', gap: 28, listStyle: 'none', margin: 0, padding: 0 }}>
          <li><a href="#features" style={{ color: 'var(--w60)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Fonctionnalités</a></li>
          <li><a href="#how" style={{ color: 'var(--w60)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Comment ça marche</a></li>
          <li><a href="#personas" style={{ color: 'var(--w60)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Pour qui</a></li>
        </ul>
        <div className="lp-nav-cta" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/login" style={{ color: 'var(--w60)', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '8px 12px' }}>Connexion</Link>
          <Link href="/signup" style={{
            background: 'var(--orange)', color: '#fff', borderRadius: 10, padding: '10px 18px',
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
          }}>
            S&apos;inscrire
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56,
        alignItems: 'start', padding: '72px 40px 64px',
        maxWidth: 1160, margin: '0 auto',
      }}>
        <div>
          <div className="badge" style={{ marginBottom: 22 }}>
            <span className="badge-dot" />
            La fintech panafricaine nouvelle génération
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-2px', marginBottom: 12 }}>
            De l&apos;<span style={{ color: 'var(--purple)' }}>Afrique</span> vers l&apos;<span style={{ color: 'var(--orange)' }}>Europe</span> — et retour
          </h1>

          <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
              <span style={{ fontSize: 22, lineHeight: 1 }}>🌍</span>
              <span style={{ fontSize: 18, color: 'var(--orange)', fontWeight: 800 }}>→</span>
              <span style={{ fontSize: 22, lineHeight: 1 }}>🇪🇺</span>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Afrique → Europe</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--w40)', paddingLeft: 2, marginTop: 2 }}>Freelances, PME, étudiants · reçois tes euros sur IBAN en 30s</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', marginTop: 10, background: 'var(--w06)', border: '0.5px solid var(--border)', borderRadius: 10 }}>
              <span style={{ fontSize: 14, lineHeight: 1 }}>🇪🇺</span>
              <span style={{ fontSize: 11, color: 'var(--w40)' }}>→</span>
              <span style={{ fontSize: 14, lineHeight: 1 }}>🌍</span>
              <span style={{ fontSize: 13, color: 'var(--w50)', flex: 1 }}>Europe → Afrique aussi disponible</span>
              <span style={{ fontSize: 11, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', borderRadius: 20, padding: '2px 9px', fontWeight: 600 }}>Diaspora</span>
            </div>
          </div>

          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--w60)', marginBottom: 32, maxWidth: 460 }}>
            2× moins cher que Western Union. Connecté à Orange Money, MTN et Wave. Wallet multi-devises, carte virtuelle, transferts instantanés.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/signup" style={{
              background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: 12,
              padding: '14px 30px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              textDecoration: 'none', transition: 'background 0.2s, transform 0.15s',
              display: 'inline-block',
            }}>
              Créer un compte
            </Link>
            <Link href="/login" className="btn-purple" style={{ display: 'inline-flex', padding: '14px 24px' }}>
              ▶ Se connecter
            </Link>
          </div>

          <div style={{ marginTop: 10 }}>
            <a href="#how" className="btn-ghost" style={{ padding: '10px 18px', fontSize: 13, color: 'var(--w40)', display: 'inline-block', textDecoration: 'none' }}>
              Comment ça marche →
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, fontSize: 12, color: 'var(--w40)' }}>
            {['🇨🇲', '🇨🇮', '🇸🇳', '🇫🇷', '🇧🇪', '🇩🇪'].map(f => <span key={f} style={{ fontSize: 18, lineHeight: 1 }}>{f}</span>)}
            <span style={{ marginLeft: 6 }}>+15 pays couverts</span>
          </div>
        </div>

        {/* ── MOCKUP ── */}
        <div className="lp-mockup" style={{
          background: 'var(--bg2)', border: '0.5px solid var(--border-p)',
          borderRadius: 22, padding: 22, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--w40)' }}>Bonjour 👋</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Aurélien</div>
            </div>
            <span className="wordmark" style={{ fontSize: 15 }}><span className="mony">Mony</span><span className="link">Link</span></span>
          </div>
          {/* Balance card */}
          <div style={{ background: 'linear-gradient(135deg, var(--teal) 0%, #3b82f6 100%)', borderRadius: 14, padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 5 }}>Solde disponible</div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 13 }}>152 300 FCFA</div>
            <div style={{ display: 'flex', gap: 7 }}>
              {['+ Dépôt', '↩ Retrait', '⇄ Transfert'].map(l => (
                <button key={l} style={{ flex: 1, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: '8px 5px', fontSize: 11, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>{l}</button>
              ))}
            </div>
          </div>
          {/* Transactions */}
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--w40)', marginBottom: 9 }}>Dernières transactions</div>
          {[
            { bg: 'rgba(34,211,176,0.15)', icon: '✓', name: 'Paiement reçu', sub: 'Client France · IBAN', amt: '+230 €', pos: true },
            { bg: 'rgba(249,115,22,0.15)',  icon: '→', name: 'Transfert famille', sub: 'Yaoundé · MTN Mobile Money', amt: '-50 €', pos: false },
          ].map(t => (
            <div key={t.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--w06)', borderRadius: 9, padding: '10px 12px', marginBottom: 6 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{t.icon}</div>
              <div style={{ flex: 1, marginLeft: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'var(--w40)' }}>{t.sub}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.pos ? 'var(--teal)' : 'var(--orange)' }}>{t.amt}</div>
            </div>
          ))}
          <TransferSimulator />
        </div>
      </section>

      {/* ── PARTNER LOGOS ── */}
      <div style={{ padding: '26px 40px', borderTop: '0.5px solid var(--border)', borderBottom: '0.5px solid var(--border)' }}>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--w40)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 14 }}>Connecté à</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          {['🟠 Orange Money', '🟡 MTN Mobile Money', '🔵 Wave', '🏦 IBAN Europe', '💳 Revolut', '₿ Crypto'].map(p => (
            <div key={p} className="lp">{p}</div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="lp-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--border)' }}>
        {[
          { num: '2×',   lbl: 'Moins cher que Western Union' },
          { num: '+15',  lbl: 'Pays africains couverts' },
          { num: '<30s', lbl: 'Temps de transfert moyen' },
        ].map(s => (
          <div key={s.lbl} style={{ background: 'var(--bg)', padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -2, background: 'linear-gradient(135deg, var(--orange), var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 6 }}>{s.num}</div>
            <div style={{ fontSize: 14, color: 'var(--w40)' }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="lp-features" style={{ padding: '80px 40px', maxWidth: 1160, margin: '0 auto' }}>
        <div className="eyebrow">Pourquoi MonyLink</div>
        <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-1.2px', marginBottom: 10, lineHeight: 1.2 }}>Tout en un seul wallet</h2>
        <p style={{ fontSize: 16, color: 'var(--w60)', marginBottom: 40 }}>Multi-devises, bidirectionnel, carte virtuelle incluse.</p>
        <div className="lp-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[
            { icon: '⚡', h: 'Transferts instantanés', p: "L'argent arrive en moins de 30 secondes sur le Mobile Money ou l'IBAN du destinataire." },
            { icon: '🔒', h: 'Sécurité renforcée',    p: 'KYC biométrique, chiffrement bout-en-bout, conformité ACPR Europe.' },
            { icon: '💱', h: 'Taux transparents',     p: '2,5 % de commission. Taux affiché avant confirmation. Zéro frais cachés.' },
            { icon: '💰', h: 'Multi-devises',         p: 'EUR, FCFA, USD, Crypto dans un seul portefeuille. Conversion automatique en temps réel.' },
            { icon: '💳', h: 'Carte virtuelle',       p: 'Compatible Apple Pay & Google Pay. Payez partout dans le monde depuis l\'Afrique.' },
            { icon: '↔️', h: 'Bidirectionnel',        p: 'Unique sur le marché : envois dans les deux sens. Freelances et PME reçoivent en euros.' },
          ].map(f => (
            <div key={f.h} className="fade-in" style={{ background: 'var(--bg2)', border: '0.5px solid var(--border-p)', borderRadius: 20, padding: 24, cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 7 }}>{f.h}</div>
              <div style={{ fontSize: 13, color: 'var(--w40)', lineHeight: 1.65 }}>{f.p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="lp-how" style={{ padding: '0 40px 80px', maxWidth: 1160, margin: '0 auto' }}>
        <div className="eyebrow">Comment ça marche</div>
        <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-1.2px', marginBottom: 10, lineHeight: 1.2 }}>4 étapes, c&apos;est tout</h2>
        <p style={{ fontSize: 16, color: 'var(--w60)', marginBottom: 0 }}>De l&apos;inscription au premier transfert en moins de 5 minutes.</p>
        <div className="lp-how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginTop: 40 }}>
          {[
            { n: 1, h: 'Créez votre compte',       p: 'Inscription en 2 min. Vérification KYC rapide via votre téléphone.' },
            { n: 2, h: 'Alimentez votre wallet',   p: 'Virement IBAN, carte bancaire ou Mobile Money. Fonds disponibles instantanément.' },
            { n: 3, h: 'Choisissez le destinataire', p: 'Entrez le numéro Mobile Money ou l\'IBAN. Frais affichés avant confirmation.' },
            { n: 4, h: 'Confirmez et envoyez',     p: 'Transfert en moins de 30 secondes. Notification immédiate des deux côtés.' },
          ].map(s => (
            <div key={s.n} className="fade-in" style={{ textAlign: 'center', padding: '28px 20px', background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--orange), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, margin: '0 auto 14px' }}>{s.n}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 7 }}>{s.h}</div>
              <div style={{ fontSize: 13, color: 'var(--w40)', lineHeight: 1.6 }}>{s.p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PERSONAS ── */}
      <section id="personas" className="lp-personas" style={{ padding: '0 40px 80px', maxWidth: 1160, margin: '0 auto' }}>
        <div className="eyebrow">Ils utilisent MonyLink</div>
        <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-1.2px', marginBottom: 10, lineHeight: 1.2 }}>Fait pour vous</h2>
        <p style={{ fontSize: 16, color: 'var(--w60)', marginBottom: 28 }}>Diaspora, freelances, familles, étudiants.</p>
        <div className="lp-personas-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { initials: 'KA', color: 'rgba(139,92,246,0.15)', textColor: '#8B5CF6', name: 'Kevin, 27 ans · Douala', role: 'Graphiste freelance · reçoit des paiements d\'Europe', quote: '"PayPal bloque mon argent 21 jours. J\'ai besoin d\'un wallet pour recevoir mes euros de clients européens et retirer en FCFA sans perdre 8 %."' },
            { initials: 'JT', color: 'rgba(249,115,22,0.15)',  textColor: '#F97316', name: 'Jeanne, 52 ans · Yaoundé', role: 'Fonctionnaire · envoie à son fils en France', quote: '"Je veux envoyer 150 € à mon fils chaque mois depuis Orange Money, sans payer 12 % de frais et sans me déplacer jusqu\'à une agence."' },
          ].map(p => (
            <div key={p.name} className="fade-in" style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: p.color, color: p.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{p.initials}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--w40)', marginTop: 3 }}>{p.role}</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'var(--w60)', lineHeight: 1.65, fontStyle: 'italic' }}>{p.quote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMO SECTION ── */}
      <section className="lp-demo" style={{ padding: '64px 40px', maxWidth: 1160, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(249,115,22,0.08))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 24, padding: '48px 32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, background: 'radial-gradient(circle,rgba(249,115,22,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.12)', border: '0.5px solid rgba(249,115,22,0.3)', color: 'var(--orange)', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100, marginBottom: 18, letterSpacing: '0.5px' }}>▶ VERSION D&apos;ESSAI DISPONIBLE</div>
          <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-1.2px', marginBottom: 12 }}>Testez MonyLink<br />avant même de vous inscrire</h2>
          <p style={{ fontSize: 16, color: 'var(--w60)', marginBottom: 32, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>Explorez le wallet, simulez un vrai transfert Afrique → Europe et découvrez toutes les fonctionnalités — sans créer de compte.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
            {['Création de compte simulée', 'Transfert Afrique → Europe', 'Historique des transactions', 'Tableau de bord wallet'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--w60)' }}>
                <span style={{ color: 'var(--teal)' }}>✓</span> {item}
              </div>
            ))}
          </div>
          <Link href="/demo" className="btn-purple" style={{ display: 'inline-flex', padding: '16px 36px', fontSize: 16, borderRadius: 14 }}>
            ▶ &nbsp;Essayer la version démo
          </Link>
          <div style={{ fontSize: 12, color: 'var(--w40)', marginTop: 14 }}>Aucune donnée réelle · Aucune inscription requise</div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="lp-cta" style={{ background: 'linear-gradient(135deg, #1e0f3a 0%, #0f0a1e 100%)', borderTop: '0.5px solid rgba(139,92,246,0.3)', padding: '88px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 14, position: 'relative' }}>Prêt à recevoir vos euros ?</h2>
        <p style={{ fontSize: 17, color: 'var(--w60)', marginBottom: 34, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', position: 'relative' }}>
          Rejoignez la liste d&apos;attente. Accès prioritaire dès le lancement + 3 premiers transferts offerts.
        </p>
        <div style={{ position: 'relative' }}>
          <SignupForm />
        </div>
        <p style={{ fontSize: 13, color: 'var(--w40)', marginTop: 18, position: 'relative' }}>Aucune carte requise · Accès gratuit au lancement · Données 100 % sécurisées</p>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer" style={{ padding: '24px 40px', borderTop: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'var(--w40)', flexWrap: 'wrap', gap: 10 }}>
        <span className="wordmark" style={{ fontSize: 15 }}><span className="mony">Mony</span><span className="link">Link</span></span>
        <span>© 2025 MonyLink SAS · Paris, France</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/cgu" style={{ color: 'var(--w40)', textDecoration: 'none' }}>CGU</Link>
          <Link href="/confidentialite" style={{ color: 'var(--w40)', textDecoration: 'none' }}>Confidentialité</Link>
          <a href="mailto:contact@monylink.com" style={{ color: 'var(--w40)', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>

    </div>
  )
}
