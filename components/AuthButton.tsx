"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) return <span className="text-sm opacity-60">…</span>;

  if (!session) {
    return (
      <button
        className="btn btn-ghost"
        onClick={() => signIn(undefined, { callbackUrl: "/" })}
        aria-label="Log in"
      >
        Log in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {session.user?.image && (
        <Image
          src={session.user.image}
          alt={session.user?.name ?? "User"}
          width={28}
          height={28}
          className="rounded-full"
        />
      )}
      <span className="hidden sm:inline text-sm">
        {session.user?.name ?? "Account"}
      </span>
      {/* Optional: show Admin link for admins */}
      {(session.user as any)?.role === "ADMIN" && (
        <a href="/admin" className="btn btn-ghost hidden sm:inline">
          Admin
        </a>
      )}
      <button
        className="btn btn-ghost"
        onClick={() => signOut({ callbackUrl: "/" })}
        aria-label="Sign out"
      >
        Sign out
      </button>
    </div>
  );
}
