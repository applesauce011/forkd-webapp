"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RatingDistributionEntry } from "./types";

interface RatingDistributionProps {
  data: RatingDistributionEntry[];
}

const STAR_LABELS = ["1 ★", "2 ★", "3 ★", "4 ★", "5 ★"];

export function RatingDistribution({ data }: RatingDistributionProps) {
  // Ensure all 5 star values are represented
  const normalized = [1, 2, 3, 4, 5].map((stars) => {
    const entry = data.find((d) => d.stars === stars);
    return { stars, label: STAR_LABELS[stars - 1], count: entry?.count ?? 0 };
  });

  const max = Math.max(...normalized.map((d) => d.count), 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={normalized} barCategoryGap="30%">
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={28}
              domain={[0, max]}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as { label: string; count: number };
                return (
                  <div className="bg-popover border border-border rounded px-3 py-1.5 text-sm shadow">
                    <span className="font-medium">{d.label}</span>
                    <span className="ml-2 text-muted-foreground">
                      {d.count} {d.count === 1 ? "rating" : "ratings"}
                    </span>
                  </div>
                );
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {normalized.map((entry) => (
                <Cell key={entry.stars} fill="#F97316" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
