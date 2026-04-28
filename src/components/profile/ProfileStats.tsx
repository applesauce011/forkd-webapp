import type { Database } from "@/types/database";
import { formatCount } from "@/lib/utils/format";
import { Star } from "lucide-react";

export type ProfileCounters = Database["public"]["Views"]["profile_counters"]["Row"];

interface ProfileStatsProps {
  counters: ProfileCounters;
  avgRating?: number | null;
}

export function ProfileStats({ counters, avgRating }: ProfileStatsProps) {
  return (
    <div className="flex items-center gap-4 text-sm flex-wrap">
      <span>
        <span className="font-semibold">{formatCount(counters.recipes_count ?? 0)}</span>{" "}
        <span className="text-muted-foreground">Recipes</span>
      </span>
      <span>
        <span className="font-semibold">{formatCount(counters.followers_count ?? 0)}</span>{" "}
        <span className="text-muted-foreground">Followers</span>
      </span>
      <span>
        <span className="font-semibold">{formatCount(counters.following_count ?? 0)}</span>{" "}
        <span className="text-muted-foreground">Following</span>
      </span>
      {avgRating != null && (
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{avgRating.toFixed(1)}</span>
          <span className="text-muted-foreground">avg</span>
        </span>
      )}
    </div>
  );
}
