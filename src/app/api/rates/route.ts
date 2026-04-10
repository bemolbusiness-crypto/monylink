// GET /api/rates — taux de change live EUR → devises africaines
// Utilise open.er-api.com (gratuit, sans clé, mise à jour quotidienne)
// Cache serveur 6h pour éviter les appels répétés

import { NextResponse } from 'next/server'

let cache: { rates: Record<string, number>; fetchedAt: number } | null = null
const CACHE_TTL = 6 * 60 * 60 * 1000 // 6 heures

export async function GET() {
  // Retourner le cache si encore valide
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) {
    return NextResponse.json({ rates: cache.rates, source: 'cache', fetchedAt: cache.fetchedAt })
  }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/EUR', {
      next: { revalidate: 21600 }, // Next.js cache 6h
    })
    if (!res.ok) throw new Error('API unavailable')
    const data = await res.json()

    // Extraire seulement les devises qui nous intéressent
    const rates: Record<string, number> = {
      XAF: data.rates?.XAF ?? 655.96,
      XOF: data.rates?.XOF ?? 655.96,
      NGN: data.rates?.NGN ?? 1650,
      GHS: data.rates?.GHS ?? 16.5,
      KES: data.rates?.KES ?? 145,
      USD: data.rates?.USD ?? 1.09,
    }

    cache = { rates, fetchedAt: Date.now() }
    return NextResponse.json({ rates, source: 'live', fetchedAt: cache.fetchedAt })
  } catch {
    // Fallback sur les taux interbancaires hardcodés
    const fallback = { XAF: 655.96, XOF: 655.96, NGN: 1650, GHS: 16.5, KES: 145, USD: 1.09 }
    return NextResponse.json({ rates: fallback, source: 'fallback', fetchedAt: Date.now() })
  }
}
