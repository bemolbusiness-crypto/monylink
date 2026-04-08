// POST /api/convert
// Convertit EUR → USDC dans le wallet de l'utilisateur
// Taux : 1 EUR = 1.09 USDC (USDC ≈ USD)

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require-auth'
import { createServerClient } from '@/lib/supabase/server'

const EUR_USDC_RATE = 1.09

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) return authResult
    const { userId } = authResult

    const supabase = createServerClient()

    const { amountEur } = await req.json()
    const amount = parseFloat(amountEur)
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Montant invalide' }, { status: 400 })
    }

    // Vérifier le solde EUR
    const { data: wallets } = await supabase
      .from('wallets')
      .select('id, currency, balance')
      .eq('user_id', userId)
      .in('currency', ['EUR', 'USDC'])

    const eurWallet = wallets?.find(w => w.currency === 'EUR')
    const usdcWallet = wallets?.find(w => w.currency === 'USDC')

    if (!eurWallet || eurWallet.balance < amount) {
      return NextResponse.json({ error: 'Solde EUR insuffisant' }, { status: 400 })
    }

    const amountUsdc = Math.round(amount * EUR_USDC_RATE * 100) / 100

    // Débiter EUR
    await supabase
      .from('wallets')
      .update({ balance: eurWallet.balance - amount, updated_at: new Date().toISOString() })
      .eq('id', eurWallet.id)

    // Créditer USDC (crée le wallet si absent)
    if (usdcWallet) {
      await supabase
        .from('wallets')
        .update({ balance: usdcWallet.balance + amountUsdc, updated_at: new Date().toISOString() })
        .eq('id', usdcWallet.id)
    } else {
      await supabase.from('wallets').insert({
        user_id: userId,
        currency: 'USDC',
        balance: amountUsdc,
      })
    }

    // Log de la conversion
    await supabase.from('crypto_conversions').insert({
      user_id: userId,
      from_currency: 'EUR',
      to_currency: 'USDC',
      amount_from: amount,
      amount_to: amountUsdc,
      rate: EUR_USDC_RATE,
      status: 'completed',
    })

    return NextResponse.json({ success: true, amountUsdc, rate: EUR_USDC_RATE })

  } catch (err) {
    console.error('POST /api/convert error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
