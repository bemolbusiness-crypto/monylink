// =============================================
// Webhook Monetbil
// Déclenché quand un paiement Orange Money / MTN MoMo est confirmé
// Monétbil POST : payment_ref, amount, status, phone...
// =============================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { redis } from '@/lib/redis/client'
import { toEur, calculateFee } from '@/lib/utils/rates'

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  try {
    const body = await req.json().catch(() => null) ?? Object.fromEntries(await req.formData())

    // Log du webhook
    await supabase.from('webhooks_log').insert({
      provider: 'monetbil',
      payload: body,
      reference: body.payment_ref,
      status: 'received',
    })

    // Vérifier que c'est un paiement réussi
    const status = body.status ?? body.payment_status
    if (status !== 'success' && status !== 'PAID') {
      return NextResponse.json({ received: true, credited: false })
    }

    const reference: string = body.payment_ref

    // Idempotency : éviter le double-crédit
    const idempotencyKey = `webhook:monetbil:${reference}`
    const isNew = await redis.set(idempotencyKey, '1', { nx: true, ex: 86400 })
    if (!isNew) return NextResponse.json({ received: true, duplicate: true })
    const amountLocal: number = parseFloat(body.amount ?? '0')
    const currency: string = body.currency ?? 'XAF'

    if (!reference || !amountLocal) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    }

    // Trouver la payment_request correspondante
    const { data: pr } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('reference', reference)
      .single()

    if (!pr) {
      await supabase.from('webhooks_log').update({ status: 'no_match' }).eq('reference', reference)
      return NextResponse.json({ error: 'reference not found' }, { status: 404 })
    }

    if (pr.status === 'completed') {
      return NextResponse.json({ received: true, credited: false, reason: 'already_processed' })
    }

    // Calculer le montant EUR net
    const grossEur = toEur(amountLocal, currency)
    const feeEur = calculateFee(grossEur)
    const netEur = grossEur - feeEur

    // Mettre à jour la payment_request
    await supabase.from('payment_requests').update({
      status: 'completed',
      amount_eur: netEur,
      exchange_rate: toEur(1, currency),
      fee_eur: feeEur,
      provider_tx_id: body.transaction_id ?? body.operator_transaction_id,
    }).eq('id', pr.id)

    // Créditer le wallet EUR de l'utilisateur
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', pr.user_id)
      .eq('currency', 'EUR')
      .single()

    const currentBalance = wallet?.balance ?? 0
    await supabase.from('wallets').update({
      balance: currentBalance + netEur,
      updated_at: new Date().toISOString(),
    }).eq('user_id', pr.user_id).eq('currency', 'EUR')

    // Marquer le log comme traité
    await supabase.from('webhooks_log').update({
      status: 'processed',
      processed_at: new Date().toISOString(),
    }).eq('reference', reference)

    return NextResponse.json({ received: true, credited: true, amount_eur: netEur })

  } catch (err) {
    console.error('Monetbil webhook error:', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
