"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthGateModal } from "@/components/auth/AuthGateModal";
import { parseRecipeItems, scaleItem } from "@/lib/utils/recipe";
import { useSession } from "@/hooks/useSession";

interface IngredientsListProps {
  ingredients: string | null;
  servings: number | null;
}

export function IngredientsList({ ingredients, servings: defaultServings }: IngredientsListProps) {
  const { user } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [servings, setServings] = useState(defaultServings ?? 1);
  const items = parseRecipeItems(ingredients);
  const ratio = defaultServings ? servings / defaultServings : 1;

  if (!user) {
    return (
      <>
        <div className="my-6">
          <h2 className="text-xl font-bold mb-3">Ingredients</h2>
          <div className="relative rounded-xl overflow-hidden">
            <div className="space-y-2 blur-sm select-none pointer-events-none">
              {["1 cup flour", "2 eggs", "1/2 cup milk", "1 tbsp butter"].map((i) => (
                <div key={i} className="flex items-start gap-2 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{i}</span>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
              <Button onClick={() => setAuthOpen(true)}>Sign in to see full recipe</Button>
            </div>
          </div>
        </div>
        <AuthGateModal open={authOpen} onOpenChange={setAuthOpen} action="view ingredients" />
      </>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">Ingredients</h2>
        {defaultServings && (
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setServings((s) => Math.max(1, s - 1))}
              className="p-1 rounded-full border hover:bg-muted transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="font-medium w-20 text-center">{servings} serving{servings !== 1 ? "s" : ""}</span>
            <button
              onClick={() => setServings((s) => s + 1)}
              className="p-1 rounded-full border hover:bg-muted transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      <div className="space-y-1">
        {items.map((item, i) => {
          if (item.type === "heading") {
            return (
              <p key={i} className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mt-4 mb-2">
                {item.text}
              </p>
            );
          }
          const scaled = scaleItem(item, ratio);
          return (
            <div key={item.id ?? i} className="flex items-start gap-2 py-1.5 border-b border-border/40 last:border-0">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
              <span className="text-sm leading-relaxed">{scaled.type === "item" ? scaled.text : item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
