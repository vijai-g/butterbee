import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const phone = process.env.WA_PHONE; // server-only
  if (!phone) {
    return new NextResponse("WA_PHONE not set", { status: 500 });
  }

  const text = req.nextUrl.searchParams.get("text") || "Hi ButterBee";
  const target = new URL(`https://wa.me/${phone}`);
  target.searchParams.set("text", text);

  // 302 so it opens the WhatsApp app/site immediately
  return NextResponse.redirect(target.toString(), 302);
}
