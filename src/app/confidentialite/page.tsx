import Link from 'next/link'

export const metadata = { title: 'Politique de Confidentialité — MonyLink' }

export default function ConfidentialitePage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 80px', background: 'var(--bg)', minHeight: '100dvh' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--w40)', textDecoration: 'none', fontSize: 14, marginBottom: 32 }}>
        ← Retour
      </Link>

      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>Politique de Confidentialité</h1>
      <p style={{ fontSize: 13, color: 'var(--w40)', marginBottom: 40 }}>Dernière mise à jour : avril 2026 · Version 0.1 (Prototype)</p>

      {[
        {
          title: '1. Données collectées',
          content: `Lors de votre inscription, nous collectons : votre nom complet, votre adresse email, votre numéro de téléphone (optionnel), votre pays de résidence et votre région (Afrique / Europe). Ces informations sont nécessaires au fonctionnement du service.`,
        },
        {
          title: '2. Utilisation des données',
          content: `Vos données sont utilisées pour : créer et gérer votre compte, personnaliser votre expérience, sécuriser vos transactions, vous envoyer des notifications relatives à vos transferts, et respecter nos obligations légales (conformité AML/KYC).`,
        },
        {
          title: '3. Stockage et sécurité',
          content: `Vos données sont stockées sur des serveurs sécurisés via Supabase (hébergement EU). Les mots de passe sont hachés (bcrypt). Nous n'avons accès à aucun mot de passe en clair. Les communications sont chiffrées via HTTPS/TLS.`,
        },
        {
          title: '4. Partage des données',
          content: `Nous ne vendons pas vos données personnelles. Elles peuvent être partagées avec nos prestataires techniques (Supabase, Cloudflare, Vercel) dans le cadre strict de la fourniture du service, ainsi qu'avec les autorités compétentes en cas d'obligation légale.`,
        },
        {
          title: '5. Cookies',
          content: `MonyLink utilise des cookies techniques essentiels au fonctionnement du service (authentification, préférences de session). Aucun cookie publicitaire ou de tracking tiers n'est utilisé. La protection anti-bot Cloudflare Turnstile peut déposer un cookie de session.`,
        },
        {
          title: '6. Vos droits',
          content: `Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à : privacy@monylink.com. Nous répondrons dans un délai de 30 jours.`,
        },
        {
          title: '7. Conservation des données',
          content: `Vos données sont conservées pendant la durée de votre inscription et 5 ans après la clôture de votre compte (obligations légales financières). Les données de transactions sont conservées 10 ans conformément à la réglementation financière.`,
        },
        {
          title: '8. Contact DPO',
          content: `Pour toute question relative à la protection de vos données : privacy@monylink.com`,
        },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: '#fff' }}>{section.title}</h2>
          <p style={{ fontSize: 14, color: 'var(--w60)', lineHeight: 1.75 }}>{section.content}</p>
        </div>
      ))}

      <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: 24, display: 'flex', gap: 20 }}>
        <Link href="/cgu" style={{ fontSize: 13, color: 'var(--orange)', textDecoration: 'none', fontWeight: 600 }}>
          CGU →
        </Link>
        <Link href="/" style={{ fontSize: 13, color: 'var(--w40)', textDecoration: 'none' }}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
