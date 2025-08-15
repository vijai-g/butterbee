// sitemap.ts
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://butterbee.gosatouchwood.com";
  const pages = ["", "/menu", "/cart", "/checkout", "/about", "/contact"];
  const now = new Date();
  return pages.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.7
  }));
}
