'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CopyIcon, CheckIcon, ShareIcon, UsersIcon } from 'lucide-react'

interface InviteClientProps {
  referralCode: string | null
  friendCount: number
}

export function InviteClient({ referralCode, friendCount }: InviteClientProps) {
  const [copied, setCopied] = useState(false)

  const shareText = referralCode
    ? `Join me on Fork'd! Use my referral code ${referralCode} to get started: https://forkd.io/redeem`
    : "Join me on Fork'd — the best way to discover and share recipes!"

  async function handleCopy() {
    if (!referralCode) return
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopied(true)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Fork'd",
          text: shareText,
          url: referralCode
            ? `https://forkd.io/redeem?code=${referralCode}`
            : 'https://forkd.io',
        })
      } catch {
        // User dismissed — not an error
      }
    } else {
      // Fallback: copy the share text
      try {
        await navigator.clipboard.writeText(shareText)
        toast.success('Invite link copied to clipboard!')
      } catch {
        toast.error('Could not copy to clipboard')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats card */}
      <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
        <div className="flex items-center justify-center size-12 rounded-xl bg-orange-100 dark:bg-orange-950">
          <UsersIcon className="size-6 text-orange-500" />
        </div>
        <div>
          <p className="text-2xl font-bold">{friendCount}</p>
          <p className="text-sm text-muted-foreground">
            {friendCount === 1 ? 'friend invited' : 'friends invited'}
          </p>
        </div>
      </div>

      {/* Referral code */}
      {referralCode ? (
        <div className="space-y-3">
          <p className="text-sm font-medium">Your referral code</p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={referralCode}
              className="font-mono tracking-widest text-center text-base font-semibold bg-muted"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              aria-label="Copy code"
            >
              {copied ? (
                <CheckIcon className="size-4 text-green-500" />
              ) : (
                <CopyIcon className="size-4" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">
          No referral code found on your account.
        </div>
      )}

      {/* Share button */}
      <Button
        className="w-full gap-2"
        variant="outline"
        onClick={handleShare}
      >
        <ShareIcon className="size-4" />
        Share invite
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Friends who redeem your code get a head start. Thanks for spreading the word!
      </p>
    </div>
  )
}
