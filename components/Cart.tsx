'use client';
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
export function Cart(){
  const { items, remove, update, total } = useCart();
  if(items.length === 0){
    return (
      <div className="card p-6">
        <p>Your cart is empty.</p>
        <Link className="btn btn-primary mt-4 inline-block" href="/menu">Browse Menu</Link>
      </div>
    )
  }
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <ul className="lg:col-span-2 space-y-3">
        {items.map(it => (
          <li key={it.id} className="card p-3 flex items-center gap-3">
            <Image src={it.image} alt={it.name} width={80} height={64} className="rounded-md object-cover"/>
            <div className="flex-1">
              <div className="font-semibold">{it.name}</div>
              <div className="text-sm text-gray-600">₹{it.price.toFixed(2)}</div>
            </div>
            <div className="inline-flex items-center border rounded-lg overflow-hidden">
              <button className="px-2 py-1" onClick={()=>update(it.id, Math.max(1, it.quantity-1))} aria-label="Decrease quantity">−</button>
              <input className="w-12 text-center outline-none" value={it.quantity} onChange={(e)=>update(it.id, Math.max(1, Number(e.target.value)||1))} aria-live="polite"/>
              <button className="px-2 py-1" onClick={()=>update(it.id, it.quantity+1)} aria-label="Increase quantity">+</button>
            </div>
            <button className="ml-2 btn" onClick={()=>remove(it.id)} aria-label={`Remove ${it.name}`}>Remove</button>
          </li>
        ))}
      </ul>
      <aside className="card p-4 h-fit">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <div className="text-sm text-gray-600 mb-4">Delivery charges calculated during checkout.</div>
        <Link className="btn btn-primary w-full" href="/checkout" aria-label="Proceed to checkout">Proceed to Checkout</Link>
      </aside>
    </div>
  )
}
