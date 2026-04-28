import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants/routes";
import { StatsOverview } from "@/components/stats/StatsOverview";
import { RatingDistribution } from "@/components/stats/RatingDistribution";
import { ActivityCalendar } from "@/components/stats/ActivityCalendar";
import { StreakDisplay } from "@/components/stats/StreakDisplay";
import { LeaderboardCard } from "@/components/stats/LeaderboardCard";
import { FeatureTable } from "@/components/premium/FeatureTable";
import { Button } from "@/components/ui/button";
import type { CreatorStatsFull, RatingDistributionEntry, ActivityEntry } from "@/components/stats/types";
import { Lock } from "lucide-react";

function computeStreakAndActivity(dates: string[]): {
  current: number;
  longest: number;
  activityByDay: ActivityEntry[];
} {
  if (dates.length === 0) return { current: 0, longest: 0, activityByDay: [] };

  // Unique sorted dates descending
  const unique = [...new Set(dates)].sort().reverse();

  // Activity map
  const map: Record<string, number> = {};
  for (const d of dates) map[d] = (map[d] ?? 0) + 1;
  const activityByDay: ActivityEntry[] = Object.entries(map).map(([date, count]) => ({ date, count }));

  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterdayStr = new Date(Date.now() - 864e5).toISOString().slice(0, 10);

  // Current streak
  let current = 0;
  if (unique[0] === todayStr || unique[0] === yesterdayStr) {
    current = 1;
    for (let i = 1; i < unique.length; i++) {
      const diff = Math.round((new Date(unique[i - 1]).getTime() - new Date(unique[i]).getTime()) / 864e5);
      if (diff === 1) current++;
      else break;
    }
  }

  // Longest streak
  let longest = unique.length > 0 ? 1 : 0;
  let temp = 1;
  for (let i = 1; i < unique.length; i++) {
    const diff = Math.round((new Date(unique[i - 1]).getTime() - new Date(unique[i]).getTime()) / 864e5);
    if (diff === 1) { temp++; if (temp > longest) longest = temp; }
    else temp = 1;
  }

  return { current, longest: Math.max(longest, current), activityByDay };
}

function buildRatingDist(ratings: number[]): RatingDistributionEntry[] {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of ratings) if (r >= 1 && r <= 5) counts[Math.round(r)]++;
  return [1, 2, 3, 4, 5].map((stars) => ({ stars, count: counts[stars] }));
}

export const metadata: Metadata = { title: "Creator Stats — Fork'd" };

export default async function StatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Check entitlements
  const { data: ent } = await supabase.rpc("get_my_entitlements");
  const isPremium = (ent as { is_premium?: boolean } | null)?.is_premium ?? false;

  // Fetch profile for avatar / display name
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, username, avatar_source, avatar_placeholder_key, avatar_custom_path")
    .eq("id", user.id)
    .single();

  if (!isPremium) {
    return <StatsUpgradePrompt />;
  }

  // Fetch stats RPCs in parallel with direct table queries for reliability
  const [{ data: statsRaw }, { data: percentileRaw }, { data: myRecipes }] = await Promise.all([
    supabase.rpc("get_creator_stats_full", { p_user_id: user.id }),
    supabase.rpc("get_cook_percentile", { p_user_id: user.id }),
    supabase.from("recipes").select("id").eq("author_id", user.id).eq("visibility", "public").is("deleted_at", null),
  ]);

  const stats = (statsRaw ?? {}) as CreatorStatsFull;
  const percentile = typeof percentileRaw === "number" ? percentileRaw : 0;
  const myRecipeIds = (myRecipes ?? []).map((r) => r.id);

  // Fill in stats that the RPC frequently returns as 0 with direct table queries
  // Use a dummy ID when list is empty so .in() doesn't error on an empty array
  const safeIds = myRecipeIds.length > 0 ? myRecipeIds : ["__none__"];
  const [
    { count: directCooks },
    { data: ratingsRows },
    { data: cookActivityRows },
  ] = await Promise.all([
    supabase.from("cooked_recipes").select("*", { count: "exact", head: true }).in("recipe_id", safeIds),
    supabase.from("recipe_ratings").select("rating").in("recipe_id", safeIds),
    supabase.from("cooked_recipes").select("cooked_at").eq("user_id", user.id),
  ]);

  // Override broken RPC fields
  if (directCooks != null && directCooks > 0) stats.total_cooks = directCooks;
  if (ratingsRows && ratingsRows.length > 0) {
    // Use Number() to guard against Postgres numeric columns arriving as strings
    stats.avg_rating = ratingsRows.reduce((s, r) => s + Number(r.rating), 0) / ratingsRows.length;
    stats.total_ratings = ratingsRows.length;
  }

  // Compute streak & activity from cooked_at dates
  const cookedDates = (cookActivityRows ?? []).map((r) => r.cooked_at.slice(0, 10));
  const { current: computedStreak, longest: computedLongest, activityByDay: computedActivity } =
    computeStreakAndActivity(cookedDates);

  if (computedStreak > 0 || !stats.current_streak) stats.current_streak = computedStreak;
  if (computedLongest > 0 || !stats.longest_streak) stats.longest_streak = computedLongest;

  const ratingDist: RatingDistributionEntry[] =
    Array.isArray(stats.rating_distribution) ? stats.rating_distribution : [];

  // Build rating distribution from raw ratings if RPC didn't supply it
  const effectiveRatingDist: RatingDistributionEntry[] =
    ratingDist.length > 0
      ? ratingDist
      : ratingsRows && ratingsRows.length > 0
      ? buildRatingDist(ratingsRows.map((r) => r.rating))
      : [];

  const activity: ActivityEntry[] =
    Array.isArray(stats.activity_by_day) && stats.activity_by_day.length > 0
      ? stats.activity_by_day
      : computedActivity;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Creator Stats</h1>
      </div>

      {/* Key metrics */}
      <StatsOverview stats={stats} />

      {/* Streak + Leaderboard side-by-side on wider screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StreakDisplay
          currentStreak={stats.current_streak ?? 0}
          longestStreak={stats.longest_streak ?? undefined}
        />
        <LeaderboardCard percentile={percentile} />
      </div>

      {/* Activity heatmap */}
      <ActivityCalendar activity={activity} />

      {/* Rating distribution */}
      {effectiveRatingDist.length > 0 || stats.total_ratings ? (
        <RatingDistribution data={effectiveRatingDist} />
      ) : null}

    </div>
  );
}

function StatsUpgradePrompt() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center text-center gap-6">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900/30">
        <Lock className="h-8 w-8 text-orange-500" />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2">Creator Stats</h1>
        <p className="text-muted-foreground max-w-sm">
          Track your impact with detailed analytics — likes, cooks, ratings, streaks, and
          your cook percentile across all Fork'd users.
        </p>
      </div>
      <a href={ROUTES.UPGRADE}>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8">
          Upgrade to Premium
        </Button>
      </a>
      <div className="w-full mt-4">
        <p className="text-sm text-muted-foreground mb-4 font-medium">What you get with Premium</p>
        <FeatureTable />
      </div>
    </div>
  );
}
