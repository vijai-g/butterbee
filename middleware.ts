import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = pathname.startsWith("/admin") || pathname.startsWith("/tt");
  if (!needsAuth) return NextResponse.next();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) { const url = req.nextUrl.clone(); url.pathname = "/login"; url.searchParams.set("from", pathname); return NextResponse.redirect(url); }
  const role = (token as any).role;
  if (pathname.startsWith("/admin") && role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });
  if (pathname.startsWith("/tt") && !(role === "ADMIN" || role === "PARTNER")) return new NextResponse("Forbidden", { status: 403 });
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*", "/tt/:path*"] };
