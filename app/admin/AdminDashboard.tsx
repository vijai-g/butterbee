// app/admin/AdminDashboard.tsx
"use client";

import useSWR from "swr";
import { useMemo, useState, useRef, useEffect } from "react";

/* ----------------- types & helpers ----------------- */
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;   // /images/foo.jpg, https://..., or data:<...>
  category: string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
  department?: "FOOD" | "CLOTHES" | "SPORTS";
};

type Department = "FOOD" | "CLOTHES" | "SPORTS";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

type FormState = {
  id?: string;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  available: boolean;
  department: Department;
};

const emptyForm: FormState = {
  name: "",
  price: "",
  description: "",
  image: "",
  category: "misc",
  available: true,
  department: "FOOD",
};

/* ----------------- component ----------------- */
export default function AdminDashboard() {
  // products
  const { data, mutate, isLoading } = useSWR<Product[]>("/api/products", fetcher);
  const products = useMemo(() => data ?? [], [data]);

  // discover /public/images via API
  const { data: libResp } = useSWR<{ files: string[] }>("/api/images", fetcher);
  const LIBRARY = useMemo(
    () =>
      (libResp?.files ?? [
        // fallback list if API not available
        "butterBeeHome.jpeg",
        "batter.png",
        "batter2.png",
        "item3.png",
        "item4.svg",
        "item5.png",
      ]).sort(),
    [libResp]
  );

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imgMode, setImgMode] = useState<"library" | "url" | "upload">("library");

  const fileRef = useRef<HTMLInputElement | null>(null);

  // --- image library scroller refs/state ---
  const libRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  function calcLibArrows() {
    const el = libRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 4);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 4);
  }

  function scrollLib(dir: -1 | 1) {
    const el = libRef.current;
    if (!el) return;
    const step = Math.max(240, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
    // after the scroll animation, recompute arrow state
    window.setTimeout(calcLibArrows, 260);
  }

  // recalc on modal open, tab change, library load, and window resize
  useEffect(() => {
    if (!open) return;
    const onResize = () => calcLibArrows();
    window.addEventListener("resize", onResize);
    // next tick so the modal layout exists
    const t = window.setTimeout(calcLibArrows, 0);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
    };
  }, [open, imgMode, LIBRARY.length]);

  function onAdd() {
    setMode("create");
    setForm(emptyForm);
    setImgMode("library");
    setOpen(true);
  }

  function onEdit(p: Product) {
    setMode("edit");
    setOpen(true);
    setImgMode("library");
    setForm({
      id: p.id,
      name: p.name,
      price: String(p.price),
      description: p.description,
      image: p.image.startsWith("/images/") ? p.image.replace("/images/", "") : p.image,
      category: p.category,
      available: p.available,
      department: p.department ?? "FOOD",
    });
  }

  async function onDelete(p: Product) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    setSaving(true);
    try {
      const r = await fetch(`/api/products/${p.id}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      await mutate();
    } catch {
      alert("Delete failed");
    } finally {
      setSaving(false);
    }
  }

  // local file -> data URL
  async function onPickFile(f?: File | null) {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({ ...s, image: String(reader.result ?? "") }));
    reader.readAsDataURL(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseInt(form.price, 10),
      image: form.image.trim(),
      category: form.category.trim() || "misc",
      available: form.available,
      department: form.department,
    };
    if (!payload.name || !payload.description || Number.isNaN(payload.price) || !payload.image) {
      alert("Name, description, price and image are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(mode === "create" ? "/api/products" : `/api/products/${form.id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? "Save failed");
      }
      setOpen(false);
      await mutate();
    } catch (err: any) {
      alert(err?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  // preview src
  const previewSrc =
    !form.image
      ? ""
      : form.image.startsWith("http")
      ? form.image
      : form.image.startsWith("data:")
      ? form.image
      : form.image.startsWith("/images/")
      ? form.image
      : `/images/${form.image}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Products</h2>
        <button onClick={onAdd} className="btn btn-primary">Add product</button>
      </div>

      {isLoading && <div className="text-neutral-600">Loading…</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p.id} className="card space-y-2 p-4">
            <div className="relative h-40 w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <img
                src={p.image}
                alt={p.name}
                className={`h-full w-full object-contain p-2 transition ${p.available ? "" : "grayscale opacity-60"}`}
              />
              {!p.available && (
                <div className="absolute inset-0 grid place-items-center">
                  <span className="badge bg-white/90 text-black">Sold out</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="font-semibold">{p.name}</div>
              <span className="badge">{p.category}</span>
            </div>

            <div className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
              {p.description}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>₹{p.price}</div>
              <div className="flex gap-2">
                <button className="btn btn-ghost" onClick={() => onEdit(p)}>
                  Edit
                </button>
                <button className="btn btn-ghost" onClick={() => onDelete(p)}>
                  Delete
                </button>
              </div>
            </div>

            <div className="break-all text-xs text-neutral-500 dark:text-neutral-400">
              img: {p.image}
            </div>
          </div>
        ))}
      </div>

      {/* ----------------- Modal ----------------- */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-3">
          <form
            onSubmit={onSubmit}
            className="w-[min(680px,96vw)] max-h-[90vh] overflow-y-auto
                       space-y-4 rounded-2xl bg-white p-6 text-neutral-900 shadow-xl
                       dark:bg-neutral-900 dark:text-neutral-100"
          >
            <h3 className="text-lg font-semibold">
              {mode === "create" ? "Add product" : "Edit product"}
            </h3>

            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Name
              <input
                className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3
                           text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2
                           focus:ring-primary/60 dark:border-neutral-700 dark:bg-neutral-950
                           dark:text-neutral-100"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>

            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Price (INR)
              <input
                className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3
                           text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/60
                           dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                inputMode="numeric"
                pattern="[0-9]*"
                required
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 block">Department</span>
              <select
                className="w-full rounded-md border px-3 py-2"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value as Department }))}
              >
                <option value="FOOD">Food</option>
                <option value="CLOTHES">Clothes</option>
                <option value="SPORTS">Sports</option>
              </select>
            </label>

            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Description
              <textarea
                className="mt-1 min-h-28 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3
                           text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/60
                           dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </label>

            {/* Image picker */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Product image
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className={`btn btn-ghost ${imgMode === "library" ? "ring-2 ring-primary/60" : ""}`}
                  onClick={() => setImgMode("library")}
                >
                  From library
                </button>
                <button
                  type="button"
                  className={`btn btn-ghost ${imgMode === "url" ? "ring-2 ring-primary/60" : ""}`}
                  onClick={() => setImgMode("url")}
                >
                  Paste URL
                </button>
                <button
                  type="button"
                  className={`btn btn-ghost ${imgMode === "upload" ? "ring-2 ring-primary/60" : ""}`}
                  onClick={() => setImgMode("upload")}
                >
                  Upload file
                </button>
              </div>

              {imgMode === "library" && (
                <div className="relative">
                  {/* scroller */}
                  <div
                    ref={libRef}
                    onScroll={calcLibArrows}
                    className="
                      flex gap-2 overflow-x-auto rounded-xl border border-neutral-200 p-2
                      scroll-smooth dark:border-neutral-700
                      [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                    "
                  >
                    {LIBRARY.length === 0 && (
                      <div className="px-3 py-6 text-sm text-neutral-500">No images found in /public/images</div>
                    )}
                    {LIBRARY.map((fn) => {
                      const src = `/images/${fn}`;
                      const selected =
                        form.image === fn || form.image === src || form.image === `/${fn}`;
                      return (
                        <button
                          key={fn}
                          type="button"
                          onClick={() => setForm((s) => ({ ...s, image: fn }))}
                          className={`h-28 w-40 shrink-0 overflow-hidden rounded-lg border ${
                            selected ? "border-primary ring-2 ring-primary/60" : "border-transparent"
                          }`}
                          title={fn}
                        >
                          <img
                            src={src}
                            alt={fn}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* left/right chevrons */}
                  <button
                    type="button"
                    aria-label="Scroll left"
                    onClick={() => scrollLib(-1)}
                    disabled={!canLeft}
                    className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow
                               ring-1 ring-black/10 disabled:opacity-40"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label="Scroll right"
                    onClick={() => scrollLib(1)}
                    disabled={!canRight}
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow
                               ring-1 ring-black/10 disabled:opacity-40"
                  >
                    ›
                  </button>
                </div>
              )}

              {imgMode === "url" && (
                <>
                  <div className="flex gap-2">
                    <span className="inline-flex select-none items-center rounded-xl bg-neutral-100 px-3 text-sm dark:bg-neutral-800">
                      https:// or /images/
                    </span>
                    <input
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3
                                 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/60
                                 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                      placeholder="https://example.com/pic.jpg or /images/file.jpg"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                    />
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Tip: keep local assets in <code>/public/images</code> and reference as <code>/images/…</code>.
                  </p>
                </>
              )}

              {imgMode === "upload" && (
                <>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                  />
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    The image will be embedded as a data URL. Keep it small (&lt; 800KB) for performance.
                  </p>
                </>
              )}

              {/* live preview */}
              {previewSrc && (
                <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800">
                  <div className="mb-1 text-xs text-neutral-600 dark:text-neutral-400">Preview</div>
                  <div className="relative h-40 w-full overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-700">
                    <img src={previewSrc} alt="preview" className="h-full w-full object-contain p-2" />
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Category
                <input
                  className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3
                             text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/60
                             dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </label>

              <label className="mt-7 inline-flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                />
                Available
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button disabled={saving} className="btn btn-primary">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
