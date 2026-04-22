import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InviteClient } from './InviteClient'

export const metadata: Metadata = {
  title: "Invite Friends — Fork'd",
  description: 'Share your referral code and earn rewards.',
}

export default async function InvitePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch the user's referral code from their profile
  const { data: profile } = await supabase
    .from('profiles_visible')
    .select('referral_code')
    .eq('id', user.id)
    .single()

  // Count how many friends have redeemed this user's code
  const { count: inviteCount } = await supabase
    .from('referral_redemptions')
    .select('id', { count: 'exact', head: true })
    .eq('referrer_id', user.id)

  const referralCode = profile?.referral_code ?? null
  const friendCount = inviteCount ?? 0

  return (
    <div className="max-w-md mx-auto py-10 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Invite Friends</h1>
        <p className="text-muted-foreground text-sm">
          Share your referral code and give friends a head start on Fork'd.
        </p>
      </div>

      <InviteClient referralCode={referralCode} friendCount={friendCount} />
    </div>
  )
}
