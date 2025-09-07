import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AddressCreate = z.object({
  label: z.string().trim().max(50).optional(),
  door: z.string().trim().max(100).optional(),
  tower: z.string().trim().max(100).optional(),
  apartment: z.string().trim().max(100).optional(),
  line1: z.string().trim().max(200).optional(),
  city: z.string().trim().max(80).optional(),
  state: z.string().trim().max(80).optional(),
  pincode: z.string().trim().max(20).optional(),
  isDefault: z.boolean().optional(),
});

// GET current user's addresses
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  // Not logged in -> empty list (keeps UI simple)
  if (!userId) return NextResponse.json([], { status: 200 });

  const rows = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });
  return NextResponse.json(rows, { status: 200 });
}

// app/api/addresses/route.ts (just the POST handler)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
    }

    let uid = (session.user as any).id as string | undefined;
    if (!uid) {
      return NextResponse.json({ error: "NO_USER_ID_IN_SESSION" }, { status: 401 });
    }

    // Ensure the referenced user exists (protects the FK)
    let user = await prisma.user.findUnique({ where: { id: uid }, select: { id: true } });

    // Optional rescue: if id-based lookup fails but we have email, try by email.
    if (!user && session.user.email) {
      const byEmail = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      if (byEmail) {
        uid = byEmail.id;
        user = byEmail;
      }
    }

    if (!user) {
      // Ask client to sign out/in to refresh the session & create the user via adapter
      return NextResponse.json(
        { error: "USER_NOT_FOUND", action: "SIGN_OUT_AND_SIGN_IN" },
        { status: 409 }
      );
    }

    const body = await req.json();
    const parsed = z.object({
      door: z.string().min(1),
      tower: z.string().min(1),
      apartment: z.string().min(1),
      isDefault: z.boolean().optional().default(true),
    }).safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "INVALID_PAYLOAD", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { door, tower, apartment, isDefault } = parsed.data;

    const created = await prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.address.updateMany({
          where: { userId: uid! },
          data: { isDefault: false, updatedAt: new Date() },
        });
      }
      return tx.address.create({
        data: { userId: uid!, door, tower, apartment, isDefault: !!isDefault },
      });
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2003") {
      // FK error, surface a clearer message
      return NextResponse.json({ error: "FOREIGN_KEY_USER_MISSING" }, { status: 409 });
    }
    console.error("[addresses:POST]", e);
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}

