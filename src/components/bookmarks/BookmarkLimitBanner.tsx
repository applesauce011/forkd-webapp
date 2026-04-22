"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

interface BookmarkLimitBannerProps {
  lockedCount: number;
}

export function BookmarkLimitBanner({ lockedCount }: BookmarkLimitBannerProps) {
  return (
    <div className="col-span-full mt-2">
      <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-6 py-8 text-center">
        <div className="flex justify-center mb-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary" />
          </div>
        </div>
        <p className="font-semibold text-foreground mb-1">
          {lockedCount} more bookmark{lockedCount !== 1 ? "s" : ""} locked behind Premium
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Upgrade to Premium to access all your saved recipes.
        </p>
        <Button asChild size="sm">
          <Link href={ROUTES.UPGRADE}>Upgrade to Premium</Link>
        </Button>
      </div>
    </div>
  );
}
