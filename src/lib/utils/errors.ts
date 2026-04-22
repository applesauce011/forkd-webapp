import type { PostgrestError } from "@supabase/supabase-js";

export function getErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred.";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "An unexpected error occurred.";
}

export function isAuthError(error: unknown): boolean {
  if (!error) return false;
  const msg = getErrorMessage(error).toLowerCase();
  return (
    msg.includes("invalid login credentials") ||
    msg.includes("email not confirmed") ||
    msg.includes("user not found") ||
    msg.includes("jwt")
  );
}

export function postgrestErrorToMessage(error: PostgrestError | null): string {
  if (!error) return "";
  // Map common Postgres constraint names to friendly messages
  if (error.code === "23505") {
    if (error.message.includes("username")) return "This username is already taken.";
    if (error.message.includes("email")) return "An account with this email already exists.";
    return "This value already exists.";
  }
  if (error.code === "23514") return "Invalid value provided.";
  if (error.code === "42501") return "You don't have permission to do that.";
  return error.message || "Something went wrong.";
}
