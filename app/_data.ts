import data from "@/data/products.json";
import type { Product } from "@/lib/types";

export function getAllProducts(): Product[] {
  return (data as Product[]).filter(p => p.available);
}

export function getCategories(): string[] {
  const set = new Set<string>();
  getAllProducts().forEach(p => set.add(p.category));
  return Array.from(set);
}
