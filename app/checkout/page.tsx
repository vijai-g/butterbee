"use client";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CheckoutPage() {
  const { state, total, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", email: "", deliverySlot: "" });
  const canSubmit = state.items.length > 0 && form.name && form.phone && form.address;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return toast.error("Fill required fields");
    const summary = encodeURIComponent(
      `Order from ButterBee\n` +
      state.items.map(i => `${i.product.name} x ${i.qty} = ₹${i.qty * i.product.price}`).join("\n") +
      `\nTotal: ₹${total}\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nAddress: ${form.address}\nSlot: ${form.deliverySlot}`
    );
    const wa = `https://wa.me/8825755675?text=${summary}`;
    toast.success("Order summary prepared in WhatsApp");
    clear();
    window.location.href = wa;
  };
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      {state.items.length === 0 && (<p>Your cart is empty. <Link href="/menu" className="underline">Add items</Link>.</p>)}
      <form className="mt-4 grid gap-4 max-w-xl" onSubmit={submit}>
        <div><label className="block text-sm font-medium">Name *</label><input className="mt-1 w-full rounded-md border px-3 py-2" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required /></div>
        <div><label className="block text-sm font-medium">Phone *</label><input inputMode="tel" className="mt-1 w-full rounded-md border px-3 py-2" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} required /></div>
        <div><label className="block text-sm font-medium">Address *</label><textarea className="mt-1 w-full rounded-md border px-3 py-2" value={form.address} onChange={(e)=>setForm({...form, address: e.target.value})} required /></div>
        <div><label className="block text-sm font-medium">Email</label><input type="email" className="mt-1 w-full rounded-md border px-3 py-2" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} /></div>
        <div><label className="block text-sm font-medium">Delivery Slot</label><select className="mt-1 w-full rounded-md border px-3 py-2" value={form.deliverySlot} onChange={(e)=>setForm({...form, deliverySlot: e.target.value})}><option value="">Select…</option><option>6–8 AM</option><option>8–10 AM</option><option>5–7 PM</option></select></div>
        <div className="pt-2"><button disabled={!canSubmit} className="btn btn-primary disabled:opacity-50" type="submit">Place Order (WhatsApp)</button></div>
        <p className="text-sm text-black/70">Payment: placeholder. Integrate Razorpay/PhonePe later.</p>
        <p className="text-sm">Total payable: <span className="font-bold">₹{total}</span></p>
      </form>
    </section>
  );
}
