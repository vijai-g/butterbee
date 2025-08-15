// app/checkout/page.tsx
"use client";

import { useCart } from "@/lib/cart";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

// Define your delivery windows here
const SLOT_DEFS = [
  { id: "6-8", label: "6–8 AM", startHour: 6, startMinute: 0 },
  { id: "8-10", label: "8–10 AM", startHour: 8, startMinute: 0 },
  { id: "17-19", label: "5–7 PM", startHour: 17, startMinute: 0 },
] as const;

type DayType = "today" | "tomorrow" | "date";

function yyyymmdd(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export default function CheckoutPage() {
  const { state, total, clear } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  // Delivery selection state
  const [dayType, setDayType] = useState<DayType>("today");
  const today = useMemo(() => new Date(), []);
  const [customDate, setCustomDate] = useState<string>(yyyymmdd(today)); // YYYY-MM-DD
  const [slotId, setSlotId] = useState<string>("");

  // Resolve the actual date from selection
  const resolvedDate: Date = useMemo(() => {
    if (dayType === "today") return today;
    if (dayType === "tomorrow") return addDays(today, 1);
    // dayType === "date"
    const d = new Date(customDate + "T00:00:00");
    return isNaN(d.getTime()) ? today : d;
  }, [dayType, customDate, today]);

  // Disable logic: for "today", disable any slot whose start is within 2h from now (or past)
  const disabledById = useMemo(() => {
    const map: Record<string, boolean> = {};
    const now = new Date();

    SLOT_DEFS.forEach((s) => {
      let disabled = false;
      if (
        resolvedDate.getFullYear() === now.getFullYear() &&
        resolvedDate.getMonth() === now.getMonth() &&
        resolvedDate.getDate() === now.getDate()
      ) {
        const slotStart = new Date(
          resolvedDate.getFullYear(),
          resolvedDate.getMonth(),
          resolvedDate.getDate(),
          s.startHour,
          s.startMinute,
          0,
          0
        );
        const diffMs = slotStart.getTime() - now.getTime();
        // within 2h or already past -> disable
        if (diffMs <= 2 * 60 * 60 * 1000) disabled = true;
      }
      map[s.id] = disabled;
    });
    return map;
  }, [resolvedDate]);

  // When the day type changes, reset slot selection
  function chooseDay(next: DayType) {
    setDayType(next);
    setSlotId("");
    if (next === "date") {
      // clamp picked date to today..+30 days
      const min = yyyymmdd(today);
      if (!customDate || customDate < min) setCustomDate(min);
    }
  }

  const canSubmit =
    state.items.length > 0 &&
    form.name &&
    form.phone &&
    form.address &&
    slotId &&
    resolvedDate;

  const selectedSlot = SLOT_DEFS.find((s) => s.id === slotId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return toast.error("Fill required fields");

    const dateStr = yyyymmdd(resolvedDate);
    const summary = encodeURIComponent(
      `Order from ButterBee\n` +
        state.items
          .map(
            (i) => `${i.product.name} x ${i.qty} = ₹${i.qty * i.product.price}`
          )
          .join("\n") +
        `\nTotal: ₹${total}\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}` +
        `\nAddress: ${form.address}\nDelivery Date: ${dateStr}\nSlot: ${
          selectedSlot?.label ?? ""
        }`
    );

    const wa = `/api/wa?text=${summary}`;
    toast.success("Order summary prepared in WhatsApp");
    clear();
    window.location.href = wa;
  };

  // Helpers for min/max date on picker (today .. +30 days)
  const minDate = yyyymmdd(today);
  const maxDate = yyyymmdd(addDays(today, 30));

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      {state.items.length === 0 && (
        <p>
          Your cart is empty.{" "}
          <Link href="/menu" className="underline">
            Add items
          </Link>
          .
        </p>
      )}

      <form className="mt-4 grid gap-4 max-w-xl" onSubmit={submit}>
        {/* Customer details */}
        <div>
          <label className="block text-sm font-medium">Name *</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone *</label>
          <input
            inputMode="tel"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address *</label>
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Delivery day selector */}
        <fieldset className="mt-2">
          <legend className="block text-sm font-medium mb-2">
            Delivery Day
          </legend>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => chooseDay("today")}
              className={`px-3 py-1 rounded-full border ${
                dayType === "today"
                  ? "bg-primary text-secondary"
                  : "bg-white text-secondary hover:bg-black/5"
              }`}
              aria-pressed={dayType === "today"}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => chooseDay("tomorrow")}
              className={`px-3 py-1 rounded-full border ${
                dayType === "tomorrow"
                  ? "bg-primary text-secondary"
                  : "bg-white text-secondary hover:bg-black/5"
              }`}
              aria-pressed={dayType === "tomorrow"}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => chooseDay("date")}
              className={`px-3 py-1 rounded-full border ${
                dayType === "date"
                  ? "bg-primary text-secondary"
                  : "bg-white text-secondary hover:bg-black/5"
              }`}
              aria-pressed={dayType === "date"}
            >
              Pick date
            </button>
          </div>

          {dayType === "date" && (
            <div className="mt-3">
              <label className="block text-sm text-black/70 mb-1">
                Select a date
              </label>
              <input
                type="date"
                className="rounded-md border px-3 py-2"
                min={minDate}
                max={maxDate}
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            </div>
          )}
        </fieldset>

        {/* Delivery slot selector */}
        <div className="mt-2">
          <label className="block text-sm font-medium">Delivery Slot *</label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={slotId}
            onChange={(e) => setSlotId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select…
            </option>
            {SLOT_DEFS.map((s) => (
              <option key={s.id} value={s.id} disabled={disabledById[s.id]}>
                {s.label} {disabledById[s.id] ? " (closed)" : ""}
              </option>
            ))}
          </select>
          {dayType === "today" && (
            <p className="mt-1 text-xs text-black/60">
              Today’s slots close 2 hours before their start time.
            </p>
          )}
        </div>

        {/* Totals / submit */}
        <div className="pt-2">
          <button
            disabled={!canSubmit}
            className="btn btn-primary disabled:opacity-50"
            type="submit"
          >
            Place Order (WhatsApp)
          </button>
        </div>
        <p className="text-sm text-black/70">Payment: placeholder.</p>
        <p className="text-sm">
          Total payable: <span className="font-bold">₹{total}</span>
        </p>
      </form>
    </section>
  );
}
