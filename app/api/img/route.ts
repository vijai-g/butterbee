// Tiny image proxy for remote avatars/logos
import { NextResponse } from "next/server";

export const runtime = "edge"; // fast; switch to "nodejs" if you need auth or large files

export async function GET(req: Request) {
  const url = new URL(req.url);
  const src = url.searchParams.get("url") || "";

  try {
    // allow only https and a max length; reject data/file/etc. URIs
    const u = new URL(src);
    if (u.protocol !== "https:") {
      return NextResponse.json({ error: "ONLY_HTTPS" }, { status: 400 });
    }

    // fetch and stream through with caching
    const res = await fetch(u.toString(), { redirect: "follow" });
    if (!res.ok) return NextResponse.json({ error: "FETCH_FAILED" }, { status: 502 });

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    // simple content-type allowlist (images only)
    if (!/^image\//i.test(contentType)) {
      return NextResponse.json({ error: "NOT_IMAGE" }, { status: 415 });
    }

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    // cache for a day at the edge; tune as you like
    headers.set("Cache-Control", "public, s-maxage=86400, max-age=3600, stale-while-revalidate=86400");
    headers.set("X-Content-Type-Options", "nosniff");

    return new NextResponse(res.body, { headers });
  } catch {
    return NextResponse.json({ error: "BAD_URL" }, { status: 400 });
  }
}
