import Link from "next/link";
import Image from "next/image";
import { ChefHat, Star } from "lucide-react";
import { formatRelativeTime, formatCount } from "@/lib/utils/format";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { RecipeBadge } from "@/components/shared/RecipeBadge";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import type { RecipeWithAuthor } from "@/types/app";

interface RecipeCardProps {
  recipe: RecipeWithAuthor;
  className?: string;
  compact?: boolean;
}

export function RecipeCard({ recipe, className, compact = false }: RecipeCardProps) {
  const author = Array.isArray(recipe.profiles) ? recipe.profiles[0] : recipe.profiles;
  const stats = Array.isArray(recipe.recipe_stats) ? recipe.recipe_stats[0] : recipe.recipe_stats;
  const photoUrl =
    recipe.recipe_photos && recipe.recipe_photos.length > 0
      ? [...recipe.recipe_photos].sort((a, b) => a.position - b.position)[0].url
      : null;

  const ratingDisplay = stats?.average_rating && stats.ratings_count > 0 ? (
    <span className="flex items-center gap-0.5 ml-auto">
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      {Number(stats.average_rating).toFixed(1)}
      <span className="text-muted-foreground/70">· {formatCount(stats.cooked_count ?? 0)}</span>
    </span>
  ) : (
    <span className="flex items-center gap-0.5 ml-auto">
      <ChefHat className="h-3 w-3" />
      {formatCount(stats?.cooked_count ?? 0)}
    </span>
  );

  if (compact) {
    return (
      <Link
        href={ROUTES.RECIPE(recipe.id)}
        className={cn(
          "block rounded-xl border bg-card hover:shadow-md transition-shadow p-1.5",
          className
        )}
      >
        <div className="relative w-full aspect-square bg-muted rounded-xl overflow-hidden">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={recipe.title ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-3xl">🍴</div>
          )}
        </div>

        <div className="p-2.5 space-y-1.5">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">{recipe.title}</h3>

          {author && (
            <div className="flex items-center gap-1.5">
              <UserAvatar profile={author} size="sm" />
              <span className="text-xs text-muted-foreground truncate">
                {author.display_name || author.username}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            {ratingDisplay}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={ROUTES.RECIPE(recipe.id)}
      className={cn(
        "block rounded-2xl border bg-card hover:shadow-md transition-shadow p-2",
        className
      )}
    >
      {photoUrl ? (
        <div className="relative w-full aspect-[16/9] bg-muted rounded-xl overflow-hidden">
          <Image
            src={photoUrl}
            alt={recipe.title ?? ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      ) : (
        <div className="w-full aspect-[16/9] bg-muted rounded-xl flex items-center justify-center text-4xl">
          🍴
        </div>
      )}

      <div className="p-2 pt-3">
        <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">{recipe.title}</h3>

        {author && (
          <div className="flex items-center gap-2 mb-3">
            <UserAvatar profile={author} size="sm" />
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{author.display_name || author.username}</span>
              {author.is_founding_cook && (
                <span className="text-blue-500 text-xs" title="Founding Cook">✓</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground ml-auto">
              {formatRelativeTime(recipe.created_at)}
            </span>
          </div>
        )}

        {(recipe.cuisine_primary || recipe.dietary?.length) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {recipe.cuisine_primary && (
              <RecipeBadge label={recipe.cuisine_primary} variant="cuisine" />
            )}
            {recipe.dietary?.slice(0, 2).map((tag) => (
              <RecipeBadge key={tag} label={tag.replace(/_/g, " ")} variant="dietary" />
            ))}
          </div>
        )}

        <div className="flex items-center text-sm text-muted-foreground">
          {stats?.average_rating && stats.ratings_count > 0 ? (
            <span className="flex items-center gap-1.5 ml-auto">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">
                {Number(stats.average_rating).toFixed(1)}
              </span>
              <span className="text-muted-foreground/70 text-xs">
                · {formatCount(stats.cooked_count ?? 0)} cooked
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-1 ml-auto">
              <ChefHat className="h-4 w-4" />
              {formatCount(stats?.cooked_count ?? 0)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
