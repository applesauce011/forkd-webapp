"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Shuffle, Clock, Users, ChefHat, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { ROUTES } from "@/lib/constants/routes";

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
  { value: "dessert", label: "Dessert" },
];

const DIETARY = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten-Free" },
  { value: "dairy_free", label: "Dairy-Free" },
  { value: "keto", label: "Keto" },
];

const TIME_BUCKETS = [
  { label: "< 15 min", max: 15 },
  { label: "15–30 min", max: 30 },
  { label: "30–60 min", max: 60 },
  { label: "1 h+", max: null },
];

type Recipe = {
  id: string;
  title: string;
  recipe_photos: { url: string; position: number }[] | null;
  total_time_minutes: number | null;
  servings: number | null;
  difficulty: string | null;
};

function formatTime(mins: number | null) {
  if (!mins) return null;
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background border-border hover:border-primary/50 hover:bg-primary/5"
      }`}
    >
      {children}
    </button>
  );
}

export function HelpMePickClient() {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<number | null | undefined>(
    undefined
  ); // undefined = not set, null = 1h+
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleDietary = (val: string) => {
    setSelectedDietary((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val]
    );
  };

  const pick = useCallback(async () => {
    setLoading(true);
    setRecipe(null);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      let query = supabase
        .from("recipes_visible")
        .select("id, title, recipe_photos(url, position), total_time_minutes, servings, difficulty")
        .eq("is_private", false)
        .eq("moderation_status", "approved");

      if (selectedMeal) {
        query = query.contains("meal_types", [selectedMeal]);
      }
      if (selectedDietary.length > 0) {
        query = query.overlaps("dietary", selectedDietary);
      }
      if (selectedTime !== undefined) {
        if (selectedTime === null) {
          // 1h+ — at least 60 minutes
          query = query.gte("total_time_minutes", 60);
        } else {
          query = query.lte("total_time_minutes", selectedTime);
        }
      }

      // Fetch a small random pool and pick one client-side
      const { data, error: qErr } = await query.limit(200);
      if (qErr) throw qErr;
      if (!data || data.length === 0) {
        setError("No recipes found for those filters. Try loosening them!");
        return;
      }
      const picked = data[Math.floor(Math.random() * data.length)];
      setRecipe(picked as Recipe);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedMeal, selectedDietary, selectedTime]);

  const imageUrl = recipe?.recipe_photos && recipe.recipe_photos.length > 0
    ? [...recipe.recipe_photos].sort((a, b) => a.position - b.position)[0].url
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-2">
          <Shuffle className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Help Me Pick</h1>
        <p className="text-muted-foreground">
          Can't decide what to cook? Let us surprise you.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-5 rounded-2xl border bg-card p-6">
        {/* Meal type */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">What are you feeling?</p>
          <div className="flex flex-wrap gap-2">
            {MEAL_TYPES.map((m) => (
              <ChipButton
                key={m.value}
                active={selectedMeal === m.value}
                onClick={() =>
                  setSelectedMeal((prev) => (prev === m.value ? null : m.value))
                }
              >
                {m.label}
              </ChipButton>
            ))}
          </div>
        </div>

        {/* Dietary */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Any dietary needs?</p>
          <div className="flex flex-wrap gap-2">
            {DIETARY.map((d) => (
              <ChipButton
                key={d.value}
                active={selectedDietary.includes(d.value)}
                onClick={() => toggleDietary(d.value)}
              >
                {d.label}
              </ChipButton>
            ))}
          </div>
        </div>

        {/* Time */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">How much time?</p>
          <div className="flex flex-wrap gap-2">
            {TIME_BUCKETS.map((t) => (
              <ChipButton
                key={t.label}
                active={selectedTime === t.max}
                onClick={() =>
                  setSelectedTime((prev) => (prev === t.max ? undefined : t.max))
                }
              >
                {t.label}
              </ChipButton>
            ))}
          </div>
        </div>
      </div>

      {/* Pick button */}
      <Button
        size="lg"
        className="w-full text-base h-14"
        onClick={pick}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Looking for the perfect recipe…
          </>
        ) : (
          <>
            <Shuffle className="mr-2 h-5 w-5" />
            {recipe ? "Pick Another!" : "Help Me Pick!"}
          </>
        )}
      </Button>

      {/* Error */}
      {error && (
        <p className="text-center text-sm text-destructive">{error}</p>
      )}

      {/* Result card */}
      {recipe && !loading && (
        <div className="rounded-2xl border bg-card overflow-hidden shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          {imageUrl ? (
            <div className="relative w-full aspect-video">
              <Image
                src={imageUrl}
                alt={recipe.title ?? "Recipe"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-muted flex items-center justify-center">
              <ChefHat className="h-16 w-16 text-muted-foreground/40" />
            </div>
          )}

          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold leading-tight">{recipe.title}</h2>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-3">
              {recipe.total_time_minutes && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(recipe.total_time_minutes)}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings} servings</span>
                </div>
              )}
              {recipe.difficulty && (
                <Badge variant="secondary" className="capitalize">
                  {recipe.difficulty}
                </Badge>
              )}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 pt-2">
              <Button asChild className="flex-1">
                <Link href={ROUTES.RECIPE(recipe.id)}>
                  Let's Cook!
                </Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={pick}
                disabled={loading}
              >
                <Shuffle className="mr-2 h-4 w-4" />
                Pick Another
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
