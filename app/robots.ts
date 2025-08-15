// robots.ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV === "production";
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://butterbee.gosatouchwood.com";
  return {
    rules: isProd ? [{ userAgent: "*", allow: "/" }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: new URL(base).host
  };
}
