import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PinnedRecipe } from "@/components/profile/PinnedRecipe";
import { RecipeTabs } from "@/components/profile/RecipeTabs";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { RecipeWithAuthor } from "@/types/app";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles_visible")
    .select("display_name, bio, username, avatar_custom_path")
    .eq("username", username)
    .single();

  if (!profile) return { title: "Profile not found" };

  const name = profile.display_name || profile.username || "Chef";
  const description = profile.bio || `Check out ${name}'s recipes on Fork'd`;

  return {
    title: `${name} (@${profile.username})`,
    description,
    openGraph: {
      title: `${name} on Fork'd`,
      description,
      type: "profile",
      username: profile.username ?? undefined,
    },
    twitter: {
      card: "summary",
      title: `${name} on Fork'd`,
      description,
    },
    alternates: {
      canonical: `/profile/${profile.username}`,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles_visible")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile || !profile.id) notFound();

  // Fetch counters
  const { data: counters } = await supabase
    .from("profile_counters")
    .select("*")
    .eq("user_id", profile.id)
    .single();

  // Check current auth user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwnProfile = user?.id === profile.id;

  // Check follow status for other users
  let isFollowing = false;
  if (user && !isOwnProfile) {
    const { data: followRow } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("follower_id", user.id)
      .eq("followed_id", profile.id)
      .single();
    isFollowing = !!followRow;
  }

  // Fetch pinned recipe if any
  let pinnedRecipe: RecipeWithAuthor | null = null;
  if (profile.pinned_recipe_id) {
    const { data: pr } = await supabase
      .from("recipes_visible")
      .select(
        `*, profiles!recipes_author_fk(id, username, display_name, avatar_source, avatar_placeholder_key, avatar_custom_path, is_founding_cook, is_premium), recipe_stats(*)`
      )
      .eq("id", profile.pinned_recipe_id)
      .single();

    if (pr) pinnedRecipe = pr as unknown as RecipeWithAuthor;
  }

  const safeCounters = counters ?? {
    user_id: profile.id,
    recipes_count: 0,
    followers_count: 0,
    following_count: 0,
  };

  // Fetch avg rating for premium profiles
  let profileAvgRating: number | null = null;
  if (profile.is_premium) {
    const { data: recipeIds } = await supabase
      .from("recipes")
      .select("id")
      .eq("author_id", profile.id)
      .eq("visibility", "public")
      .is("deleted_at", null);

    const ids = (recipeIds ?? []).map((r) => r.id);
    if (ids.length > 0) {
      const { data: ratingRows } = await supabase
        .from("recipe_ratings")
        .select("rating")
        .in("recipe_id", ids);

      if (ratingRows && ratingRows.length > 0) {
        profileAvgRating =
          ratingRows.reduce((s, r) => s + Number(r.rating), 0) / ratingRows.length;
      }
    }
  }

  return (
    <PageWrapper className="max-w-2xl py-6">
      <ProfileHeader
        profile={profile}
        counters={safeCounters}
        isOwnProfile={isOwnProfile}
        initialIsFollowing={isFollowing}
        avgRating={profileAvgRating}
      />

      {pinnedRecipe && <PinnedRecipe recipe={pinnedRecipe} />}

      <RecipeTabs userId={profile.id} username={profile.username ?? username} />
    </PageWrapper>
  );
}
