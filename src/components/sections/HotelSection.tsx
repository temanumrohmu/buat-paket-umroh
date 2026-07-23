"use client";

import { CURRENCY_LABELS, type Currency, type HotelItem } from "@/lib/types";
import { hotelTotal, type Rates } from "@/lib/calc";
import { parseNumericInput } from "@/lib/number";

const CURRENCIES = Object.keys(CURRENCY_LABELS) as Currency[];
const STAR_OPTIONS = [1, 2, 3, 4, 5];

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-red-200 text-red-500 hover:bg-red-50"
      aria-label="Hapus"
    >
      ×
    </button>
  );
}

function CurrencyToggle({ value, onChange }: { value: Currency; onChange: (c: Currency) => void }) {
  return (
    <div className="grid shrink-0 grid-cols-3 overflow-hidden rounded border border-navy-700">
      {CURRENCIES.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`px-2.5 py-1.5 text-sm font-medium ${
            value === c ? "bg-navy-600 text-white" : "bg-white text-navy-700"
          }`}
        >
          {CURRENCY_LABELS[c]}
        </button>
      ))}
    </div>
  );
}

export default function HotelSection({
  items,
  onChange,
  city,
  rates,
}: {
  items: HotelItem[];
  onChange: (items: HotelItem[]) => void;
  city: string;
  rates: Rates;
}) {
  const cityRows = items
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => item.city === city);

  const first = cityRows[0]?.item;

  function updateShared(patch: Partial<Pick<HotelItem, "name" | "stars" | "nights">>) {
    onChange(items.map((it) => (it.city === city ? { ...it, ...patch } : it)));
  }

  function updateRow(idx: number, patch: Partial<HotelItem>) {
    const next = items.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }

  function removeRow(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  function addProperty() {
    onChange([
      ...items,
      {
        city,
        name: "",
        stars: 4,
        roomType: "",
        nights: 1,
        rooms: 1,
        ratePerNight: 0,
        currency: "SAR",
        pricingMode: "TOTAL",
      },
    ]);
  }

  function addRoomType() {
    onChange([
      ...items,
      {
        city,
        name: first?.name ?? "",
        stars: first?.stars ?? 4,
        roomType: "",
        nights: first?.nights ?? 1,
        rooms: 1,
        ratePerNight: 0,
        currency: "SAR",
        pricingMode: "TOTAL",
      },
    ]);
  }

  if (cityRows.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-navy-400">
          Belum ada hotel {city}. Klik &quot;+ Tambah Hotel {city}&quot; untuk menambah.
        </p>
        <button
          type="button"
          onClick={addProperty}
          className="rounded-md border border-dashed border-gold-300 px-3 py-1.5 text-sm text-navy-700 hover:bg-gold-50"
        >
          + Tambah Hotel {city}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-navy-700">Nama Hotel</span>
          <input
            className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
            placeholder="Anjum, Hilton..."
            value={first?.name ?? ""}
            onChange={(e) => updateShared({ name: e.target.value })}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-navy-700">Bintang</span>
          <select
            className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
            value={first?.stars ?? 4}
            onChange={(e) => updateShared({ stars: Number(e.target.value) })}
          >
            {STAR_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {"⭐".repeat(s)} {s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-navy-700">Jumlah Malam</span>
          <input
            type="text"
            inputMode="decimal"
            onFocus={(e) => e.target.select()}
            className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
            value={first?.nights ?? 0}
            onChange={(e) => updateShared({ nights: parseNumericInput(e.target.value) })}
          />
        </label>
      </div>

      <div className="rounded-md border border-navy-100 bg-navy-50/40 p-3">
        <span className="mb-2 block text-xs font-semibold text-navy-700 uppercase">Tipe Kamar</span>
        <div className="space-y-3">
          {cityRows.map(({ item, idx }) => (
            <div key={item.id ?? idx} className="rounded-md border border-navy-100 bg-white p-3">
              <div className="mb-2 flex items-center gap-2">
                <input
                  className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                  placeholder="Double, Triple, Quad..."
                  value={item.roomType}
                  onChange={(e) => updateRow(idx, { roomType: e.target.value })}
                />
                <RemoveButton onClick={() => removeRow(idx)} />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block text-navy-700">Jumlah Kamar</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    onFocus={(e) => e.target.select()}
                    className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                    value={item.rooms}
                    onChange={(e) => updateRow(idx, { rooms: parseNumericInput(e.target.value) })}
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-navy-700">Harga / Kamar / Malam</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      onFocus={(e) => e.target.select()}
                      className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                      value={item.ratePerNight}
                      onChange={(e) => updateRow(idx, { ratePerNight: parseNumericInput(e.target.value) })}
                    />
                    <CurrencyToggle
                      value={item.currency}
                      onChange={(currency) => updateRow(idx, { currency })}
                    />
                  </div>
                </label>
              </div>
              <div className="mt-2 text-right text-sm font-semibold text-navy-800">
                Subtotal: {hotelTotal(item, rates).toLocaleString("en-US")} SAR
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRoomType}
          className="mt-3 w-full rounded-md border border-dashed border-gold-300 px-3 py-1.5 text-sm text-navy-700 hover:bg-gold-50"
        >
          + Tambah Tipe Kamar
        </button>
      </div>
    </div>
  );
}
