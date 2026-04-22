import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak?: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  return (
    <Card className="border border-border">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-orange-100 dark:bg-orange-900/30 shrink-0">
          <Flame
            className="h-7 w-7 text-orange-500"
            fill={currentStreak > 0 ? "#F97316" : "none"}
          />
        </div>
        <div>
          <div className="flex items-end gap-1.5">
            <span className="text-3xl font-bold tabular-nums">{currentStreak}</span>
            <span className="text-muted-foreground mb-0.5 text-sm">
              {currentStreak === 1 ? "day" : "days"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Current streak</p>
          {longestStreak != null && longestStreak > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Best: {longestStreak} {longestStreak === 1 ? "day" : "days"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
