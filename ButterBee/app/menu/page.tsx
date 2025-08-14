'use client';
import { useEffect, useMemo, useState } from "react";
import products from "@/data/products.json";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { useSearchParams } from "next/navigation";

const CATEGORIES = ["All","Breakfast","Batters","Snacks","Desserts","Beverages"] as const;
type Category = typeof CATEGORIES[number];

export default function MenuPage(){
  const sp = useSearchParams();
  const initialCat = (sp.get("category") as Category) || "All";

  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<Category>(initialCat);

  useEffect(()=>{
    const cat = (sp.get("category") as Category) || "All";
    setCategory(cat);
  },[sp]);

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase();
    return products.filter(p => {
      if(!p.available) return false;
      const inCategory = category === "All" ? true : p.category === category;
      const inQuery = q === "" ? true :
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q));
      return inCategory && inQuery;
    });
  },[query, category]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Menu</h1>
      <CategoryFilter
        categories={CATEGORIES as unknown as string[]}
        selected={category}
        onSelect={(c)=>setCategory(c as Category)}
        query={query}
        onQueryChange={setQuery}
      />
      {filtered.length === 0 && (
        <p className="text-gray-600">No items match your search. Try different filters.</p>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
