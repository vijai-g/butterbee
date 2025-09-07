"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import clsx from "clsx";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const role = (session?.user as any)?.role;

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setMobileOpen(false)}
      className={clsx(
        "px-3 py-2 rounded-md text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary",
        pathname === href ? "bg-primary text-secondary" : "text-secondary hover:bg-black/5"
      )}
    >
      {label}
    </Link>
  );

  function AuthControls({ mobile = false }: { mobile?: boolean }) {
    if (loading) return <span className="text-sm opacity-60">…</span>;

    if (!session) {
      return (
        <button
          className={clsx("btn btn-ghost", mobile && "w-full justify-center")}
          onClick={() => signIn(undefined, { callbackUrl: pathname || "/" })}
          aria-label="Log in"
        >
          Log in
        </button>
      );
    }

    const img = session.user?.image || "";
    const avatarSrc = img ? `/api/img?url=${encodeURIComponent(img)}` : "/avatar-fallback.png";

    return (
      <div className={clsx("flex items-center gap-3", mobile && "justify-between w-full")}>
        <div className="flex items-center gap-2">
          <Image
            src={avatarSrc}
            alt={session.user?.name ?? "User"}
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="text-sm">{session.user?.name ?? "Account"}</span>
        </div>

        <div className="flex items-center gap-2">
          {role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className={clsx("btn btn-ghost", mobile && "px-3 py-2")}
            >
              Admin
            </Link>
          )}
          <button
            className={clsx("btn btn-ghost", mobile && "px-3 py-2")}
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-black/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label="ButterBee Home">
          <img src="/logo.svg" alt="ButterBee logo" className="h-8 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink href="/" label="Home" />
          <NavLink href="/menu" label="Menu" />
          <NavLink href="/about" label="About" />
          <NavLink href="/contact" label="Contact" />

          {/* Cart icon */}
          <Link href="/cart" className="relative px-3 py-2" aria-label="View cart">
            <span className="sr-only">Cart</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="10" cy="20.5" r="1.5" />
              <circle cx="18" cy="20.5" r="1.5" />
              <path d="M2 3h3l3.6 12.59c.1.34.42.58.77.58H19a1 1 0 0 0 .96-.74L22 9H6" />
            </svg>
            {count > 0 && (
              <span
                className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px]
                               items-center justify-center rounded-full bg-primary px-1
                               text-xs font-bold text-secondary"
              >
                {count}
              </span>
            )}
          </Link>

          {/* Auth controls */}
          <div className="ml-2">
            <AuthControls />
          </div>
        </nav>

        {/* Mobile menu toggle */}
        <button
          aria-label="Toggle menu"
          className="md:hidden btn btn-secondary px-3 py-2"
          onClick={() => setMobileOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-black/5 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
            <NavLink href="/" label="Home" />
            <NavLink href="/menu" label="Menu" />
            <NavLink href="/about" label="About" />
            <NavLink href="/contact" label="Contact" />

            {/* Cart quick link on mobile */}
            <NavLink href="/cart" label={`Cart${count ? ` (${count})` : ""}`} />

            {/* Auth controls on mobile */}
            <div className="pt-2">
              <AuthControls mobile />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
