"use client";

import type { PackageData } from "@/lib/types";
import { calculateHpp, formatIDR, formatSAR } from "@/lib/calc";

const sectionLabels: Record<string, string> = {
  hotels: "Hotel",
  flights: "Tiket Pesawat",
  documents: "Visa & Dokumen",
  transports: "Transportasi",
  guides: "Muthawwif / Guide",
  additionals: "Biaya Tambahan",
};

export default function SummaryPanel({ pkg }: { pkg: PackageData }) {
  const hpp = calculateHpp(pkg);

  return (
    <div className="sticky top-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-semibold text-slate-800">Ringkasan HPP</h3>

      <div className="space-y-1.5 text-sm">
        {Object.entries(hpp.sections).map(([key, value]) => (
          <div key={key} className="flex justify-between text-slate-600">
            <span>{sectionLabels[key]}</span>
            <span>{formatSAR(value)}</span>
          </div>
        ))}
      </div>

      <div className="my-3 border-t border-slate-100" />

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span>{formatSAR(hpp.subtotalSAR)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Margin ({pkg.marginPercent || 0}%)</span>
          <span>{formatSAR(hpp.marginSAR)}</span>
        </div>
        <div className="flex justify-between font-semibold text-slate-800">
          <span>Grand Total</span>
          <span>{formatSAR(hpp.grandTotalSAR)}</span>
        </div>
      </div>

      <div className="my-3 border-t border-slate-100" />

      <div className="space-y-1 rounded-md bg-emerald-50 p-3">
        <p className="text-xs text-emerald-700">Per Peserta ({pkg.participants || 1} orang)</p>
        <p className="text-lg font-bold text-emerald-800">{formatSAR(hpp.perParticipantSAR)}</p>
        <p className="text-sm font-semibold text-emerald-700">{formatIDR(hpp.perParticipantIDR)}</p>
      </div>

      <div className="mt-3 space-y-1 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>Grand Total (IDR)</span>
          <span>{formatIDR(hpp.grandTotalIDR)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kurs</span>
          <span>1 SAR = {(pkg.exchangeRate || 0).toLocaleString("id-ID")} IDR</span>
        </div>
      </div>
    </div>
  );
}
