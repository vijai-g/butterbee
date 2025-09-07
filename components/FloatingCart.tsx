"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function FloatingCart() {
  const { count, total } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="Open cart"
      className="
        md:hidden fixed right-4 bottom-20 z-50
        inline-flex items-center justify-center gap-2
        rounded-full bg-secondary text-white shadow-soft
        px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
      "
    >
      {/* Cart icon */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
           className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="10" cy="20.5" r="1.5" />
        <circle cx="18" cy="20.5" r="1.5" />
        <path d="M2 3h3l3.6 12.59c.1.34.42.58.77.58H19a1 1 0 0 0 .96-.74L22 9H6" />
      </svg>

      {/* Count badge */}
      <span className="text-sm font-semibold">
        {count > 0 ? `${count} • ₹${total}` : "Cart"}
      </span>
    </Link>
  );
}
