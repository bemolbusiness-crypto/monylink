// GET /api/profile
// Retourne le profil + wallets de l'utilisateur connecté (Clerk)

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require-auth'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult
  const { userId } = authResult

  const supabase = createServerClient()

  const [{ data: profile }, { data: wallets }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('wallets').select('*').eq('user_id', userId),
  ])

  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  return NextResponse.json({ profile, wallets: wallets ?? [] })
}
