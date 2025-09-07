import { Suspense } from "react";
import ShopClient from "./ShopClient";
import { getAllProducts } from "@/app/_data";

export const dynamic = "force-dynamic";
export const revalidate = 0; // don't prerender; let client read searchParams

export default async function ShopPage() {
  // fallback list in case the client hasn't fetched yet
  const products = await getAllProducts({ availableOnly: true });
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <ShopClient initialProducts={products} />
    </Suspense>
  );
}
