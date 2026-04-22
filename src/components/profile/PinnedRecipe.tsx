import { Pin } from "lucide-react";
import { RecipeCard } from "@/components/feed/RecipeCard";
import type { RecipeWithAuthor } from "@/types/app";

interface PinnedRecipeProps {
  recipe: RecipeWithAuthor | null;
}

export function PinnedRecipe({ recipe }: PinnedRecipeProps) {
  if (!recipe) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
        <Pin className="h-3.5 w-3.5" />
        <span>Pinned recipe</span>
      </div>
      <RecipeCard recipe={recipe} />
    </div>
  );
}
