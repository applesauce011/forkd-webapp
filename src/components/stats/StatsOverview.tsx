import { Card, CardContent } from "@/components/ui/card";
import { formatCount, formatRating } from "@/lib/utils/format";
import {
  ChefHat,
  Heart,
  Bookmark,
  Star,
  Flame,
  BookOpen,
} from "lucide-react";
import type { CreatorStatsFull } from "./types";

interface StatsOverviewProps {
  stats: CreatorStatsFull;
}

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards: StatCard[] = [
    {
      label: "Recipes",
      value: formatCount(stats.total_recipes),
      icon: <BookOpen className="h-5 w-5 text-orange-500" />,
    },
    {
      label: "Likes received",
      value: formatCount(stats.total_likes),
      icon: <Heart className="h-5 w-5 text-rose-500" />,
    },
    {
      label: "Cooks",
      value: formatCount(stats.total_cooks),
      icon: <ChefHat className="h-5 w-5 text-amber-500" />,
      sub: "people cooked your recipes",
    },
    {
      label: "Bookmarks",
      value: formatCount(stats.total_bookmarks),
      icon: <Bookmark className="h-5 w-5 text-blue-500" />,
    },
    {
      label: "Avg rating",
      value: formatRating(stats.avg_rating),
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      sub: `from ${formatCount(stats.total_ratings ?? 0)} ratings`,
    },
    {
      label: "Current streak",
      value: `${stats.current_streak ?? 0}`,
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      sub: stats.current_streak === 1 ? "day" : "days",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cards.map((card) => (
        <Card key={card.label} className="border border-border">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              {card.icon}
              <span>{card.label}</span>
            </div>
            <div className="text-2xl font-bold tabular-nums">{card.value}</div>
            {card.sub && (
              <div className="text-xs text-muted-foreground">{card.sub}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
