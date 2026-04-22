'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2Icon, TicketIcon } from 'lucide-react'

export function RedeemForm() {
  const [code, setCode] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return

    startTransition(async () => {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.rpc('redeem_promo_code', {
        p_code: trimmed,
      })

      if (error || (data && typeof data === 'object' && 'error' in data)) {
        const message =
          typeof data === 'object' && data !== null && 'error' in data
            ? String((data as { error: string }).error)
            : 'Invalid or expired code'
        toast.error(message)
        return
      }

      toast.success("Code applied! Enjoy Fork'd Premium.")
      setCode('')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="promo-code">Promo or referral code</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <TicketIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="promo-code"
              placeholder="FORKD-XXXX"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="pl-9 font-mono uppercase tracking-widest"
              autoComplete="off"
              spellCheck={false}
              disabled={isPending}
            />
          </div>
          <Button type="submit" disabled={isPending || !code.trim()}>
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              'Redeem'
            )}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Codes are case-insensitive. Each code can only be redeemed once.
      </p>
    </form>
  )
}
