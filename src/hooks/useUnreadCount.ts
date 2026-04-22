"use client";

import { useNotificationsContext } from "@/contexts/NotificationsContext";

/**
 * Lightweight hook that returns only the unread notification count.
 * Shares the same subscription as useNotifications — no extra DB calls.
 */
export function useUnreadCount(): number {
  const { unreadCount } = useNotificationsContext();
  return unreadCount;
}
