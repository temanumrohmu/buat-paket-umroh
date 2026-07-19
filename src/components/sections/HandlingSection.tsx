"use client";

import { CURRENCY_LABELS, type Currency, type HandlingItem, type PricingMode } from "@/lib/types";
import { handlingTotal, type Rates } from "@/lib/calc";
import {
  HANDLING_CATEGORIES,
  HANDLING_PRESETS,
  type HandlingCategory,
  type HandlingPreset,
} from "@/lib/handlingPresets";
import { parseNumericInput } from "@/lib/number";

const CURRENCIES = Object.keys(CURRENCY_LABELS) as Currency[];

function emptyHandlingItem(
  category: HandlingCategory | "LAINNYA",
  presetKey: string | null,
  label: string,
  pricingMode: PricingMode,
): HandlingItem {
  return { category, presetKey, label, price: 0, currency: "SAR", pricingMode };
}

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
}: {
  value: PricingMode;
  onChange: (mode: PricingMode) => void;
  totalLabel?: string;
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
          Per Pax
        </button>
      </div>
    </div>
  );
}

function PriceFields({
  item,
  onUpdate,
  totalLabel,
}: {
  item: HandlingItem;
  onUpdate: (patch: Partial<HandlingItem>) => void;
  totalLabel: string;
}) {
  const isTotal = item.pricingMode === "TOTAL";
  return (
    <div className="space-y-3">
      <PricingModeToggle
        value={item.pricingMode}
        onChange={(pricingMode) => onUpdate({ pricingMode })}
        totalLabel={totalLabel}
      />
      <label className="block text-sm">
        <span className="mb-1 block text-navy-700">{isTotal ? "Harga Total" : "Harga/Pax"}</span>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="decimal"
            onFocus={(e) => e.target.select()}
            className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
            value={item.price}
            onChange={(e) => onUpdate({ price: parseNumericInput(e.target.value) })}
          />
          <select
            className="rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
            value={item.currency}
            onChange={(e) => onUpdate({ currency: e.target.value as Currency })}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {CURRENCY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
      </label>
    </div>
  );
}

export default function HandlingSection({
  items,
  onChange,
  participants,
  rates,
}: {
  items: HandlingItem[];
  onChange: (items: HandlingItem[]) => void;
  participants: number;
  rates: Rates;
}) {
  function togglePreset(preset: HandlingPreset) {
    const active = items.some((i) => i.presetKey === preset.key);
    if (active) {
      onChange(items.filter((i) => i.presetKey !== preset.key));
    } else {
      onChange([
        ...items,
        emptyHandlingItem(preset.category, preset.key, preset.label, preset.defaultPricingMode),
      ]);
    }
  }

  function updateByPresetKey(presetKey: string, patch: Partial<HandlingItem>) {
    onChange(items.map((i) => (i.presetKey === presetKey ? { ...i, ...patch } : i)));
  }

  function updateByIndex(index: number, patch: Partial<HandlingItem>) {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function removeByIndex(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addCustomItem() {
    onChange([...items, emptyHandlingItem("LAINNYA", null, "", "TOTAL")]);
  }

  const customRows = items
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => item.category === "LAINNYA" && !item.presetKey);

  return (
    <div className="space-y-5">
      {HANDLING_CATEGORIES.map((cat) => {
        const presets = HANDLING_PRESETS.filter((p) => p.category === cat.key);

        return (
          <div key={cat.key} className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-navy-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-navy-700 uppercase">
              <span>{cat.icon}</span>
              <span>{cat.title}</span>
            </div>

            <div className="space-y-2">
              {presets.map((preset) => {
                const item = items.find((i) => i.presetKey === preset.key);
                const active = !!item;
                return (
                  <div key={preset.key} className="overflow-hidden rounded-md border border-navy-100">
                    <label className="flex cursor-pointer items-center gap-3 p-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-navy-700"
                        checked={active}
                        onChange={() => togglePreset(preset)}
                      />
                      <div>
                        <div className="text-sm font-medium text-navy-900">{preset.label}</div>
                        <div className="text-xs text-navy-400">{preset.subtitle}</div>
                      </div>
                    </label>
                    {active && item && (
                      <div className="border-t border-gold-100 bg-gold-50/40 p-3">
                        <PriceFields
                          item={item}
                          onUpdate={(patch) => updateByPresetKey(preset.key, patch)}
                          totalLabel="Total Sesi"
                        />
                        <div className="mt-2 text-right text-sm font-semibold text-navy-800">
                          Subtotal: {handlingTotal(item, participants, rates).toLocaleString("en-US")} SAR
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {customRows.length > 0 && (
        <div className="space-y-2">
          {customRows.map(({ item, idx }) => (
            <div key={item.id ?? idx} className="rounded-md border border-navy-200 bg-navy-50 p-3">
              <div className="mb-3 flex items-center gap-2">
                <input
                  className="w-full rounded border border-navy-100 bg-white px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                  placeholder="Nama item..."
                  value={item.label}
                  onChange={(e) => updateByIndex(idx, { label: e.target.value })}
                />
                <RemoveButton onClick={() => removeByIndex(idx)} />
              </div>
              <PriceFields item={item} onUpdate={(patch) => updateByIndex(idx, patch)} totalLabel="Total" />
              <div className="mt-2 text-right text-sm font-semibold text-navy-800">
                Subtotal: {handlingTotal(item, participants, rates).toLocaleString("en-US")} SAR
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addCustomItem}
        className="rounded-md border border-dashed border-gold-300 px-3 py-1.5 text-sm text-navy-700 hover:bg-gold-50"
      >
        + Item Handling Lain
      </button>
    </div>
  );
}
