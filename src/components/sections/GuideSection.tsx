"use client";

import { CURRENCY_LABELS, type Currency, type GuideItem, type PricingMode } from "@/lib/types";
import { guideTotal, type Rates } from "@/lib/calc";

const CURRENCIES = Object.keys(CURRENCY_LABELS) as Currency[];

export default function GuideSection({
  items,
  onChange,
  participants,
  rates,
}: {
  items: GuideItem[];
  onChange: (items: GuideItem[]) => void;
  participants: number;
  rates: Rates;
}) {
  function update(index: number, patch: Partial<GuideItem>) {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...items, { label: "Muthawwif", days: 1, rate: 0, currency: "SAR", pricingMode: "TOTAL" }]);
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-navy-400">Belum ada biaya guide. Klik &quot;+ Tambah Guide&quot; untuk menambah.</p>
      )}
      {items.map((item, index) => (
        <div
          key={item.id ?? index}
          className="grid grid-cols-1 gap-2 rounded-md border border-gold-100 p-3 sm:grid-cols-12 sm:items-center"
        >
          <input
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-4"
            placeholder="Muthawwif / Guide"
            value={item.label}
            onChange={(e) => update(index, { label: e.target.value })}
          />
          <input
            type="number"
            min={0}
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-2"
            placeholder="Hari"
            value={item.days}
            onChange={(e) => update(index, { days: Number(e.target.value) })}
          />
          <input
            type="number"
            min={0}
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-2"
            placeholder="Rate/hari"
            value={item.rate}
            onChange={(e) => update(index, { rate: Number(e.target.value) })}
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
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-2"
            value={item.pricingMode}
            onChange={(e) => update(index, { pricingMode: e.target.value as PricingMode })}
          >
            <option value="TOTAL">Total</option>
            <option value="PER_PERSON">Per Orang</option>
          </select>
          <div className="text-sm font-medium text-navy-700 sm:col-span-1">
            {guideTotal(item, participants, rates).toLocaleString("en-US")}
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
        + Tambah Guide
      </button>
    </div>
  );
}
