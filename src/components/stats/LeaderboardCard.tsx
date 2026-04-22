import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface LeaderboardCardProps {
  percentile: number; // 0–100: user cooks more than X% of users
}

function getLabel(percentile: number): string {
  if (percentile >= 99) return "Top Chef";
  if (percentile >= 95) return "Master Cook";
  if (percentile >= 80) return "Avid Cook";
  if (percentile >= 50) return "Regular Cook";
  return "Aspiring Cook";
}

export function LeaderboardCard({ percentile }: LeaderboardCardProps) {
  const pct = Math.round(Math.max(0, Math.min(100, percentile)));
  const label = getLabel(pct);

  return (
    <Card className="border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Cook Percentile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold tabular-nums text-orange-500">{pct}%</span>
        </div>
        <Progress value={pct} className="h-2" />
        <p className="text-sm text-muted-foreground">
          You cook more than{" "}
          <span className="font-semibold text-foreground">{pct}%</span> of Fork'd users
        </p>
        <span className="inline-block text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
          {label}
        </span>
      </CardContent>
    </Card>
  );
}
