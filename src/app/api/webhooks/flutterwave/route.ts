// =============================================
// Webhook Flutterwave
// Déclenché quand un paiement Wave/MTN NG/M-Pesa est confirmé
// Flutterwave POST : event, data.tx_ref, data.amount, data.status...
// =============================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getRedis } from '@/lib/redis/client'
import { toEur, calculateFee } from '@/lib/utils/rates'

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  try {
    // Vérifier la signature Flutterwave (toujours, même en sandbox)
    const verifyHash = req.headers.get('verif-hash')
    if (process.env.NEXT_PUBLIC_SANDBOX_MODE !== 'true' && verifyHash !== process.env.FLUTTERWAVE_WEBHOOK_HASH) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    await supabase.from('webhooks_log').insert({
      provider: 'flutterwave',
      payload: body,
      reference: body.data?.tx_ref,
      status: 'received',
    })

    if (body.event !== 'charge.completed') {
      return NextResponse.json({ received: true, credited: false })
    }

    const txData = body.data
    if (!txData || txData.status !== 'successful') {
      return NextResponse.json({ received: true, credited: false })
    }

    const reference: string = txData.tx_ref

    // Idempotency : éviter le double-crédit
    const idempotencyKey = `webhook:flutterwave:${reference}`
    const redis = getRedis()
    if (redis) {
      const isNew = await redis.set(idempotencyKey, '1', { nx: true, ex: 86400 })
      if (!isNew) return NextResponse.json({ received: true, duplicate: true })
    }
    const amountLocal: number = parseFloat(txData.amount ?? '0')
    const currency: string = txData.currency ?? 'XOF'

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

    const grossEur = toEur(amountLocal, currency)
    const feeEur = calculateFee(grossEur)
    const netEur = grossEur - feeEur

    await supabase.from('payment_requests').update({
      status: 'completed',
      amount_eur: netEur,
      exchange_rate: toEur(1, currency),
      fee_eur: feeEur,
      provider_tx_id: txData.flw_ref,
    }).eq('id', pr.id)

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

    await supabase.from('webhooks_log').update({
      status: 'processed',
      processed_at: new Date().toISOString(),
    }).eq('reference', reference)

    return NextResponse.json({ received: true, credited: true, amount_eur: netEur })

  } catch (err) {
    console.error('Flutterwave webhook error:', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
