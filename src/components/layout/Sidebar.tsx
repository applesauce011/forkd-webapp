"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Search, PlusCircle, Bookmark, User,
  BarChart2, Settings, Zap
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import { useSession } from "@/hooks/useSession";
import { useEntitlements } from "@/hooks/useEntitlements";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: ROUTES.FEED, icon: Home, label: "Feed", allowGuest: true },
  { href: ROUTES.SEARCH, icon: Search, label: "Search", allowGuest: true },
  { href: ROUTES.RECIPE_NEW, icon: PlusCircle, label: "New Recipe", primary: true },
  { href: ROUTES.BOOKMARKS, icon: Bookmark, label: "Bookmarks" },
  { href: ROUTES.STATS, icon: BarChart2, label: "Creator Stats" },
  { href: ROUTES.SETTINGS, icon: Settings, label: "Settings" },
];

interface SidebarProps {
  username?: string | null;
}

export function Sidebar({ username }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useSession();
  const entitlements = useEntitlements();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r h-[calc(100vh-3.5rem)] sticky top-14 py-4 px-3">
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label, primary, allowGuest }) => {
          const active = pathname === href || ((href as string) !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={user || allowGuest ? href : "/login"}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                primary && "mt-2"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", primary && "text-primary")} />
              {label}
            </Link>
          );
        })}
        {user && username && (
          <Link
            href={ROUTES.PROFILE(username)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith("/profile")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <User className="h-5 w-5 shrink-0" />
            My Profile
          </Link>
        )}
      </nav>
      <div className="mt-auto space-y-2">
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground text-center px-2">Better on your phone</p>
          <Button asChild size="sm" className="w-full" variant="outline">
            <a href="https://apps.apple.com/app/forkd/id6757679956" target="_blank" rel="noopener noreferrer">
              <svg className="h-4 w-4 mr-2 shrink-0" viewBox="0 0 814 1000" fill="currentColor" aria-hidden="true">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 67.4 0 123.5 44.4 165.9 44.4 40.5 0 103.9-47.2 180.3-47.2zm-238 141.2c-35.7-50.2-84.8-82.3-140.4-82.3-48 0-108.8 27.4-145.3 82.3-35.7 53.4-60.2 134-60.2 218.2 0 79.1 23.1 163.5 62.6 222.2 33.5 51.6 89.3 86.9 147.5 86.9 56.6 0 109.6-37.4 143.6-86.9 44.9-64.5 69.4-150.2 69.4-237.2 0-76.2-23.2-153.6-77.2-203.2z" />
              </svg>
              Get the iPhone App
            </a>
          </Button>
        </div>
        {user && !entitlements.is_premium && (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground text-center px-2">Loving Fork&apos;d?</p>
            <Button asChild size="sm" className="w-full" variant="outline">
              <Link href={ROUTES.UPGRADE}>
                <Zap className="h-4 w-4 mr-2 text-amber-500" />
                Go Premium
              </Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
