import type { Database } from "./database";

// Convenience row type aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
export type RecipeStat = Database["public"]["Tables"]["recipe_stats"]["Row"];
export type Like = Database["public"]["Tables"]["likes"]["Row"];
export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
export type Follow = Database["public"]["Tables"]["follows"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type NotificationPreferences = Database["public"]["Tables"]["notification_preferences"]["Row"];
export type UserEntitlement = Database["public"]["Tables"]["user_entitlements"]["Row"];
export type SmartTag = Database["public"]["Tables"]["smart_tags"]["Row"];
export type ContentReport = Database["public"]["Tables"]["content_reports"]["Row"];
export type PromoCode = Database["public"]["Tables"]["promo_codes"]["Row"];
export type PremiumAccessGrant = Database["public"]["Tables"]["premium_access_grants"]["Row"];
export type CookedRecipe = Database["public"]["Tables"]["cooked_recipes"]["Row"];
export type RecipeRating = Database["public"]["Tables"]["recipe_ratings"]["Row"];
export type RecipeReaction = Database["public"]["Tables"]["recipe_reactions"]["Row"];
export type AvatarPlaceholder = Database["public"]["Tables"]["avatar_placeholders"]["Row"];

// Enriched types used throughout the UI
export type RecipePhoto = { id: string; url: string; position: number };

export type RecipeWithAuthor = Recipe & {
  profiles: Profile | null;
  recipe_stats: RecipeStat | null;
  recipe_photos?: RecipePhoto[] | null;
};

export type RecipeWithMeta = Recipe & {
  author: Profile | null;
  stats: RecipeStat | null;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  is_cooked?: boolean;
  user_rating?: number | null;
};

export type ProfileWithCounters = Profile & {
  recipes_count?: number;
  remixes_count?: number;
  followers_count?: number;
  following_count?: number;
  total_likes_received?: number;
  total_bookmarks_received?: number;
};

export type NotificationWithActor = Notification & {
  actor: Profile | null;
  recipe: { title: string; photos: string[] | null } | null;
};
