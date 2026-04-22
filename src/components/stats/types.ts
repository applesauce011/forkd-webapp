export interface RatingDistributionEntry {
  stars: number;
  count: number;
}

export interface ActivityEntry {
  date: string; // ISO date string "YYYY-MM-DD"
  count: number;
}

export interface CreatorStatsFull {
  total_recipes: number;
  total_likes: number;
  total_cooks: number;
  total_bookmarks: number;
  avg_rating: number | null;
  total_ratings?: number | null;
  current_streak: number | null;
  longest_streak?: number | null;
  rating_distribution?: RatingDistributionEntry[] | null;
  activity_by_day?: ActivityEntry[] | null;
  // Additional fields the RPC may return
  [key: string]: unknown;
}
