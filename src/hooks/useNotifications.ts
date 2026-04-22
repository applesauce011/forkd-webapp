"use client";

import { useNotificationsContext } from "@/contexts/NotificationsContext";

/**
 * Hook that consumes the shared NotificationsContext.
 * Use this in any client component that needs notification data.
 */
export function useNotifications() {
  return useNotificationsContext();
}
