import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  metadataBase: new URL("https://butterbee.example.com"),
  title: {
    default: "ButterBee — Fresh batters & homestyle bites",
    template: "%s · ButterBee"
  },
  description: "Fresh, homestyle South Indian batters and snacks. Order via WhatsApp or checkout.",
  openGraph: {
    title: "ButterBee",
    description: "Fresh, homestyle South Indian batters and snacks.",
    images: ["/logo.svg"]
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Toaster position="top-center" />
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
