'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Region } from '@/types'

const IconHome = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 11L12 3L21 11V21H15V15H9V21H3V11Z"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"
      fill={active ? 'rgba(249,115,22,0.15)' : 'none'} />
  </svg>
)

const IconSend = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
)

const IconReceive = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 3V16M12 16L7 11M12 16L17 11"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 19H20"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const IconHistory = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" />
    <path d="M12 7V12L15 14"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconTopup = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="14" rx="3"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" fill={active ? 'rgba(249,115,22,0.15)' : 'none'} />
    <path d="M2 11H22"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" />
    <path d="M12 3V6"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 3L12 6L15 3"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconCard = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="3"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" fill={active ? 'rgba(249,115,22,0.1)' : 'none'} />
    <path d="M2 10H22"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" />
    <path d="M6 15H10"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const IconCrypto = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M16 3L21 8L16 13"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 8H9C6.2 8 4 10.2 4 13"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 21L3 16L8 11"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 16H15C17.8 16 20 13.8 20 11"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const IconProfile = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" fill={active ? 'rgba(249,115,22,0.15)' : 'none'} />
    <path d="M4 20C4 16.7 7.6 14 12 14C16.4 14 20 16.7 20 20"
      stroke={active ? '#F97316' : 'rgba(255,255,255,0.4)'}
      strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const NAV_AFRICA = [
  { href: '/dashboard', label: 'Accueil',  Icon: IconHome },
  { href: '/send',      label: 'Envoyer',  Icon: IconSend },
  { href: '/card',      label: 'Carte',    Icon: IconCard },
  { href: '/history',   label: 'Activité', Icon: IconHistory },
  { href: '/profile',   label: 'Profil',   Icon: IconProfile },
]

const NAV_EUROPE = [
  { href: '/dashboard', label: 'Accueil',  Icon: IconHome },
  { href: '/receive',   label: 'Recevoir', Icon: IconReceive },
  { href: '/card',      label: 'Carte',    Icon: IconCard },
  { href: '/convert',   label: 'Crypto',   Icon: IconCrypto },
  { href: '/profile',   label: 'Profil',   Icon: IconProfile },
]

export default function BottomNav({ region = 'europe' }: { region?: Region }) {
  const pathname = usePathname()
  const items = region === 'africa' ? NAV_AFRICA : NAV_EUROPE

  return (
    <nav className="bottom-nav">
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href
        return (
          <Link key={href} href={href} className={`bnav-item${active ? ' active' : ''}`}>
            <span className="bnav-icon"><Icon active={active} /></span>
            <span className="bnav-label">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
