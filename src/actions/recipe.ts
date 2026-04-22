'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { RecipeFormValues } from '@/types/recipe'

export async function createRecipe(
  data: RecipeFormValues & { id: string }
): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const totalTime =
    (data.prep_time_minutes ?? 0) + (data.cook_time_minutes ?? 0) || null

  const { data: recipe, error } = await supabase
    .from('recipes')
    .insert({
      id: data.id,
      author_id: user.id,
      title: data.title,
      photos: data.photos ?? [],
      prep_time_minutes: data.prep_time_minutes ?? null,
      cook_time_minutes: data.cook_time_minutes ?? null,
      total_time_minutes: totalTime,
      servings: data.servings ?? null,
      difficulty: data.difficulty ?? null,
      visibility: data.visibility ?? 'public',
      cuisine_primary: data.cuisine_primary ?? null,
      cuisine_secondary: data.cuisine_secondary ?? [],
      dietary: data.dietary ?? [],
      contains_allergens: data.contains_allergens ?? [],
      meal_types: data.meal_types ?? [],
      dish_types: data.dish_types ?? [],
      main_ingredients: data.main_ingredients ?? [],
      methods: data.methods ?? [],
      spice_level: data.spice_level ?? null,
      flavor_notes: data.flavor_notes ?? [],
      occasions: data.occasions ?? [],
      ingredients: JSON.stringify(data.ingredients),
      steps: JSON.stringify(data.instructions),
      parent_id: data.parent_id ?? null,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  return { id: recipe.id }
}

export async function updateRecipe(
  id: string,
  data: Partial<RecipeFormValues>
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const updatePayload: {
    title?: string
    photos?: string[]
    prep_time_minutes?: number | null
    cook_time_minutes?: number | null
    total_time_minutes?: number | null
    servings?: number | null
    difficulty?: string | null
    visibility?: string
    cuisine_primary?: string | null
    cuisine_secondary?: string[]
    dietary?: string[]
    contains_allergens?: string[]
    meal_types?: string[]
    dish_types?: string[]
    main_ingredients?: string[]
    methods?: string[]
    spice_level?: string | null
    flavor_notes?: string[]
    occasions?: string[]
    ingredients?: string
    steps?: string
  } = {}

  if (data.title !== undefined) updatePayload.title = data.title
  if (data.photos !== undefined) updatePayload.photos = data.photos
  if (data.prep_time_minutes !== undefined) updatePayload.prep_time_minutes = data.prep_time_minutes
  if (data.cook_time_minutes !== undefined) updatePayload.cook_time_minutes = data.cook_time_minutes
  if (data.prep_time_minutes !== undefined || data.cook_time_minutes !== undefined) {
    updatePayload.total_time_minutes =
      (data.prep_time_minutes ?? 0) + (data.cook_time_minutes ?? 0) || null
  }
  if (data.servings !== undefined) updatePayload.servings = data.servings
  if (data.difficulty !== undefined) updatePayload.difficulty = data.difficulty
  if (data.visibility !== undefined) updatePayload.visibility = data.visibility
  if (data.cuisine_primary !== undefined) updatePayload.cuisine_primary = data.cuisine_primary
  if (data.cuisine_secondary !== undefined) updatePayload.cuisine_secondary = data.cuisine_secondary
  if (data.dietary !== undefined) updatePayload.dietary = data.dietary
  if (data.contains_allergens !== undefined) updatePayload.contains_allergens = data.contains_allergens
  if (data.meal_types !== undefined) updatePayload.meal_types = data.meal_types
  if (data.dish_types !== undefined) updatePayload.dish_types = data.dish_types
  if (data.main_ingredients !== undefined) updatePayload.main_ingredients = data.main_ingredients
  if (data.methods !== undefined) updatePayload.methods = data.methods
  if (data.spice_level !== undefined) updatePayload.spice_level = data.spice_level
  if (data.flavor_notes !== undefined) updatePayload.flavor_notes = data.flavor_notes
  if (data.occasions !== undefined) updatePayload.occasions = data.occasions
  if (data.ingredients !== undefined) updatePayload.ingredients = JSON.stringify(data.ingredients)
  if (data.instructions !== undefined) updatePayload.steps = JSON.stringify(data.instructions)

  const { error } = await supabase
    .from('recipes')
    .update(updatePayload)
    .eq('id', id)
    .eq('author_id', user.id)

  if (error) return { error: error.message }

  revalidatePath(`/recipe/${id}`)
  return {}
}

export async function deleteRecipe(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Fetch photos first so we can clean up storage
  const { data: recipe } = await supabase
    .from('recipes')
    .select('photos, author_id')
    .eq('id', id)
    .single()

  if (!recipe) return { error: 'Recipe not found' }
  if (recipe.author_id !== user.id) return { error: 'Forbidden' }

  // Delete photos from storage
  if (recipe.photos && recipe.photos.length > 0) {
    await supabase.storage.from('recipe-photos').remove(recipe.photos)
  }

  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
    .eq('author_id', user.id)

  if (error) return { error: error.message }
  return {}
}

export async function publishRecipe(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('recipes')
    .update({ visibility: 'public' })
    .eq('id', id)
    .eq('author_id', user.id)

  if (error) return { error: error.message }

  revalidatePath(`/recipe/${id}`)
  return {}
}
