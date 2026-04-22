'use client'

import { useCallback } from 'react'
import type { RecipeFormValues } from '@/types/recipe'

const DRAFT_KEY = 'forkd_recipe_draft_v1'

export type RecipeDraftData = Partial<RecipeFormValues> & {
  savedAt: string
  recipeId: string
}

export function useDraftRecipe() {
  const saveDraft = useCallback(
    (values: Partial<RecipeFormValues>, recipeId: string) => {
      try {
        const draft: RecipeDraftData = {
          ...values,
          savedAt: new Date().toISOString(),
          recipeId,
        }
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
      } catch {
        // localStorage may be unavailable
      }
    },
    []
  )

  const loadDraft = useCallback((): RecipeDraftData | null => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return null
      return JSON.parse(raw) as RecipeDraftData
    } catch {
      return null
    }
  }, [])

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      // ignore
    }
  }, [])

  const hasDraft = useCallback((): boolean => {
    try {
      return !!localStorage.getItem(DRAFT_KEY)
    } catch {
      return false
    }
  }, [])

  return { saveDraft, loadDraft, clearDraft, hasDraft }
}
