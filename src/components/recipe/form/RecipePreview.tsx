'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { RecipeSchema } from '@/hooks/useRecipeForm'
import { getRecipePhotoUrl } from '@/lib/utils/image'
import { parseRecipeItems } from '@/lib/utils/recipe'
import type { RecipeItem } from '@/types/recipe'
import { Clock, Users, ChefHat } from 'lucide-react'
import Image from 'next/image'

interface RecipePreviewProps {
  open: boolean
  onClose: () => void
  values: RecipeSchema
}

export function RecipePreview({ open, onClose, values }: RecipePreviewProps) {
  const photoUrl = values.photos?.[0] ? getRecipePhotoUrl(values.photos[0]) : null

  const ingredients = (values.ingredients ?? []) as RecipeItem[]
  const instructions = (values.instructions ?? []) as string[]

  const totalMinutes =
    (values.prep_time_minutes ?? 0) + (values.cook_time_minutes ?? 0)

  function formatTime(minutes: number | null | undefined): string | null {
    if (!minutes) return null
    if (minutes < 60) return `${minutes}m`
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Recipe Preview</SheetTitle>
        </SheetHeader>

        <div className="pb-12">
          {/* Cover photo */}
          {photoUrl ? (
            <div className="relative w-full aspect-video">
              <Image
                src={photoUrl}
                alt={values.title || 'Recipe'}
                fill
                className="object-cover"
                sizes="672px"
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-muted flex items-center justify-center">
              <ChefHat className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}

          <div className="px-6 pt-6 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold">{values.title || 'Untitled Recipe'}</h1>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {values.prep_time_minutes && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Prep: {formatTime(values.prep_time_minutes)}</span>
                </div>
              )}
              {values.cook_time_minutes && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Cook: {formatTime(values.cook_time_minutes)}</span>
                </div>
              )}
              {totalMinutes > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Total: {formatTime(totalMinutes)}</span>
                </div>
              )}
              {values.servings && (
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>{values.servings} servings</span>
                </div>
              )}
              {values.difficulty && (
                <div className="flex items-center gap-1.5">
                  <ChefHat className="h-4 w-4" />
                  <span>{values.difficulty}</span>
                </div>
              )}
            </div>

            {/* Ingredients */}
            {ingredients.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Ingredients</h2>
                <ul className="space-y-1.5">
                  {ingredients.map((item, i) => {
                    if (item.type === 'heading') {
                      return (
                        <li key={i} className="font-semibold text-sm mt-3 first:mt-0">
                          {item.text}
                        </li>
                      )
                    }
                    return (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground mt-0.5">•</span>
                        <span>{item.text}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Instructions */}
            {instructions.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Instructions</h2>
                <ol className="space-y-3">
                  {instructions.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold mt-0.5">
                        {i + 1}
                      </span>
                      <span className="flex-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
