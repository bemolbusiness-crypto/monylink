// GET /api/recipient/:mlkId
// Route publique — pas d'auth requise
// Utilisée par /p/[mlkId] pour afficher le nom du destinataire

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ mlkId: string }> }
) {
  const { mlkId: rawId } = await params
  const mlkId = rawId?.toUpperCase()
  if (!mlkId || !/^MLK-[A-Z0-9]{4}$/.test(mlkId)) {
    return NextResponse.json({ error: 'Identifiant invalide' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, monylink_id, country')
    .eq('monylink_id', mlkId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  }

  return NextResponse.json({
    full_name: data.full_name,
    monylink_id: data.monylink_id,
    country: data.country,
  })
}
