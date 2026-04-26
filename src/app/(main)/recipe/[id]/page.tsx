import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseRecipeItems } from "@/lib/utils/recipe";
import { toRecipeSlug, extractUUIDFromSlug, isUUID } from "@/lib/utils/recipe-slug";
import { RecipeHero } from "@/components/recipe/detail/RecipeHero";
import { RecipeMeta } from "@/components/recipe/detail/RecipeMeta";
import { RecipeTags } from "@/components/recipe/detail/RecipeTags";
import { IngredientsList } from "@/components/recipe/detail/IngredientsList";
import { InstructionsList } from "@/components/recipe/detail/InstructionsList";
import { RecipeActions } from "@/components/recipe/detail/RecipeActions";
import { RecipeViewGate } from "@/components/recipe/detail/RecipeViewGate";
import { PageWrapper } from "@/components/layout/PageWrapper";

interface Props {
  params: Promise<{ id: string }>;
}

function buildRecipeDescription(
  title: string,
  authorName: string | null | undefined,
  cuisine: string | null | undefined,
  totalMinutes: number | null | undefined,
  servings: number | null | undefined,
  mainIngredients: string[] | null | undefined,
): string {
  let desc = `${title} recipe by ${authorName ?? "a Fork'd cook"}`;
  if (cuisine) desc += `. ${cuisine} dish`;
  if (totalMinutes) desc += ` that takes ${totalMinutes} minutes`;
  if (servings) desc += ` and serves ${servings}`;
  const top = (mainIngredients ?? []).slice(0, 3);
  if (top.length > 0) desc += `. Made with ${top.join(", ")}`;
  return desc + ".";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: rawParam } = await params;

  let recipeId: string;
  if (isUUID(rawParam)) {
    recipeId = rawParam;
  } else {
    const uuid = extractUUIDFromSlug(rawParam);
    if (!uuid) return { title: "Recipe Not Found" };
    recipeId = uuid;
  }

  const supabase = await createClient();
  const { data: recipe } = await supabase
    .from("recipes_visible")
    .select("title, cuisine_primary, total_time_minutes, servings, main_ingredients, recipe_photos(url, position), profiles!recipes_author_fk(display_name, username)")
    .eq("id", recipeId)
    .single();

  if (!recipe) return { title: "Recipe Not Found" };

  const photos = Array.isArray(recipe.recipe_photos) ? recipe.recipe_photos : [];
  const photoUrl = photos.length > 0
    ? [...photos].sort((a, b) => a.position - b.position)[0].url
    : undefined;
  const author = Array.isArray(recipe.profiles) ? recipe.profiles[0] : recipe.profiles;

  const title = recipe.title ?? "Recipe";
  const description = buildRecipeDescription(
    title,
    author?.display_name,
    recipe.cuisine_primary,
    recipe.total_time_minutes,
    recipe.servings,
    recipe.main_ingredients as string[] | null,
  );
  const canonicalSlug = toRecipeSlug(title, recipeId);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: photoUrl ? [{ url: photoUrl, width: 1200, height: 630, alt: title }] : [],
      type: "article",
      authors: author?.display_name ? [author.display_name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: photoUrl ? [photoUrl] : [],
    },
    alternates: {
      canonical: `/recipe/${canonicalSlug}`,
    },
  };
}

export default async function RecipeDetailPage({ params }: Props) {
  const { id: rawParam } = await params;
  const supabase = await createClient();

  // Resolve UUID from the URL param (supports both bare UUID and slug form)
  let recipeId: string;
  if (isUUID(rawParam)) {
    recipeId = rawParam;
  } else {
    const uuid = extractUUIDFromSlug(rawParam);
    if (!uuid) notFound();
    recipeId = uuid!;
  }

  // Fetch recipe with author (stats fetched separately below)
  const { data: recipe } = await supabase
    .from("recipes_visible")
    .select(`
      *,
      profiles!recipes_author_fk(id, username, display_name, avatar_source, avatar_placeholder_key, avatar_custom_path, is_founding_cook, is_premium),
      recipe_photos(id, url, position)
    `)
    .eq("id", recipeId)
    .single();

  if (!recipe) notFound();

  // After notFound() guard, core fields are guaranteed to be non-null
  const r = recipe as typeof recipe & {
    id: string;
    title: string;
    created_at: string;
    author_id: string;
    prep_time_minutes?: number | null;
    cook_time_minutes?: number | null;
    recipe_photos: { id: string; url: string; position: number }[] | null;
  };

  // Redirect bare UUID URLs to the SEO-friendly slug form (308 Permanent)
  if (isUUID(rawParam)) {
    permanentRedirect(`/recipe/${toRecipeSlug(r.title, r.id)}`);
  }

  const { data: { user } } = await supabase.auth.getUser();

  let userCooked = false;
  let userRating: number | null = null;

  const [allRatingsRes, cookedRes, userRatingRes] = await Promise.all([
    supabase.from("recipe_ratings").select("rating").eq("recipe_id", recipeId),
    user ? supabase.from("cooked_recipes").select("recipe_id").eq("user_id", user.id).eq("recipe_id", recipeId).maybeSingle() : null,
    user ? supabase.from("recipe_ratings").select("rating").eq("user_id", user.id).eq("recipe_id", recipeId).maybeSingle() : null,
  ]);

  const ratingsCount = allRatingsRes.data?.length ?? 0;
  const averageRating = ratingsCount > 0
    ? allRatingsRes.data!.reduce((sum, row) => sum + row.rating, 0) / ratingsCount
    : null;
  userCooked = !!cookedRes?.data;
  userRating = userRatingRes?.data?.rating ?? null;

  // Fetch parent recipe if this is a remix
  let parentRecipe: { id: string; title: string } | null = null;
  if (r.parent_id) {
    const { data: parent } = await supabase
      .from("recipes_visible")
      .select("id, title")
      .eq("id", r.parent_id)
      .single();
    if (parent?.id && parent?.title) {
      parentRecipe = { id: parent.id, title: parent.title };
    }
  }

  // Fetch stats via RPC (SECURITY DEFINER) so RLS doesn't filter out other users' stats
  const { data: statsData } = await supabase.rpc("get_recipe_stats_batch", { p_recipe_ids: [recipeId] });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statsRow = ((statsData as any[])?.[0] ?? null) as import("@/types/app").RecipeStat | null;

  const author = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
  const stats = statsRow ?? null;

  const photos = Array.isArray(r.recipe_photos) ? r.recipe_photos : (r.recipe_photos ? [r.recipe_photos] : []);
  const sortedPhotos = [...photos].sort((a, b) => a.position - b.position);

  // Parse ingredients and steps for JSON-LD (full content for search engines)
  const ingredientItems = parseRecipeItems(r.ingredients as string | null);
  const stepItems = parseRecipeItems(r.steps as string | null);

  const mainIngredients = (r as unknown as { main_ingredients?: string[] }).main_ingredients;
  const dishTypes = (r as unknown as { dish_types?: string[] }).dish_types;
  const mealTypes = (r as unknown as { meal_types?: string[] }).meal_types;
  const dietary = (r as unknown as { dietary?: string[] }).dietary;
  const methods = (r as unknown as { methods?: string[] }).methods;
  const flavorNotes = (r as unknown as { flavor_notes?: string[] }).flavor_notes;

  const description = buildRecipeDescription(
    r.title,
    author?.display_name,
    r.cuisine_primary,
    r.total_time_minutes,
    r.servings,
    mainIngredients,
  );

  const canonicalSlug = toRecipeSlug(r.title, r.id);

  const keywords = [
    ...(mainIngredients ?? []),
    ...(dietary ?? []),
    ...(methods ?? []),
    ...(flavorNotes ?? []),
  ].filter(Boolean).join(", ") || undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: r.title,
    description,
    author: { "@type": "Person", name: author?.display_name ?? author?.username },
    datePublished: r.created_at,
    image: sortedPhotos.length > 0 ? sortedPhotos.map((p) => p.url) : undefined,
    prepTime: r.prep_time_minutes ? `PT${r.prep_time_minutes}M` : undefined,
    cookTime: r.cook_time_minutes ? `PT${r.cook_time_minutes}M` : undefined,
    totalTime: r.total_time_minutes ? `PT${r.total_time_minutes}M` : undefined,
    recipeYield: r.servings ? `${r.servings} servings` : undefined,
    recipeCuisine: r.cuisine_primary ?? undefined,
    recipeCategory: dishTypes?.[0] ?? mealTypes?.[0] ?? undefined,
    keywords,
    recipeIngredient: ingredientItems
      .filter((i) => i.type === "item")
      .map((i) => i.text),
    recipeInstructions: stepItems
      .filter((i) => i.type === "item")
      .map((item, idx) => ({
        "@type": "HowToStep",
        position: idx + 1,
        text: item.text,
      })),
    aggregateRating: ratingsCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: averageRating!.toFixed(1),
      ratingCount: ratingsCount,
    } : undefined,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Fork'd", item: "https://forkd.app" },
      { "@type": "ListItem", position: 2, name: "Recipes", item: "https://forkd.app/feed" },
      { "@type": "ListItem", position: 3, name: r.title, item: `https://forkd.app/recipe/${canonicalSlug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="max-w-5xl mx-auto pb-8">
        {/* Hero photo */}
        <RecipeHero
          recipe={r}
          author={author}
          userId={user?.id}
        />

        <div className="px-4 py-6">
          {/* Meta + Actions + Tags — narrower on desktop */}
          <div className="max-w-3xl mx-auto">
            {/* Meta bar */}
            <RecipeMeta recipe={r} averageRating={averageRating} ratingsCount={ratingsCount} />

            {/* Actions */}
            <RecipeActions
              recipe={r}
              stats={stats}
              userId={user?.id}
              initialLiked={false}
              initialBookmarked={false}
              initialCooked={userCooked}
              initialRating={userRating}
            />

            {/* Tags */}
            <RecipeTags recipe={r} />

            {/* Remix banner */}
            {parentRecipe && (
              <div className="my-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-sm">
                🔀 Remixed from{" "}
                <a href={`/recipe/${parentRecipe.id}`} className="text-primary font-medium hover:underline">
                  {parentRecipe.title}
                </a>
              </div>
            )}
          </div>

          {/* Ingredients + Instructions gated for unauthenticated users and daily limit for free users */}
          <RecipeViewGate recipeId={recipeId} userId={user?.id}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2 max-w-5xl mx-auto">
              <div className="lg:border-r lg:pr-8">
                <IngredientsList ingredients={r.ingredients} servings={r.servings} />
              </div>
              <div>
                <InstructionsList instructions={r.steps} />
              </div>
            </div>


          </RecipeViewGate>
        </div>
      </div>
    </>
  );
}
