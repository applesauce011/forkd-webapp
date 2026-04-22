"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function followUser(targetUserId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: user.id, followed_id: targetUserId });

  if (error) return { error: error.message };

  revalidatePath("/profile");
  return {};
}

export async function unfollowUser(targetUserId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("followed_id", targetUserId);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  return {};
}

export async function blockUser(targetUserId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.rpc("block_user", { p_blocked: targetUserId });

  if (error) return { error: error.message };

  return {};
}

export async function unblockUser(targetUserId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.rpc("unblock_user", { p_blocked: targetUserId });

  if (error) return { error: error.message };

  revalidatePath("/settings/blocked");
  return {};
}
