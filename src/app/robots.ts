import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/recipe/", "/profile/", "/feed", "/search"],
        disallow: [
          "/settings/",
          "/api/",
          "/onboarding/",
          "/bookmarks",
          "/stats",
          "/notifications",
          "/upgrade",
          "/invite",
          "/redeem",
          "/recipe/*/cook",
          "/recipe/*/edit",
        ],
      },
    ],
    sitemap: "https://forkd.app/sitemap.xml",
  };
}
