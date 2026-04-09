// =============================================
// POST /api/demo/verify
// 1. Vérifie le token Cloudflare Turnstile
// 2. Pose le cookie ml-demo=1 (2h, SameSite=Strict)
// Route publique — aucune auth Clerk requise
// =============================================

import { NextRequest, NextResponse } from 'next/server'
import { verifyTurnstile, buildDemoCookieHeader } from '@/lib/cloudflare/turnstile'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const token: string | undefined = body?.token

    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 400 })
    }

    // IP pour le challenge Turnstile (Cloudflare envoie cf-connecting-ip)
    const ip =
      req.headers.get('cf-connecting-ip') ??
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      undefined

    const valid = await verifyTurnstile(token, ip)

    if (!valid) {
      return NextResponse.json({ error: 'Vérification Turnstile échouée' }, { status: 403 })
    }

    const res = NextResponse.json({ ok: true })
    res.headers.set('Set-Cookie', buildDemoCookieHeader())
    return res

  } catch {
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
