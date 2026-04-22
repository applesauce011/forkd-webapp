import type { Metadata } from 'next'
import { RedeemForm } from './RedeemForm'

export const metadata: Metadata = {
  title: "Redeem a Code — Fork'd",
  description: "Enter a promo or referral code to unlock Fork'd Premium.",
}

export default function RedeemPage() {
  return (
    <div className="max-w-md mx-auto py-10 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Redeem a Code</h1>
        <p className="text-muted-foreground text-sm">
          Enter a promo or referral code below to unlock premium access.
        </p>
      </div>
      <RedeemForm />
    </div>
  )
}
