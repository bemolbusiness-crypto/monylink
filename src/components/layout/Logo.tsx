import Link from 'next/link'

function LogoMark({ size = 34 }: { size?: number }) {
  const r = size * 0.3
  return (
    <div
      style={{
        width: size, height: size, borderRadius: size * 0.29,
        background: 'linear-gradient(135deg, #F97316 0%, #8B5CF6 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(249,115,22,0.3)', flexShrink: 0,
      }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 20" fill="none">
        {/* Chain link: two overlapping circles = Africa ↔ Europe connection */}
        <circle cx="7" cy="10" r={r} stroke="white" strokeWidth="1.8" fill="none" />
        <circle cx="13" cy="10" r={r} stroke="white" strokeWidth="1.8" fill="none" />
      </svg>
    </div>
  )
}

interface LogoProps {
  size?: number
  fontSize?: number
  href?: string
}

export default function Logo({ size = 34, fontSize = 18, href }: LogoProps) {
  const content = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <LogoMark size={size} />
      <span style={{ fontSize, fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1 }}>
        Mony<span style={{ color: 'var(--purple)' }}>Link</span>
      </span>
    </div>
  )

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex' }}>
        {content}
      </Link>
    )
  }
  return content
}

export { LogoMark }
