"use client";

import type { PackageData } from "@/lib/types";
import { calculateHpp, formatIDR, formatSAR } from "@/lib/calc";

const sectionLabels: Record<string, string> = {
  hotels: "Hotel",
  flights: "Tiket Pesawat",
  documents: "Dokumen & Visa",
  transports: "Transportasi",
  handlings: "Handling",
  guides: "Muthawwif / Guide",
  additionals: "Item Tambahan",
};

function StatCard({
  label,
  value,
  subtitle,
  highlight = false,
}: {
  label: string;
  value: string;
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-md bg-navy-800 p-3 ${highlight ? "border border-gold-400" : "border border-navy-700"}`}
    >
      <div className="text-[10px] font-semibold tracking-wide text-navy-300 uppercase">{label}</div>
      <div className={`text-lg font-bold ${highlight ? "text-gold-300" : "text-white"}`}>{value}</div>
      <div className="text-[11px] text-navy-400">{subtitle}</div>
    </div>
  );
}

export default function SummaryPanel({
  pkg,
  onSave,
  onOpenLaporan,
  saving,
}: {
  pkg: PackageData;
  onSave: () => void;
  onOpenLaporan: () => void;
  saving: boolean;
}) {
  const hpp = calculateHpp(pkg);
  const participants = Math.max(1, pkg.participants || 1);

  return (
    <div className="sticky top-4 rounded-lg bg-navy-900 p-4 shadow-lg">
      <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold tracking-wide text-gold-300 uppercase">
        <span>📊</span>Ringkasan HPP
      </h3>

      <div className="space-y-1.5 text-sm">
        {Object.entries(hpp.sections).map(([key, value]) => (
          <div key={key} className="flex justify-between text-navy-200">
            <span>{sectionLabels[key]}</span>
            <span>{formatSAR(value)}</span>
          </div>
        ))}
      </div>

      <div className="my-3 border-t border-navy-700" />

      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Subtotal" value={formatSAR(hpp.subtotalSAR)} subtitle="Sebelum jasa" />
        <StatCard
          label="Jasa Kami"
          value={formatSAR(hpp.marginSAR)}
          subtitle={`${pkg.marginPercent || 0}%`}
        />
        <StatCard
          label="Per Jamaah"
          value={formatSAR(hpp.perParticipantSAR)}
          subtitle={formatIDR(hpp.perParticipantIDR)}
          highlight
        />
        <StatCard
          label="Total Semua"
          value={formatSAR(hpp.grandTotalSAR)}
          subtitle={`${formatIDR(hpp.grandTotalIDR)} (${participants} pax)`}
          highlight
        />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onOpenLaporan}
          className="flex-1 rounded-md border border-navy-600 px-3 py-2 text-sm font-medium text-white hover:bg-navy-800"
        >
          📄 Laporan
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex-1 rounded-md bg-gold-500 px-3 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600 disabled:opacity-50"
        >
          💾 {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
