"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useEntitlements } from "@/hooks/useEntitlements";
import { ROUTES } from "@/lib/constants/routes";
import { CookModeGate } from "./CookModeGate";
import { StepCard } from "./StepCard";
import { CookTimer } from "./CookTimer";
import { ServingScaler } from "./ServingScaler";
import { FontSizeControl } from "./FontSizeControl";

type FontSize = "sm" | "md" | "lg" | "xl";

interface ActiveTimer {
  id: string;
  label: string;
  seconds: number;
}

interface CookModeShellProps {
  recipe: {
    id: string;
    title: string;
    servings: number | null;
    steps: string;
    ingredients: string;
  };
}

const COOK_USES_KEY = "forkd_cook_uses";

function normalizeSteps(stepsJson: string): string[] {
  try {
    const parsed = JSON.parse(stepsJson);
    if (!Array.isArray(parsed)) return [];
    return (parsed as unknown[])
      .map((s) => {
        if (typeof s === "string") return s;
        if (s && typeof s === "object" && "text" in s) {
          return String((s as { text: unknown }).text);
        }
        return String(s);
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function CookModeShell({ recipe }: CookModeShellProps) {
  const router = useRouter();
  const entitlements = useEntitlements();

  const [currentStep, setCurrentStep] = useState(0);
  const [servingMultiplier, setServingMultiplier] = useState(1.0);
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);
  const [showGate, setShowGate] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const isPremium = entitlements.is_premium;
  const freeUseLimit = entitlements.cook_mode_free_uses;

  // Keep screen awake while cooking
  useWakeLock(isActive);

  // On mount: check free tier gate and increment use count
  useEffect(() => {
    const uses = parseInt(localStorage.getItem(COOK_USES_KEY) ?? "0", 10);

    if (!isPremium && uses >= freeUseLimit) {
      setShowGate(true);
      return;
    }

    // Increment count for this session (free users only)
    if (!isPremium) {
      localStorage.setItem(COOK_USES_KEY, String(uses + 1));
    }

    setIsActive(true);
  }, [isPremium, freeUseLimit]);

  const steps = normalizeSteps(recipe.steps);
  const totalSteps = steps.length;

  const handleClose = useCallback(() => {
    setIsActive(false);
    router.push(ROUTES.RECIPE(recipe.id));
  }, [router, recipe.id]);

  const handlePrev = useCallback(() => {
    setCurrentStep((s) => Math.max(0, s - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev === totalSteps - 1) {
        // Finished — navigate back to recipe
        setIsActive(false);
        setTimeout(() => router.push(ROUTES.RECIPE(recipe.id)), 0);
        return prev;
      }
      return prev + 1;
    });
  }, [totalSteps, router, recipe.id]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") handleNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") handlePrev();
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev, handleClose]);

  const handleStartTimer = useCallback((label: string, seconds: number) => {
    setActiveTimers((prev) => {
      // Avoid duplicate active timers for same label
      if (prev.some((t) => t.label === label)) return prev;
      const id = `${Date.now()}-${Math.random()}`;
      return [...prev, { id, label, seconds }];
    });
  }, []);

  const handleDismissTimer = useCallback((id: string) => {
    setActiveTimers((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (showGate) {
    return <CookModeGate recipeId={recipe.id} />;
  }

  if (totalSteps === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-950 flex items-center justify-center px-6 text-center">
        <div className="space-y-4">
          <p className="text-gray-400 text-lg">This recipe has no steps yet.</p>
          <button
            onClick={handleClose}
            className="text-orange-400 hover:text-orange-300 underline text-sm"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;
  const currentStepText = steps[currentStep] ?? "";

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col overflow-hidden">
      {/* ── Top bar: close + progress ── */}
      <div className="shrink-0 flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          onClick={handleClose}
          aria-label="Exit Cook Mode"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-orange-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
          />
        </div>

        {/* Step counter */}
        <span className="text-xs text-gray-500 tabular-nums shrink-0">
          {currentStep + 1}/{totalSteps}
        </span>
      </div>

      {/* ── Active timers ── */}
      {activeTimers.length > 0 && (
        <div className="shrink-0 px-4 pb-2 space-y-2 max-h-52 overflow-y-auto">
          {activeTimers.map((timer) => (
            <CookTimer
              key={timer.id}
              label={timer.label}
              seconds={timer.seconds}
              onDismiss={() => handleDismissTimer(timer.id)}
            />
          ))}
        </div>
      )}

      {/* ── Recipe title ── */}
      <div className="shrink-0 px-6 pb-1">
        <h2 className="text-sm font-medium text-gray-500 truncate">{recipe.title}</h2>
      </div>

      {/* ── Step card (scrollable) ── */}
      <div className="flex-1 overflow-y-auto">
        <StepCard
          text={currentStepText}
          stepNumber={currentStep + 1}
          totalSteps={totalSteps}
          fontSize={fontSize}
          onStartTimer={handleStartTimer}
        />
      </div>

      {/* ── Bottom controls ── */}
      <div className="shrink-0 px-4 pb-2 space-y-3">
        <ServingScaler
          originalServings={recipe.servings}
          currentMultiplier={servingMultiplier}
          onChange={setServingMultiplier}
          ingredientsJson={recipe.ingredients}
        />

        <div className="flex justify-end">
          <FontSizeControl value={fontSize} onChange={setFontSize} />
        </div>
      </div>

      {/* ── Navigation buttons ── */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-4 pb-6">
        <button
          onClick={handlePrev}
          disabled={isFirst}
          aria-label="Previous step"
          className="flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Prev
        </button>

        <button
          onClick={handleNext}
          aria-label={isLast ? "Finish cooking" : "Next step"}
          className={`flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl text-base font-semibold transition-colors ${
            isLast
              ? "bg-green-600 hover:bg-green-500 text-white"
              : "bg-orange-600 hover:bg-orange-500 text-white"
          }`}
        >
          {isLast ? (
            <>
              <Check className="w-5 h-5" />
              Finish
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
