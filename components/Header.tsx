"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import clsx from "clsx";

export default function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} onClick={() => setMobileOpen(false)}
      className={clsx("px-3 py-2 rounded-md text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary",
        pathname === href ? "bg-primary text-secondary" : "text-secondary hover:bg-black/5")}>
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-black/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label="ButterBee Home">
          <img src="/logo.svg" alt="ButterBee logo" className="h-8 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <NavLink href="/" label="Home" />
          <NavLink href="/menu" label="Menu" />
          <NavLink href="/cart" label="Cart" />
          <NavLink href="/checkout" label="Checkout" />
          <NavLink href="/about" label="About" />
          <NavLink href="/contact" label="Contact" />
          <Link href="/cart" className="relative px-3 py-2" aria-label="View cart">
            <span className="sr-only">Cart</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="10" cy="20.5" r="1.5"/><circle cx="18" cy="20.5" r="1.5"/>
              <path d="M2 3h3l3.6 12.59c.1.34.42.58.77.58H19a1 1 0 0 0 .96-.74L22 9H6"/>
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-secondary">
                {count}
              </span>
            )}
          </Link>
        </nav>
        <button aria-label="Toggle menu" className="md:hidden btn btn-secondary px-3 py-2" onClick={() => setMobileOpen(v => !v)}>☰</button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-black/5 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
            <NavLink href="/" label="Home" />
            <NavLink href="/menu" label="Menu" />
            <NavLink href="/cart" label="Cart" />
            <NavLink href="/checkout" label="Checkout" />
            <NavLink href="/about" label="About" />
            <NavLink href="/contact" label="Contact" />
          </div>
        </div>
      )}
    </header>
  );
}
