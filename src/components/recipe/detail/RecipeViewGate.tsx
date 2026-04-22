"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkAndTrackRecipeView } from "@/actions/recipe-view-limit";
import { ROUTES } from "@/lib/constants/routes";

interface RecipeViewGateProps {
  recipeId: string;
  userId?: string;
  children: React.ReactNode;
}

export function RecipeViewGate({ recipeId, userId, children }: RecipeViewGateProps) {
  const [status, setStatus] = useState<"checking" | "allowed" | "blocked">("checking");
  const [limit, setLimit] = useState(15);

  useEffect(() => {
    if (!userId) {
      setStatus("allowed");
      return;
    }
    checkAndTrackRecipeView(recipeId).then((result) => {
      setLimit(result.limit);
      setStatus(result.allowed ? "allowed" : "blocked");
    });
  }, [recipeId, userId]);

  // Unauthenticated: blur content, show sign-in CTA
  if (!userId) {
    return (
      <div className="relative mt-6">
        <div
          className="pointer-events-none select-none"
          style={{ filter: "blur(6px)", opacity: 0.45 }}
          aria-hidden
        >
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="bg-card border rounded-2xl p-6 max-w-sm w-full text-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-semibold text-lg mb-2">Sign in to see the full recipe</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Join Fork&apos;d free to access ingredients, step-by-step instructions, and cook mode.
            </p>
            <Button asChild className="w-full mb-2">
              <Link href="/signup">Join Fork&apos;d Free</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="w-full text-muted-foreground">
              <Link href="/login">Already have an account? Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but daily limit reached
  if (status === "blocked") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-sm mx-auto">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Daily limit reached</h2>
        <p className="text-sm text-muted-foreground mb-6">
          You&apos;ve viewed {limit} recipes today. Upgrade to Premium for unlimited access.
        </p>
        <Button asChild size="lg" className="w-full max-w-xs">
          <Link href={ROUTES.UPGRADE}>Upgrade to Premium</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="mt-3 text-muted-foreground">
          <Link href={ROUTES.FEED}>Back to Feed</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
