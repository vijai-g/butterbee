"use client";

import { CartProvider } from "@/lib/cart";
import { Toaster } from "react-hot-toast";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FloatingCart from "@/components/FloatingCart";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Toaster position="top-center" />
      {children}
      {/* Floating actions */}
      <FloatingCart />
      <FloatingWhatsApp />
    </CartProvider>
  );
}
