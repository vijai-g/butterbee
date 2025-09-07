import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";
import StructuredData from "@/components/StructuredData";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://butterbee.in";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "ButterBee — Fresh batters & homestyle bites", template: "%s · ButterBee" },
  description: "Fresh, homestyle South Indian batters and snacks. Order via WhatsApp or checkout.",
  alternates: { canonical: "/", languages: { "en-IN": "/", "en-US": "/" } },
  openGraph: { type: "website", url: "/", siteName: "ButterBee", title: "ButterBee", description: "Fresh, homestyle South Indian batters and snacks. Order via WhatsApp or checkout.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "ButterBee" }] },
  twitter: { card: "summary_large_image", title: "ButterBee", description: "Fresh, homestyle South Indian batters and snacks. Order via WhatsApp or checkout.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <Footer />
          <StructuredData />
        </Providers>
      </body>
    </html>
  );
}
