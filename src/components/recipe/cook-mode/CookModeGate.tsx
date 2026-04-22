"use client";

import Link from "next/link";
import { ChefHat, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

interface CookModeGateProps {
  recipeId: string;
}

const PREMIUM_FEATURES = [
  "Unlimited Cook Mode sessions",
  "Keep screen awake while cooking",
  "Step-by-step timers with alerts",
  "Real-time serving size scaler",
  "Adjustable font size for readability",
  "Private recipes",
  "Unlimited bookmarks",
  "Ad-free experience",
];

export function CookModeGate({ recipeId }: CookModeGateProps) {
  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
          <ChefHat className="w-10 h-10 text-primary" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            Cook Mode is a Premium Feature
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            You&apos;ve used your 2 free Cook Mode sessions. Upgrade to Premium
            for unlimited access and a better cooking experience.
          </p>
        </div>

        {/* Feature list */}
        <ul className="w-full space-y-2 text-left">
          {PREMIUM_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
              <Check className="w-4 h-4 text-primary shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="w-full flex flex-col gap-3 pt-2">
          <Button asChild size="lg" className="w-full">
            <Link href={ROUTES.UPGRADE}>Upgrade to Premium</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Link href={ROUTES.RECIPE(recipeId)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back to Recipe
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
