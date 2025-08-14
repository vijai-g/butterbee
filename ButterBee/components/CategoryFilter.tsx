'use client';
import classNames from "classnames";

export function CategoryFilter({
  categories,
  selected,
  onSelect,
  query,
  onQueryChange
}: {
  categories: string[];
  selected: string;
  onSelect: (c:string)=>void;
  query: string;
  onQueryChange: (q:string)=>void;
}){
  return (
    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button
            key={c}
            className={classNames("btn", c===selected ? "btn-primary" : "btn-outline")}
            onClick={()=>onSelect(c)}
            aria-pressed={c===selected}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="md:ml-auto w-full md:w-80">
        <input
          aria-label="Search menu"
          placeholder="Search items..."
          value={query}
          onChange={(e)=>onQueryChange(e.target.value)}
          className="w-full border rounded-lg p-3"
        />
      </div>
    </div>
  )
}
