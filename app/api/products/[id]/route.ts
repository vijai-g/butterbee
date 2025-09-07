// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IdSchema = z.object({ id: z.string().min(1) });

const DeptEnum = z.enum(["FOOD","CLOTHES","SPORTS"]);


const UpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().min(2).max(2000).optional(),
  price: z.coerce.number().int().nonnegative().optional(),
  image: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  department: DeptEnum.optional(),       // NEW
  available: z.boolean().optional(),
});


// --- image helpers (allow external + data URLs) ---
const isExternal  = (s: string) => /^https?:\/\//i.test(s);
const isLocalPath = (s: string) => s.startsWith("/images/");
const isDataURL   = (s: string) => /^data:/i.test(s);
const normalizeImage = (s: string) => {
  const t = s.trim();
  if (!t) return t;
  if (isExternal(t) || isLocalPath(t) || isDataURL(t)) return t;
  // bare filename like "foo.jpg" -> "/images/foo.jpg"
  return `/images/${t.replace(/^\/+/, "")}`;
};

function requireAdmin(session: any) {
  if (!session) throw new Error("UNAUTHORIZED");
  const role = (session.user as any)?.role;
  if (role !== "ADMIN") throw new Error("FORBIDDEN");
}

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    requireAdmin(session);

    // validate id
    const idParsed = IdSchema.safeParse(ctx.params);
    if (!idParsed.success) {
      return NextResponse.json({ error: "INVALID_ID" }, { status: 400 });
    }

    // validate body
    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "INVALID_PAYLOAD", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data: any = { ...parsed.data };
    if (typeof data.image === "string") {
      data.image = normalizeImage(data.image);
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "NO_CHANGES" }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id: idParsed.data.id },
      data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }
    if (e?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    if (e?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }
    console.error("[products:PUT] failed"); // minimal log
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    requireAdmin(session);

    const idParsed = IdSchema.safeParse(ctx.params);
    if (!idParsed.success) {
      return NextResponse.json({ error: "INVALID_ID" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id: idParsed.data.id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }
    if (e?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    if (e?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }
    console.error("[products:DELETE] failed"); // minimal log
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}
