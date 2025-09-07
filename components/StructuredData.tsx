import Script from "next/script";
export default function StructuredData() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://butterbee.in";
  const data = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "ButterBee",
    url: site,
    logo: `${site}/logo.svg`,
    servesCuisine: "South Indian",
    priceRange: "₹",
    sameAs: ["https://wa.me/8825755675"]
  };
  return <Script id="ld-json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
