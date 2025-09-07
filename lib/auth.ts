// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";
import { z } from "zod";

// Trim to avoid hidden spaces/newlines that cause Google "invalid_client"
const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID ?? "").trim();
const GOOGLE_CLIENT_SECRET = (process.env.GOOGLE_CLIENT_SECRET ?? "").trim();

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn(
    "[auth] GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET not set; Google provider will be disabled (avoid invalid_client)."
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    // Include Google only when fully configured
    ...(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
      ? [Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })]
      : []),

    Credentials({
      name: "phone",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const schema = z.object({
          phone: z.string().min(8),
          password: z.string().min(4),
        });
        const parsed = schema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { phone: parsed.data.phone },
        });
        if (!user?.password) return null;

        const ok = await compare(parsed.data.password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name ?? user.phone!,
          email: user.email ?? undefined,
          image: user.image ?? undefined,
          role: user.role,
        } as any;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On sign-in we get the full user from the adapter; stash role in the token.
      if (user) {
        token.role = (user as any).role ?? "USER";
      } else if (!token.role && token.sub) {
        // If role missing (first request after sign-in in some flows), fetch once.
        const u = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });
        token.role = u?.role ?? "USER";
      }
      return token;
    },

    async session({ session, token }) {
      (session.user as any).id = token.sub;
      (session.user as any).role = (token as any).role ?? "USER";
      return session;
    },
  },

  pages: { signIn: "/login" },

  // Extra logs in dev help diagnose provider/env issues
  debug: process.env.NODE_ENV === "development",
};
