import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RecipeForm } from '@/components/recipe/form/RecipeForm'
import { ROUTES } from '@/lib/constants/routes'
import { parseRecipeItems } from '@/lib/utils/recipe'
import type { RecipeFormValues } from '@/types/recipe'
import { PageWrapper } from '@/components/layout/PageWrapper'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: "Edit Recipe — Fork'd",
}

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  const { data: recipe } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()

  if (!recipe) notFound()

  // Only the author can edit
  if (recipe.author_id !== user.id) {
    redirect(ROUTES.FEED)
  }

  const initialValues: Partial<RecipeFormValues> = {
    title: recipe.title,
    photos: recipe.photos ?? [],
    servings: recipe.servings ?? null,
    prep_time_minutes: recipe.prep_time_minutes ?? null,
    cook_time_minutes: recipe.cook_time_minutes ?? null,
    difficulty: (recipe.difficulty as RecipeFormValues['difficulty']) ?? null,
    visibility: (recipe.visibility as 'public' | 'private') ?? 'public',
    cuisine_primary: recipe.cuisine_primary ?? null,
    cuisine_secondary: recipe.cuisine_secondary ?? [],
    dietary: recipe.dietary ?? [],
    contains_allergens: recipe.contains_allergens ?? [],
    meal_types: recipe.meal_types ?? [],
    dish_types: recipe.dish_types ?? [],
    main_ingredients: recipe.main_ingredients ?? [],
    methods: recipe.methods ?? [],
    spice_level: recipe.spice_level ?? null,
    flavor_notes: recipe.flavor_notes ?? [],
    occasions: recipe.occasions ?? [],
    ingredients: parseRecipeItems(recipe.ingredients),
    instructions: parseRecipeItems(recipe.steps ?? null),
    parent_id: recipe.parent_id ?? null,
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <div className="px-4 pt-6 pb-2">
          <h1 className="text-2xl font-bold">Edit Recipe</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update your recipe details below.
          </p>
        </div>

        <RecipeForm
          initialValues={initialValues}
          recipeId={id}
        />
      </div>
    </PageWrapper>
  )
}
