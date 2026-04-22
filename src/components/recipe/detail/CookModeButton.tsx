"use client";

import Link from "next/link";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useSession } from "@/hooks/useSession";
import { ROUTES } from "@/lib/constants/routes";

interface CookModeButtonProps {
  recipeId: string;
}

export function CookModeButton({ recipeId }: CookModeButtonProps) {
  const { user } = useSession();
  const entitlements = useEntitlements();

  // For now show the button — full gate logic handled in Cook Mode page
  return (
    <div className="my-4">
      <Button asChild className="w-full" size="lg">
        <Link href={user ? ROUTES.RECIPE_COOK(recipeId) : "/login"}>
          <ChefHat className="mr-2 h-5 w-5" />
          Cook Mode
          {!entitlements.is_premium && (
            <span className="ml-2 text-xs bg-primary-foreground/20 rounded-full px-2 py-0.5">
              {entitlements.cook_mode_free_uses} free uses
            </span>
          )}
        </Link>
      </Button>
    </div>
  );
}
