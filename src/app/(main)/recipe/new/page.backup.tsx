import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RecipeForm } from '@/components/recipe/form/RecipeForm'
import { ROUTES } from '@/lib/constants/routes'
import { parseRecipeItems } from '@/lib/utils/recipe'
import type { RecipeFormValues } from '@/types/recipe'
import { PageWrapper } from '@/components/layout/PageWrapper'

interface Props {
  searchParams: Promise<{ remix?: string }>
}

export const metadata = {
  title: 'New Recipe — Forkd',
}

export default async function NewRecipePage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  const { remix } = await searchParams

  let initialValues: Partial<RecipeFormValues> | undefined
  let parentTitle: string | undefined

  if (remix) {
    const { data: parent } = await supabase
      .from('recipes_visible')
      .select('*')
      .eq('id', remix)
      .single()

    if (parent) {
      parentTitle = parent.title ?? undefined
      initialValues = {
        title: `${parent.title ?? ''} (remix)`,
        photos: [], // don't copy photos
        servings: parent.servings ?? null,
        prep_time_minutes: null,
        cook_time_minutes: null,
        difficulty: (parent.difficulty as RecipeFormValues['difficulty']) ?? null,
        visibility: 'public',
        cuisine_primary: parent.cuisine_primary ?? null,
        cuisine_secondary: parent.cuisine_secondary ?? [],
        dietary: parent.dietary ?? [],
        contains_allergens: parent.contains_allergens ?? [],
        meal_types: parent.meal_types ?? [],
        dish_types: parent.dish_types ?? [],
        main_ingredients: parent.main_ingredients ?? [],
        methods: parent.methods ?? [],
        spice_level: parent.spice_level ?? null,
        flavor_notes: parent.flavor_notes ?? [],
        occasions: parent.occasions ?? [],
        ingredients: parseRecipeItems(parent.ingredients),
        instructions: parseRecipeItems(parent.steps ?? null),
        parent_id: remix,
      }
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <div className="px-4 pt-6 pb-2">
          <h1 className="text-2xl font-bold">
            {remix ? 'Remix Recipe' : 'New Recipe'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {remix
              ? 'Put your own spin on this recipe.'
              : 'Share your creation with the Forkd community.'}
          </p>
        </div>

        <RecipeForm
          initialValues={initialValues}
          remixedFrom={remix}
          parentTitle={parentTitle}
        />
      </div>
    </PageWrapper>
  )
}
