// =============================================
// GET  /api/card  → récupérer la carte de l'utilisateur
// POST /api/card  → créer une carte virtuelle Swan
// PATCH /api/card → bloquer / débloquer
// =============================================

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require-auth'
import { createServerClient } from '@/lib/supabase/server'
import { createVirtualCard, updateCardStatus } from '@/lib/providers/swan'

export async function GET() {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) return authResult
    const { userId } = authResult

    const supabase = createServerClient()
    const { data: card } = await supabase.from('cards').select('*').eq('user_id', userId).single()

    return NextResponse.json({ card: card ?? null })
  } catch {
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) return authResult
    const { userId } = authResult

    const supabase = createServerClient()

    // Vérifier qu'il n'a pas déjà une carte
    const { data: existing } = await supabase.from('cards').select('id').eq('user_id', userId).single()
    if (existing) return NextResponse.json({ error: 'Carte déjà existante' }, { status: 400 })

    const { data: profile } = await supabase.from('profiles').select('full_name, monylink_id').eq('id', userId).single()

    // Créer la carte Swan
    const result = await createVirtualCard({
      accountMembershipId: process.env.SWAN_ACCOUNT_ID!,
      cardHolderName: profile?.full_name ?? 'MonyLink User',
      spendingLimit: 1000,
    })

    if (!result.success || !result.card) {
      return NextResponse.json({ error: result.error ?? 'Erreur création carte' }, { status: 502 })
    }

    // Sauvegarder en base
    const { data: card } = await supabase.from('cards').insert({
      user_id: userId,
      swan_card_id: result.card.id,
      last4: result.card.cardNumber.replace(/\s/g, '').slice(-4),
      expiry: result.card.expiryDate,
      holder_name: profile?.full_name ?? 'MonyLink User',
      status: 'active',
      spending_limit_eur: 1000,
    }).select().single()

    return NextResponse.json({ success: true, card })
  } catch {
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) return authResult
    const { userId } = authResult

    const { action } = await req.json() // 'suspend' | 'resume'
    const supabase = createServerClient()

    const { data: card } = await supabase.from('cards').select('*').eq('user_id', userId).single()
    if (!card) return NextResponse.json({ error: 'Carte introuvable' }, { status: 404 })

    await updateCardStatus(card.swan_card_id, action)
    const newStatus = action === 'suspend' ? 'frozen' : 'active'
    await supabase.from('cards').update({ status: newStatus }).eq('id', card.id)

    return NextResponse.json({ success: true, status: newStatus })
  } catch {
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
