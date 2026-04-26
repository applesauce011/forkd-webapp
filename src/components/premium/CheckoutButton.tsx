'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'

interface CheckoutButtonProps {
  className?: string
  children?: React.ReactNode
}

export function CheckoutButton({
  className,
  children = 'Start Premium',
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/create-checkout', { method: 'POST' })
      if (!res.ok) {
        throw new Error('Failed to create checkout session')
      }
      const { url } = await res.json()
      if (url) {
        window.location.href = url
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Checkout error:', err)
      setLoading(false)
    }
    // Don't reset loading if redirecting — page will navigate away
  }

  return (
    <Button
      className={className}
      onClick={handleCheckout}
      disabled={loading}
      size="lg"
    >
      {loading ? (
        <>
          <Loader2Icon className="size-4 animate-spin" />
          <span>Loading…</span>
        </>
      ) : (
        children
      )}
    </Button>
  )
}
