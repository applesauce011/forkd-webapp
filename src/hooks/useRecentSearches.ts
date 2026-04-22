"use client";

import { useState, useCallback } from "react";

const STORAGE_KEY = "forkd_recent_searches";
const MAX_SEARCHES = 8;

export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const add = useCallback((query: string) => {
    if (!query.trim()) return;
    setSearches((prev) => {
      const deduped = [query, ...prev.filter((s) => s !== query)].slice(0, MAX_SEARCHES);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped));
      } catch {}
      return deduped;
    });
  }, []);

  const remove = useCallback((query: string) => {
    setSearches((prev) => {
      const next = prev.filter((s) => s !== query);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { searches, add, remove, clear };
}
