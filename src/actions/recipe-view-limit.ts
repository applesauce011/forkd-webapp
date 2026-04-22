"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function checkAndTrackRecipeView(
  recipeId: string
): Promise<{ allowed: boolean; limit: number; count: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated users browse freely
  if (!user) return { allowed: true, limit: 0, count: 0 };

  // Premium users have no limit
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium")
    .eq("id", user.id)
    .single();

  if (profile?.is_premium) return { allowed: true, limit: 0, count: 0 };

  // Get limit from app_config via entitlements RPC
  const { data: entRaw } = await supabase.rpc("get_my_entitlements");
  const limit = Number((entRaw as Record<string, unknown>)?.daily_recipe_view_limit ?? 15);

  // Cookie tracks which recipe IDs were viewed today
  const cookieStore = await cookies();
  const today = new Date().toISOString().split("T")[0];
  const cookieName = `rvl_${today}`;

  let viewed: string[] = [];
  try {
    viewed = JSON.parse(cookieStore.get(cookieName)?.value ?? "[]");
  } catch {
    viewed = [];
  }

  // Re-visiting the same recipe doesn't consume quota
  if (viewed.includes(recipeId)) {
    return { allowed: true, limit, count: viewed.length };
  }

  if (viewed.length >= limit) {
    return { allowed: false, limit, count: viewed.length };
  }

  viewed.push(recipeId);
  const expires = new Date();
  expires.setDate(expires.getDate() + 2);
  cookieStore.set(cookieName, JSON.stringify(viewed), {
    expires,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return { allowed: true, limit, count: viewed.length };
}
