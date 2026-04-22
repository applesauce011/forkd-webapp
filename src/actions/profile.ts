"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function claimProfile(formData: {
  display_name: string;
  username: string;
  bio?: string;
  avatar_source: "placeholder" | "custom";
  avatar_placeholder_key?: string;
  avatar_custom_path?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Call the claim_profile RPC
  const { error: rpcError } = await supabase.rpc("claim_profile", {
    new_display_name: formData.display_name,
    new_username: formData.username,
  });

  if (rpcError) {
    return { error: rpcError.message };
  }

  // Update additional fields
  const updateData: {
    bio?: string;
    avatar_source?: "placeholder" | "custom";
    avatar_placeholder_key?: string;
    avatar_custom_path?: string;
  } = {
    bio: formData.bio || undefined,
    avatar_source: formData.avatar_source,
  };
  if (formData.avatar_source === "placeholder" && formData.avatar_placeholder_key) {
    updateData.avatar_placeholder_key = formData.avatar_placeholder_key;
  }
  if (formData.avatar_source === "custom" && formData.avatar_custom_path) {
    updateData.avatar_custom_path = formData.avatar_custom_path;
  }

  await supabase.from("profiles").update(updateData).eq("id", user.id);

  redirect("/onboarding/follow");
}

export async function updateProfile(formData: {
  display_name?: string;
  username?: string;
  bio?: string;
  avatar_source?: "placeholder" | "custom";
  avatar_placeholder_key?: string;
  avatar_custom_path?: string;
  vibe_phrases?: string[];
  pinned_recipe_id?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update(formData)
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  revalidatePath("/settings");
  return { success: true };
}
