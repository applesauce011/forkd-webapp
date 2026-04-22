"use client";

import { ChevronLeft, ChevronRight, X, Check } from "lucide-react";

interface StepNavProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function StepNav({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onClose,
}: StepNavProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const progressPercent = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <>
      {/* Top bar: close + progress */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={onClose}
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

      {/* Bottom navigation */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-4 pb-6">
        <button
          onClick={onPrev}
          disabled={isFirst}
          aria-label="Previous step"
          className="flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Prev
        </button>

        <button
          onClick={onNext}
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
    </>
  );
}
