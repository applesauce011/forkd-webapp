import { Clock, Users, ChefHat, Star } from "lucide-react";
import { formatMinutes } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface RecipeMetaProps {
  recipe: {
    servings: number | null;
    total_time_minutes: number | null;
    difficulty: string | null;
  };
  averageRating?: number | null;
  ratingsCount?: number;
}

const difficultyColor = {
  Easy: "text-green-600 bg-green-50 dark:bg-green-900/20",
  Medium: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
  Hard: "text-red-600 bg-red-50 dark:bg-red-900/20",
};

export function RecipeMeta({ recipe, averageRating, ratingsCount = 0 }: RecipeMetaProps) {
  const items = [
    recipe.servings && { icon: Users, label: "Servings", value: String(recipe.servings) },
    recipe.total_time_minutes && { icon: Clock, label: "Time", value: formatMinutes(recipe.total_time_minutes) },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  const hasRating = averageRating != null && ratingsCount > 0;

  if (items.length === 0 && !recipe.difficulty && !hasRating) return null;

  return (
    <div className="flex flex-wrap gap-3 my-4">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{label}:</span>
          <span className="font-medium">{value}</span>
        </div>
      ))}
      {recipe.difficulty && (
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium",
          difficultyColor[recipe.difficulty as keyof typeof difficultyColor] ?? "bg-muted"
        )}>
          <ChefHat className="h-4 w-4" />
          {recipe.difficulty}
        </div>
      )}
      {hasRating && (
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-sm font-medium text-amber-700 dark:text-amber-300">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {averageRating!.toFixed(1)}
          <span className="text-amber-600/70 dark:text-amber-400/70 font-normal">
            ({ratingsCount} {ratingsCount === 1 ? "rating" : "ratings"})
          </span>
        </div>
      )}
    </div>
  );
}
