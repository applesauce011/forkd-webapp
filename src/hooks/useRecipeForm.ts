'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { RecipeFormValues } from '@/types/recipe'

export const recipeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  ingredients: z.array(z.any()).min(1, 'At least one ingredient is required'),
  instructions: z.array(z.any()).min(1, 'At least one instruction step is required'),
  photos: z.array(z.string()).default([]),
  servings: z.number().min(1).max(999).nullable().optional(),
  prep_time_minutes: z.number().min(0).nullable().optional(),
  cook_time_minutes: z.number().min(0).nullable().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).nullable().optional(),
  visibility: z.enum(['public', 'private']).default('public'),
  cuisine_primary: z.string().nullable().optional(),
  cuisine_secondary: z.array(z.string()).default([]),
  dietary: z.array(z.string()).default([]),
  contains_allergens: z.array(z.string()).default([]),
  meal_types: z.array(z.string()).default([]),
  dish_types: z.array(z.string()).default([]),
  main_ingredients: z.array(z.string()).default([]),
  methods: z.array(z.string()).default([]),
  spice_level: z.string().nullable().optional(),
  flavor_notes: z.array(z.string()).default([]),
  occasions: z.array(z.string()).default([]),
  parent_id: z.string().uuid().nullable().optional(),
})

export type RecipeSchema = z.infer<typeof recipeSchema>
type RecipeInput = z.input<typeof recipeSchema>

export function useRecipeForm(initialValues?: Partial<RecipeFormValues>) {
  const form = useForm<RecipeInput, unknown, RecipeSchema>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      ingredients: [],
      instructions: [],
      photos: [],
      servings: null,
      prep_time_minutes: null,
      cook_time_minutes: null,
      difficulty: null,
      visibility: 'public',
      cuisine_primary: null,
      cuisine_secondary: [],
      dietary: [],
      contains_allergens: [],
      meal_types: [],
      dish_types: [],
      main_ingredients: [],
      methods: [],
      spice_level: null,
      flavor_notes: [],
      occasions: [],
      parent_id: null,
      ...initialValues,
    },
  })

  return form
}
