'use client';
import { Cart } from "@/components/Cart";

export default function CartPage(){
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      <Cart />
    </div>
  )
}
