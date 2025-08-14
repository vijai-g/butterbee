'use client';
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { useState } from "react";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  available: boolean;
};

export function ProductCard({ product }: {product: Product}){
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  const addToCart = () => {
    add({ id: product.id, name: product.name, price: product.price, image: product.image }, qty);
    toast.success(`Added ${product.name} × ${qty}`);
  };

  return (
    <article className="card overflow-hidden">
      <Image src={product.image} alt={product.name} width={640} height={480} className="w-full h-48 object-cover"/>
      <div className="p-4 space-y-3">
        <header className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <span className="font-bold">₹{product.price.toFixed(2)}</span>
        </header>
        <p className="text-gray-600 text-sm">{product.description}</p>
        <div className="flex items-center gap-3">
          <label className="text-sm" htmlFor={`qty-${product.id}`}>Qty</label>
          <div className="inline-flex items-center border rounded-lg overflow-hidden">
            <button className="px-2 py-1" onClick={()=>setQty(q => Math.max(1, q-1))} aria-label="Decrease quantity">−</button>
            <input id={`qty-${product.id}`} className="w-12 text-center outline-none" value={qty} onChange={e=>setQty(Math.max(1, Number(e.target.value)||1))} aria-live="polite"/>
            <button className="px-2 py-1" onClick={()=>setQty(q => q+1)} aria-label="Increase quantity">+</button>
          </div>
          <button className="btn btn-primary ml-auto" onClick={addToCart} aria-label={`Add ${product.name} to cart`}>Add to Cart</button>
        </div>
      </div>
    </article>
  );
}
