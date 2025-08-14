import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ButterBee — Fresh, Fast, and Tasty",
  description: "ButterBee serves fresh breakfasts, batters, snacks, desserts, and beverages. Order now on WhatsApp!",
  icons: [{ rel: "icon", url: "/favicon.ico" }, { rel: "icon", url: "/bee.svg", type: "image/svg+xml" }],
  openGraph: { title: "ButterBee", description: "Fresh. Fast. Tasty.", images: ["/og.png"] },
  themeColor: "#FFC107",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1 container-px py-6">{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}
