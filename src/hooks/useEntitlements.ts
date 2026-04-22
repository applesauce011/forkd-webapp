import { useEntitlementsContext } from "@/contexts/EntitlementsContext";

export function useEntitlements() {
  return useEntitlementsContext().entitlements;
}
