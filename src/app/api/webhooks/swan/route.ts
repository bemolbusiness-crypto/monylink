// =============================================
// Webhook Swan
// - Transaction.Booked (Credit) → SEPA entrant → crédit wallet EUR
// - Transaction.Booked (Debit)  → SEPA sortant → maj statut withdrawal
// - Transaction.Rejected / Canceled → remboursement withdrawal
// =============================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifySwanWebhook } from '@/lib/providers/swan'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const rawBody = await req.text()
    const signature = req.headers.get('swan-signature') ?? ''

    if (!verifySwanWebhook(rawBody, signature)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const body = JSON.parse(rawBody)
    const eventType: string = body.eventType ?? ''
    const tx = body.data?.transaction

    if (!tx) return NextResponse.json({ received: true })

    const swanTxId: string = tx.id
    const swanStatus: string = tx.statusInfo?.status ?? ''
    const side: string = tx.side ?? '' // Credit = entrant, Debit = sortant
    const reference: string = tx.reference ?? tx.externalReference ?? ''
    const label: string = tx.label ?? ''

    await supabase.from('webhooks_log').insert({
      provider: 'swan',
      payload: body,
      reference: reference || swanTxId,
      status: 'received',
    })

    // ── SEPA ENTRANT (Credit) ──────────────────────────────────────────
    if (side === 'Credit' && swanStatus === 'Booked') {
      const amountEur: number = parseFloat(tx.amount?.value ?? '0')
      if (!amountEur) return NextResponse.json({ received: true })

      // Chercher le MLK ID dans le motif ou le label
      // Format attendu : "MLK-XXXX" (4 chars alphanum)
      const mlkMatch = (reference + ' ' + label).match(/MLK-[A-Z0-9]{4}/i)
      if (!mlkMatch) {
        await supabase.from('webhooks_log').update({ status: 'no_mlk_ref' }).eq('reference', reference || swanTxId)
        return NextResponse.json({ received: true, credited: false, reason: 'no_mlk_ref' })
      }

      const mlkId = mlkMatch[0].toUpperCase()

      // Trouver l'utilisateur par son monylink_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('monylink_id', mlkId)
        .single()

      if (!profile) {
        await supabase.from('webhooks_log').update({ status: 'user_not_found' }).eq('reference', reference || swanTxId)
        return NextResponse.json({ received: true, credited: false, reason: 'user_not_found' })
      }

      // Anti-doublon : vérifier si ce swan_tx_id a déjà été traité
      const { data: existing } = await supabase
        .from('payment_requests')
        .select('id')
        .eq('provider_tx_id', swanTxId)
        .single()

      if (existing) {
        return NextResponse.json({ received: true, credited: false, reason: 'already_processed' })
      }

      // Créditer le wallet EUR
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', profile.id)
        .eq('currency', 'EUR')
        .single()

      await supabase.from('wallets').update({
        balance: (wallet?.balance ?? 0) + amountEur,
        updated_at: new Date().toISOString(),
      }).eq('user_id', profile.id).eq('currency', 'EUR')

      // Enregistrer comme payment_request de type SEPA entrant
      await supabase.from('payment_requests').insert({
        user_id: profile.id,
        reference: reference || swanTxId,
        amount_local: amountEur,
        currency_local: 'EUR',
        amount_eur: amountEur,
        exchange_rate: 1,
        fee_eur: 0,
        provider: 'swan_sepa',
        method: 'sepa_credit',
        status: 'completed',
        provider_tx_id: swanTxId,
        expires_at: new Date().toISOString(),
      })

      await supabase.from('webhooks_log').update({
        status: 'processed',
        processed_at: new Date().toISOString(),
      }).eq('reference', reference || swanTxId)

      return NextResponse.json({ received: true, credited: true, amount_eur: amountEur, user: mlkId })
    }

    // ── SEPA SORTANT (Debit) ───────────────────────────────────────────
    const { data: withdrawal } = await supabase
      .from('withdrawals')
      .select('*')
      .or(`sepa_ref.eq.${reference},provider_tx_id.eq.${swanTxId}`)
      .single()

    if (!withdrawal) {
      return NextResponse.json({ received: true, matched: false })
    }

    const statusMap: Record<string, string> = {
      Booked: 'completed', Upcoming: 'processing', Rejected: 'failed', Canceled: 'failed',
    }
    const newStatus = statusMap[swanStatus] ?? 'processing'

    if (newStatus === 'failed' && withdrawal.status !== 'failed') {
      const { data: wallet } = await supabase
        .from('wallets').select('balance').eq('user_id', withdrawal.user_id).eq('currency', 'EUR').single()
      await supabase.from('wallets').update({
        balance: (wallet?.balance ?? 0) + withdrawal.amount_eur,
        updated_at: new Date().toISOString(),
      }).eq('user_id', withdrawal.user_id).eq('currency', 'EUR')
    }

    await supabase.from('withdrawals').update({ status: newStatus, provider_tx_id: swanTxId }).eq('id', withdrawal.id)
    await supabase.from('webhooks_log').update({ status: 'processed', processed_at: new Date().toISOString() }).eq('reference', reference || swanTxId)

    return NextResponse.json({ received: true, status: newStatus })

  } catch (err) {
    console.error('Swan webhook error:', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
