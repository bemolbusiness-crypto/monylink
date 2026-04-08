// POST /api/webhooks/clerk
// Reçoit les événements Clerk (user.created) et crée le profil + wallet dans Supabase
// Remplace le trigger SQL handle_new_user()

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

const AFRICAN_CODES = ['CM', 'GA']

async function generateMlkId(supabase: ReturnType<typeof createServerClient>): Promise<string> {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  while (true) {
    const random = Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
    const candidate = `MLK-${random}`
    const { data } = await supabase.from('profiles').select('id').eq('monylink_id', candidate).single()
    if (!data) return candidate
  }
}

export async function POST(req: NextRequest) {
  const headerPayload = await headers()
  const svix_id        = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const body = await req.text()

  let event: { type: string; data: Record<string, unknown> }
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as typeof event
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  if (event.type !== 'user.created') {
    return NextResponse.json({ received: true })
  }

  const clerkUser   = event.data
  const clerkUserId = clerkUser.id as string

  const phones     = (clerkUser.phone_numbers as Array<{ phone_number: string }>) ?? []
  const emails     = (clerkUser.email_addresses as Array<{ email_address: string }>) ?? []
  const metadata   = (clerkUser.unsafe_metadata as Record<string, string>) ?? {}

  const phone    = phones[0]?.phone_number ?? ''
  const email    = emails[0]?.email_address ?? undefined
  const country  = metadata.country ?? 'CM'
  const fullName = metadata.full_name
    || (`${clerkUser.first_name ?? ''} ${clerkUser.last_name ?? ''}`.trim() || 'Utilisateur')
  const region   = AFRICAN_CODES.includes(country) ? 'africa' : 'europe'

  const supabase = createServerClient()
  const mlkId    = await generateMlkId(supabase)

  const { error: profileError } = await supabase.from('profiles').insert({
    id: clerkUserId,
    full_name: fullName,
    phone,
    email,
    country,
    region,
    monylink_id: mlkId,
    kyc_status: 'pending',
  })

  if (profileError) {
    console.error('Clerk webhook — profile insert error:', profileError)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  const wallets = region === 'africa'
    ? [{ user_id: clerkUserId, currency: 'XAF', balance: 0 }]
    : [
        { user_id: clerkUserId, currency: 'EUR',  balance: 0 },
        { user_id: clerkUserId, currency: 'USDC', balance: 0 },
      ]

  await supabase.from('wallets').insert(wallets)

  console.log(`New user: ${clerkUserId} → ${mlkId} (${region}, ${country})`)
  return NextResponse.json({ received: true, mlkId })
}
