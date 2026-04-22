import { useSupabaseContext } from "@/contexts/SupabaseContext";

export function useSession() {
  const { session, user, loading } = useSupabaseContext();
  return { session, user, loading };
}
