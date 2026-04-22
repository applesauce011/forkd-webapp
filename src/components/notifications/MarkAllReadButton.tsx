"use client";

import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";

export function MarkAllReadButton() {
  const { unreadCount, markAllRead } = useNotifications();

  if (unreadCount === 0) return null;

  return (
    <Button variant="ghost" size="sm" onClick={markAllRead} className="text-sm">
      Mark all as read
    </Button>
  );
}
