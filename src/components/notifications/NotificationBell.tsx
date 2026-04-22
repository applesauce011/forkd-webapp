"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import { ROUTES } from "@/lib/constants/routes";

export function NotificationBell() {
  const unreadCount = useUnreadCount();

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href={ROUTES.NOTIFICATIONS} aria-label="Notifications">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
