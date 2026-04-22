import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: recipe } = await supabase
    .from("recipes_visible")
    .select("title, cuisine_primary, total_time_minutes, servings, recipe_photos(url, position), profiles!recipes_author_fk(display_name, username)")
    .eq("id", id)
    .single();

  if (!recipe) return { title: "Recipe Not Found" };

  const photos = Array.isArray(recipe.recipe_photos) ? recipe.recipe_photos : [];
  const photoUrl = photos.length > 0
    ? [...photos].sort((a, b) => a.position - b.position)[0].url
    : undefined;
  const author = Array.isArray(recipe.profiles) ? recipe.profiles[0] : recipe.profiles;

  const parts: string[] = [`By ${author?.display_name ?? "a Fork'd cook"}`];
  if (recipe.cuisine_primary) parts.push(recipe.cuisine_primary);
  if (recipe.total_time_minutes) parts.push(`${recipe.total_time_minutes} min`);
  if (recipe.servings) parts.push(`serves ${recipe.servings}`);
  const description = parts.join(" · ");

  const title = recipe.title ?? "Recipe";

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
      canonical: `/recipe/${id}`,
    },
  };
}

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch recipe with author (stats fetched separately below)
  const { data: recipe } = await supabase
    .from("recipes_visible")
    .select(`
      *,
      profiles!recipes_author_fk(id, username, display_name, avatar_source, avatar_placeholder_key, avatar_custom_path, is_founding_cook, is_premium),
      recipe_photos(id, url, position)
    `)
    .eq("id", id)
    .single();

  if (!recipe) notFound();

  // After notFound() guard, core fields are guaranteed to be non-null
  const r = recipe as typeof recipe & {
    id: string;
    title: string;
    created_at: string;
    author_id: string;
    recipe_photos: { id: string; url: string; position: number }[] | null;
  };

  const { data: { user } } = await supabase.auth.getUser();

  let userCooked = false;
  let userRating: number | null = null;

  const [allRatingsRes, cookedRes, userRatingRes] = await Promise.all([
    supabase.from("recipe_ratings").select("rating").eq("recipe_id", id),
    user ? supabase.from("cooked_recipes").select("recipe_id").eq("user_id", user.id).eq("recipe_id", id).maybeSingle() : null,
    user ? supabase.from("recipe_ratings").select("rating").eq("user_id", user.id).eq("recipe_id", id).maybeSingle() : null,
  ]);

  const ratingsCount = allRatingsRes.data?.length ?? 0;
  const averageRating = ratingsCount > 0
    ? allRatingsRes.data!.reduce((sum, r) => sum + r.rating, 0) / ratingsCount
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
  const { data: statsData } = await supabase.rpc("get_recipe_stats_batch", { p_recipe_ids: [id] });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statsRow = ((statsData as any[])?.[0] ?? null) as import("@/types/app").RecipeStat | null;

  const author = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
  const stats = statsRow ?? null;

  const photos = Array.isArray(r.recipe_photos) ? r.recipe_photos : (r.recipe_photos ? [r.recipe_photos] : []);
  const firstPhoto = [...photos].sort((a, b) => a.position - b.position)[0]?.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: r.title,
    author: { "@type": "Person", name: author?.display_name ?? author?.username },
    datePublished: r.created_at,
    image: firstPhoto ? [firstPhoto] : undefined,
    recipeYield: r.servings ? `${r.servings} servings` : undefined,
    totalTime: r.total_time_minutes ? `PT${r.total_time_minutes}M` : undefined,
    recipeCuisine: r.cuisine_primary ?? undefined,
    aggregateRating: ratingsCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: averageRating!.toFixed(1),
      ratingCount: ratingsCount,
    } : undefined,
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        <RecipeViewGate recipeId={id} userId={user?.id}>
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
