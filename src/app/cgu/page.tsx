import Link from 'next/link'

export const metadata = { title: "Conditions Générales d'Utilisation — MonyLink" }

export default function CguPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 80px', background: 'var(--bg)', minHeight: '100dvh' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--w40)', textDecoration: 'none', fontSize: 14, marginBottom: 32 }}>
        ← Retour
      </Link>

      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>Conditions Générales d&apos;Utilisation</h1>
      <p style={{ fontSize: 13, color: 'var(--w40)', marginBottom: 40 }}>Dernière mise à jour : avril 2026 · Version 0.1 (Prototype)</p>

      {[
        {
          title: '1. Objet',
          content: `MonyLink est un service de transfert d'argent en ligne permettant d'envoyer des fonds entre l'Afrique et l'Europe. La plateforme est actuellement en phase de prototype et à vocation démonstrative. Aucune transaction financière réelle n'est traitée dans cette version.`,
        },
        {
          title: '2. Accès au service',
          content: `L'accès au service est réservé aux personnes majeures (18 ans et plus). En créant un compte, vous attestez que les informations fournies sont exactes et à jour. MonyLink se réserve le droit de suspendre ou de clôturer tout compte en cas d'informations erronées ou de comportement frauduleux.`,
        },
        {
          title: '3. Mode démo',
          content: `La version accessible à l'adresse monylink-jk2u.vercel.app est un prototype de démonstration. Les données affichées sont fictives. Aucun paiement réel n'est effectué. Le mode démo peut être désactivé à tout moment sans préavis.`,
        },
        {
          title: '4. Données personnelles',
          content: `Les informations collectées (nom, email, numéro de téléphone, pays) sont utilisées uniquement pour créer votre compte et personnaliser votre expérience. Elles ne sont pas transmises à des tiers à des fins commerciales. Voir notre Politique de Confidentialité pour plus de détails.`,
        },
        {
          title: '5. Responsabilité',
          content: `Dans le cadre du prototype, MonyLink ne saurait être tenu responsable d'éventuelles pertes de données, indisponibilités du service ou erreurs d'affichage. Le service est fourni "en l'état" sans garantie de continuité ou d'exactitude des données financières.`,
        },
        {
          title: '6. Propriété intellectuelle',
          content: `L'ensemble des éléments de la plateforme (logo, design, code, textes) est la propriété exclusive de MonyLink. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.`,
        },
        {
          title: '7. Modification des CGU',
          content: `MonyLink se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront informés de toute modification substantielle par email ou notification dans l'application.`,
        },
        {
          title: '8. Contact',
          content: `Pour toute question relative aux présentes CGU, vous pouvez nous contacter à : contact@monylink.com`,
        },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: '#fff' }}>{section.title}</h2>
          <p style={{ fontSize: 14, color: 'var(--w60)', lineHeight: 1.75 }}>{section.content}</p>
        </div>
      ))}

      <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: 24, display: 'flex', gap: 20 }}>
        <Link href="/confidentialite" style={{ fontSize: 13, color: 'var(--orange)', textDecoration: 'none', fontWeight: 600 }}>
          Politique de confidentialité →
        </Link>
        <Link href="/" style={{ fontSize: 13, color: 'var(--w40)', textDecoration: 'none' }}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
