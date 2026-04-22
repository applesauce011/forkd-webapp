'use client'

import { useCallback, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { AdvancedFilters } from '@/components/search/AdvancedFilters'
import { FilterChips } from '@/components/search/FilterChips'
import { SavedSearches } from '@/components/search/SavedSearches'
import { useRecentSearches } from '@/hooks/useRecentSearches'
import { useEntitlements } from '@/hooks/useEntitlements'

export interface SearchFilters {
  cuisine?: string
  dietary?: string[]
  exclude_allergens?: string[]
  meal_types?: string[]
  difficulty?: string
  max_cook_time?: number
}

type SearchTab = 'recipes' | 'people'

export function SearchPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const entitlements = useEntitlements()
  const recentSearches = useRecentSearches()

  const query = searchParams.get('q') ?? ''
  const tab = (searchParams.get('tab') as SearchTab) ?? 'recipes'

  const [filters, setFilters] = useState<SearchFilters>({})
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [savedSearchesOpen, setSavedSearchesOpen] = useState(false)

  const updateUrl = useCallback(
    (q: string, newTab?: SearchTab) => {
      const params = new URLSearchParams(searchParams.toString())
      if (q) {
        params.set('q', q)
      } else {
        params.delete('q')
      }
      if (newTab) {
        params.set('tab', newTab)
      }
      router.replace(`/search?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleQueryChange = useCallback(
    (q: string) => {
      updateUrl(q)
    },
    [updateUrl]
  )

  const handleTabChange = useCallback(
    (newTab: SearchTab) => {
      updateUrl(query, newTab)
    },
    [updateUrl, query]
  )

  const handleRemoveFilter = useCallback(
    (key: keyof SearchFilters, value?: string) => {
      setFilters((prev) => {
        const next = { ...prev }
        if (Array.isArray(next[key]) && value) {
          (next[key] as string[]) = (next[key] as string[]).filter((v) => v !== value)
          if ((next[key] as string[]).length === 0) {
            delete next[key]
          }
        } else {
          delete next[key]
        }
        return next
      })
    },
    []
  )

  const handleClearAllFilters = useCallback(() => {
    setFilters({})
  }, [])

  const handleRestoreSavedSearch = useCallback(
    (savedQuery: string, savedFilters: SearchFilters) => {
      updateUrl(savedQuery)
      setFilters(savedFilters)
      setSavedSearchesOpen(false)
    },
    [updateUrl]
  )

  const hasActiveFilters = Object.keys(filters).some((k) => {
    const v = filters[k as keyof SearchFilters]
    return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ''
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchBar
            value={query}
            onChange={handleQueryChange}
            recentSearches={recentSearches}
          />
        </div>

        {/* Advanced Filters trigger */}
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button
              variant={hasActiveFilters ? 'default' : 'outline'}
              size="icon"
              aria-label="Advanced filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96">
            <SheetHeader>
              <SheetTitle>Advanced Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <AdvancedFilters filters={filters} onChange={setFilters} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Saved Searches trigger (premium) */}
        <Sheet open={savedSearchesOpen} onOpenChange={setSavedSearchesOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Saved searches">
              <Bookmark className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96">
            <SheetHeader>
              <SheetTitle>Saved Searches</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <SavedSearches
                currentQuery={query}
                currentFilters={filters}
                onRestore={handleRestoreSavedSearch}
                isPremium={entitlements.is_premium}
                maxSaved={entitlements.max_saved_searches}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <FilterChips
          filters={filters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
      )}

      {/* Results */}
      <SearchResults
        query={query}
        tab={tab}
        filters={filters}
        onTabChange={handleTabChange}
        onSearch={recentSearches.add}
      />
    </div>
  )
}
