"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type Slot = {
  id: string;
  label: string;
  startHour: number;
  startMinute: number;
  active?: boolean;
};

type Settings = {
  apartments: string[];
  slots: Slot[];
};

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function AdminSettings() {
  const { data, mutate, isLoading } = useSWR<Settings>("/api/settings", fetcher);
  const [apartmentsCsv, setApartmentsCsv] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    if (!data) return;
    setApartmentsCsv(data.apartments.join(", "));
    setSlots(data.slots);
  }, [data]);

  function updateSlot(i: number, patch: Partial<Slot>) {
    setSlots(prev => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function addSlot() {
    setSlots(prev => [...prev, { id: "", label: "", startHour: 0, startMinute: 0, active: true }]);
  }

  function removeSlot(i: number) {
    setSlots(prev => prev.filter((_, idx) => idx !== i));
  }

  async function save() {
    const payload = {
      apartmentsCsv,
      slots: slots.map(s => ({
        ...s,
        id: s.id.trim(),
        label: s.label.trim(),
        startHour: Number(s.startHour),
        startMinute: Number(s.startMinute),
        active: !!s.active,
      })),
    };

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success("Settings saved");
      mutate();
    } else {
      toast.error("Save failed");
    }
  }

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold">Settings</h2>
      {isLoading && <p className="opacity-60">Loading…</p>}

      {/* Apartments CSV */}
      <div className="mt-4">
        <label className="block text-sm font-medium">Apartments (comma separated)</label>
        <textarea
          className="mt-1 w-full rounded-md border px-3 py-2"
          rows={2}
          value={apartmentsCsv}
          onChange={(e) => setApartmentsCsv(e.target.value)}
          placeholder="e.g. Olympia Opaline, Test, Another"
        />
      </div>

      {/* Slots */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Delivery Slots</h3>
          <button className="btn btn-secondary" type="button" onClick={addSlot}>+ Add slot</button>
        </div>

        <div className="mt-3 grid gap-3">
          {slots.map((s, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end rounded-md border p-3">
              <label className="col-span-2 text-sm">
                <span className="block mb-1 text-black/70">ID</span>
                <input
                  className="w-full rounded-md border px-2 py-1"
                  value={s.id}
                  onChange={(e) => updateSlot(i, { id: e.target.value })}
                />
              </label>
              <label className="col-span-4 text-sm">
                <span className="block mb-1 text-black/70">Label</span>
                <input
                  className="w-full rounded-md border px-2 py-1"
                  value={s.label}
                  onChange={(e) => updateSlot(i, { label: e.target.value })}
                />
              </label>
              <label className="col-span-2 text-sm">
                <span className="block mb-1 text-black/70">Start hour</span>
                <input
                  type="number"
                  min={0}
                  max={23}
                  className="w-full rounded-md border px-2 py-1"
                  value={s.startHour}
                  onChange={(e) => updateSlot(i, { startHour: Number(e.target.value) })}
                />
              </label>
              <label className="col-span-2 text-sm">
                <span className="block mb-1 text-black/70">Start minute</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  className="w-full rounded-md border px-2 py-1"
                  value={s.startMinute}
                  onChange={(e) => updateSlot(i, { startMinute: Number(e.target.value) })}
                />
              </label>
              <label className="col-span-1 text-sm flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={s.active ?? true}
                  onChange={(e) => updateSlot(i, { active: e.target.checked })}
                />
                <span>Active</span>
              </label>
              <button className="col-span-1 btn btn-ghost" type="button" onClick={() => removeSlot(i)}>
                Remove
              </button>
            </div>
          ))}
          {slots.length === 0 && <p className="text-sm opacity-70">No slots yet.</p>}
        </div>
      </div>

      <div className="mt-6">
        <button className="btn btn-primary" type="button" onClick={save}>
          Save settings
        </button>
      </div>
    </section>
  );
}
