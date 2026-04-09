'use client'

// Bandeau sandbox — affiché en haut de toutes les pages protégées
// quand le cookie ml-demo=1 est présent.

import { useEffect, useState } from 'react'
import { clearDemoSession } from '@/lib/demo/session'
import { useRouter } from 'next/navigation'

export default function DemoBanner() {
  const router = useRouter()
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    setIsDemo(document.cookie.includes('ml-demo=1'))
  }, [])

  if (!isDemo) return null

  function handleExit() {
    clearDemoSession()
    router.push('/')
  }

  return (
    <div className="demo-banner" role="status" aria-label="Mode sandbox actif">
      <span className="dot" />
      <span>
        Mode démo — données fictives · aucun paiement réel
      </span>
      <button
        onClick={handleExit}
        style={{ marginLeft: 12, background: 'rgba(249,115,22,0.2)', border: '0.5px solid rgba(249,115,22,0.4)', color: 'var(--orange)', borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
      >
        Quitter
      </button>
    </div>
  )
}
