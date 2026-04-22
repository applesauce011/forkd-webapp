"use client";

import { useEffect, useRef } from "react";

export function useWakeLock(enabled: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  async function acquire() {
    if (!("wakeLock" in navigator)) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
    } catch {
      // Wake lock request failed — device or OS may not support it
    }
  }

  async function release() {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  }

  useEffect(() => {
    if (!enabled) {
      release();
      return;
    }

    acquire();

    // Re-acquire when page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && enabled) {
        acquire();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      release();
    };
  }, [enabled]);
}
