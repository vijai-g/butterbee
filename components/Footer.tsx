export default function Footer() {
  return (
    <footer className="border-t border-black/5 mt-12">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row items-center md:justify-between gap-4">
        <p className="text-sm text-black/70">
          &copy; {new Date().getFullYear()} ButterBee. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
