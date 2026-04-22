"use client";

import { useMemo } from "react";
import {
  eachDayOfInterval,
  subWeeks,
  format,
  startOfWeek,
  endOfWeek,
  getDay,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ActivityEntry } from "./types";

interface ActivityCalendarProps {
  activity: ActivityEntry[];
}

function getColorClass(count: number): string {
  if (count === 0) return "bg-muted";
  if (count === 1) return "bg-orange-200 dark:bg-orange-900";
  if (count <= 3) return "bg-orange-300 dark:bg-orange-700";
  if (count <= 6) return "bg-orange-400 dark:bg-orange-600";
  return "bg-orange-500";
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ActivityCalendar({ activity }: ActivityCalendarProps) {
  const { weeks, activityMap } = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(subWeeks(today, 51), { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });

    const allDays = eachDayOfInterval({ start, end });

    // Build lookup map: "YYYY-MM-DD" -> count
    const map: Record<string, number> = {};
    for (const entry of activity) {
      map[entry.date] = (map[entry.date] ?? 0) + entry.count;
    }

    // Group into weeks (columns), each week = array of 7 days (Mon–Sun)
    const weeksArr: Date[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeksArr.push(allDays.slice(i, i + 7));
    }

    return { weeks: weeksArr, activityMap: map };
  }, [activity]);

  // Month label positions: find the first week each month appears in
  const monthLabels = useMemo(() => {
    const seen = new Set<string>();
    return weeks.map((week, colIdx) => {
      const firstDay = week[0];
      const monthKey = format(firstDay, "MMM yyyy");
      if (!seen.has(monthKey)) {
        seen.add(monthKey);
        return { colIdx, label: format(firstDay, "MMM") };
      }
      return null;
    });
  }, [weeks]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Activity</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <TooltipProvider delayDuration={200}>
          <div className="inline-block min-w-full">
            {/* Month labels row */}
            <div className="flex mb-1 ml-8">
              {weeks.map((_, colIdx) => {
                const label = monthLabels[colIdx];
                return (
                  <div key={colIdx} className="w-[14px] mx-[1px] shrink-0">
                    {label && (
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {label.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-[2px]">
              {/* Day-of-week labels */}
              <div className="flex flex-col gap-[2px] mr-1">
                {DAY_LABELS.map((d, i) => (
                  <div
                    key={d}
                    className="h-[14px] w-6 flex items-center"
                  >
                    {/* Show only Mon, Wed, Fri, Sun to save space */}
                    {i % 2 === 0 && (
                      <span className="text-[9px] text-muted-foreground">{d}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              {weeks.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[2px]">
                  {week.map((day) => {
                    const key = format(day, "yyyy-MM-dd");
                    const count = activityMap[key] ?? 0;
                    const colorClass = getColorClass(count);
                    const label = format(day, "MMM d, yyyy");

                    return (
                      <Tooltip key={key}>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-[14px] w-[14px] rounded-[2px] ${colorClass} cursor-default`}
                            aria-label={`${count} activities on ${label}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          {count === 0
                            ? `No activity on ${label}`
                            : `${count} ${count === 1 ? "activity" : "activities"} on ${label}`}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1.5 mt-3 text-[10px] text-muted-foreground">
              <span>Less</span>
              {[0, 1, 2, 4, 7].map((n) => (
                <div key={n} className={`h-[14px] w-[14px] rounded-[2px] ${getColorClass(n)}`} />
              ))}
              <span>More</span>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
