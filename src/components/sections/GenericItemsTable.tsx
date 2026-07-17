"use client";

import { CURRENCY_LABELS, type Currency, type PricingMode } from "@/lib/types";

const CURRENCIES = Object.keys(CURRENCY_LABELS) as Currency[];

export interface GenericLineItem {
  id?: string;
  label: string;
  qty: number;
  price: number;
  currency: Currency;
  pricingMode: PricingMode;
}

export default function GenericItemsTable({
  items,
  onChange,
  labelPlaceholder,
  addLabel,
  totalFn,
}: {
  items: GenericLineItem[];
  onChange: (items: GenericLineItem[]) => void;
  labelPlaceholder: string;
  addLabel: string;
  totalFn: (item: GenericLineItem) => number;
}) {
  function updateItem(index: number, patch: Partial<GenericLineItem>) {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, { label: "", qty: 1, price: 0, currency: "SAR", pricingMode: "TOTAL" }]);
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-navy-400">Belum ada item. Klik &quot;{addLabel}&quot; untuk menambah.</p>
      )}
      {items.map((item, index) => (
        <div
          key={item.id ?? index}
          className="grid grid-cols-1 gap-2 rounded-md border border-gold-100 p-3 sm:grid-cols-12 sm:items-center"
        >
          <input
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-3"
            placeholder={labelPlaceholder}
            value={item.label}
            onChange={(e) => updateItem(index, { label: e.target.value })}
          />
          <input
            type="number"
            min={0}
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-1"
            placeholder="Qty"
            value={item.qty}
            onChange={(e) => updateItem(index, { qty: Number(e.target.value) })}
          />
          <input
            type="number"
            min={0}
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-2"
            placeholder="Harga"
            value={item.price}
            onChange={(e) => updateItem(index, { price: Number(e.target.value) })}
          />
          <select
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-2"
            value={item.currency}
            onChange={(e) => updateItem(index, { currency: e.target.value as Currency })}
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
            onChange={(e) => updateItem(index, { pricingMode: e.target.value as PricingMode })}
          >
            <option value="TOTAL">Total</option>
            <option value="PER_PERSON">Per Orang</option>
          </select>
          <div className="flex items-center justify-between text-sm text-navy-700 sm:col-span-1">
            <span className="font-medium">{totalFn(item).toLocaleString("en-US")}</span>
          </div>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="text-sm text-red-500 hover:underline sm:col-span-1"
          >
            Hapus
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="rounded-md border border-dashed border-gold-300 px-3 py-1.5 text-sm text-navy-700 hover:bg-gold-50"
      >
        + {addLabel}
      </button>
    </div>
  );
}
