'use client'

import { useRouter } from 'next/navigation'
import { SparklesIcon, BookmarkCheck, Search, BarChart2, ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CheckoutButton } from '@/components/premium/CheckoutButton'

const BENEFITS = [
  { icon: Search, text: 'Unlimited recipe results & advanced search filters' },
  { icon: BookmarkCheck, text: 'Unlimited bookmarks — save every recipe you love' },
  { icon: ChefHat, text: 'Unlimited Cook Mode sessions' },
  { icon: BarChart2, text: 'Creator Stats dashboard to track your impact' },
]

export function PremiumUpsell() {
  const router = useRouter()

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-orange-100 dark:bg-orange-950 mb-2">
          <SparklesIcon className="size-7 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">You're all set!</h1>
        <p className="text-muted-foreground">
          Want to unlock everything Fork'd has to offer?
        </p>
      </div>

      <ul className="space-y-3 text-left">
        {BENEFITS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm">
            <Icon className="h-4 w-4 text-orange-500 shrink-0" />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-1">
        <p className="text-3xl font-extrabold tracking-tight">$4.99<span className="text-base font-normal text-muted-foreground">/month</span></p>
        <p className="text-xs text-muted-foreground">Cancel any time</p>
      </div>

      <div className="flex flex-col gap-3">
        <CheckoutButton className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          Start Premium
        </CheckoutButton>
        <Button variant="ghost" className="w-full" onClick={() => router.push('/feed')}>
          Continue for free →
        </Button>
        <p className="text-xs text-muted-foreground">
          You can upgrade any time from your sidebar
        </p>
      </div>
    </div>
  )
}
