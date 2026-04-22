'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ChefHat } from 'lucide-react'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { RecipeBadge } from '@/components/shared/RecipeBadge'
import { ROUTES } from '@/lib/constants/routes'
import { CUISINE_TAGS } from '@/lib/constants/tags'
import { cn } from '@/lib/utils/cn'

type RecipeResult = {
  id: string
  title: string
  recipe_photos: { url: string; position: number }[] | null
  cuisine_primary: string | null
  dietary: string[] | null
  author_id: string | null
}

type AuthorInfo = {
  username: string | null
  display_name: string | null
  avatar_source: string | null
  avatar_placeholder_key: string | null
  avatar_custom_path: string | null
} | null

interface RecipeSearchResultProps {
  recipe: RecipeResult
  author: AuthorInfo
  className?: string
}

function getCuisineLabel(value: string | null): string | null {
  if (!value) return null
  return CUISINE_TAGS.find((t) => t.value === value)?.label ?? value
}

export function RecipeSearchResult({ recipe, author, className }: RecipeSearchResultProps) {
  const photoUrl = recipe.recipe_photos && recipe.recipe_photos.length > 0
    ? [...recipe.recipe_photos].sort((a, b) => a.position - b.position)[0].url
    : null
  const cuisineLabel = getCuisineLabel(recipe.cuisine_primary)

  return (
    <Link
      href={ROUTES.RECIPE(recipe.id)}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm hover:bg-accent/5 transition-all',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden bg-muted">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={recipe.title ?? ''}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm leading-tight line-clamp-2 mb-1">
          {recipe.title}
        </h3>

        {/* Author */}
        {author && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <UserAvatar profile={author} size="sm" className="h-5 w-5 text-[10px]" />
            <span className="text-xs text-muted-foreground truncate">
              {author.display_name || author.username}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1">
          {cuisineLabel && (
            <RecipeBadge label={cuisineLabel} variant="cuisine" />
          )}
          {recipe.dietary?.slice(0, 2).map((tag) => (
            <RecipeBadge
              key={tag}
              label={tag.replace(/_/g, ' ')}
              variant="dietary"
            />
          ))}
        </div>
      </div>
    </Link>
  )
}
