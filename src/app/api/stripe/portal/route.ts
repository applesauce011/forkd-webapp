import { NextResponse } from 'next/server'
import { stripe, APP_URL } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Look up the Stripe subscription ID stored in source_id (source = 'stripe')
  const { data: grant } = await supabase
    .from('premium_access_grants')
    .select('source_id')
    .eq('user_id', user.id)
    .eq('source', 'stripe')
    .order('granted_at', { ascending: false })
    .limit(1)
    .single()

  if (!grant?.source_id) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
  }

  // Retrieve the subscription to get the customer ID
  const subscription = await stripe.subscriptions.retrieve(grant.source_id)
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${APP_URL}/settings/subscription`,
  })

  return NextResponse.json({ url: session.url })
}
