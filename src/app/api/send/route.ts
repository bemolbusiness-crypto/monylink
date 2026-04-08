// =============================================
// POST /api/send
// Envoi Mobile Money vers l'Afrique
// 1. Valide session + solde EUR
// 2. Convertit EUR → devise locale
// 3. Débite le wallet EUR
// 4. Initie le disbursement Flutterwave
// =============================================

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require-auth'
import { createServerClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitResponse } from '@/lib/redis/rate-limit'
import { initiateDisbursement } from '@/lib/providers/flutterwave'
import { fromEur, calculateFee } from '@/lib/utils/rates'
import type { MobileMoneyMethod } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) return authResult
    const { userId } = authResult

    const allowed = await rateLimit(`send:${userId}`, 5, 60)
    if (!allowed) return rateLimitResponse()

    const supabase = createServerClient()

    const body = await req.json()
    const { amountEur, recipientPhone, recipientName, method, currency, country } = body as {
      amountEur: number
      recipientPhone: string
      recipientName: string
      method: MobileMoneyMethod
      currency: string
      country: string
    }

    if (!amountEur || !recipientPhone || !recipientName || !method || !currency) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    const feeEur = calculateFee(amountEur)
    const totalDebit = amountEur + feeEur
    const amountLocal = Math.round(fromEur(amountEur, currency))

    // Vérifier le solde
    const { data: wallet } = await supabase
      .from('wallets').select('balance').eq('user_id', userId).eq('currency', 'EUR').single()

    if ((wallet?.balance ?? 0) < totalDebit) {
      return NextResponse.json({ error: 'Solde insuffisant' }, { status: 400 })
    }

    const reference = `MLK-SEND-${Date.now().toString(36).toUpperCase()}`

    // Créer l'enregistrement de l'envoi
    const { data: send, error: insertError } = await supabase.from('outgoing_transfers').insert({
      user_id: userId,
      reference,
      amount_eur: amountEur,
      fee_eur: feeEur,
      amount_local: amountLocal,
      currency_local: currency,
      recipient_phone: recipientPhone,
      recipient_name: recipientName,
      method,
      country,
      status: 'pending',
    }).select().single()

    if (insertError || !send) {
      return NextResponse.json({ error: 'Erreur création envoi' }, { status: 500 })
    }

    // Débiter le wallet (frais inclus)
    await supabase.from('wallets').update({
      balance: (wallet?.balance ?? 0) - totalDebit,
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId).eq('currency', 'EUR')

    // Initier le disbursement Flutterwave
    const result = await initiateDisbursement({
      amount: amountLocal,
      currency,
      phone: recipientPhone,
      network: method,
      beneficiaryName: recipientName,
      reference,
      narration: `MonyLink transfer from ${userId}`,
    })

    if (!result.success) {
      // Remboursement si échec
      await supabase.from('wallets').update({
        balance: wallet?.balance ?? 0,
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId).eq('currency', 'EUR')
      await supabase.from('outgoing_transfers').update({ status: 'failed' }).eq('id', send.id)
      return NextResponse.json({ error: result.error ?? 'Erreur Flutterwave' }, { status: 502 })
    }

    await supabase.from('outgoing_transfers').update({
      status: 'processing',
      provider_tx_id: result.transferId,
    }).eq('id', send.id)

    return NextResponse.json({
      success: true,
      reference,
      transferId: result.transferId,
      amountLocal,
      currency,
      feeEur,
    })

  } catch (err) {
    console.error('POST /api/send error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
