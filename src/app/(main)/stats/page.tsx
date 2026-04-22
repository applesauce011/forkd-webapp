import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants/routes";
import { StatsOverview } from "@/components/stats/StatsOverview";
import { RatingDistribution } from "@/components/stats/RatingDistribution";
import { ActivityCalendar } from "@/components/stats/ActivityCalendar";
import { StreakDisplay } from "@/components/stats/StreakDisplay";
import { LeaderboardCard } from "@/components/stats/LeaderboardCard";
import { ShareStatCard } from "@/components/stats/ShareStatCard";
import { FeatureTable } from "@/components/premium/FeatureTable";
import { Button } from "@/components/ui/button";
import type { CreatorStatsFull, RatingDistributionEntry, ActivityEntry } from "@/components/stats/types";
import { Lock } from "lucide-react";

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

  // Fetch stats RPCs in parallel
  const [{ data: statsRaw }, { data: percentileRaw }] = await Promise.all([
    supabase.rpc("get_creator_stats_full", { p_user_id: user.id }),
    supabase.rpc("get_cook_percentile", { p_user_id: user.id }),
  ]);

  const stats = (statsRaw ?? {}) as CreatorStatsFull;
  const percentile = typeof percentileRaw === "number" ? percentileRaw : 0;

  const ratingDist: RatingDistributionEntry[] =
    Array.isArray(stats.rating_distribution) ? stats.rating_distribution : [];

  const activity: ActivityEntry[] =
    Array.isArray(stats.activity_by_day) ? stats.activity_by_day : [];

  const shareProfile = {
    display_name: profile?.display_name ?? null,
    username: profile?.username ?? null,
    avatar_source: profile?.avatar_source ?? null,
    avatar_placeholder_key: profile?.avatar_placeholder_key ?? null,
    avatar_custom_path: profile?.avatar_custom_path ?? null,
  };

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
      {ratingDist.length > 0 || stats.total_ratings ? (
        <RatingDistribution data={ratingDist} />
      ) : null}

      {/* Share card */}
      <div>
        <h2 className="text-base font-semibold mb-3">Share your stats</h2>
        <ShareStatCard stats={stats} profile={shareProfile} />
      </div>
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
