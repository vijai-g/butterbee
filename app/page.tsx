// app/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <section className="grid gap-8 md:grid-cols-[1.1fr,0.9fr] items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Fresh batters. Honest ingredients.{" "}
          <span className="text-primary">Delivered daily.</span>
        </h1>
        <p className="mt-4 text-lg text-black/80">
          ButterBee brings you stone-ground batters and homestyle snacks—perfect
          for breakfast, dinner, and everything in between.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/menu" className="btn btn-primary">Browse Menu</Link>
          <Link href="/about" className="btn btn-secondary">About Us</Link>
        </div>
      </div>

      {/* Gradient-framed hero image (no layout shift) */}
      <div className="relative w-full rounded-2xl p-[6px] bg-gradient-to-br from-[#FFF3CD] via-[#FFE082] to-[#FFC107] shadow-soft">
        <div className="relative w-full rounded-[14px] overflow-hidden border border-black/10">
          <div className="relative w-full aspect-[1/1] sm:aspect-[5/4] lg:aspect-[4/3]">
            <Image
              src="/images/butterBeeHome.jpeg"
              alt="ButterBee mascot and products"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain bg-[#deb05f]"

            />
          </div>
        </div>
      </div>
    </section>
  );
}
