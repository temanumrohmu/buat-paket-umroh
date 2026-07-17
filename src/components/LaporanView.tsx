"use client";

import { calculateHpp, formatIDR, formatSAR } from "@/lib/calc";
import { calculateTripLength, toDateInputValue, type PackageData } from "@/lib/types";

function formatDisplayDate(value: string): string {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "-";
  return `${day}/${month}/${year}`;
}

export default function LaporanView({
  packages,
  onSelect,
}: {
  packages: PackageData[];
  onSelect: (id: string) => void;
}) {
  if (packages.length === 0) {
    return (
      <div className="rounded-lg border border-gold-200 bg-white p-8 text-center text-sm text-navy-500 shadow-sm">
        Belum ada paket tersimpan. Buat paket di tab &quot;Input&quot; untuk mulai.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gold-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-gold-200 bg-gold-50 text-left text-navy-700">
            <th className="px-4 py-3 font-semibold">Nama Paket</th>
            <th className="px-4 py-3 font-semibold">Tgl Berangkat</th>
            <th className="px-4 py-3 font-semibold">Pax</th>
            <th className="px-4 py-3 font-semibold">Hari/Malam</th>
            <th className="px-4 py-3 text-right font-semibold">Grand Total (SAR)</th>
            <th className="px-4 py-3 text-right font-semibold">Grand Total (IDR)</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => {
            const departureDate = toDateInputValue(pkg.departureDate);
            const trip = calculateTripLength({ ...pkg, departureDate });
            const hpp = calculateHpp(pkg);
            return (
              <tr
                key={pkg.id}
                onClick={() => pkg.id && onSelect(pkg.id)}
                className="cursor-pointer border-b border-gold-100 last:border-0 hover:bg-gold-50"
              >
                <td className="px-4 py-3 font-medium text-navy-900">{pkg.name}</td>
                <td className="px-4 py-3 text-navy-700">{formatDisplayDate(departureDate)}</td>
                <td className="px-4 py-3 text-navy-700">{pkg.participants}</td>
                <td className="px-4 py-3 text-navy-700">
                  {trip.totalNights > 0 ? `${trip.totalDays} hari / ${trip.totalNights} malam` : "-"}
                </td>
                <td className="px-4 py-3 text-right text-navy-800">{formatSAR(hpp.grandTotalSAR)}</td>
                <td className="px-4 py-3 text-right font-semibold text-gold-700">
                  {formatIDR(hpp.grandTotalIDR)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
