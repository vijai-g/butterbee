// app/api/images/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";        // must be Node (FS access)
export const dynamic = "force-dynamic"; // don't cache listing

const ALLOW = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"]);

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "images");
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((n) => ALLOW.has(path.extname(n).toLowerCase()))
      .sort((a, b) => a.localeCompare(b));
    return NextResponse.json({ files });
  } catch (e) {
    console.error("[images:GET]", e);
    return NextResponse.json({ files: [] });
  }
}
