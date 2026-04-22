"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import { parseRecipeItems, scaleAmount } from "@/lib/utils/recipe";

interface ServingScalerProps {
  originalServings: number | null;
  currentMultiplier: number;
  onChange: (multiplier: number) => void;
  ingredientsJson: string;
}

export function ServingScaler({
  originalServings,
  currentMultiplier,
  onChange,
  ingredientsJson,
}: ServingScalerProps) {
  const [expanded, setExpanded] = useState(false);

  const base = originalServings ?? 4;
  const currentServings = Math.round(base * currentMultiplier);

  function decrease() {
    const next = currentServings - 1;
    if (next >= 1) onChange(next / base);
  }

  function increase() {
    const next = currentServings + 1;
    onChange(next / base);
  }

  const ingredients = parseRecipeItems(ingredientsJson);
  const scaledIngredients = ingredients.map((item) => {
    if (item.type !== "item") return item;
    return { ...item, text: scaleAmount(item.text, currentMultiplier) };
  });

  return (
    <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 overflow-hidden">
      {/* Servings row */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm text-gray-300 font-medium">Servings</span>
        <div className="flex items-center gap-3">
          <button
            onClick={decrease}
            disabled={currentServings <= 1}
            aria-label="Decrease servings"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-white font-semibold w-6 text-center tabular-nums">
            {currentServings}
          </span>
          <button
            onClick={increase}
            aria-label="Increase servings"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          {/* Toggle ingredients */}
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Hide ingredients" : "Show ingredient amounts"}
            className="ml-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            Ingredients
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Scaled ingredient list */}
      {expanded && (
        <div className="border-t border-gray-700/50 px-4 py-3 space-y-1.5 max-h-48 overflow-y-auto">
          {scaledIngredients.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No ingredients listed.</p>
          ) : (
            scaledIngredients.map((item, i) => {
              if (item.type === "heading") {
                return (
                  <p key={i} className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-1">
                    {item.text}
                  </p>
                );
              }
              return (
                <p key={i} className="text-sm text-gray-200">
                  {item.text}
                </p>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
