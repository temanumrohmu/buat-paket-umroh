"use client";

import { CURRENCY_LABELS, ROOM_TYPE_LABELS, type Currency, type HotelItem, type RoomType } from "@/lib/types";
import { hotelTotal, type Rates } from "@/lib/calc";

const ROOM_TYPES = Object.keys(ROOM_TYPE_LABELS) as RoomType[];
const CURRENCIES = Object.keys(CURRENCY_LABELS) as Currency[];
const STAR_OPTIONS = [1, 2, 3, 4, 5];

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

  function update(idx: number, patch: Partial<HotelItem>) {
    const next = items.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }

  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  function add() {
    onChange([
      ...items,
      {
        city,
        name: "",
        stars: 4,
        roomType: "DOUBLE",
        nights: 1,
        rooms: 1,
        ratePerNight: 0,
        currency: "SAR",
        pricingMode: "TOTAL",
      },
    ]);
  }

  return (
    <div className="space-y-3">
      {cityRows.length === 0 && (
        <p className="text-sm text-navy-400">Belum ada hotel {city}. Klik &quot;+ Tambah Hotel {city}&quot; untuk menambah.</p>
      )}
      {cityRows.map(({ item, idx }) => (
        <div key={item.id ?? idx} className="rounded-md border border-gold-100 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-navy-800">
              {item.name || "Hotel baru"}
            </span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-sm text-red-500 hover:underline"
            >
              Hapus
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="text-sm sm:col-span-3">
              <span className="mb-1 block text-navy-700">Nama Hotel</span>
              <input
                className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                placeholder="cth. Azka Safa"
                value={item.name}
                onChange={(e) => update(idx, { name: e.target.value })}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-navy-700">Bintang</span>
              <select
                className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                value={item.stars}
                onChange={(e) => update(idx, { stars: Number(e.target.value) })}
              >
                {STAR_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {"⭐".repeat(s)} ({s})
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-navy-700">Jumlah Malam</span>
              <input
                type="number"
                min={0}
                className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                value={item.nights}
                onChange={(e) => update(idx, { nights: Number(e.target.value) })}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-navy-700">Tipe Kamar</span>
              <select
                className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                value={item.roomType}
                onChange={(e) => update(idx, { roomType: e.target.value as RoomType })}
              >
                {ROOM_TYPES.map((rt) => (
                  <option key={rt} value={rt}>
                    {ROOM_TYPE_LABELS[rt]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-navy-700">Jumlah Kamar</span>
              <input
                type="number"
                min={0}
                className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                value={item.rooms}
                onChange={(e) => update(idx, { rooms: Number(e.target.value) })}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-navy-700">Harga/Kamar/Malam</span>
              <input
                type="number"
                min={0}
                className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                value={item.ratePerNight}
                onChange={(e) => update(idx, { ratePerNight: Number(e.target.value) })}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-navy-700">Mata Uang</span>
              <select
                className="w-full rounded border border-navy-100 px-2 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                value={item.currency}
                onChange={(e) => update(idx, { currency: e.target.value as Currency })}
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
            Subtotal: {hotelTotal(item, rates).toLocaleString("en-US")} SAR
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-md border border-dashed border-gold-300 px-3 py-1.5 text-sm text-navy-700 hover:bg-gold-50"
      >
        + Tambah Hotel {city}
      </button>
    </div>
  );
}
