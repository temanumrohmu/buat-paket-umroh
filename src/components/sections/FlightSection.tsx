"use client";

import type { FlightItem, PricingMode } from "@/lib/types";
import { flightTotal } from "@/lib/calc";

export default function FlightSection({
  items,
  onChange,
  participants,
}: {
  items: FlightItem[];
  onChange: (items: FlightItem[]) => void;
  participants: number;
}) {
  function update(index: number, patch: Partial<FlightItem>) {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function add() {
    onChange([
      ...items,
      { route: "", airline: "", qty: 1, price: 0, pricingMode: "PER_PERSON" },
    ]);
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-slate-400">Belum ada tiket. Klik &quot;+ Tambah Tiket&quot; untuk menambah.</p>
      )}
      {items.map((item, index) => (
        <div
          key={item.id ?? index}
          className="grid grid-cols-1 gap-2 rounded-md border border-slate-100 p-3 sm:grid-cols-12 sm:items-center"
        >
          <input
            className="rounded border border-slate-200 px-2 py-1.5 text-sm sm:col-span-3"
            placeholder="Rute (CGK-JED)"
            value={item.route}
            onChange={(e) => update(index, { route: e.target.value })}
          />
          <input
            className="rounded border border-slate-200 px-2 py-1.5 text-sm sm:col-span-2"
            placeholder="Maskapai"
            value={item.airline}
            onChange={(e) => update(index, { airline: e.target.value })}
          />
          <input
            type="number"
            min={0}
            className="rounded border border-slate-200 px-2 py-1.5 text-sm sm:col-span-1"
            placeholder="Qty"
            value={item.qty}
            onChange={(e) => update(index, { qty: Number(e.target.value) })}
          />
          <input
            type="number"
            min={0}
            className="rounded border border-slate-200 px-2 py-1.5 text-sm sm:col-span-2"
            placeholder="Harga (SAR)"
            value={item.price}
            onChange={(e) => update(index, { price: Number(e.target.value) })}
          />
          <select
            className="rounded border border-slate-200 px-2 py-1.5 text-sm sm:col-span-2"
            value={item.pricingMode}
            onChange={(e) => update(index, { pricingMode: e.target.value as PricingMode })}
          >
            <option value="TOTAL">Total</option>
            <option value="PER_PERSON">Per Orang</option>
          </select>
          <div className="text-sm font-medium text-slate-600 sm:col-span-1">
            {flightTotal(item, participants).toLocaleString("en-US")}
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-sm text-red-500 hover:underline sm:col-span-1"
          >
            Hapus
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
      >
        + Tambah Tiket
      </button>
    </div>
  );
}
