"use client";

import { CURRENCY_LABELS, type Currency, type FlightItem, type PricingMode } from "@/lib/types";
import { flightTotal, type Rates } from "@/lib/calc";

const CURRENCIES = Object.keys(CURRENCY_LABELS) as Currency[];

export default function FlightSection({
  items,
  onChange,
  participants,
  rates,
}: {
  items: FlightItem[];
  onChange: (items: FlightItem[]) => void;
  participants: number;
  rates: Rates;
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
      { route: "", airline: "", qty: 1, price: 0, currency: "SAR", pricingMode: "PER_PERSON" },
    ]);
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-navy-400">Belum ada tiket. Klik &quot;+ Tambah Tiket&quot; untuk menambah.</p>
      )}
      {items.map((item, index) => (
        <div
          key={item.id ?? index}
          className="grid grid-cols-1 gap-2 rounded-md border border-gold-100 p-3 sm:grid-cols-12 sm:items-center"
        >
          <input
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-3"
            placeholder="Rute (CGK-JED)"
            value={item.route}
            onChange={(e) => update(index, { route: e.target.value })}
          />
          <input
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-2"
            placeholder="Maskapai"
            value={item.airline}
            onChange={(e) => update(index, { airline: e.target.value })}
          />
          <input
            type="number"
            min={0}
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-2"
            placeholder="Harga"
            value={item.price}
            onChange={(e) => update(index, { price: Number(e.target.value) })}
          />
          <select
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-2"
            value={item.currency}
            onChange={(e) => update(index, { currency: e.target.value as Currency })}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {CURRENCY_LABELS[c]}
              </option>
            ))}
          </select>
          <select
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-3"
            value={item.pricingMode}
            onChange={(e) => update(index, { pricingMode: e.target.value as PricingMode })}
          >
            <option value="TOTAL">Total Semua</option>
            <option value="PER_PERSON">Per Pax</option>
          </select>
          {item.pricingMode === "TOTAL" && (
            <label className="text-sm sm:col-span-3">
              <span className="mb-1 block text-navy-700 sm:hidden">Jumlah Orang</span>
              <input
                type="number"
                min={0}
                className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                placeholder="Jumlah Orang"
                value={item.qty}
                onChange={(e) => update(index, { qty: Number(e.target.value) })}
              />
            </label>
          )}
          <div className="text-sm font-medium text-navy-700 sm:col-span-2">
            {flightTotal(item, participants, rates).toLocaleString("en-US")}
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
        className="rounded-md border border-dashed border-gold-300 px-3 py-1.5 text-sm text-navy-700 hover:bg-gold-50"
      >
        + Tambah Tiket
      </button>
    </div>
  );
}
