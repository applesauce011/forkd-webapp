import { NextResponse } from 'next/server'
import { stripe, STRIPE_PRICE_ID, APP_URL } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${APP_URL}/settings/subscription?success=true`,
    cancel_url: `${APP_URL}/upgrade`,
    metadata: { supabase_user_id: user.id },
    customer_email: user.email,
  })

  return NextResponse.json({ url: session.url })
}
