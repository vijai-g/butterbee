import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULTS = {
  apartments: ["Olympia Opaline", "Test"],
  slots: [
    { id: "6-8",   label: "6–8 AM",  startHour: 6,  startMinute: 0,  active: true },
    { id: "8-10",  label: "8–10 AM", startHour: 8,  startMinute: 0,  active: true },
    { id: "17-19", label: "5–7 PM",  startHour: 17, startMinute: 0,  active: true },
  ],
};

const SlotSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  startHour: z.number().int().min(0).max(23),
  startMinute: z.number().int().min(0).max(59),
  active: z.boolean().optional().default(true),
});

const PutSchema = z.object({
  // Admin can send either apartmentsCsv or apartments[]
  apartmentsCsv: z.string().optional(),
  apartments: z.array(z.string().min(1)).optional(),
  slots: z.array(SlotSchema).optional(),
});

function requireAdmin(session: any) {
  const role = session?.user && (session.user as any).role;
  if (role !== "ADMIN") throw new Error("FORBIDDEN");
}

export async function GET() {
  const row = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  let apartments = DEFAULTS.apartments;
  let slots = DEFAULTS.slots;

  if (row?.apartmentsCsv) {
    apartments = row.apartmentsCsv
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
  }

  if (row?.slotsJson) {
    try {
      const parsed = JSON.parse(row.slotsJson);
      const safe = z.array(SlotSchema).safeParse(parsed);
      if (safe.success) slots = safe.data;
    } catch {
      /* fall back to defaults */
    }
  }

  return NextResponse.json({ apartments, slots }, { status: 200 });
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    requireAdmin(session);

    const body = await req.json();
    const parsed = PutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "INVALID_PAYLOAD", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const apartmentsCsv = parsed.data.apartmentsCsv ??
      (parsed.data.apartments ? parsed.data.apartments.map(s => s.trim()).filter(Boolean).join(",") : undefined);

    const slotsJson = parsed.data.slots ? JSON.stringify(parsed.data.slots) : undefined;

    const updated = await prisma.siteConfig.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        apartmentsCsv: apartmentsCsv ?? DEFAULTS.apartments.join(","),
        slotsJson: slotsJson ?? JSON.stringify(DEFAULTS.slots),
      },
      update: {
        ...(apartmentsCsv !== undefined ? { apartmentsCsv } : {}),
        ...(slotsJson !== undefined ? { slotsJson } : {}),
      },
    });

    // respond normalized
    const apartments = (updated.apartmentsCsv || "")
      .split(",").map(s => s.trim()).filter(Boolean);
    const slots = JSON.parse(updated.slotsJson || "[]");

    return NextResponse.json({ apartments, slots }, { status: 200 });
  } catch (e: any) {
    if (e?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }
    console.error("[settings:PUT]", e);
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}
