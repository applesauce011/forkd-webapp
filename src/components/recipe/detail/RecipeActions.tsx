"use client";

import { useState } from "react";
import { ChefHat, Star, Share2 } from "lucide-react";
import { toast } from "sonner";
import { AuthGateModal } from "@/components/auth/AuthGateModal";
import { RatingWidget } from "@/components/recipe/detail/RatingWidget";
import { useSupabaseContext } from "@/contexts/SupabaseContext";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import type { RecipeStat } from "@/types/app";

interface RecipeActionsProps {
  recipe: { id: string; author_id: string };
  stats: RecipeStat | null;
  userId?: string;
  initialLiked: boolean;
  initialBookmarked: boolean;
  initialCooked: boolean;
  initialRating: number | null;
}

export function RecipeActions({
  recipe,
  userId,
  initialCooked,
  initialRating,
}: RecipeActionsProps) {
  const { supabase } = useSupabaseContext();
  const [cooked, setCooked] = useState(initialCooked);
  const [rating, setRating] = useState<number | null>(initialRating);
  const [authOpen, setAuthOpen] = useState(false);
  const [showRating, setShowRating] = useState(false);

  async function markCooked() {
    if (!userId) {
      setAuthOpen(true);
      return;
    }
    if (cooked) {
      setShowRating(true);
      return;
    }
    const { error } = await supabase.from("cooked_recipes").upsert({
      user_id: userId,
      recipe_id: recipe.id,
      cooked_at: new Date().toISOString(),
    });
    if (error) { toast.error("Failed to mark as cooked"); return; }

    await supabase.from("cooked_recipe_events").insert({
      user_id: userId,
      recipe_id: recipe.id,
      cooked_at: new Date().toISOString(),
    });

    setCooked(true);
    setShowRating(true);
    toast.success("Marked as cooked! How was it?");
  }

  async function submitRating(stars: number) {
    if (!userId) return;
    const { error } = await supabase.from("recipe_ratings").upsert({
      user_id: userId,
      recipe_id: recipe.id,
      rating: stars,
      updated_at: new Date().toISOString(),
    });
    if (!error) {
      setRating(stars);
      setShowRating(false);
      toast.success("Rating saved!");
    }
  }

  async function handleShare() {
    const url = `${window.location.origin}${ROUTES.RECIPE(recipe.id)}`;
    if (navigator.share) {
      await navigator.share({ url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  }

  return (
    <div className="my-4">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Cook */}
        <button
          onClick={markCooked}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all border",
            cooked
              ? "bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
              : "border-border hover:bg-muted"
          )}
        >
          <ChefHat className="h-4 w-4" />
          {cooked ? "Cooked!" : "Cook it"}
        </button>

        {/* Rate — only after cooking */}
        {cooked && (
          <button
            onClick={() => setShowRating(true)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border transition-all",
              rating !== null
                ? "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300"
                : "border-border hover:bg-muted"
            )}
          >
            <Star className={cn("h-4 w-4", rating !== null && "fill-current")} />
            {rating ? `${rating}/5` : "Rate"}
          </button>
        )}

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border border-border hover:bg-muted transition-colors ml-auto"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>

      {showRating && (
        <RatingWidget
          currentRating={rating ?? 0}
          onRate={submitRating}
          onClose={() => setShowRating(false)}
        />
      )}

      <AuthGateModal open={authOpen} onOpenChange={setAuthOpen} action="mark recipes as cooked" />
    </div>
  );
}
