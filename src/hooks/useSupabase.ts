import { useSupabaseContext } from "@/contexts/SupabaseContext";

export function useSupabase() {
  return useSupabaseContext();
}
