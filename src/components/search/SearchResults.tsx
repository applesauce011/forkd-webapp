'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutList, LayoutGrid } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { RecipeSearchResult } from '@/components/search/RecipeSearchResult'
import { PeopleSearchResult } from '@/components/search/PeopleSearchResult'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { RecipeBadge } from '@/components/shared/RecipeBadge'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useEntitlements } from '@/hooks/useEntitlements'
import { useSupabaseContext } from '@/contexts/SupabaseContext'
import { ROUTES } from '@/lib/constants/routes'
import { CUISINE_TAGS } from '@/lib/constants/tags'
import type { SearchFilters } from '@/components/search/SearchPageClient'

type RecipeResult = {
  id: string
  title: string
  recipe_photos: { url: string; position: number }[] | null
  cuisine_primary: string | null
  dietary: string[] | null
  author_id: string | null
}

type ProfileResult = {
  id: string | null
  username: string | null
  display_name: string | null
  avatar_source: string | null
  avatar_placeholder_key: string | null
  avatar_custom_path: string | null
  bio: string | null
  is_founding_cook: boolean | null
  is_premium: boolean | null
}

type AuthorMap = Record<
  string,
  {
    username: string | null
    display_name: string | null
    avatar_source: string | null
    avatar_placeholder_key: string | null
    avatar_custom_path: string | null
  }
>

interface SearchResultsProps {
  query: string
  tab: 'recipes' | 'people'
  filters: SearchFilters
  onTabChange: (tab: 'recipes' | 'people') => void
  onSearch?: (q: string) => void
}

function getCuisineLabel(value: string | null): string | null {
  if (!value) return null
  return CUISINE_TAGS.find((t) => t.value === value)?.label ?? value
}

function ResultsListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
          <Skeleton className="h-20 w-20 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ResultsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border p-1.5">
          <Skeleton className="w-full aspect-square rounded-xl" />
          <div className="p-2 space-y-1.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function RecipeGridCard({ recipe, author }: { recipe: RecipeResult; author: AuthorMap[string] | null }) {
  const photoUrl = recipe.recipe_photos && recipe.recipe_photos.length > 0
    ? [...recipe.recipe_photos].sort((a, b) => a.position - b.position)[0].url
    : null
  const cuisineLabel = getCuisineLabel(recipe.cuisine_primary)

  return (
    <Link
      href={ROUTES.RECIPE(recipe.id)}
      className="block rounded-xl border bg-card hover:shadow-md transition-shadow p-1.5"
    >
      <div className="relative w-full aspect-square bg-muted rounded-xl overflow-hidden">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={recipe.title ?? ''}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🍴</div>
        )}
      </div>
      <div className="p-2 space-y-1.5">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">{recipe.title}</h3>
        {author && (
          <div className="flex items-center gap-1.5">
            <UserAvatar profile={author} size="sm" />
            <span className="text-xs text-muted-foreground truncate">
              {author.display_name || author.username}
            </span>
          </div>
        )}
        {cuisineLabel && (
          <RecipeBadge label={cuisineLabel} variant="cuisine" />
        )}
      </div>
    </Link>
  )
}

// Keep old ResultsSkeleton name so existing code doesn't break
const ResultsSkeleton = ResultsListSkeleton

function PeopleResultsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function SearchResults({
  query,
  tab,
  filters,
  onTabChange,
  onSearch,
}: SearchResultsProps) {
  const entitlements = useEntitlements()
  const { user } = useSupabaseContext()
  const supabase = getSupabaseBrowserClient()

  const isPremium = entitlements.is_premium
  const resultLimit = isPremium ? 50 : entitlements.free_search_results_limit

  const [columns, setColumns] = useState<1 | 3>(3)
  const [recipes, setRecipes] = useState<RecipeResult[]>([])
  const [authors, setAuthors] = useState<AuthorMap>({})
  const [people, setPeople] = useState<ProfileResult[]>([])
  const [loadingRecipes, setLoadingRecipes] = useState(false)
  const [loadingPeople, setLoadingPeople] = useState(false)
  const [recipeTotal, setRecipeTotal] = useState<number | null>(null)
  const [peopleTotal, setPeopleTotal] = useState<number | null>(null)

  // Fetch recipes
  const fetchRecipes = useCallback(async () => {
    if (!query.trim()) {
      setRecipes([])
      setRecipeTotal(null)
      return
    }

    setLoadingRecipes(true)
    try {
      function buildRecipeQuery(useTextSearch: boolean) {
        let q = supabase
          .from('recipes_visible')
          .select('id, title, recipe_photos(url, position), cuisine_primary, dietary, author_id', { count: 'estimated' })

        if (useTextSearch) {
          q = q.textSearch('search_tsv', query, { type: 'websearch', config: 'english' })
        } else {
          q = q.ilike('title', `%${query}%`)
        }

        // Apply filters
        if (filters.cuisine) q = q.eq('cuisine_primary', filters.cuisine)
        if (filters.dietary?.length) q = q.contains('dietary', filters.dietary)
        if (filters.difficulty) q = q.eq('difficulty', filters.difficulty)
        if (filters.max_cook_time) q = q.lte('total_time_minutes', filters.max_cook_time)
        if (filters.meal_types?.length) q = q.overlaps('meal_types', filters.meal_types)
        if (filters.exclude_allergens?.length) {
          for (const allergen of filters.exclude_allergens) {
            q = q.not('contains_allergens', 'cs', `{${allergen}}`)
          }
        }

        return q.limit(resultLimit)
      }

      // Try full-text search first, fall back to ilike on error
      let { data, count, error } = await buildRecipeQuery(true)

      if (error || !data?.length) {
        ;({ data, count, error } = await buildRecipeQuery(false))
      }

      const results = (data ?? []) as RecipeResult[]
      setRecipes(results)
      setRecipeTotal(count ?? null)

      // Fetch authors for the results
      const authorIds = [...new Set(results.map((r) => r.author_id).filter(Boolean))] as string[]
      if (authorIds.length) {
        const { data: profileData } = await supabase
          .from('profiles_visible')
          .select('id, username, display_name, avatar_source, avatar_placeholder_key, avatar_custom_path')
          .in('id', authorIds)

        if (profileData) {
          const map: AuthorMap = {}
          for (const p of profileData) {
            if (p.id) map[p.id] = p
          }
          setAuthors(map)
        }
      }
    } finally {
      setLoadingRecipes(false)
    }
  }, [query, filters, resultLimit, supabase])

  // Fetch people
  const fetchPeople = useCallback(async () => {
    if (!query.trim()) {
      setPeople([])
      setPeopleTotal(null)
      return
    }

    setLoadingPeople(true)
    try {
      const { data, count } = await supabase
        .from('profiles_visible')
        .select(
          'id, username, display_name, avatar_source, avatar_placeholder_key, avatar_custom_path, bio, is_founding_cook, is_premium',
          { count: 'estimated' }
        )
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(isPremium ? 50 : 20)

      setPeople((data ?? []) as ProfileResult[])
      setPeopleTotal(count ?? null)
    } finally {
      setLoadingPeople(false)
    }
  }, [query, supabase, isPremium])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  useEffect(() => {
    fetchPeople()
  }, [fetchPeople])

  // Empty state when no query
  if (!query.trim()) {
    return (
      <EmptyState
        icon="🔍"
        title="Search for recipes, chefs, and more..."
        description="Type something above to find recipes, discover new chefs, and explore the Fork'd community."
      />
    )
  }

  const extraRecipes = recipeTotal != null ? Math.max(0, recipeTotal - recipes.length) : 0

  const isGrid = columns === 3

  return (
    <Tabs value={tab} onValueChange={(v) => onTabChange(v as 'recipes' | 'people')}>
      <div className="flex items-center gap-2 mb-1">
        <TabsList className="flex-1">
          <TabsTrigger value="recipes" className="flex-1">
            Recipes
            {recipeTotal != null && (
              <span className="ml-1.5 text-xs opacity-70">
                ({recipeTotal > resultLimit ? `${resultLimit}+` : recipeTotal})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="people" className="flex-1">
            People
            {peopleTotal != null && (
              <span className="ml-1.5 text-xs opacity-70">({peopleTotal})</span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Layout toggle (only visible on recipes tab) */}
        {tab === 'recipes' && (
          <div className="flex items-center border rounded-lg overflow-hidden shrink-0">
            <button
              onClick={() => setColumns(1)}
              className={`p-2 transition-colors ${columns === 1 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
              title="List view"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setColumns(3)}
              className={`p-2 transition-colors ${columns === 3 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Recipes tab */}
      <TabsContent value="recipes" className="mt-4">
        {loadingRecipes ? (
          isGrid ? <ResultsGridSkeleton /> : <ResultsSkeleton />
        ) : recipes.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="No recipes found"
            description={`We couldn't find any recipes matching "${query}". Try different keywords.`}
          />
        ) : (
          <>
            {isGrid ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {recipes.map((recipe) => (
                  <RecipeGridCard
                    key={recipe.id}
                    recipe={recipe}
                    author={recipe.author_id ? authors[recipe.author_id] ?? null : null}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {recipes.map((recipe) => (
                  <RecipeSearchResult
                    key={recipe.id}
                    recipe={recipe}
                    author={recipe.author_id ? authors[recipe.author_id] ?? null : null}
                  />
                ))}
              </div>
            )}

            {/* Soft gate for free users */}
            {!isPremium && extraRecipes > 0 && (
              <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 text-center">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  {extraRecipes} more result{extraRecipes !== 1 ? 's' : ''} available
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Upgrade to Premium to see all search results
                </p>
                <Button asChild size="sm" className="mt-3">
                  <Link href={ROUTES.UPGRADE}>Upgrade to Premium</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </TabsContent>

      {/* People tab */}
      <TabsContent value="people" className="mt-4">
        {loadingPeople ? (
          <PeopleResultsSkeleton />
        ) : people.length === 0 ? (
          <EmptyState
            icon="👩‍🍳"
            title="No people found"
            description={`No chefs or users matching "${query}". Try searching by username or display name.`}
          />
        ) : (
          <div className="space-y-2">
            {people.map((person) => (
              <PeopleSearchResult
                key={person.id}
                profile={person}
                currentUserId={user?.id ?? null}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
