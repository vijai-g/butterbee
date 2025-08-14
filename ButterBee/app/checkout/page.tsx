'use client';
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { useState } from "react";

export default function CheckoutPage(){
  const { items, total, clear } = useCart();
  const [form, setForm] = useState({ name:"", phone:"", address:"", email:"", deliverySlot:"" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(items.length === 0){ toast.error("Cart is empty."); return; }
    // Placeholder for payment + order placement
    toast.success("Order placed! (payment placeholder)");
    clear();
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <h2 className="text-2xl font-semibold">Checkout</h2>
        <input required name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border rounded-lg p-3"/>
        <input required name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border rounded-lg p-3" />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email (optional)" className="w-full border rounded-lg p-3"/>
        <textarea required name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full border rounded-lg p-3 min-h-[120px]" />
        <select required name="deliverySlot" value={form.deliverySlot} onChange={handleChange} className="w-full border rounded-lg p-3">
          <option value="" disabled>Choose delivery slot</option>
          <option>Tomorrow 7-9 AM</option>
          <option>Tomorrow 5-7 PM</option>
          <option>Weekend Morning</option>
        </select>
        <button className="btn btn-primary" type="submit" aria-label="Place Order">Place Order</button>
        <p className="text-xs text-gray-600">Payment: placeholder for UPI/PG integration.</p>
      </form>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">Order Summary</h2>
        <ul className="space-y-2">
        {items.map(it => (
          <li key={it.id} className="flex justify-between items-center border-b pb-2">
            <span>{it.name} × {it.quantity}</span>
            <span>₹{(it.price * it.quantity).toFixed(2)}</span>
          </li>
        ))}
        </ul>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span><span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
