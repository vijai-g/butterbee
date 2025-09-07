"use client";
import Link from "next/link";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  return (
    <section className="py-24 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-black/70">{error.message || "Unexpected error"}</p>
      <div className="mt-6 flex gap-3 justify-center">
        <button className="btn btn-primary" onClick={reset}>Try again</button>
        <Link href="/" className="btn btn-secondary">Home</Link>
      </div>
    </section>
  );
}
