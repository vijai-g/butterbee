"use client";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getAllProducts, getCategories } from "../_data";

export default function MenuPage() {
  const products = useMemo(() => getAllProducts(), []);
  const categories = useMemo(() => getCategories(), []);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | "All">("All");

  const filtered = products.filter(p => {
    const matchesQuery = [p.name, p.description, ...p.tags].join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesCat = active === "All" ? true : p.category === active;
    return matchesQuery && matchesCat;
  });

  return (
    <section>
      <h1 className="text-3xl font-bold">Menu</h1>
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          aria-label="Search items"
          placeholder="Search idli, aapam, snacks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-1/2 rounded-xl border px-3 py-2"
        />
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map(c => (
            <button
              key={c}
              onClick={() => setActive(c as any)}
              className={`px-3 py-1 rounded-full border ${active === c ? "bg-primary text-secondary" : "bg-white text-secondary hover:bg-black/5"}`}
              aria-pressed={active === c}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p => <ProductCard key={p.id} p={p} />)}
        {filtered.length === 0 && (
          <p className="text-black/60">No items match your search.</p>
        )}
      </div>
    </section>
  );
}
