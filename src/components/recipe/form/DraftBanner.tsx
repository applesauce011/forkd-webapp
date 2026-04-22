'use client'

import { Button } from '@/components/ui/button'
import { X, FileText } from 'lucide-react'

interface DraftBannerProps {
  hasDraft: boolean
  savedAt?: string
  onResume: () => void
  onDiscard: () => void
}

export function DraftBanner({ hasDraft, savedAt, onResume, onDiscard }: DraftBannerProps) {
  if (!hasDraft) return null

  const savedDate = savedAt ? new Date(savedAt) : null
  const timeStr = savedDate
    ? savedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-800 dark:bg-amber-950/20">
      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
        <FileText className="h-4 w-4 shrink-0" />
        <span>
          You have an unsaved draft{timeStr ? ` from ${timeStr}` : ''}.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onResume}
          className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900/40"
        >
          Resume draft
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDiscard}
          className="text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/40"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Discard draft</span>
        </Button>
      </div>
    </div>
  )
}
