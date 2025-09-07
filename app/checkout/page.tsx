"use client";

import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSession, signIn } from "next-auth/react";
import { useCart } from "@/lib/cart";

type Address = {
  id: string;
  door?: string | null;
  tower?: string | null;
  apartment?: string | null;
  isDefault: boolean;
};

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

const fetcher = (u: string) => fetch(u).then((r) => r.json());

// Fallbacks if settings not yet configured
const DEFAULT_APTS = ["Olympia Opaline", "Test"];
const DEFAULT_SLOTS: Slot[] = [
  { id: "6-8",   label: "6–8 AM",  startHour: 6,  startMinute: 0,  active: true },
  { id: "8-10",  label: "8–10 AM", startHour: 8,  startMinute: 0,  active: true },
  { id: "17-19", label: "5–7 PM",  startHour: 17, startMinute: 0,  active: true },
];

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
function formatAddress(a: Partial<Address>) {
  return [a.door && `Door ${a.door}`, a.tower && `Tower ${a.tower}`, a.apartment && `Apt ${a.apartment}`]
    .filter(Boolean)
    .join(", ");
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { state, total, clear } = useCart();

  // Settings (apartments & slots) from API
  const { data: settings } = useSWR<Settings>("/api/settings", fetcher);
  const apartments = settings?.apartments?.length ? settings.apartments : DEFAULT_APTS;
  const allSlots = (settings?.slots?.length ? settings.slots : DEFAULT_SLOTS).filter(s => s.active ?? true);

  // Basic customer details
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  useEffect(() => {
    if (session?.user) {
      setForm((f) => ({
        ...f,
        name: f.name || (session.user.name ?? ""),
        email: f.email || (session.user.email ?? ""),
      }));
    }
  }, [session]);

  // Saved addresses (only when logged in)
  const { data: addresses = [], mutate: refreshAddresses } = useSWR<Address[]>(
    session ? "/api/addresses" : null,
    fetcher
  );
  const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;

  // If we have a saved default, start in summary mode; otherwise start editing/new
  const [editingAddress, setEditingAddress] = useState(true);
  useEffect(() => {
    setEditingAddress(!defaultAddr ? true : false);
  }, [defaultAddr?.id]);

  // New/edit address form (Door/Tower text inputs, Apartment dropdown)
  const [addrForm, setAddrForm] = useState<Partial<Address>>({
    door: "",
    tower: "",
    apartment: "",
  });
  const [saveAsDefault, setSaveAsDefault] = useState(true); // only matters when logged in

  // Delivery date/slot
  const [dayType, setDayType] = useState<DayType>("today");
  const today = useMemo(() => new Date(), []);
  const [customDate, setCustomDate] = useState<string>(yyyymmdd(today));
  const [slotId, setSlotId] = useState<string>("");

  const resolvedDate: Date = useMemo(() => {
    if (dayType === "today") return today;
    if (dayType === "tomorrow") return addDays(today, 1);
    const d = new Date(customDate + "T00:00:00");
    return isNaN(d.getTime()) ? today : d;
  }, [dayType, customDate, today]);

  // Disable slots 2h before start when “today”
  const disabledById = useMemo(() => {
    const map: Record<string, boolean> = {};
    const now = new Date();
    for (const s of allSlots) {
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
          s.startMinute
        );
        if (slotStart.getTime() - now.getTime() <= 2 * 60 * 60 * 1000) disabled = true;
      }
      map[s.id] = disabled;
    }
    return map;
  }, [resolvedDate, allSlots]);

  function chooseDay(next: DayType) {
    setDayType(next);
    setSlotId("");
    if (next === "date") {
      const min = yyyymmdd(today);
      if (!customDate || customDate < min) setCustomDate(min);
    }
  }

  const minDate = yyyymmdd(today);
  const maxDate = yyyymmdd(addDays(today, 30));
  const selectedSlot = allSlots.find((s) => s.id === slotId);

  // Validation
  const cartOk = state.items.length > 0;
  const baseOk = !!form.name && !!form.phone && !!slotId;
  const addressOk =
    (!!defaultAddr && !editingAddress) ||
    (!!addrForm.door && !!addrForm.tower && !!addrForm.apartment);

  const canSubmit = cartOk && baseOk && addressOk;
  const [submitting, setSubmitting] = useState(false);

  async function maybeSaveAddress() {
    if (!session) return;
    if (!saveAsDefault) return;
    if (!addrForm.door || !addrForm.tower || !addrForm.apartment) return;

    // trim door/tower; apartment is a selected value
    const payload = {
      door: (addrForm.door ?? "").trim(),
      tower: (addrForm.tower ?? "").trim(),
      apartment: (addrForm.apartment ?? "").trim(),
      isDefault: true,
    };

    // Save if no default or user is editing
    if (!defaultAddr || editingAddress) {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await refreshAddresses();
        setEditingAddress(false);
      } else {
        toast.error("Could not save address");
      }
    }
  }

  function currentAddressString() {
    if (defaultAddr && !editingAddress) return formatAddress(defaultAddr);
    return formatAddress(addrForm);
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) {
      if (!submitting) toast.error("Fill required fields");
      return;
    }

    setSubmitting(true);
    try {
      await maybeSaveAddress();

      const dateStr = yyyymmdd(resolvedDate);

      // Build plain (UNENCODED) summary for DB
      const plainSummary =
        `Order from ButterBee\n` +
        state.items
          .map((i) => `${i.product.name} x ${i.qty} = ₹${i.qty * i.product.price}`)
          .join("\n") +
        `\nTotal: ₹${total}` +
        `\nName: ${form.name}` +
        `\nPhone: ${form.phone}` +
        (form.email ? `\nEmail: ${form.email}` : "") +
        `\nAddress: ${currentAddressString()}` +
        `\nDelivery Date: ${dateStr}\nSlot: ${selectedSlot?.label ?? ""}`;

      // 1) Create order -> get opaque publicId
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ summary: plainSummary }),
      });
      if (!res.ok) throw new Error("Order creation failed");
      const created = await res.json();
      const publicId: string = created.publicId;

      // 2) WhatsApp message (prefix with Order #publicId)
      const waText = `Order #${publicId}\n` + plainSummary;
      const encoded = encodeURIComponent(waText);

      toast.success("Order created! Opening WhatsApp…");
      clear();
      window.location.href = `/api/wa?text=${encoded}`;
    } catch (err) {
      console.error(err);
      toast.error("Could not create order. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      {state.items.length === 0 && (
        <p>
          Your cart is empty.{" "}
          <Link href="/menu" className="underline">Add items</Link>.
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
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Address */}
        <div className="mt-2 rounded-xl border p-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Delivery Address</h2>
            {!session && (
              <button
                type="button"
                className="btn btn-ghost text-sm"
                onClick={() => signIn(undefined, { callbackUrl: "/checkout" })}
              >
                Log in to use saved address
              </button>
            )}
          </div>

          {/* Summary mode */}
          {defaultAddr && !editingAddress && (
            <div className="mt-3 flex items-center justify-between rounded-lg border px-3 py-2">
              <div className="text-sm">
                <div className="font-medium">{currentAddressString()}</div>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setEditingAddress(true);
                  setAddrForm({
                    door: defaultAddr.door ?? "",
                    tower: defaultAddr.tower ?? "",
                    apartment: defaultAddr.apartment ?? "",
                  });
                }}
              >
                Change delivery address
              </button>
            </div>
          )}

          {/* Edit / New address form */}
          {(!defaultAddr || editingAddress) && (
            <div className="mt-3 grid gap-3">
              <div className="grid grid-cols-3 gap-2">
                <label className="text-sm">
                  <span className="block mb-1 text-black/70">Door *</span>
                  <input
                    className="w-full rounded-md border px-3 py-2"
                    value={addrForm.door || ""}
                    onChange={(e) => setAddrForm((x) => ({ ...x, door: e.target.value }))}
                    onBlur={(e) => setAddrForm((x) => ({ ...x, door: e.target.value.trim() }))}
                    required
                  />
                </label>

                <label className="text-sm">
                  <span className="block mb-1 text-black/70">Tower *</span>
                  <input
                    className="w-full rounded-md border px-3 py-2"
                    value={addrForm.tower || ""}
                    onChange={(e) => setAddrForm((x) => ({ ...x, tower: e.target.value }))}
                    onBlur={(e) => setAddrForm((x) => ({ ...x, tower: e.target.value.trim() }))}
                    required
                  />
                </label>

                <label className="text-sm">
                  <span className="block mb-1 text-black/70">Apartment *</span>
                  <select
                    className="w-full rounded-md border px-3 py-2"
                    value={addrForm.apartment || ""}
                    onChange={(e) => setAddrForm((x) => ({ ...x, apartment: e.target.value }))}
                    required
                  >
                    <option value="" disabled>—</option>
                    {apartments.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </label>
              </div>

              {session && (
                <label className="text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={saveAsDefault}
                    onChange={(e) => setSaveAsDefault(e.target.checked)}
                  />
                  <span>Save as my address (default)</span>
                </label>
              )}

              {defaultAddr && (
                <button
                  type="button"
                  className="btn btn-ghost justify-self-start"
                  onClick={() => setEditingAddress(false)}
                >
                  Use saved address
                </button>
              )}
            </div>
          )}
        </div>

        {/* Delivery Day */}
        <fieldset className="mt-2">
          <legend className="block text-sm font-medium mb-2">Delivery Day</legend>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => chooseDay("today")}
              className={`px-3 py-1 rounded-full border ${dayType === "today" ? "bg-primary text-secondary" : "bg-white text-secondary hover:bg-black/5"}`}
              aria-pressed={dayType === "today"}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => chooseDay("tomorrow")}
              className={`px-3 py-1 rounded-full border ${dayType === "tomorrow" ? "bg-primary text-secondary" : "bg-white text-secondary hover:bg-black/5"}`}
              aria-pressed={dayType === "tomorrow"}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => chooseDay("date")}
              className={`px-3 py-1 rounded-full border ${dayType === "date" ? "bg-primary text-secondary" : "bg-white text-secondary hover:bg-black/5"}`}
              aria-pressed={dayType === "date"}
            >
              Pick date
            </button>
          </div>

          {dayType === "date" && (
            <div className="mt-3">
              <label className="block text-sm text-black/70 mb-1">Select a date</label>
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

        {/* Delivery slot */}
        <div className="mt-2">
          <label className="block text-sm font-medium">Delivery Slot *</label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={slotId}
            onChange={(e) => setSlotId(e.target.value)}
            required
          >
            <option value="" disabled>Select…</option>
            {allSlots.map((s) => (
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
            disabled={!canSubmit || submitting}
            className="btn btn-primary disabled:opacity-50"
            type="submit"
          >
            {submitting ? "Creating order…" : "Place Order (Redirects to WhatsApp)"}
          </button>
        </div>
        <p className="text-sm text-black/70">Online Payment Coming soon.</p>
        <p className="text-sm">
          Total payable: <span className="font-bold">₹{total}</span>
        </p>
      </form>
    </section>
  );
}
