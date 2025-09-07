import { getAllProducts, getCategories } from "@/app/_data";
import MenuClient from "../menu/MenuClient"; // reuse the same client

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),   // includes sold-out
    getCategories(),
  ]);

  return (
    <MenuClient
      initialProducts={products}
      initialCategories={categories}
    />
  );
}
