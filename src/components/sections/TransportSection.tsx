"use client";

import { CURRENCY_LABELS, type Currency, type PricingMode, type TransportItem } from "@/lib/types";
import { transportTotal, type Rates } from "@/lib/calc";
import {
  TRANSPORT_CATEGORIES,
  TRANSPORT_PRESETS,
  type TransportCategory,
  type TransportFieldMode,
  type TransportPreset,
} from "@/lib/transportPresets";

const CURRENCIES = Object.keys(CURRENCY_LABELS) as Currency[];

function emptyTransportItem(
  category: TransportCategory,
  presetKey: string | null,
  label: string,
  mode: TransportFieldMode,
  pricingMode: PricingMode,
): TransportItem {
  return {
    category,
    presetKey,
    label,
    vehicleType: "",
    notes: "",
    qty: 1,
    price: 0,
    currency: "SAR",
    pricingMode,
  };
}

function PricingModeToggle({
  value,
  onChange,
}: {
  value: PricingMode;
  onChange: (mode: PricingMode) => void;
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
          Total Kendaraan
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

function VehicleFields({
  item,
  onUpdate,
  participants,
  rates,
}: {
  item: TransportItem;
  onUpdate: (patch: Partial<TransportItem>) => void;
  participants: number;
  rates: Rates;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm">
        <span className="mb-1 block text-navy-700">Jenis Kendaraan</span>
        <input
          className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
          placeholder="cth. Hiace"
          value={item.vehicleType}
          onChange={(e) => onUpdate({ vehicleType: e.target.value })}
        />
      </label>

      <PricingModeToggle value={item.pricingMode} onChange={(pricingMode) => onUpdate({ pricingMode })} />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1 block text-navy-700">Harga Sewa/Unit</span>
          <input
            type="number"
            min={0}
            className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
            value={item.price}
            onChange={(e) => onUpdate({ price: Number(e.target.value) })}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-navy-700">Mata Uang</span>
          <select
            className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
            value={item.currency}
            onChange={(e) => onUpdate({ currency: e.target.value as Currency })}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {CURRENCY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
        {item.pricingMode === "TOTAL" && (
          <label className="text-sm">
            <span className="mb-1 block text-navy-700">Jumlah Unit</span>
            <input
              type="number"
              min={0}
              className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
              value={item.qty}
              onChange={(e) => onUpdate({ qty: Number(e.target.value) })}
            />
          </label>
        )}
      </div>

      <label className="block text-sm">
        <span className="mb-1 block text-navy-700">Catatan</span>
        <textarea
          className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
          rows={2}
          value={item.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
        />
      </label>

      <div className="text-right text-sm font-semibold text-navy-800">
        Subtotal: {transportTotal(item, participants, rates).toLocaleString("en-US")} SAR
      </div>
    </div>
  );
}

function PerOrangFields({
  item,
  onUpdate,
  participants,
  rates,
}: {
  item: TransportItem;
  onUpdate: (patch: Partial<TransportItem>) => void;
  participants: number;
  rates: Rates;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-navy-700">Harga per Orang</span>
          <input
            type="number"
            min={0}
            className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
            value={item.price}
            onChange={(e) => onUpdate({ price: Number(e.target.value) })}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-navy-700">Mata Uang</span>
          <select
            className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
            value={item.currency}
            onChange={(e) => onUpdate({ currency: e.target.value as Currency })}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {CURRENCY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="text-right text-sm font-semibold text-navy-800">
        Subtotal: {transportTotal(item, participants, rates).toLocaleString("en-US")} SAR
      </div>
    </div>
  );
}

export default function TransportSection({
  items,
  onChange,
  participants,
  rates,
}: {
  items: TransportItem[];
  onChange: (items: TransportItem[]) => void;
  participants: number;
  rates: Rates;
}) {
  function togglePreset(preset: TransportPreset) {
    const active = items.some((i) => i.presetKey === preset.key);
    if (active) {
      onChange(items.filter((i) => i.presetKey !== preset.key));
    } else {
      onChange([
        ...items,
        emptyTransportItem(
          preset.category,
          preset.key,
          preset.label,
          preset.mode,
          preset.defaultPricingMode,
        ),
      ]);
    }
  }

  function updateByPresetKey(presetKey: string, patch: Partial<TransportItem>) {
    onChange(items.map((i) => (i.presetKey === presetKey ? { ...i, ...patch } : i)));
  }

  function updateByIndex(index: number, patch: Partial<TransportItem>) {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function removeByIndex(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addCustomRoute() {
    onChange([...items, emptyTransportItem("KERETA_HARAMAIN", null, "", "perOrang", "PER_PERSON")]);
  }

  function addCustomItem() {
    onChange([...items, emptyTransportItem("LAINNYA", null, "", "vehicle", "TOTAL")]);
  }

  return (
    <div className="space-y-5">
      {TRANSPORT_CATEGORIES.map((cat) => {
        const presets = TRANSPORT_PRESETS.filter((p) => p.category === cat.key);
        const customRows = items
          .map((item, idx) => ({ item, idx }))
          .filter(({ item }) => item.category === cat.key && !item.presetKey);

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
                        {preset.mode === "vehicle" ? (
                          <VehicleFields
                            item={item}
                            onUpdate={(patch) => updateByPresetKey(preset.key, patch)}
                            participants={participants}
                            rates={rates}
                          />
                        ) : (
                          <PerOrangFields
                            item={item}
                            onUpdate={(patch) => updateByPresetKey(preset.key, patch)}
                            participants={participants}
                            rates={rates}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {customRows.map(({ item, idx }) => (
                <div key={item.id ?? idx} className="rounded-md border border-gold-100 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <input
                      className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                      placeholder={cat.key === "KERETA_HARAMAIN" ? "cth. Makkah → Jeddah" : "Nama item transportasi"}
                      value={item.label}
                      onChange={(e) => updateByIndex(idx, { label: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => removeByIndex(idx)}
                      className="shrink-0 text-sm text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                  {cat.key === "KERETA_HARAMAIN" ? (
                    <PerOrangFields
                      item={item}
                      onUpdate={(patch) => updateByIndex(idx, patch)}
                      participants={participants}
                      rates={rates}
                    />
                  ) : (
                    <VehicleFields
                      item={item}
                      onUpdate={(patch) => updateByIndex(idx, patch)}
                      participants={participants}
                      rates={rates}
                    />
                  )}
                </div>
              ))}
            </div>

            {cat.key === "KERETA_HARAMAIN" && (
              <button
                type="button"
                onClick={addCustomRoute}
                className="rounded-md border border-dashed border-gold-300 px-3 py-1.5 text-sm text-navy-700 hover:bg-gold-50"
              >
                + Tambah Rute Lain
              </button>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addCustomItem}
        className="rounded-md border border-dashed border-gold-300 px-3 py-1.5 text-sm text-navy-700 hover:bg-gold-50"
      >
        + Item Transportasi Lain
      </button>
    </div>
  );
}
