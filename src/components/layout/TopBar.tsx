"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useSession } from "@/hooks/useSession";
import { useSupabaseContext } from "@/contexts/SupabaseContext";
import { ROUTES } from "@/lib/constants/routes";

interface TopBarProps {
  profile?: {
    avatar_source: string | null;
    avatar_placeholder_key: string | null;
    avatar_custom_path: string | null;
    display_name: string | null;
    username: string | null;
  } | null;
}

export function TopBar({ profile }: TopBarProps) {
  const { user } = useSession();
  const { supabase } = useSupabaseContext();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo — flush left */}
        <Link href={user ? ROUTES.FEED : "/"} className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="Fork'd"
            width={28}
            height={28}
            className="rounded-[6px]"
          />
          <span className="text-xl font-bold text-primary">Fork&apos;d</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {user ? (
            <>
              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <UserAvatar profile={profile ?? null} size="sm" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {profile?.username && (
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.PROFILE(profile.username)}>My Profile</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.BOOKMARKS}>Bookmarks</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.STATS}>Creator Stats</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.SETTINGS}>Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.UPGRADE}>Upgrade to Premium</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
