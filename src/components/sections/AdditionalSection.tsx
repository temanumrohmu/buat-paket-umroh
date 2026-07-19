"use client";

import { CURRENCY_LABELS, type AdditionalItem, type Currency, type PricingMode } from "@/lib/types";
import { additionalTotal, type Rates } from "@/lib/calc";

const CURRENCIES = Object.keys(CURRENCY_LABELS) as Currency[];

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-red-200 text-red-500 hover:bg-red-50"
      aria-label="Hapus"
    >
      ×
    </button>
  );
}

export default function AdditionalSection({
  items,
  onChange,
  participants,
  rates,
}: {
  items: AdditionalItem[];
  onChange: (items: AdditionalItem[]) => void;
  participants: number;
  rates: Rates;
}) {
  function update(index: number, patch: Partial<AdditionalItem>) {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...items, { label: "", qty: 1, price: 0, currency: "SAR", pricingMode: "TOTAL" }]);
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isTotal = item.pricingMode === "TOTAL";
        return (
          <div key={item.id ?? index} className="rounded-md border border-navy-200 bg-navy-50 p-3">
            <div className="mb-3 flex items-center gap-2">
              <input
                className="w-full rounded border border-navy-100 bg-white px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                placeholder="Nama item"
                value={item.label}
                onChange={(e) => update(index, { label: e.target.value })}
              />
              <RemoveButton onClick={() => remove(index)} />
            </div>

            <div className="mb-3">
              <span className="mb-1 block text-xs text-navy-700">Mode Harga</span>
              <div className="grid grid-cols-2 overflow-hidden rounded border border-navy-700">
                <button
                  type="button"
                  onClick={() => update(index, { pricingMode: "TOTAL" as PricingMode })}
                  className={`px-2 py-1.5 text-sm font-medium ${
                    isTotal ? "bg-navy-600 text-white" : "bg-white text-navy-700"
                  }`}
                >
                  Total
                </button>
                <button
                  type="button"
                  onClick={() => update(index, { pricingMode: "PER_PERSON" as PricingMode })}
                  className={`px-2 py-1.5 text-sm font-medium ${
                    !isTotal ? "bg-navy-600 text-white" : "bg-white text-navy-700"
                  }`}
                >
                  Per Pax
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-navy-700">{isTotal ? "Harga Total" : "Harga/Pax"}</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    min={0}
                    className="w-full rounded border border-navy-100 bg-white px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                    value={item.price}
                    onChange={(e) => update(index, { price: Number(e.target.value) })}
                  />
                  <select
                    className="rounded border border-navy-100 bg-white px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                    value={item.currency}
                    onChange={(e) => update(index, { currency: e.target.value as Currency })}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {CURRENCY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              {isTotal && (
                <label className="text-sm">
                  <span className="mb-1 block text-navy-700">Qty</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    min={0}
                    className="w-full rounded border border-navy-100 bg-white px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                    value={item.qty}
                    onChange={(e) => update(index, { qty: Number(e.target.value) })}
                  />
                </label>
              )}
            </div>

            <div className="mt-2 text-right text-sm font-semibold text-navy-800">
              Subtotal: {additionalTotal(item, participants, rates).toLocaleString("en-US")} SAR
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={add}
        className="rounded-md border border-dashed border-gold-300 px-3 py-1.5 text-sm text-navy-700 hover:bg-gold-50"
      >
        + Tambah Item
      </button>
    </div>
  );
}
