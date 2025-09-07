import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IdSchema = z.object({ id: z.string().min(1) });

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const { id } = IdSchema.parse(ctx.params);

    // Only allow touching own addresses
    const row = await prisma.address.findFirst({ where: { id, userId: session.user.id } });
    if (!row) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    // Make default
    await prisma.$transaction([
      prisma.address.updateMany({ where: { userId: session.user.id, isDefault: true }, data: { isDefault: false } }),
      prisma.address.update({ where: { id }, data: { isDefault: true } }),
    ]);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("[addresses:PATCH]", e);
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const { id } = IdSchema.parse(ctx.params);

    const row = await prisma.address.findFirst({ where: { id, userId: session.user.id } });
    if (!row) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("[addresses:DELETE]", e);
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}
