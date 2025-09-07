"use client";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";

export default function ProductCard({ p }: { p: Product }) {
  const { add, state } = useCart();
  const inCartQty = state.items.find((i) => i.product.id === p.id)?.qty ?? 0;

  const handleAdd = () => {
    if (!p.available) return; // don't add if sold out
    add(p, 1);
  };

  const handleRemove = () => {
    if (inCartQty > 0) add(p, -1); // decrement using negative delta
  };

  const canRemove = inCartQty > 0;

  return (
    <div className={`card overflow-hidden relative ${p.available ? "" : "opacity-70"}`}>
      {/* SOLD OUT ribbon */}
      {!p.available && (
        <div className="absolute left-0 top-0 z-10 rounded-br-xl bg-black/80 px-3 py-1 text-xs font-bold uppercase text-white">
          Sold out
        </div>
      )}

      <div className="relative aspect-[4/3] w-full bg-white">
        <Image
          src={p.image}
          alt={p.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover ${p.available ? "" : "grayscale"}`}
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{p.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-black/70">{p.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold">₹{p.price}</span>

          <div className="flex items-center gap-2">
            {/* Remove button: white text on red bg when enabled */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={!canRemove}
              aria-label={`Remove one ${p.name} from cart`}
              className={[
                "inline-flex h-9 items-center justify-center rounded-xl px-3 py-1 font-medium transition",
                canRemove
                  ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
                  : "bg-red-500/30 text-white/60 cursor-not-allowed",
              ].join(" ")}
              title="Remove one"
            >
              −
            </button>

            {/* Counter */}
            <span
              aria-live="polite"
              aria-atomic="true"
              className="min-w-[2rem] rounded-full bg-black/5 px-2 py-1 text-center text-sm font-semibold"
              title="Quantity in cart"
            >
              {inCartQty}
            </span>

            {/* Add button (unchanged) */}
            <button
              className={`btn btn-primary ${p.available ? "" : "opacity-40 cursor-not-allowed"}`}
              onClick={handleAdd}
              aria-label={`Add one ${p.name} to cart`}
              disabled={!p.available}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
