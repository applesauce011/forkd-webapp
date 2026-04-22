const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export function getPublicUrl(bucket: string, path: string | null | undefined): string | null {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export function getAvatarUrl(profile: {
  avatar_source: string | null;
  avatar_placeholder_key: string | null;
  avatar_custom_path: string | null;
} | null): string | null {
  if (!profile) return null;
  if (profile.avatar_source === "custom" && profile.avatar_custom_path) {
    return getPublicUrl("avatars", profile.avatar_custom_path);
  }
  if (profile.avatar_placeholder_key) {
    return getPublicUrl("avatar-placeholders", profile.avatar_placeholder_key);
  }
  return null;
}

export function getRecipePhotoUrl(path: string | null | undefined): string | null {
  return getPublicUrl("recipe-photos", path);
}
