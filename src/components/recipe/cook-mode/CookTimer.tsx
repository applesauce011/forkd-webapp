"use client";

import { useEffect, useRef } from "react";
import { X, Play, Pause, RotateCcw } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";

interface CookTimerProps {
  label: string;
  seconds: number;
  onDismiss: () => void;
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Simple beep using Web Audio API
function playBeep() {
  try {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 880;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);
  } catch {
    // Audio not supported
  }
}

function vibrate() {
  if ("vibrate" in navigator) {
    navigator.vibrate([200, 100, 200, 100, 200]);
  }
}

export function CookTimer({ label, seconds: initialSeconds, onDismiss }: CookTimerProps) {
  const { seconds, running, start, pause, reset, isDone } = useTimer(initialSeconds);
  const alerted = useRef(false);

  // Alert when timer finishes
  useEffect(() => {
    if (isDone && !alerted.current) {
      alerted.current = true;
      playBeep();
      vibrate();
    }
    if (!isDone) {
      alerted.current = false;
    }
  }, [isDone]);

  // Progress: 0 → 1 as time elapses
  const progress = initialSeconds > 0 ? seconds / initialSeconds : 0;
  const circumference = 2 * Math.PI * 22; // r=22
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      className={`relative flex items-center gap-3 px-3 py-2 rounded-xl border transition-colors ${
        isDone
          ? "bg-red-950/60 border-red-500/50 animate-pulse"
          : "bg-gray-800/80 border-gray-700/50"
      }`}
    >
      {/* Circular progress ring */}
      <div className="relative w-12 h-12 shrink-0">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 50 50">
          {/* Track */}
          <circle
            cx="25"
            cy="25"
            r="22"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
          {/* Progress */}
          <circle
            cx="25"
            cy="25"
            r="22"
            fill="none"
            stroke={isDone ? "#ef4444" : "#f97316"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.5s linear" }}
          />
        </svg>
        {/* Time label in ring center */}
        <span
          className={`absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold tabular-nums ${
            isDone ? "text-red-400" : "text-white"
          }`}
        >
          {formatTime(seconds)}
        </span>
      </div>

      {/* Label + controls */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-300 truncate">{label}</p>
        {isDone && (
          <p className="text-xs text-red-400 font-semibold">Time&apos;s up!</p>
        )}
        <div className="flex items-center gap-1.5 mt-1">
          {!isDone && (
            <>
              {running ? (
                <button
                  onClick={pause}
                  aria-label="Pause timer"
                  className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                >
                  <Pause className="w-2.5 h-2.5" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={start}
                  aria-label="Start timer"
                  className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-orange-600 hover:bg-orange-500 text-white transition-colors"
                >
                  <Play className="w-2.5 h-2.5" />
                  Start
                </button>
              )}
            </>
          )}
          <button
            onClick={reset}
            aria-label="Reset timer"
            className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        aria-label="Dismiss timer"
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
