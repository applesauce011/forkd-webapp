"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";

const NAV_ITEMS = [
  { label: "Account", href: ROUTES.SETTINGS_ACCOUNT },
  { label: "Notifications", href: ROUTES.SETTINGS_NOTIFICATIONS },
  { label: "Blocked Users", href: ROUTES.SETTINGS_BLOCKED },
  { label: "Subscription", href: ROUTES.SETTINGS_SUBSCRIPTION },
] as const;

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar nav */}
      <nav className="hidden md:flex flex-col gap-1 w-48 shrink-0">
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive =
            href === ROUTES.SETTINGS_ACCOUNT
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile top tabs */}
      <nav className="flex md:hidden gap-1 overflow-x-auto pb-1 mb-4 border-b">
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive =
            href === ROUTES.SETTINGS_ACCOUNT
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                isActive
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
