"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "react-hot-toast";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FloatingCart from "@/components/FloatingCart";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <Toaster position="top-center" />
        {children}
        {/* Floating actions */}
        <FloatingCart />
        <FloatingWhatsApp text="Hi! I have a question about ButterBee." />
      </CartProvider>
    </SessionProvider>
  );
}