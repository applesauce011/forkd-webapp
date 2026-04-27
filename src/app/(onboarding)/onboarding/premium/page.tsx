import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PremiumUpsell } from '@/components/onboarding/PremiumUpsell'

export default async function OnboardingPremiumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  if (!profile?.username) redirect('/onboarding')

  return (
    <div className="w-full max-w-md px-4">
      <PremiumUpsell />
    </div>
  )
}
