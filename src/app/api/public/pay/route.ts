// POST /api/public/pay
// Route publique — pas d'auth requise
// Utilisée par /p/[mlkId] : famille en Afrique initie un paiement Mobile Money
// Flow : FCFA → Monetbil → webhook → crédit EUR wallet Europe

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit, rateLimitResponse } from '@/lib/redis/rate-limit'
import { initiateMonetbilPayment } from '@/lib/providers/monetbil'

const RATE = 700 // 1 EUR = 700 FCFA

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    const allowed = await rateLimit(`pay:${ip}`, 10, 60)
    if (!allowed) return rateLimitResponse()

    const body = await req.json()
    const { mlkId, amountXaf, phone, method } = body

    // Validation de base
    if (!mlkId || !amountXaf || !phone || !method) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }
    if (!/^MLK-[A-Z0-9]{4}$/i.test(mlkId)) {
      return NextResponse.json({ error: 'Identifiant invalide' }, { status: 400 })
    }
    if (amountXaf < 500 || amountXaf > 5000000) {
      return NextResponse.json({ error: 'Montant hors limites (500 – 5 000 000 FCFA)' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Vérifier que le destinataire existe
    const { data: recipient } = await supabase
      .from('profiles')
      .select('id, full_name, monylink_id, region')
      .eq('monylink_id', mlkId.toUpperCase())
      .single()

    if (!recipient || recipient.region !== 'europe') {
      return NextResponse.json({ error: 'Destinataire introuvable' }, { status: 404 })
    }

    const amountEur = Math.round((amountXaf / RATE) * 100) / 100
    const reference = `${mlkId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

    // Créer le transfer en base (status: pending)
    const { data: transfer, error: insertError } = await supabase
      .from('transfers')
      .insert({
        sender_id: null,          // non-inscrit
        sender_phone: phone,
        sender_name: 'Expéditeur',
        recipient_id: recipient.id,
        recipient_mlk_id: mlkId.toUpperCase(),
        amount_xaf: amountXaf,
        amount_eur: amountEur,
        rate: RATE,
        method,
        status: 'pending',
        provider_tx_id: null,
        payment_url: null,
        reference,
      })
      .select()
      .single()

    if (insertError || !transfer) {
      return NextResponse.json({ error: 'Erreur création transfert' }, { status: 500 })
    }

    // Initier le paiement Monetbil
    const monetbilResult = await initiateMonetbilPayment({
      amount: amountXaf,
      phone,
      reference,
      description: `Transfert vers ${recipient.full_name} (${mlkId})`,
    })

    if (!monetbilResult.success) {
      // Marquer le transfer comme failed
      await supabase.from('transfers').update({ status: 'failed' }).eq('id', transfer.id)
      return NextResponse.json({ error: monetbilResult.error ?? 'Erreur paiement' }, { status: 502 })
    }

    // Mettre à jour le transfer avec l'URL de paiement
    await supabase
      .from('transfers')
      .update({
        payment_url: monetbilResult.payment_url,
        provider_tx_id: monetbilResult.payment_ref,
        status: 'processing',
      })
      .eq('id', transfer.id)

    return NextResponse.json({
      success: true,
      paymentUrl: monetbilResult.payment_url,
      reference,
      amountEur,
    })

  } catch (err) {
    console.error('POST /api/public/pay error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
