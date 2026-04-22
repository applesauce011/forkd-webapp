import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CookModeShell } from "@/components/recipe/cook-mode/CookModeShell";
import { ROUTES } from "@/lib/constants/routes";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: recipe } = await supabase
    .from("recipes_visible")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: recipe ? `Cook: ${recipe.title} — Fork'd` : "Cook Mode — Fork'd",
  };
}

export default async function CookModePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Require authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Fetch the recipe
  const { data: recipe } = await supabase
    .from("recipes_visible")
    .select("id, title, servings, steps, ingredients")
    .eq("id", id)
    .single();

  if (!recipe) notFound();

  return (
    <CookModeShell
      recipe={{
        id: recipe.id!,
        title: recipe.title!,
        servings: recipe.servings,
        steps: recipe.steps!,
        ingredients: recipe.ingredients!,
      }}
    />
  );
}
