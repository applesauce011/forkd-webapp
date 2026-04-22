import type { Metadata } from 'next'
import Link from 'next/link'
import { SparklesIcon } from 'lucide-react'
import { FeatureTable } from '@/components/premium/FeatureTable'
import { CheckoutButton } from '@/components/premium/CheckoutButton'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: "Upgrade to Premium — Fork'd",
  description: 'Unlock unlimited recipes, private recipes, AI dictation, and more.',
}

export default function UpgradePage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-orange-100 dark:bg-orange-950 mb-2">
          <SparklesIcon className="size-7 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Go Premium</h1>
        <p className="text-muted-foreground text-base max-w-sm mx-auto">
          Unlimited access to every feature Fork'd has to offer — cook without limits.
        </p>
      </div>

      {/* Price */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-end gap-1">
          <span className="text-5xl font-extrabold tracking-tight">$4.99</span>
          <span className="text-muted-foreground text-lg pb-1">/month</span>
        </div>
        <p className="text-sm text-muted-foreground">Cancel any time</p>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3">
        <CheckoutButton className="w-full max-w-xs bg-orange-500 hover:bg-orange-600 text-white">
          Start Premium
        </CheckoutButton>
        <Link
          href={ROUTES.REDEEM}
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
        >
          Already have a code?
        </Link>
      </div>

      {/* Feature comparison table */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-center">What&apos;s included</h2>
        <FeatureTable />
      </div>
    </div>
  )
}
