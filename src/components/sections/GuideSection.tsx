"use client";

import type { GuideItem, PricingMode } from "@/lib/types";
import { guideTotal } from "@/lib/calc";

export default function GuideSection({
  items,
  onChange,
  participants,
}: {
  items: GuideItem[];
  onChange: (items: GuideItem[]) => void;
  participants: number;
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
    onChange([...items, { label: "Muthawwif", days: 1, rate: 0, pricingMode: "TOTAL" }]);
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-slate-400">Belum ada biaya guide. Klik &quot;+ Tambah Guide&quot; untuk menambah.</p>
      )}
      {items.map((item, index) => (
        <div
          key={item.id ?? index}
          className="grid grid-cols-1 gap-2 rounded-md border border-slate-100 p-3 sm:grid-cols-12 sm:items-center"
        >
          <input
            className="rounded border border-slate-200 px-2 py-1.5 text-sm sm:col-span-4"
            placeholder="Muthawwif / Guide"
            value={item.label}
            onChange={(e) => update(index, { label: e.target.value })}
          />
          <input
            type="number"
            min={0}
            className="rounded border border-slate-200 px-2 py-1.5 text-sm sm:col-span-2"
            placeholder="Hari"
            value={item.days}
            onChange={(e) => update(index, { days: Number(e.target.value) })}
          />
          <input
            type="number"
            min={0}
            className="rounded border border-slate-200 px-2 py-1.5 text-sm sm:col-span-2"
            placeholder="Rate/hari (SAR)"
            value={item.rate}
            onChange={(e) => update(index, { rate: Number(e.target.value) })}
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
            {guideTotal(item, participants).toLocaleString("en-US")}
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
        + Tambah Guide
      </button>
    </div>
  );
}
