import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <section className="grid gap-8 md:grid-cols-[1.1fr,0.9fr] items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Fresh batters. Honest ingredients. <span className="text-primary">Delivered daily.</span>
        </h1>
        <p className="mt-4 text-lg text-black/80">
          ButterBee brings you stone-ground batters and homestyle snacks—perfect for breakfast,
          dinner, and everything in between.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/menu" className="btn btn-primary">Browse Menu</Link>
          <Link href="/about" className="btn btn-secondary">About Us</Link>
        </div>
      </div>
      <div className="relative aspect-[4/3] w-full">
        <Image src="/images/item1.svg" alt="Fresh idli batter" fill sizes="(max-width: 768px) 100vw, 50vw" priority />
      </div>
    </section>
  );
}
