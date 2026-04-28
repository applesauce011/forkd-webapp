import { EntitlementsProvider } from "@/contexts/EntitlementsContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { createClient } from "@/lib/supabase/server";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { AuthLoadingGate } from "@/components/layout/AuthLoadingGate";
import type { Entitlements } from "@/types/entitlements";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let entitlements: Entitlements | null = null;
  let profile = null;

  if (user) {
    // Load entitlements (includes app limits)
    const { data: entRaw } = await supabase.rpc("get_my_entitlements");
    const ent = entRaw as Record<string, unknown> | null;
    if (ent) {
      entitlements = {
        is_premium: (ent.is_premium as boolean) ?? false,
        trial_active: (ent.trial_active as boolean) ?? false,
        trial_start: (ent.trial_start as string) ?? null,
        trial_end: (ent.trial_end as string) ?? null,
        dictation: (ent.dictation as boolean) ?? false,
        private_recipes: (ent.private_recipes as boolean) ?? false,
        surprise_me_use_count: (ent.surprise_me_use_count as number) ?? 0,
        surprise_me_reset_at: (ent.surprise_me_reset_at as string) ?? null,
        surprise_me_weekly_limit: (ent.surprise_me_weekly_limit as number) ?? 2,
        free_feed_results_limit: Number(ent.free_feed_results_limit ?? 12),
        free_trending_limit: Number(ent.free_trending_limit ?? 12),
        free_new_this_week_limit: Number(ent.free_new_this_week_limit ?? 7),
        free_search_results_limit: Number(ent.free_search_results_limit ?? 15),
        free_bookmarks_visible: Number(ent.free_bookmarks_visible ?? 5),
        daily_recipe_view_limit: Number(ent.daily_recipe_view_limit ?? 15),
        daily_follow_limit: Number(ent.daily_follow_limit ?? 15),
        cook_mode_free_uses: Number(ent.cook_mode_free_uses ?? 2),
        max_saved_searches: Number(ent.max_saved_searches ?? 12),
        ai_dictation_daily_limit: Number(ent.ai_dictation_daily_limit ?? 10),
        ai_dictation_max_chars: Number(ent.ai_dictation_max_chars ?? 3000),
      };
    }

    // Load user profile
    const { data: p } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_source, avatar_placeholder_key, avatar_custom_path, is_founding_cook, is_premium")
      .eq("id", user.id)
      .single();
    profile = p;

    // Onboarding guard — if no username, redirect to onboarding
    if (!profile?.username) {
      const { redirect } = await import("next/navigation");
      redirect("/onboarding");
    }
  }

  // Fetch total public recipe count for footer
  const { count: recipeCount } = await supabase
    .from("recipes_visible")
    .select("id", { count: "exact", head: true })
    .eq("visibility", "public");

  return (
    <AuthLoadingGate>
      <EntitlementsProvider initialEntitlements={entitlements}>
        <NotificationsProvider>
          <div className="flex flex-col min-h-screen">
            <TopBar profile={profile} />
            <div className="flex flex-1">
              <Sidebar username={profile?.username} />
              <main className="flex-1 pb-20 md:pb-0 flex flex-col">
                <div className="flex-1">
                  {children}
                </div>
                <Footer recipeCount={recipeCount ?? 0} />
              </main>
            </div>
            <BottomNav username={profile?.username} />
          </div>
        </NotificationsProvider>
      </EntitlementsProvider>
    </AuthLoadingGate>
  );
}
