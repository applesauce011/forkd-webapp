"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useSupabaseContext } from "@/contexts/SupabaseContext";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { cn } from "@/lib/utils/cn";
interface FoundingCook {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_source: "placeholder" | "custom";
  avatar_placeholder_key: string | null;
  avatar_custom_path: string | null;
  is_founding_cook: boolean;
}

interface FoundingCookWidgetProps {
  className?: string;
}

const DISMISS_KEY = "forkd_founding_widget_dismissed";

export function FoundingCookWidget({ className }: FoundingCookWidgetProps) {
  const { supabase } = useSupabaseContext();
  const [dismissed, setDismissed] = useState(true); // start dismissed to avoid flash
  const [cooks, setCooks] = useState<FoundingCook[]>([]);

  useEffect(() => {
    // Check dismissal (expires after 14 days)
    const stored = localStorage.getItem(DISMISS_KEY);
    if (stored) {
      const ts = parseInt(stored, 10);
      if (Date.now() - ts < 14 * 24 * 60 * 60 * 1000) return;
    }
    setDismissed(false);

    // Load founding cooks
    supabase
      .from("profiles")
      .select("id, username, display_name, avatar_source, avatar_placeholder_key, avatar_custom_path, is_founding_cook")
      .eq("is_founding_cook", true)
      .limit(4)
      .then(({ data }) => setCooks(data ?? []));
  }, [supabase]);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  }

  if (dismissed || cooks.length === 0) return null;

  return (
    <div className={cn("rounded-2xl border bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">👨‍🍳 Suggested Cooks to Follow</h3>
        <button onClick={dismiss} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cooks.map((cook) => (
          <Link
            key={cook.id}
            href={`/profile/${cook.username}`}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
          >
            <UserAvatar profile={cook} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{cook.display_name || cook.username}</p>
              <p className="text-xs text-muted-foreground truncate">@{cook.username}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
