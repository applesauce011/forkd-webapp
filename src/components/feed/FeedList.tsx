"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSupabaseContext } from "@/contexts/SupabaseContext";
import { useEntitlements } from "@/hooks/useEntitlements";
import { RecipeCard } from "@/components/feed/RecipeCard";
import { RecipeCardSkeleton, RecipeCardSkeletonGrid } from "@/components/feed/RecipeCardSkeleton";
import { InfiniteScroll } from "@/components/shared/InfiniteScroll";
import { EmptyState } from "@/components/shared/EmptyState";
import { FoundingCookWidget } from "@/components/feed/FoundingCookWidget";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import type { RecipeWithAuthor } from "@/types/app";

const PAGE_SIZE = 15;

const FEED_SELECT = `
  *,
  profiles!recipes_author_fk(id, username, display_name, avatar_source, avatar_placeholder_key, avatar_custom_path, is_founding_cook, is_premium),
  recipe_photos(id, url, position)
`.trim();

interface FeedListProps {
  type: "following" | "everyone" | "liked";
  userId?: string;
  columns?: 1 | 3;
  sort?: "recent" | "trending";
}

export function FeedList({ type, userId, columns = 1, sort = "recent" }: FeedListProps) {
  const { supabase } = useSupabaseContext();
  const entitlements = useEntitlements();
  const [recipes, setRecipes] = useState<RecipeWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [cursorTimestamp, setCursorTimestamp] = useState<string | null>(null);

  const freeLimit = entitlements.is_premium
    ? Infinity
    : type === "liked"
    ? entitlements.free_feed_results_limit
    : entitlements.free_feed_results_limit;

  const loadRecipes = useCallback(async (pageNum: number) => {
    if (!hasMore && pageNum > 0) return;
    setLoading(true);

    try {
      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let query;

      if (type === "following" && userId) {
        // Get followed user IDs, then fetch their recipes
        const { data: follows } = await supabase
          .from("follows")
          .select("followed_id")
          .eq("follower_id", userId);
        const followedIds = follows?.map((f) => f.followed_id) ?? [];
        const allIds = [...followedIds, userId];

        const ids = allIds.length > 0 ? allIds : ["00000000-0000-0000-0000-000000000000"];
        const idList = ids.join(",");
        query = supabase
          .from("recipes_visible")
          .select(FEED_SELECT)
          .or(`author.in.(${idList}),author_id.in.(${idList})`)
          .eq("visibility", "public")
          .order("created_at", { ascending: false })
          .range(from, to);
      } else if (type === "liked" && userId) {
        const { data: likeRows } = await supabase
          .from("likes")
          .select("recipe_id, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .range(from, to);

        if (!likeRows || likeRows.length === 0) {
          setHasMore(false);
          setLoading(false);
          return;
        }

        const ids = likeRows.map((l) => l.recipe_id);
        query = supabase
          .from("recipes_visible")
          .select(FEED_SELECT)
          .in("id", ids);
      } else {
        query = supabase
          .from("recipes_visible")
          .select(FEED_SELECT)
          .eq("visibility", "public")
          .range(from, to);

        if (sort === "trending") {
          query = query.order("likes_count", { ascending: false });
        } else {
          query = query.order("created_at", { ascending: false });
          if (cursorTimestamp && pageNum > 0) {
            query = query.lte("created_at", cursorTimestamp);
          }
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      const items = (data ?? []) as unknown as RecipeWithAuthor[];

      if (items.length > 0) {
        const ids = items.map((r) => r.id).filter(Boolean);

        const [statsResult, ratingsResult] = await Promise.all([
          supabase.rpc("get_recipe_stats_batch", { p_recipe_ids: ids }),
          supabase.from("recipe_ratings").select("recipe_id, rating").in("recipe_id", ids),
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const statsMap: Record<string, any> = statsResult.data
          ? Object.fromEntries((statsResult.data as any[]).map((s) => [s.recipe_id, s]))
          : {};

        // Compute average rating from live recipe_ratings
        const ratingAgg: Record<string, { sum: number; count: number }> = {};
        for (const r of ratingsResult.data ?? []) {
          if (!ratingAgg[r.recipe_id]) ratingAgg[r.recipe_id] = { sum: 0, count: 0 };
          ratingAgg[r.recipe_id].sum += r.rating;
          ratingAgg[r.recipe_id].count += 1;
        }

        for (const item of items) {
          const base = statsMap[item.id] ?? {};
          const agg = ratingAgg[item.id];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item as RecipeWithAuthor).recipe_stats = {
            ...base,
            average_rating: agg ? agg.sum / agg.count : (base.average_rating ?? null),
            ratings_count: agg ? agg.count : (base.ratings_count ?? 0),
          } as any;
        }
      }

      if (pageNum === 0 && items.length > 0 && type === "everyone") {
        setCursorTimestamp(items[0].created_at);
      }

      setRecipes((prev) => (pageNum === 0 ? items : [...prev, ...items]));
      setHasMore(items.length === PAGE_SIZE);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error("Feed load error:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase, type, userId, sort, cursorTimestamp, hasMore]);

  useEffect(() => {
    setRecipes([]);
    setPage(0);
    setHasMore(true);
    setCursorTimestamp(null);
    loadRecipes(0);
  }, [type, userId, sort]); // eslint-disable-line

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadRecipes(nextPage);
  }, [page, loadRecipes]);

  if (loading && recipes.length === 0) {
    return columns === 3 ? <RecipeCardSkeletonGrid /> : (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!loading && recipes.length === 0) {
    if (type === "following") {
      return (
        <EmptyState
          icon="👨‍🍳"
          title="Your feed is empty"
          description="Follow some cooks to see their recipes here."
          action={
            <Button asChild>
              <Link href={ROUTES.SEARCH}>Discover Cooks</Link>
            </Button>
          }
        />
      );
    }
    if (type === "liked") {
      return (
        <EmptyState
          icon="❤️"
          title="No liked recipes yet"
          description="Heart recipes you love and they'll appear here."
        />
      );
    }
    return <EmptyState icon="🍴" title="No recipes yet" description="Be the first to share a recipe!" />;
  }

  const visibleRecipes = entitlements.is_premium
    ? recipes
    : recipes.slice(0, freeLimit);

  const hitLimit = !entitlements.is_premium && recipes.length >= freeLimit;

  const isGrid = columns === 3;

  return (
    <div className={isGrid ? "grid grid-cols-2 sm:grid-cols-3 gap-3" : "space-y-4"}>
      {visibleRecipes.map((recipe, i) => (
        <div key={recipe.id}>
          <RecipeCard recipe={recipe} compact={isGrid} />
          {/* Inject Founding Cook widget after 4th card on Everyone tab (single col only) */}
          {i === 3 && type === "everyone" && !isGrid && <FoundingCookWidget className="mt-4" />}
        </div>
      ))}

      {hitLimit && (
        <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center space-y-3">
          <p className="text-sm font-medium">You've seen {freeLimit} recipes</p>
          <p className="text-xs text-muted-foreground">Upgrade to Premium for unlimited browsing</p>
          <Button asChild size="sm">
            <Link href={ROUTES.UPGRADE}>Unlock Unlimited</Link>
          </Button>
        </div>
      )}

      {!hitLimit && (
        <InfiniteScroll
          onLoadMore={loadMore}
          hasMore={hasMore}
          loading={loading}
        />
      )}

      {loading && recipes.length > 0 && (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
        </div>
      )}
    </div>
  );
}
