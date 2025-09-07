// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CreateOrderSchema = z.object({
  summary: z.string().min(5),
  status: z.string().optional(), // defaults to NEW
});

// Opaque, short, URL-safe, human-friendly code (no confusing 0/O/1/I)
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 chars
function makePublicId(len = 10) {
  const bytes = crypto.randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  // Optional brand prefix, keep it short:
  return `BB-${out.slice(0,4)}-${out.slice(4,7)}-${out.slice(7)}`; // e.g., BB-9X7Q-2DG-VH3
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "INVALID_PAYLOAD", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const userId = session?.user?.id ?? null;

    // Generate a unique publicId (retry if rare collision)
    let publicId = "";
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        publicId = makePublicId();
        const order = await prisma.order.create({
          data: {
            publicId,
            summary: parsed.data.summary,
            status: parsed.data.status ?? "NEW",
            userId,
          },
          select: { id: true, publicId: true, status: true, createdAt: true },
        });
        return NextResponse.json(order, { status: 201 });
      } catch (e: any) {
        // Unique constraint violation => try again
        if (e?.code === "P2002") continue;
        throw e;
      }
    }

    // Should never reach here
    return NextResponse.json({ error: "COULD_NOT_ALLOCATE_ID" }, { status: 500 });
  } catch (e) {
    console.error("[orders:POST]", e);
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}
