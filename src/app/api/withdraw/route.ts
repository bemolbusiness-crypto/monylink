// =============================================
// POST /api/withdraw
// 1. Valide la session utilisateur
// 2. Vérifie le solde EUR
// 3. Crée un enregistrement withdrawal (pending)
// 4. Appelle Swan pour initier le SEPA Instant
// 5. Met à jour le statut + débite le wallet
// =============================================

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require-auth'
import { createServerClient } from '@/lib/supabase/server'
import { initiateSEPATransfer } from '@/lib/providers/swan'
import { WITHDRAWAL_FEE_EUR } from '@/lib/utils/rates'

export async function POST(req: NextRequest) {
  try {
    // Auth via Clerk
    const authResult = await requireAuth()
    if (authResult instanceof NextResponse) return authResult
    const { userId } = authResult

    // Service role pour les opérations côté serveur (bypass RLS)
    const supabase = createServerClient()

    const body = await req.json()
    const { amount, iban, bic, beneficiaryName, label } = body

    const amountNum = parseFloat(amount)
    if (!amountNum || amountNum <= 0 || !iban || !beneficiaryName) {
      return NextResponse.json({ error: 'Champs manquants ou invalides' }, { status: 400 })
    }

    // Vérifier le solde
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .eq('currency', 'EUR')
      .single()

    const balance = wallet?.balance ?? 0
    if (amountNum > balance) {
      return NextResponse.json({ error: 'Solde insuffisant' }, { status: 400 })
    }

    const netEur = Math.max(0, amountNum - WITHDRAWAL_FEE_EUR)
    const sepaRef = `MLK-WD-${Date.now().toString(36).toUpperCase()}`
    const cleanIban = iban.replace(/\s/g, '').toUpperCase()

    // 1. Créer le withdrawal en base (pending → on va le passer à processing après Swan)
    const { data: withdrawal, error: insertError } = await supabase
      .from('withdrawals')
      .insert({
        user_id: userId,
        amount_eur: amountNum,
        fee_eur: WITHDRAWAL_FEE_EUR,
        net_eur: netEur,
        iban: cleanIban,
        bic: bic || null,
        beneficiary_name: beneficiaryName,
        label: label || 'Retrait MonyLink',
        status: 'pending',
        sepa_ref: sepaRef,
      })
      .select()
      .single()

    if (insertError || !withdrawal) {
      return NextResponse.json({ error: 'Erreur création retrait' }, { status: 500 })
    }

    // 2. Débiter le wallet immédiatement (fonds réservés)
    await supabase
      .from('wallets')
      .update({ balance: balance - amountNum, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('currency', 'EUR')

    // 3. Appeler Swan SEPA Instant
    const swanResult = await initiateSEPATransfer({
      amount: netEur,
      iban: cleanIban,
      bic: bic || undefined,
      beneficiaryName,
      label: label || 'Retrait MonyLink',
      sepaRef,
    })

    if (!swanResult.success) {
      // Rembourser le wallet si Swan échoue
      await supabase
        .from('wallets')
        .update({ balance, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('currency', 'EUR')

      await supabase
        .from('withdrawals')
        .update({ status: 'failed' })
        .eq('id', withdrawal.id)

      return NextResponse.json({ error: swanResult.error ?? 'Erreur Swan' }, { status: 502 })
    }

    // 4. Mettre à jour le retrait avec le statut Swan
    const finalStatus = swanResult.status === 'Booked' ? 'completed' : 'processing'
    await supabase
      .from('withdrawals')
      .update({
        status: finalStatus,
        sepa_ref: sepaRef,
        // Stocker l'ID Swan pour suivi webhook
        ...(swanResult.swanTransactionId ? { provider_tx_id: swanResult.swanTransactionId } : {}),
      })
      .eq('id', withdrawal.id)

    return NextResponse.json({
      success: true,
      sepaRef,
      swanTransactionId: swanResult.swanTransactionId,
      status: finalStatus,
      netEur,
    })

  } catch (err) {
    console.error('POST /api/withdraw error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
