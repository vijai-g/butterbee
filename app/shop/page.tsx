// app/shop/page.tsx
import { Suspense } from "react";
import ShopClient from "./ShopClient";
import { getAllProducts } from "@/app/_data";
import type { Department } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeDepartment(raw?: string | string[] | null): Department | undefined {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const n = (v ?? "").trim().toLowerCase();
  if (n === "food" || n === "foods") return "FOOD";
  if (n === "clothes" || n === "clothing" || n === "apparel") return "CLOTHES";
  if (n === "sports" || n === "sport" || n === "gear") return "SPORTS";
  return undefined;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const dept =
    normalizeDepartment(searchParams.department) ??
    normalizeDepartment(searchParams.dept);

  // Pre-filter on the server → no flash
  const products = await getAllProducts({
    availableOnly: true,
    department: dept,
  });

  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <ShopClient initialProducts={products} initialDept={dept ?? null} />
    </Suspense>
  );
}
