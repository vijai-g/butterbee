"use client";
type Props = {
  categories: string[];
  active: string | "All";
  onChange: (c: string | "All") => void;
};

export default function CategoryFilter({ categories, active, onChange }: Props) {
  const list = ["All", ...categories];
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c as any)}
          className={`px-3 py-1 rounded-full border ${active === c ? "bg-primary text-secondary" : "bg-white text-secondary hover:bg-black/5"}`}
          aria-pressed={active === c}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
