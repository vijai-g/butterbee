import Link from "next/link";
export default function NotFound() {
  return (
    <section className="py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-black/70">Try our menu instead.</p>
      <div className="mt-6 flex gap-3 justify-center">
        <Link href="/" className="btn btn-secondary">Home</Link>
        <Link href="/menu" className="btn btn-primary">Browse Menu</Link>
      </div>
    </section>
  );
}
