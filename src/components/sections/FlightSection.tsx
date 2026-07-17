"use client";

import { CURRENCY_LABELS, type Currency, type FlightItem, type PricingMode } from "@/lib/types";
import { flightTotal, formatSAR, toSAR, type Rates } from "@/lib/calc";

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
      {items.map((item, index) => {
        const isTotal = item.pricingMode === "TOTAL";
        const priceSAR = toSAR(item.price, item.currency, rates);
        const pricePerPaxSAR = isTotal ? priceSAR / (item.qty || 1) : priceSAR;

        return (
          <div key={item.id ?? index} className="rounded-md border border-gold-100 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-navy-800">
                {item.route || "Tiket baru"}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-sm text-red-500 hover:underline"
              >
                Hapus
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                className="rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                placeholder="Rute (CGK-JED)"
                value={item.route}
                onChange={(e) => update(index, { route: e.target.value })}
              />
              <input
                className="rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                placeholder="Maskapai"
                value={item.airline}
                onChange={(e) => update(index, { airline: e.target.value })}
              />
            </div>

            <label className="mt-3 block text-sm sm:w-1/2">
              <span className="mb-1 block text-xs text-navy-700">Mode Harga</span>
              <select
                className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                value={item.pricingMode}
                onChange={(e) => update(index, { pricingMode: e.target.value as PricingMode })}
              >
                <option value="TOTAL">Total Semua</option>
                <option value="PER_PERSON">Per Pax</option>
              </select>
            </label>

            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <label className="text-sm">
                <span className="mb-1 block text-navy-700">
                  {isTotal ? "Total Harga Tiket" : "Harga per Pax"}
                </span>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                  value={item.price}
                  onChange={(e) => update(index, { price: Number(e.target.value) })}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-navy-700">Mata Uang</span>
                <select
                  className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                  value={item.currency}
                  onChange={(e) => update(index, { currency: e.target.value as Currency })}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {CURRENCY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </label>
              {isTotal && (
                <label className="text-sm">
                  <span className="mb-1 block text-navy-700">Jumlah Orang</span>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                    value={item.qty}
                    onChange={(e) => update(index, { qty: Number(e.target.value) })}
                  />
                </label>
              )}
            </div>

            {isTotal && (
              <p className="mt-1 text-xs text-navy-500">
                Harga per pax: {formatSAR(pricePerPaxSAR)}
              </p>
            )}

            <div className="mt-2 text-right text-sm font-semibold text-navy-800">
              Subtotal: {flightTotal(item, participants, rates).toLocaleString("en-US")} SAR
            </div>
          </div>
        );
      })}
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
