"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Bookmark, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import { useSession } from "@/hooks/useSession";

const NAV_ITEMS = [
  { href: ROUTES.FEED, icon: Home, label: "Feed" },
  { href: ROUTES.SEARCH, icon: Search, label: "Search" },
  { href: ROUTES.RECIPE_NEW, icon: PlusCircle, label: "Add", primary: true },
  { href: ROUTES.BOOKMARKS, icon: Bookmark, label: "Saves" },
];

interface BottomNavProps {
  username?: string | null;
}

export function BottomNav({ username }: BottomNavProps) {
  const pathname = usePathname();
  const { user } = useSession();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/80 backdrop-blur-sm md:hidden">
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map(({ href, icon: Icon, label, primary }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={user ? href : "/login"}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-colors",
                primary
                  ? "text-primary"
                  : active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", primary && "h-6 w-6")} />
              <span>{label}</span>
            </Link>
          );
        })}
        {/* Profile link */}
        <Link
          href={user && username ? ROUTES.PROFILE(username) : user ? ROUTES.SETTINGS : "/login"}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-colors",
            pathname.startsWith("/profile") ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}
