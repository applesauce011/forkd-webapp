"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function claimProfile(formData: {
  display_name: string;
  username: string;
  bio?: string;
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

  // Auto-assign a random placeholder avatar
  const { data: placeholders } = await supabase
    .from("avatar_placeholders")
    .select("path");

  const avatarKey = placeholders && placeholders.length > 0
    ? placeholders[Math.floor(Math.random() * placeholders.length)].path
    : null;

  await supabase.from("profiles").update({
    bio: formData.bio || undefined,
    avatar_source: "placeholder",
    ...(avatarKey ? { avatar_placeholder_key: avatarKey } : {}),
  }).eq("id", user.id);

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
