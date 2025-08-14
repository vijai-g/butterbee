import Link from "next/link";
import Image from "next/image";
export default function HomePage(){
  return (
    <div className="space-y-10">
      <section className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary">
            Welcome to <span className="text-primary">ButterBee</span>
          </h1>
          <p className="text-lg text-gray-700">
            Fresh homemade goodness. Breakfast, batters, snacks, desserts, and beverages.
          </p>
          <div className="flex gap-3">
            <Link className="btn btn-primary" href="/menu" aria-label="Browse Menu">Browse Menu</Link>
            <Link className="btn btn-outline" href="/about" aria-label="About ButterBee">About Us</Link>
          </div>
        </div>
        <div className="justify-self-center">
          <Image src="/images/hero.svg" width={480} height={360} alt="ButterBee hero" priority />
        </div>
      </section>
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {title:"Breakfast", img:"/images/placeholder-breakfast.svg", href:"/menu?category=Breakfast"},
          {title:"Batters", img:"/images/placeholder-batters.svg", href:"/menu?category=Batters"},
          {title:"Snacks", img:"/images/placeholder-snacks.svg", href:"/menu?category=Snacks"},
        ].map((c)=>(
          <Link key={c.title} href={c.href} className="card p-6 hover:shadow-md transition" aria-label={`Go to ${c.title}`}>
            <div className="flex items-center gap-4">
              <Image src={c.img} width={80} height={80} alt={c.title} />
              <div>
                <h3 className="text-xl font-semibold">{c.title}</h3>
                <p className="text-gray-600">See what&apos;s cooking</p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
