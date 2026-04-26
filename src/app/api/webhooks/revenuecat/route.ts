import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const ACTIVE_EVENTS = new Set(['INITIAL_PURCHASE', 'RENEWAL', 'PRODUCT_CHANGE', 'UNCANCELLATION'])
const INACTIVE_EVENTS = new Set(['CANCELLATION', 'EXPIRATION', 'BILLING_ISSUE_DETECTED'])

export async function POST(req: NextRequest) {
  const body = await req.json()
  const event = body.event
  const userId = event?.app_user_id

  if (!userId || (!ACTIVE_EVENTS.has(event.type) && !INACTIVE_EVENTS.has(event.type))) {
    return NextResponse.json({ received: true })
  }

  const isActive = ACTIVE_EVENTS.has(event.type)
  const supabase = await createServiceClient()

  try {
    await supabase
      .from('user_entitlements')
      .upsert({ user_id: userId, is_premium: isActive }, { onConflict: 'user_id' })

    await supabase
      .from('profiles')
      .update({ is_premium: isActive })
      .eq('id', userId)
  } catch (err) {
    console.error('RevenueCat webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
