// app/shop/ShopClient.tsx
"use client";
import useSWR from "swr";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

type Department = "FOOD" | "CLOTHES" | "SPORTS";
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  department?: Department;
};

const fetcher = (u: string) => fetch(u).then(r => r.json());

// ✅ Trim + robust aliases
function normalizeDepartment(raw: string | null): Department | null {
  const n = (raw ?? "").trim().toLowerCase();
  if (n === "food" || n === "foods") return "FOOD";
  if (n === "clothes" || n === "clothing" || n === "apparel") return "CLOTHES";
  if (n === "sports" || n === "sport" || n === "gear" || n === "sporting") return "SPORTS";
  return null;
}

export default function ShopClient({ initialProducts = [] as Product[] }) {
  const sp = useSearchParams();
  // accept both ?department= and ?dept=
  const deptParam = sp.get("department") ?? sp.get("dept");
  const dept = normalizeDepartment(deptParam);

  // Include dept in key so SWR fetches the filtered list
  const key = dept ? `/api/products?dept=${dept}` : "/api/products";
  const { data } = useSWR<Product[]>(key, fetcher, { fallbackData: initialProducts });
  const products = data ?? [];

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map(p => p.category))).sort()],
    [products]
  );

  const [active, setActive] = useState("All");
  useEffect(() => setActive("All"), [key]);

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter(p => {
      const okQ = !needle || (p.name + " " + p.description).toLowerCase().includes(needle);
      const okCat = active === "All" || p.category === active;
      return okQ && okCat;
    });
  }, [products, q, active]);

  return (
    <section>
      <h1 className="text-3xl font-bold">Shop</h1>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          aria-label="Search items"
          placeholder="Search…"
          value={q}
          onChange={e => setQ(e.target.value)}
          className="w-full md:w-1/2 rounded-xl border px-3 py-2"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-3 py-1 rounded-full border ${
                active === c ? "bg-primary text-secondary" : "bg-white text-secondary hover:bg-black/5"
              }`}
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
          <p className="text-black/60">No items in this department yet.</p>
        )}
      </div>
    </section>
  );
}
