"use client";

import { isToday, isThisWeek, parseISO } from "date-fns";
import { NotificationItem } from "./NotificationItem";
import { useNotifications } from "@/hooks/useNotifications";
import { Skeleton } from "@/components/ui/skeleton";
import type { NotificationWithActor } from "@/contexts/NotificationsContext";

function groupNotifications(notifications: NotificationWithActor[]) {
  const today: NotificationWithActor[] = [];
  const thisWeek: NotificationWithActor[] = [];
  const older: NotificationWithActor[] = [];

  for (const n of notifications) {
    try {
      const date = parseISO(n.created_at);
      if (isToday(date)) {
        today.push(n);
      } else if (isThisWeek(date, { weekStartsOn: 1 })) {
        thisWeek.push(n);
      } else {
        older.push(n);
      }
    } catch {
      older.push(n);
    }
  }

  return { today, thisWeek, older };
}

function GroupSection({
  label,
  items,
  onRead,
}: {
  label: string;
  items: NotificationWithActor[];
  onRead: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </h3>
      <div className="space-y-0.5">
        {items.map((n) => (
          <NotificationItem key={n.id} notification={n} onRead={onRead} />
        ))}
      </div>
    </section>
  );
}

export function NotificationList() {
  const { notifications, loading, markRead } = useNotifications();
  const { today, thisWeek, older } = groupNotifications(notifications);

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <p className="text-lg font-medium text-foreground mb-1">
          No notifications yet
        </p>
        <p className="text-sm text-muted-foreground">
          When people interact with your recipes, you&apos;ll see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      <GroupSection label="Today" items={today} onRead={markRead} />
      <GroupSection label="This Week" items={thisWeek} onRead={markRead} />
      <GroupSection label="Older" items={older} onRead={markRead} />
    </div>
  );
}
