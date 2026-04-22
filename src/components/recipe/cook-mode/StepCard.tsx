"use client";

import { useMemo } from "react";
import { Timer } from "lucide-react";
import { extractTimers } from "@/lib/utils/recipe";

type FontSize = "sm" | "md" | "lg" | "xl";

interface StepCardProps {
  text: string;
  stepNumber: number;
  totalSteps: number;
  fontSize: FontSize;
  onStartTimer: (label: string, seconds: number) => void;
}

const FONT_CLASS: Record<FontSize, string> = {
  sm: "text-lg leading-relaxed",
  md: "text-2xl leading-relaxed",
  lg: "text-3xl leading-relaxed",
  xl: "text-4xl leading-relaxed",
};

const TIME_RE = /(\d+(?:\.\d+)?)\s*(hours?|hrs?|minutes?|mins?|seconds?|secs?)/gi;

interface TextPart {
  type: "text" | "timer";
  content: string;
  label?: string;
  seconds?: number;
}

function parseStepText(text: string): TextPart[] {
  const parts: TextPart[] = [];
  const timers = extractTimers(text);

  if (timers.length === 0) {
    return [{ type: "text", content: text }];
  }

  // Reset regex lastIndex since extractTimers uses the global flag
  let lastIndex = 0;
  const re = new RegExp(TIME_RE.source, "gi");
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    const amount = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    let seconds = 0;
    if (unit.startsWith("h")) seconds = amount * 3600;
    else if (unit.startsWith("m")) seconds = amount * 60;
    else seconds = amount;

    parts.push({
      type: "timer",
      content: match[0],
      label: `${match[1]} ${match[2]}`,
      seconds: Math.round(seconds),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return parts;
}

export function StepCard({
  text,
  stepNumber,
  totalSteps,
  fontSize,
  onStartTimer,
}: StepCardProps) {
  const parts = useMemo(() => parseStepText(text), [text]);

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-4">
      {/* Step counter badge */}
      <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
        Step {stepNumber} of {totalSteps}
      </p>

      {/* Step text */}
      <p className={`font-medium text-white ${FONT_CLASS[fontSize]}`}>
        {parts.map((part, i) => {
          if (part.type === "text") {
            return <span key={i}>{part.content}</span>;
          }
          // Timer highlight
          return (
            <button
              key={i}
              onClick={() => {
                if (part.label && part.seconds !== undefined) {
                  onStartTimer(part.label, part.seconds);
                }
              }}
              aria-label={`Start ${part.label} timer`}
              className="inline-flex items-center gap-1 mx-0.5 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 hover:bg-orange-500/30 hover:border-orange-400/60 transition-colors cursor-pointer"
            >
              <Timer className="w-3.5 h-3.5 shrink-0" />
              {part.content}
            </button>
          );
        })}
      </p>
    </div>
  );
}
