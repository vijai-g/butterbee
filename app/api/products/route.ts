// app/api/products/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ---------- helpers ---------- */
const DeptEnum = z.enum(["FOOD", "CLOTHES", "SPORTS"]);
const toDept = (s: string | null) => {
  switch ((s ?? "").toLowerCase()) {
    case "food":
    case "foods":
      return "FOOD";
    case "clothes":
    case "clothing":
      return "CLOTHES";
    case "sports":
    case "sport":
      return "SPORTS";
    default:
      return undefined;
  }
};

const ProductSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(2).max(2000),
  price: z.coerce.number().int().nonnegative(),
  image: z.string().min(1), // /images/foo.jpg, foo.jpg, https://..., or data:...
  category: z.string().min(1),
  department: DeptEnum.optional().default("FOOD"), // NEW
  available: z.boolean().optional().default(true),
});

// image helpers (incl data URLs)
const isExternal = (s: string) => /^https?:\/\//i.test(s);
const isLocalPath = (s: string) => s.startsWith("/images/");
const isDataURL = (s: string) => /^data:/i.test(s);
const normalizeImage = (s: string) => {
  const t = s.trim().replace(/\s+/g, " ");
  if (!t) return t;
  if (isExternal(t) || isLocalPath(t) || isDataURL(t)) return t;
  return `/images/${t.replace(/^\/+/, "")}`;
};

function requireAdmin(session: any) {
  if (!session) throw new Error("UNAUTHORIZED");
  const role = (session.user as any)?.role;
  if (role !== "ADMIN") throw new Error("FORBIDDEN");
}

/* ---------- GET ---------- */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const avail = searchParams.get("available");
  const category = searchParams.get("category") ?? undefined;
  const q = searchParams.get("q")?.trim();
  const dept = toDept(searchParams.get("dept"));

  const where: any = {};
  if (avail === "true") where.available = true;
  else if (avail === "false") where.available = false;

  if (category) where.category = category;
  if (dept) where.department = dept;

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return NextResponse.json(products, { status: 200 });
}

/* ---------- POST ---------- */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    requireAdmin(session);

    const body = await req.json();
    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "INVALID_PAYLOAD", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const created = await prisma.product.create({
      data: { ...parsed.data, image: normalizeImage(parsed.data.image) },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (e?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    if (e?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }
    console.error("[products:POST]", e);
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}
