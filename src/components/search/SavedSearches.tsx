'use client'

import { useState, useCallback, useEffect } from 'react'
import { Trash2, Save, Clock, Crown, Lock, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ROUTES } from '@/lib/constants/routes'
import Link from 'next/link'
import type { SearchFilters } from '@/components/search/SearchPageClient'
import { formatDate } from '@/lib/utils/format'
import { useSession } from '@/hooks/useSession'

const STORAGE_KEY = 'forkd_saved_searches'

interface SavedSearch {
  id: string
  name: string
  query: string
  filters: SearchFilters
  savedAt: string
}

interface SavedSearchesProps {
  currentQuery: string
  currentFilters: SearchFilters
  onRestore: (query: string, filters: SearchFilters) => void
  isPremium: boolean
  maxSaved: number
}

function loadSavedSearches(): SavedSearch[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function persistSavedSearches(searches: SavedSearch[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
  } catch {}
}

function buildFilterSummary(query: string, filters: SearchFilters): string {
  const parts: string[] = []
  if (query) parts.push(`"${query}"`)
  if (filters.cuisine) parts.push(filters.cuisine)
  if (filters.dietary?.length) parts.push(`${filters.dietary.length} dietary`)
  if (filters.difficulty) parts.push(filters.difficulty)
  if (filters.max_cook_time) parts.push(`≤${filters.max_cook_time}min`)
  return parts.join(' · ') || 'No filters'
}

function PremiumGate() {
  const { user } = useSession()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
          <UserPlus className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-base">Create an account</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Sign up for free to save your favourite searches and filter combinations.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.SIGNUP}>Create free account</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
      <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
        <Lock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
      </div>
      <div>
        <h3 className="font-semibold text-base flex items-center justify-center gap-1.5">
          <Crown className="h-4 w-4 text-amber-500" />
          Premium Feature
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Save your favourite searches and filter combinations with a Premium plan.
        </p>
      </div>
      <Button asChild>
        <Link href={ROUTES.UPGRADE}>Upgrade to Premium</Link>
      </Button>
    </div>
  )
}

export function SavedSearches({
  currentQuery,
  currentFilters,
  onRestore,
  isPremium,
  maxSaved,
}: SavedSearchesProps) {
  const [saved, setSaved] = useState<SavedSearch[]>([])
  const [saveName, setSaveName] = useState('')
  const [saving, setSaving] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setSaved(loadSavedSearches())
  }, [])

  const handleSave = useCallback(() => {
    const name = saveName.trim() || buildFilterSummary(currentQuery, currentFilters)
    if (!name) return

    const newEntry: SavedSearch = {
      id: crypto.randomUUID(),
      name,
      query: currentQuery,
      filters: currentFilters,
      savedAt: new Date().toISOString(),
    }

    setSaved((prev) => {
      const next = [newEntry, ...prev].slice(0, maxSaved)
      persistSavedSearches(next)
      return next
    })
    setSaveName('')
    setSaving(false)
  }, [saveName, currentQuery, currentFilters, maxSaved])

  const handleDelete = useCallback((id: string) => {
    setSaved((prev) => {
      const next = prev.filter((s) => s.id !== id)
      persistSavedSearches(next)
      return next
    })
  }, [])

  const handleRestore = useCallback(
    (entry: SavedSearch) => {
      onRestore(entry.query, entry.filters)
    },
    [onRestore]
  )

  if (!isPremium) {
    return <PremiumGate />
  }

  const canSave = saved.length < maxSaved && (currentQuery.trim() || Object.keys(currentFilters).length > 0)

  return (
    <div className="space-y-4 pb-6">
      {/* Save current search */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Save current search</Label>
        {saving ? (
          <div className="flex gap-2">
            <Input
              placeholder="Name this search..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') setSaving(false)
              }}
              autoFocus
              className="flex-1"
            />
            <Button size="sm" onClick={handleSave} disabled={!canSave}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSaving(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setSaving(true)}
            disabled={!canSave}
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save current search
            {saved.length >= maxSaved && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({maxSaved} max)
              </span>
            )}
          </Button>
        )}
        {canSave && !saving && (
          <p className="text-xs text-muted-foreground mt-1">
            {buildFilterSummary(currentQuery, currentFilters)}
          </p>
        )}
      </div>

      <Separator />

      {/* Saved searches list */}
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Your saved searches ({saved.length}/{maxSaved})
        </Label>

        {saved.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
            No saved searches yet
          </div>
        ) : (
          <ul className="space-y-2">
            {saved.map((entry) => (
              <li
                key={entry.id}
                className="flex items-start gap-2 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors group"
              >
                <button
                  className="flex-1 text-left min-w-0"
                  onClick={() => handleRestore(entry)}
                >
                  <p className="text-sm font-medium truncate">{entry.name}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {buildFilterSummary(entry.query, entry.filters)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(entry.savedAt)}
                  </p>
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                  aria-label="Delete saved search"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
