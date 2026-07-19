"use client";

import { CURRENCY_LABELS, type Currency, type GuideItem, type PricingMode } from "@/lib/types";
import { guideTotal, type Rates } from "@/lib/calc";

const CURRENCIES = Object.keys(CURRENCY_LABELS) as Currency[];

const DEFAULT_MAIN_ITEM: GuideItem = {
  label: "Muthawwif",
  days: 1,
  rate: 0,
  notes: "",
  currency: "SAR",
  pricingMode: "TOTAL",
};

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

function PricingModeToggle({
  value,
  onChange,
  totalLabel = "Total",
  perLabel = "Per Pax",
}: {
  value: PricingMode;
  onChange: (mode: PricingMode) => void;
  totalLabel?: string;
  perLabel?: string;
}) {
  return (
    <div>
      <span className="mb-1 block text-xs text-navy-700">Mode Harga</span>
      <div className="grid grid-cols-2 overflow-hidden rounded border border-navy-700">
        <button
          type="button"
          onClick={() => onChange("TOTAL")}
          className={`px-2 py-1.5 text-sm font-medium ${
            value === "TOTAL" ? "bg-navy-600 text-white" : "bg-white text-navy-700"
          }`}
        >
          {totalLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange("PER_PERSON")}
          className={`px-2 py-1.5 text-sm font-medium ${
            value === "PER_PERSON" ? "bg-navy-600 text-white" : "bg-white text-navy-700"
          }`}
        >
          {perLabel}
        </button>
      </div>
    </div>
  );
}

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
  const mainItem = items[0] ?? DEFAULT_MAIN_ITEM;
  const customRows = items.slice(1);
  const isMainTotal = mainItem.pricingMode === "TOTAL";

  function updateMain(patch: Partial<GuideItem>) {
    if (items.length === 0) {
      onChange([{ ...DEFAULT_MAIN_ITEM, ...patch }]);
    } else {
      onChange(items.map((it, i) => (i === 0 ? { ...it, ...patch } : it)));
    }
  }

  function updateCustom(offsetIndex: number, patch: Partial<GuideItem>) {
    const index = offsetIndex + 1;
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function removeCustom(offsetIndex: number) {
    const index = offsetIndex + 1;
    onChange(items.filter((_, i) => i !== index));
  }

  function addCustomItem() {
    const base = items.length === 0 ? [DEFAULT_MAIN_ITEM] : items;
    onChange([
      ...base,
      { label: "", days: 1, rate: 0, notes: "", currency: "SAR", pricingMode: "TOTAL" },
    ]);
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-gold-100 p-3">
        <div className="mb-3">
          <PricingModeToggle
            value={mainItem.pricingMode}
            onChange={(pricingMode) => updateMain({ pricingMode })}
            totalLabel="Total/Hari"
            perLabel="Per Pax/Hari"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-navy-700">
              Fee/Hari — {isMainTotal ? "Total" : "Per Pax"}
            </span>
            <div className="flex gap-2">
              <input
                type="number"
                onFocus={(e) => e.target.select()}
                min={0}
                className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                value={mainItem.rate}
                onChange={(e) => updateMain({ rate: Number(e.target.value) })}
              />
              <select
                className="rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                value={mainItem.currency}
                onChange={(e) => updateMain({ currency: e.target.value as Currency })}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {CURRENCY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-navy-700">Jumlah Hari</span>
            <input
              type="number"
              onFocus={(e) => e.target.select()}
              min={0}
              className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
              value={mainItem.days}
              onChange={(e) => updateMain({ days: Number(e.target.value) })}
            />
          </label>
        </div>

        <label className="mt-2 block text-sm">
          <span className="mb-1 block text-navy-700">Catatan</span>
          <input
            className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
            placeholder="Ket tambahan"
            value={mainItem.notes}
            onChange={(e) => updateMain({ notes: e.target.value })}
          />
        </label>

        <div className="mt-2 text-right text-sm font-semibold text-navy-800">
          Subtotal: {guideTotal(mainItem, participants, rates).toLocaleString("en-US")} SAR
        </div>
      </div>

      {customRows.map((item, offsetIndex) => {
        const isTotal = item.pricingMode === "TOTAL";
        return (
          <div key={item.id ?? offsetIndex} className="rounded-md border border-navy-200 bg-navy-50 p-3">
            <div className="mb-3 flex items-center gap-2">
              <input
                className="w-full rounded border border-navy-100 bg-white px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                placeholder="Nama item..."
                value={item.label}
                onChange={(e) => updateCustom(offsetIndex, { label: e.target.value })}
              />
              <RemoveButton onClick={() => removeCustom(offsetIndex)} />
            </div>

            <div className="mb-3">
              <PricingModeToggle
                value={item.pricingMode}
                onChange={(pricingMode) => updateCustom(offsetIndex, { pricingMode })}
              />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-navy-700">{isTotal ? "Harga Total" : "Harga per Pax"}</span>
                <input
                  type="number"
                  onFocus={(e) => e.target.select()}
                  min={0}
                  className="w-full rounded border border-navy-100 bg-white px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                  value={item.rate}
                  onChange={(e) => updateCustom(offsetIndex, { rate: Number(e.target.value) })}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-navy-700">Mata Uang</span>
                <select
                  className="w-full rounded border border-navy-100 bg-white px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                  value={item.currency}
                  onChange={(e) => updateCustom(offsetIndex, { currency: e.target.value as Currency })}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {CURRENCY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-2 text-right text-sm font-semibold text-navy-800">
              Subtotal: {guideTotal(item, participants, rates).toLocaleString("en-US")} SAR
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addCustomItem}
        className="rounded-md border border-dashed border-gold-300 px-3 py-1.5 text-sm text-navy-700 hover:bg-gold-50"
      >
        + Item Muthawwif Lain
      </button>
    </div>
  );
}
