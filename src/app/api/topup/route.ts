// =============================================
// POST /api/topup
// 1. Valide la session utilisateur
// 2. Crée un payment_request en base
// 3. Choisit Monetbil (CEMAC) ou Flutterwave (pan-Africa) selon le pays
// 4. Initie le paiement Mobile Money → retourne l'URL de paiement
// =============================================

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require-auth'
import { createServerClient } from '@/lib/supabase/server'
import { initiateMonetbilPayment } from '@/lib/providers/monetbil'
import { initiateFlutterwavePayment } from '@/lib/providers/flutterwave'
import { METHOD_PROVIDER, type MobileMoneyMethod } from '@/types'

// Mapping méthode → type Flutterwave
const FLW_TYPE_MAP: Record<string, string> = {
  wave:    'mobilemoneyfranco',
  mtn_ng:  'mobilemoneynigeria',
  airtel:  'mobilemoneyzambia',
  mpesa:   'mpesa',
}

export async function POST(req: NextRequest) {
  try {
    // Auth via Clerk
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) return authResult
    const { userId } = authResult

    // Service role pour écriture (bypass RLS)
    const supabase = createServerClient()

    const body = await req.json()
    const { amount, currency, method, phone } = body as {
      amount: number
      currency: string
      method: MobileMoneyMethod
      phone: string
    }

    if (!amount || amount <= 0 || !currency || !method || !phone) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    // Récupérer le MLK ID de l'utilisateur pour la référence
    const { data: profile } = await supabase
      .from('profiles')
      .select('monylink_id')
      .eq('id', userId)
      .single()

    const mlkId = profile?.monylink_id ?? 'MLK'
    const reference = `${mlkId}-${Date.now().toString(36).toUpperCase()}`
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min

    // Déterminer le provider selon la méthode
    const provider = METHOD_PROVIDER[method]

    // Créer la payment_request en base
    const { data: pr, error: insertError } = await supabase
      .from('payment_requests')
      .insert({
        user_id: userId,
        reference,
        amount_local: amount,
        currency_local: currency,
        provider,
        method,
        status: 'pending',
        fee_eur: 0, // calculé dans le webhook après réception
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (insertError || !pr) {
      return NextResponse.json({ error: 'Erreur création paiement' }, { status: 500 })
    }

    let paymentUrl: string | undefined
    let providerRef: string | undefined

    if (provider === 'monetbil') {
      // Monetbil : Orange Money CM / MTN MoMo CM
      const result = await initiateMonetbilPayment({
        amount,
        phone,
        reference,
        description: `MonyLink top-up ${reference}`,
      })
      if (!result.success) {
        await supabase.from('payment_requests').update({ status: 'failed' }).eq('id', pr.id)
        return NextResponse.json({ error: result.error ?? 'Erreur Monetbil' }, { status: 502 })
      }
      paymentUrl = result.payment_url
      providerRef = result.payment_ref

    } else {
      // Flutterwave : Wave, MTN NG, Airtel, M-Pesa...
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single()

      const result = await initiateFlutterwavePayment({
        amount,
        currency,
        phone,
        reference,
        method: FLW_TYPE_MAP[method] ?? 'mobilemoneyfranco',
        email: userProfile?.email,
        fullname: userProfile?.full_name,
      })
      if (!result.success) {
        await supabase.from('payment_requests').update({ status: 'failed' }).eq('id', pr.id)
        return NextResponse.json({ error: result.error ?? 'Erreur Flutterwave' }, { status: 502 })
      }
      paymentUrl = result.redirect_url
      providerRef = result.flw_ref
    }

    // Mettre à jour la référence provider
    if (providerRef) {
      await supabase
        .from('payment_requests')
        .update({ provider_tx_id: providerRef, status: 'processing' })
        .eq('id', pr.id)
    }

    return NextResponse.json({
      success: true,
      reference,
      paymentUrl,
      providerRef,
      provider,
      expiresAt,
    })

  } catch (err) {
    console.error('POST /api/topup error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
