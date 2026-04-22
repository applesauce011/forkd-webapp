"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, List } from "lucide-react";
import { RecipeBadge } from "@/components/shared/RecipeBadge";
import { BookmarkLimitBanner } from "./BookmarkLimitBanner";
import { formatRelativeTime, formatMinutes } from "@/lib/utils/format";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

export type BookmarkRecipe = {
  id: string | null;
  title: string | null;
  recipe_photos: { url: string; position: number }[] | null;
  cuisine_primary: string | null;
  dietary: string[] | null;
  author_id: string | null;
  total_time_minutes: number | null;
  difficulty: string | null;
};

export type BookmarkEntry = {
  recipe_id: string;
  created_at: string | null;
  recipes_visible: BookmarkRecipe | BookmarkRecipe[] | null;
};

interface BookmarksGridProps {
  bookmarks: BookmarkEntry[];
  isPremium: boolean;
  totalCount: number;
}

function BookmarkCard({
  recipe,
  savedAt,
  listView,
}: {
  recipe: BookmarkRecipe;
  savedAt: string | null;
  listView: boolean;
}) {
  const photoUrl = recipe.recipe_photos && recipe.recipe_photos.length > 0
    ? [...recipe.recipe_photos].sort((a, b) => a.position - b.position)[0].url
    : null;
  const href = recipe.id ? ROUTES.RECIPE(recipe.id) : "#";

  if (listView) {
    return (
      <Link
        href={href}
        className="flex gap-4 rounded-xl border bg-card hover:shadow-md transition-shadow p-3"
      >
        {photoUrl && (
          <div className="relative h-20 w-28 shrink-0 rounded-lg overflow-hidden bg-muted">
            <Image
              src={photoUrl}
              alt={recipe.title ?? "Recipe"}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-snug mb-1 line-clamp-2">
            {recipe.title}
          </h3>
          <div className="flex flex-wrap gap-1 mb-1">
            {recipe.cuisine_primary && (
              <RecipeBadge label={recipe.cuisine_primary} variant="cuisine" />
            )}
            {recipe.dietary?.slice(0, 2).map((d) => (
              <RecipeBadge
                key={d}
                label={d.replace(/_/g, " ")}
                variant="dietary"
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Saved {formatRelativeTime(savedAt)}
            {recipe.total_time_minutes
              ? ` · ${formatMinutes(recipe.total_time_minutes)}`
              : ""}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="block rounded-2xl overflow-hidden border bg-card hover:shadow-md transition-shadow"
    >
      {photoUrl ? (
        <div className="relative w-full aspect-[4/3] bg-muted">
          <Image
            src={photoUrl}
            alt={recipe.title ?? "Recipe"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
          <span className="text-2xl">🍴</span>
        </div>
      )}
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-1.5">
          {recipe.title}
        </h3>
        {(recipe.cuisine_primary || recipe.dietary?.length) && (
          <div className="flex flex-wrap gap-1">
            {recipe.cuisine_primary && (
              <RecipeBadge label={recipe.cuisine_primary} variant="cuisine" />
            )}
            {recipe.dietary?.slice(0, 1).map((d) => (
              <RecipeBadge
                key={d}
                label={d.replace(/_/g, " ")}
                variant="dietary"
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export function BookmarksGrid({
  bookmarks,
  isPremium,
  totalCount,
}: BookmarksGridProps) {
  const [listView, setListView] = useState(false);

  const FREE_LIMIT = 5;
  const visibleBookmarks = isPremium ? bookmarks : bookmarks.slice(0, FREE_LIMIT);
  const lockedCount = isPremium ? 0 : Math.max(0, totalCount - FREE_LIMIT);

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <p className="text-lg font-medium text-foreground mb-1">
          No bookmarks yet
        </p>
        <p className="text-sm text-muted-foreground">
          Save recipes you want to try by tapping the bookmark icon.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* View toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center border rounded-lg overflow-hidden shrink-0">
          <button
            onClick={() => setListView(false)}
            className={`p-2 transition-colors ${
              !listView
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            }`}
            title="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setListView(true)}
            className={`p-2 transition-colors ${
              listView
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            }`}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid / List */}
      <div
        className={cn(
          listView
            ? "flex flex-col gap-3"
            : "grid grid-cols-2 md:grid-cols-3 gap-4"
        )}
      >
        {visibleBookmarks.map((bookmark) => {
          const recipe = Array.isArray(bookmark.recipes_visible)
            ? bookmark.recipes_visible[0]
            : bookmark.recipes_visible;

          if (!recipe) return null;

          return (
            <BookmarkCard
              key={bookmark.recipe_id}
              recipe={recipe}
              savedAt={bookmark.created_at}
              listView={listView}
            />
          );
        })}

        {/* Soft gate banner for free users */}
        {!isPremium && lockedCount > 0 && (
          <BookmarkLimitBanner lockedCount={lockedCount} />
        )}
      </div>
    </div>
  );
}
