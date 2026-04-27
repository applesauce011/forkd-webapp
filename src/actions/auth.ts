"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signUp(formData: { email: string; password: string }) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "https://forkd.io";

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback?next=/onboarding`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // When Supabase email confirmation is disabled, a session is returned immediately
  if (data.session) {
    redirect("/onboarding");
  }

  return { success: true, message: "Check your email to confirm your account." };
}

export async function logIn(formData: { email: string; password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function sendPasswordResetEmail(email: string) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "https://forkd.io";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/feed");
}

export async function initiateAppleSignIn() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "https://forkd.io";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error || !data.url) {
    return { error: error?.message ?? "Failed to initiate Apple sign in" };
  }

  return { url: data.url };
}
