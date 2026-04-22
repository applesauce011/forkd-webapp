"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, LayoutList, LayoutGrid } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeCard } from "@/components/feed/RecipeCard";
import { useSupabaseContext } from "@/contexts/SupabaseContext";
import type { RecipeWithAuthor } from "@/types/app";

const PAGE_SIZE = 12;

const PROFILE_SELECT = `
  *,
  profiles!recipes_author_fk(id, username, display_name, avatar_source, avatar_placeholder_key, avatar_custom_path, is_founding_cook, is_premium),
  recipe_photos(id, url, position)
`.trim();

interface RecipeTabsProps {
  userId: string;
  username: string;
}

function useProfileRecipes(userId: string, isRemixes: boolean) {
  const { supabase } = useSupabaseContext();
  const [recipes, setRecipes] = useState<RecipeWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(0);

  const fetchPage = useCallback(
    async (page: number) => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("recipes_visible")
        .select(PROFILE_SELECT)
        .or(`author.eq.${userId},author_id.eq.${userId}`)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (isRemixes) {
        query = query.not("parent_id", "is", null);
      } else {
        query = query.is("parent_id", null);
      }

      const { data, error } = await query;
      if (error) return [];
      const items = (data ?? []) as unknown as RecipeWithAuthor[];

      if (items.length > 0) {
        const ids = items.map((r) => r.id).filter(Boolean);
        const { data: statsRows } = await supabase.rpc("get_recipe_stats_batch", { p_recipe_ids: ids });
        if (statsRows) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const statsMap = Object.fromEntries((statsRows as any[]).map((s) => [s.recipe_id, s]));
          for (const item of items) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item as RecipeWithAuthor).recipe_stats = (statsMap[item.id] ?? null) as any;
          }
        }
      }

      return items;
    },
    [supabase, userId, isRemixes]
  );

  const loadMore = useCallback(async () => {
    if (loading && pageRef.current > 0) return;
    setLoading(true);
    const newRecipes = await fetchPage(pageRef.current);
    setRecipes((prev) => (pageRef.current === 0 ? newRecipes : [...prev, ...newRecipes]));
    setHasMore(newRecipes.length === PAGE_SIZE);
    pageRef.current += 1;
    setLoading(false);
  }, [fetchPage, loading]);

  useEffect(() => {
    pageRef.current = 0;
    setRecipes([]);
    setHasMore(true);
    setLoading(true);
    fetchPage(0).then((newRecipes) => {
      setRecipes(newRecipes);
      setHasMore(newRecipes.length === PAGE_SIZE);
      pageRef.current = 1;
      setLoading(false);
    });
  }, [fetchPage]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return { recipes, loading, hasMore, sentinelRef };
}

function RecipeGrid({
  userId,
  isRemixes,
  columns,
}: {
  userId: string;
  isRemixes: boolean;
  columns: 1 | 3;
}) {
  const { recipes, loading, hasMore, sentinelRef } = useProfileRecipes(userId, isRemixes);

  if (!loading && recipes.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12 text-sm">
        {isRemixes ? "No remixes yet." : "No recipes yet."}
      </p>
    );
  }

  const isGrid = columns === 3;

  return (
    <>
      <div className={isGrid ? "grid grid-cols-2 sm:grid-cols-3 gap-3" : "space-y-4"}>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} compact={isGrid} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-4" />

      {loading && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!hasMore && recipes.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-4">
          You&apos;ve seen everything
        </p>
      )}
    </>
  );
}

export function RecipeTabs({ userId, username }: RecipeTabsProps) {
  const [tab, setTab] = useState<"recipes" | "remixes">("recipes");
  const [columns, setColumns] = useState<1 | 3>(1);

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
      <div className="flex items-center gap-2 mb-6">
        <TabsList className="flex-1">
          <TabsTrigger value="recipes" className="flex-1">
            Recipes
          </TabsTrigger>
          <TabsTrigger value="remixes" className="flex-1">
            Remixes
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center border rounded-lg overflow-hidden shrink-0">
          <button
            onClick={() => setColumns(1)}
            className={`p-2 transition-colors ${
              columns === 1
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            }`}
            title="List view"
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            onClick={() => setColumns(3)}
            className={`p-2 transition-colors ${
              columns === 3
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            }`}
            title="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      <TabsContent value="recipes">
        <RecipeGrid userId={userId} isRemixes={false} columns={columns} />
      </TabsContent>

      <TabsContent value="remixes">
        <RecipeGrid userId={userId} isRemixes={true} columns={columns} />
      </TabsContent>
    </Tabs>
  );
}
