"use client";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { useState } from "react";

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-[4/3] w-full bg-white">
        {/* Using next/image is optional for SVG; regular img works too. */}
        <Image src={p.image} alt={p.name} fill priority sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{p.name}</h3>
        <p className="mt-1 text-sm text-black/70 line-clamp-2">{p.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold">₹{p.price}</span>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor={`qty-${p.id}`}>Quantity</label>
            <input
              id={`qty-${p.id}`}
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-16 rounded-md border px-2 py-1"
            />
            <button className="btn btn-primary" onClick={() => add(p, qty)}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
