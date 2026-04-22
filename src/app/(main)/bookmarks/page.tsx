import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookmarksGrid } from "@/components/bookmarks/BookmarksGrid";
import type { BookmarkEntry } from "@/components/bookmarks/BookmarksGrid";

export const metadata = { title: "Bookmarks — Fork'd" };

export default async function BookmarksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Load entitlements to check premium status
  const { data: ent } = await supabase.rpc("get_my_entitlements");
  const isPremium = (ent as { is_premium?: boolean } | null)?.is_premium ?? false;

  // Free users: fetch 6 so we know if there are locked ones (show 5 + banner)
  // Premium users: fetch up to 100
  const fetchLimit = isPremium ? 100 : 6;

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select(
      "recipe_id, created_at, recipes_visible!inner(id, title, recipe_photos(url, position), cuisine_primary, dietary, author_id, total_time_minutes, difficulty)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(fetchLimit);

  // Count total bookmarks to show the "X more locked" number accurately
  // For premium users we don't need this. For free users, if we got 6 back
  // we know there's at least 1 locked. Get the real total count.
  let totalCount = bookmarks?.length ?? 0;
  if (!isPremium && (bookmarks?.length ?? 0) >= 6) {
    const { count } = await supabase
      .from("bookmarks")
      .select("recipe_id", { count: "exact", head: true })
      .eq("user_id", user.id);
    totalCount = count ?? bookmarks?.length ?? 0;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        {totalCount > 0 && (
          <span className="text-sm text-muted-foreground">
            {isPremium
              ? `${totalCount} saved`
              : `${Math.min(totalCount, 5)} of ${totalCount} shown`}
          </span>
        )}
      </div>

      <BookmarksGrid
        bookmarks={(bookmarks as BookmarkEntry[]) ?? []}
        isPremium={isPremium}
        totalCount={totalCount}
      />
    </div>
  );
}
