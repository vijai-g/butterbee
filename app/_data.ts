// app/_data.ts
import "server-only";
import { prisma } from "@/lib/prisma";
import type { Department } from "@prisma/client";

export async function getAllProducts(opts?: {
  availableOnly?: boolean;
  department?: Department;
}) {
  const where: any = {};
  if (opts?.availableOnly) where.available = true;
  if (opts?.department) where.department = opts.department;

  return prisma.product.findMany({
    where,
    orderBy: { name: "asc" },
  });
}

export async function getCategories() {
  const rows = await prisma.product.findMany({
    where: { available: true },
    select: { category: true },
  });
  return Array.from(new Set(rows.map((r) => r.category))).sort();
}
