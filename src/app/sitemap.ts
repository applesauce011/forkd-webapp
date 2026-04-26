import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { toRecipeSlug } from "@/lib/utils/recipe-slug";

const PAGE_SIZE = 1000;

export async function generateSitemaps() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("recipes_visible")
    .select("*", { count: "exact", head: true })
    .eq("is_private", false);

  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return Array.from({ length: pages }, (_, i) => ({ id: i }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const idStr = await props.id;
  const pageIndex = parseInt(idStr, 10);
  const supabase = await createClient();

  const [recipesRes, profilesRes] = await Promise.all([
    supabase
      .from("recipes_visible")
      .select("id, title, updated_at")
      .eq("is_private", false)
      .order("created_at", { ascending: false })
      .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1),
    // Profiles only included on the first sitemap page
    pageIndex === 0
      ? supabase
          .from("profiles_visible")
          .select("username, updated_at")
          .not("username", "is", null)
          .limit(PAGE_SIZE)
      : Promise.resolve({ data: [] as { username: string | null; updated_at: string | null }[] }),
  ]);

  const staticUrls: MetadataRoute.Sitemap = pageIndex === 0
    ? [
        { url: "https://forkd.app", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
        { url: "https://forkd.app/feed", lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
        { url: "https://forkd.app/search", lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
        { url: "https://forkd.app/upgrade", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
      ]
    : [];

  const recipeUrls: MetadataRoute.Sitemap = (recipesRes.data ?? [])
    .filter((r): r is typeof r & { id: string } => !!r.id)
    .map((r) => ({
      url: `https://forkd.app/recipe/${toRecipeSlug(r.title ?? "recipe", r.id)}`,
      lastModified: r.updated_at ? new Date(r.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const profileUrls: MetadataRoute.Sitemap = (profilesRes.data ?? [])
    .filter((p) => p.username)
    .map((p) => ({
      url: `https://forkd.app/profile/${p.username}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.4,
    }));

  return [...staticUrls, ...recipeUrls, ...profileUrls];
}
