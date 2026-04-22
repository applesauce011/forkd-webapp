export interface Entitlements {
  is_premium: boolean;
  trial_active: boolean;
  trial_start: string | null;
  trial_end: string | null;
  dictation: boolean;
  private_recipes: boolean;
  surprise_me_use_count: number;
  surprise_me_reset_at: string | null;
  surprise_me_weekly_limit: number;
  // App config limits
  free_feed_results_limit: number;
  free_trending_limit: number;
  free_new_this_week_limit: number;
  free_search_results_limit: number;
  free_bookmarks_visible: number;
  daily_recipe_view_limit: number;
  daily_follow_limit: number;
  cook_mode_free_uses: number;
  max_saved_searches: number;
  ai_dictation_daily_limit: number;
  ai_dictation_max_chars: number;
}

export const DEFAULT_ENTITLEMENTS: Entitlements = {
  is_premium: false,
  trial_active: false,
  trial_start: null,
  trial_end: null,
  dictation: false,
  private_recipes: false,
  surprise_me_use_count: 0,
  surprise_me_reset_at: null,
  surprise_me_weekly_limit: 2,
  free_feed_results_limit: 12,
  free_trending_limit: 12,
  free_new_this_week_limit: 7,
  free_search_results_limit: 15,
  free_bookmarks_visible: 5,
  daily_recipe_view_limit: 15,
  daily_follow_limit: 15,
  cook_mode_free_uses: 2,
  max_saved_searches: 12,
  ai_dictation_daily_limit: 10,
  ai_dictation_max_chars: 3000,
};
