'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Region } from '@/types'

const NAV_AFRICA = [
  { href: '/dashboard', icon: '⌂', label: 'Accueil' },
  { href: '/send',      icon: '→', label: 'Envoyer' },
  { href: '/history',   icon: '≡', label: 'Historique' },
  { href: '/profile',   icon: '◯', label: 'Profil' },
]

const NAV_EUROPE = [
  { href: '/dashboard', icon: '⌂',  label: 'Accueil' },
  { href: '/receive',   icon: '↓',  label: 'Recevoir' },
  { href: '/card',      icon: '▣',  label: 'Carte' },
  { href: '/convert',   icon: '⟳',  label: 'Crypto' },
  { href: '/profile',   icon: '◯',  label: 'Profil' },
]

export default function BottomNav({ region = 'europe' }: { region?: Region }) {
  const pathname = usePathname()
  const items = region === 'africa' ? NAV_AFRICA : NAV_EUROPE

  return (
    <nav className="bottom-nav">
      {items.map(item => {
        const active = pathname === item.href
        return (
          <Link key={item.href} href={item.href} className={`bnav-item${active ? ' active' : ''}`}>
            <span className="bnav-icon">{item.icon}</span>
            <span className="bnav-label">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
