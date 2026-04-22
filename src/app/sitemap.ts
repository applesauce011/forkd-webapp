import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: recipes }, { data: profiles }] = await Promise.all([
    supabase
      .from("recipes_visible")
      .select("id, updated_at")
      .eq("is_private", false)
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase
      .from("profiles_visible")
      .select("username, updated_at")
      .not("username", "is", null)
      .limit(1000),
  ]);

  const recipeUrls: MetadataRoute.Sitemap = (recipes ?? []).map((r) => ({
    url: `https://forkd.app/recipe/${r.id}`,
    lastModified: r.updated_at ? new Date(r.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const profileUrls: MetadataRoute.Sitemap = (profiles ?? [])
    .filter((p) => p.username)
    .map((p) => ({
      url: `https://forkd.app/profile/${p.username}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    }));

  return [
    {
      url: "https://forkd.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://forkd.app/feed",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: "https://forkd.app/search",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://forkd.app/upgrade",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...recipeUrls,
    ...profileUrls,
  ];
}
