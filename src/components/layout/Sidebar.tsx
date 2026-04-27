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
      {user && !entitlements.is_premium && (
        <div className="mt-auto space-y-1.5">
          <p className="text-xs text-muted-foreground text-center px-2">Loving Fork&apos;d?</p>
          <Button asChild size="sm" className="w-full" variant="outline">
            <Link href={ROUTES.UPGRADE}>
              <Zap className="h-4 w-4 mr-2 text-amber-500" />
              Go Premium
            </Link>
          </Button>
        </div>
      )}
    </aside>
  );
}
