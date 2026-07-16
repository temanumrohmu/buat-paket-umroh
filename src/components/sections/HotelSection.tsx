"use client";

import type { HotelItem, PricingMode } from "@/lib/types";
import { hotelTotal } from "@/lib/calc";

export default function HotelSection({
  items,
  onChange,
  participants,
}: {
  items: HotelItem[];
  onChange: (items: HotelItem[]) => void;
  participants: number;
}) {
  function update(index: number, patch: Partial<HotelItem>) {
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
      { city: "Mekkah", name: "", nights: 1, rooms: 1, ratePerNight: 0, pricingMode: "TOTAL" },
    ]);
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-navy-400">Belum ada hotel. Klik &quot;+ Tambah Hotel&quot; untuk menambah.</p>
      )}
      {items.map((item, index) => (
        <div
          key={item.id ?? index}
          className="grid grid-cols-1 gap-2 rounded-md border border-gold-100 p-3 sm:grid-cols-12 sm:items-center"
        >
          <select
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-2"
            value={item.city}
            onChange={(e) => update(index, { city: e.target.value })}
          >
            <option value="Mekkah">Mekkah</option>
            <option value="Madinah">Madinah</option>
          </select>
          <input
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-3"
            placeholder="Nama hotel"
            value={item.name}
            onChange={(e) => update(index, { name: e.target.value })}
          />
          <input
            type="number"
            min={0}
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-1"
            placeholder="Malam"
            value={item.nights}
            onChange={(e) => update(index, { nights: Number(e.target.value) })}
          />
          <input
            type="number"
            min={0}
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-1"
            placeholder="Kamar"
            value={item.rooms}
            onChange={(e) => update(index, { rooms: Number(e.target.value) })}
          />
          <input
            type="number"
            min={0}
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-2"
            placeholder="Rate/malam (SAR)"
            value={item.ratePerNight}
            onChange={(e) => update(index, { ratePerNight: Number(e.target.value) })}
          />
          <select
            className="rounded border border-navy-100 px-2 py-1.5 text-sm sm:col-span-2"
            value={item.pricingMode}
            onChange={(e) => update(index, { pricingMode: e.target.value as PricingMode })}
          >
            <option value="TOTAL">Total (rate x malam x kamar)</option>
            <option value="PER_PERSON">Per Orang (rate x malam x peserta)</option>
          </select>
          <div className="flex items-center justify-between text-sm text-navy-700 sm:col-span-1">
            <span className="font-medium">
              {hotelTotal(item, participants).toLocaleString("en-US")}
            </span>
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-sm text-red-500 hover:underline"
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
        + Tambah Hotel
      </button>
    </div>
  );
}
