"use client";

import { createContext, useContext } from "react";
import type { Entitlements } from "@/types/entitlements";
import { DEFAULT_ENTITLEMENTS } from "@/types/entitlements";

interface EntitlementsContextValue {
  entitlements: Entitlements;
}

const EntitlementsContext = createContext<EntitlementsContextValue>({
  entitlements: DEFAULT_ENTITLEMENTS,
});

export function EntitlementsProvider({
  children,
  initialEntitlements,
}: {
  children: React.ReactNode;
  initialEntitlements: Entitlements | null;
}) {
  return (
    <EntitlementsContext.Provider
      value={{ entitlements: initialEntitlements ?? DEFAULT_ENTITLEMENTS }}
    >
      {children}
    </EntitlementsContext.Provider>
  );
}

export function useEntitlementsContext() {
  return useContext(EntitlementsContext);
}
