"use client";

import { useState } from "react";
import { AuthGateModal } from "@/components/auth/AuthGateModal";
import { parseRecipeItems } from "@/lib/utils/recipe";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";

interface InstructionsListProps {
  instructions: string | null;
}

export function InstructionsList({ instructions }: InstructionsListProps) {
  const { user } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const items = parseRecipeItems(instructions);

  if (!user) {
    return (
      <>
        <div className="my-6">
          <h2 className="text-xl font-bold mb-3">Instructions</h2>
          <div className="relative rounded-xl overflow-hidden">
            <div className="space-y-4 blur-sm select-none pointer-events-none">
              {["Preheat oven to 350°F.", "Mix ingredients together.", "Bake for 30 minutes."].map((s, i) => (
                <div key={i} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed pt-0.5">{s}</p>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
              <Button onClick={() => setAuthOpen(true)}>Sign in to see steps</Button>
            </div>
          </div>
        </div>
        <AuthGateModal open={authOpen} onOpenChange={setAuthOpen} action="view instructions" />
      </>
    );
  }

  if (items.length === 0) return null;

  let stepNumber = 0;

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-4">Instructions</h2>
      <div className="space-y-4">
        {items.map((item, i) => {
          if (item.type === "heading") {
            return (
              <p key={i} className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mt-6 mb-2">
                {item.text}
              </p>
            );
          }
          stepNumber++;
          return (
            <div key={item.id ?? i} className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                {stepNumber}
              </span>
              <p className="text-sm leading-relaxed pt-0.5">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
