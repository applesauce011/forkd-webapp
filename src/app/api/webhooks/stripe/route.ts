import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe/client'
import { createServiceClient } from '@/lib/supabase/server'
import { grantRevenueCatEntitlement, revokeRevenueCatEntitlement } from '@/lib/revenuecat/client'

export async function POST(request: NextRequest) {
  // RAW body required for Stripe signature verification
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Service role client bypasses RLS — safe for webhook handlers
  const supabase = await createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        if (!userId) break

        const subscriptionId = session.subscription as string | null

        // Upsert entitlements — idempotent
        await supabase
          .from('user_entitlements')
          .upsert({ user_id: userId, is_premium: true }, { onConflict: 'user_id' })

        // Insert access grant — skip on conflict (duplicate webhook events)
        if (subscriptionId) {
          await supabase
            .from('premium_access_grants')
            .insert({
              user_id: userId,
              source: 'stripe',
              source_id: subscriptionId,
            })
            .select()
            .maybeSingle()

          await grantRevenueCatEntitlement(
            userId,
            session.customer_email ?? session.customer_details?.email ?? null,
            subscriptionId
          )
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription

        // Find user by their subscription ID stored in source_id
        const { data: grant } = await supabase
          .from('premium_access_grants')
          .select('user_id')
          .eq('source', 'stripe')
          .eq('source_id', sub.id)
          .single()

        if (grant?.user_id) {
          await supabase
            .from('user_entitlements')
            .update({ is_premium: false })
            .eq('user_id', grant.user_id)

          await revokeRevenueCatEntitlement(grant.user_id)
        }
        break
      }

      case 'customer.subscription.updated': {
        // Handle reactivation: if status is active, ensure is_premium = true
        const sub = event.data.object as Stripe.Subscription

        const { data: grant } = await supabase
          .from('premium_access_grants')
          .select('user_id')
          .eq('source', 'stripe')
          .eq('source_id', sub.id)
          .single()

        if (grant?.user_id) {
          const isActive = sub.status === 'active' || sub.status === 'trialing'
          await supabase
            .from('user_entitlements')
            .update({ is_premium: isActive })
            .eq('user_id', grant.user_id)
        }
        break
      }
    }
  } catch (err) {
    console.error('Stripe webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
