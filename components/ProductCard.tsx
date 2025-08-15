// components/ProductCard.tsx
"use client";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";

export default function ProductCard({ p }: { p: Product }) {
  const { add, state } = useCart();
  const inCartQty = state.items.find(i => i.product.id === p.id)?.qty ?? 0;

  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-[4/3] w-full bg-white">
        <Image
          src={p.image}
          alt={p.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{p.name}</h3>
        <p className="mt-1 text-sm text-black/70 line-clamp-2">{p.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold">₹{p.price}</span>

          <div className="flex items-center gap-3">
            {/* non-editable counter */}
            <span
              aria-live="polite"
              aria-atomic="true"
              className="min-w-[2rem] text-center rounded-full bg-black/5 px-2 py-1 text-sm font-semibold"
              title="Quantity in cart"
            >
              {inCartQty}
            </span>

            <button
              className="btn btn-primary"
              onClick={() => add(p, 1)}   // +1 per click
              aria-label={`Add one ${p.name} to cart`}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
