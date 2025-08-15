"use client";
import { useCart } from "@/lib/cart";
import Link from "next/link";

export default function CartPage() {
  const { state, total, setQty, remove, clear } = useCart();
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {state.items.length === 0 ? (
        <p>Your cart is empty. <Link href="/menu" className="underline">Browse the menu</Link>.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr,360px]">
          <div className="card p-4">
            <ul className="divide-y">
              {state.items.map(({ product, qty }) => (
                <li key={product.id} className="py-3 flex items-center justify-between gap-4">
                  <div><p className="font-medium">{product.name}</p><p className="text-sm text-black/60">₹{product.price} ×</p></div>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`qty-${product.id}`} className="sr-only">Quantity</label>
                    <input id={`qty-${product.id}`} type="number" min={1} value={qty} onChange={(e)=>setQty(product.id, Math.max(1, Number(e.target.value)))} className="w-20 rounded-md border px-2 py-1" />
                    <button className="text-sm underline" onClick={()=>remove(product.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between"><button className="text-sm underline" onClick={clear}>Clear cart</button><p className="font-bold">Subtotal: ₹{total}</p></div>
          </div>
          <aside className="card p-4 h-fit sticky top-24"><h2 className="font-semibold mb-2">Summary</h2><p className="text-sm text-black/70">Delivery calculated at checkout.</p><p className="mt-2 text-xl font-bold">Total: ₹{total}</p><Link href="/checkout" className="btn btn-primary mt-4 w-full text-center">Go to Checkout</Link></aside>
        </div>
      )}
    </section>
  );
}
