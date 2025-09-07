// app/_data.ts
import "server-only";
import { prisma } from "@/lib/prisma";

export type Dept = "FOOD" | "CLOTHES" | "SPORTS";

export async function getAllProducts(opts?: { availableOnly?: boolean; department?: Dept }) {
  const where: any = {};
  if (opts?.availableOnly) where.available = true;
  if (opts?.department) where.department = opts.department;

  return prisma.product.findMany({
    where,
    orderBy: { name: "asc" },
  });
}

export async function getCategories(opts?: { department?: Dept }) {
  const where: any = { available: true };
  if (opts?.department) where.department = opts.department;

  const rows = await prisma.product.findMany({
    where,
    select: { category: true },
  });

  return Array.from(new Set(rows.map((r) => r.category))).sort();
}
