import type { Database } from "@/types/database";
import { formatCount } from "@/lib/utils/format";

export type ProfileCounters = Database["public"]["Views"]["profile_counters"]["Row"];

interface ProfileStatsProps {
  counters: ProfileCounters;
}

export function ProfileStats({ counters }: ProfileStatsProps) {
  return (
    <div className="flex items-center gap-4 text-sm">
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
    </div>
  );
}
