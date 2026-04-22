/** Default free-tier limits — used as fallback before get_app_limits() loads */
export const DEFAULT_LIMITS = {
  free_feed_results_limit: 12,
  free_trending_limit: 12,
  free_new_this_week_limit: 7,
  free_search_results_limit: 15,
  free_bookmarks_visible: 5,
  daily_recipe_view_limit: 15,
  daily_follow_limit: 15,
  cook_mode_free_uses: 2,
  surprise_me_weekly_limit: 2,
  max_saved_searches: 12,
  ai_dictation_daily_limit: 10,
  ai_dictation_max_chars: 3000,
  trial_days: 7,
} as const;

export type AppLimits = typeof DEFAULT_LIMITS;
