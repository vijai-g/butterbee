"use client";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "react-hot-toast";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Toaster position="top-center" />
      {children}
      <FloatingWhatsApp />
    </CartProvider>
  );
}
