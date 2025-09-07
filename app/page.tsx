import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const tiles = [
    {
      key: "Food",
      href: "/shop?department=Food",
      title: "Food",
      blurb: "Batters, snacks & condiments",
      img: "/images/cat-food.png",
    },
    {
      key: "Clothes",
      href: "/shop?department=Clothes",
      title: "Clothes",
      blurb: "Apparel & accessories",
      img: "/images/cat-clothes.png",
    },
    {
      key: "Sports",
      href: "/shop?department=Sports",
      title: "Sports",
      blurb: "Gear & equipment",
      img: "/images/cat-sports.png",
    },
  ];

  return (
    <section className="space-y-10">
      {/* Hero text */}
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Buy & sell inside your community.
          <span className="text-accent"> ButterBee</span> now has Food, Clothes & Sports.
        </h1>
        <p className="text-lg text-black/80">
          A simple marketplace for Urban apartment communities. Pick a category to start browsing.
        </p>
      </header>

      {/* 3 tiles */}
      <div className="grid gap-6 md:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.key} href={t.href} className="card overflow-hidden group">
            <div className="relative aspect-[16/11] w-full">
              <Image
                src={t.img}
                alt={t.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                priority={t.key === "Food"}
              />
            </div>
            <div className="p-4">
              <h2 className="text-2xl font-bold">{t.title}</h2>
              <p className="mt-1 text-sm text-black/70">{t.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-primary">
                Browse {t.title}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
