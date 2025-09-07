"use client";
import useSWR from "swr";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
};

const fetcher = (u: string) => fetch(u).then((r) => r.json());

// normalize incoming query like food/foods/clothing->Clothes etc.
function normalizeDepartment(raw: string | null | undefined) {
  if (!raw) return "All";
  const n = decodeURIComponent(raw).trim().toLowerCase();
  if (["food", "foods"].includes(n)) return "Food";
  if (["clothes", "clothing", "apparel"].includes(n)) return "Clothes";
  if (["sports", "sport", "gear"].includes(n)) return "Sports";
  // fallback: Title Case
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export default function MenuClient({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: string[];
}) {
  // fetch ALL products (includes sold-out)
  const { data } = useSWR<Product[]>("/api/products", fetcher, {
    fallbackData: initialProducts,
  });
  const products = data ?? initialProducts;

  // build categories (with “All”)
  const categories = useMemo(() => {
    const set = new Set<string>([...initialCategories, ...products.map((p) => p.category)]);
    return ["All", ...Array.from(set).sort()];
  }, [products, initialCategories]);

  // read ?department=... (preferred) or legacy ?category=...
  const searchParams = useSearchParams();
  const wanted = normalizeDepartment(
    searchParams.get("department") ?? searchParams.get("category")
  );

  // initial + reactive selected category
  const [active, setActive] = useState<string>(wanted);
  useEffect(() => setActive(wanted), [wanted]);

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const hay = `${p.name} ${p.description}`.toLowerCase();
      const matchesQuery = !q || hay.includes(q);
      const matchesCat = active === "All" || p.category === active;
      return matchesQuery && matchesCat;
    });
  }, [products, query, active]);

  return (
    <section>
      <h1 className="text-3xl font-bold">Shop</h1>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          aria-label="Search items"
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-1/2 rounded-xl border px-3 py-2"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-3 py-1 rounded-full border ${
                active === c
                  ? "bg-primary text-secondary"
                  : "bg-white text-secondary hover:bg-black/5"
              }`}
              aria-pressed={active === c}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
        {filtered.length === 0 && (
          <p className="text-black/60">No items in this category yet.</p>
        )}
      </div>
    </section>
  );
}
