"use client";

import { useState } from "react";
import { calculateHpp, type Rates } from "@/lib/calc";
import { calculateTripLength, toDateInputValue, type PackageData } from "@/lib/types";
import { buildInvoiceCategories, formatMoneySAR, formatMoneyIDR, formatTripDateRange } from "@/lib/invoiceReport";
import { exportPackagePdf, shareToWhatsApp } from "@/lib/export";

export default function LaporanView({
  packages,
  onSelect,
}: {
  packages: PackageData[];
  onSelect: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | undefined>(packages[0]?.id);
  const pkg = packages.find((p) => p.id === selectedId) ?? packages[0];

  if (!pkg) {
    return (
      <div className="rounded-lg border border-gold-200 bg-white p-8 text-center text-sm text-navy-500 shadow-sm">
        Belum ada paket tersimpan. Buat paket di tab &quot;Input&quot; untuk mulai.
      </div>
    );
  }

  const participants = Math.max(1, pkg.participants || 1);
  const rates: Rates = { exchangeRate: pkg.exchangeRate || 0, usdRate: pkg.usdRate || 0 };
  const hpp = calculateHpp(pkg);
  const trip = calculateTripLength({ ...pkg, departureDate: toDateInputValue(pkg.departureDate) });
  const categories = buildInvoiceCategories(pkg, rates, participants);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gold-200 bg-white p-3 shadow-sm">
        <select
          className="rounded border border-navy-100 px-2 py-1.5 text-sm text-navy-900 focus:border-gold-400 focus:outline-none"
          value={pkg.id ?? ""}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {packages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.participants} org)
            </option>
          ))}
        </select>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => pkg.id && onSelect(pkg.id)}
            className="rounded-md border border-navy-200 px-3 py-1.5 text-sm text-navy-700 hover:bg-navy-50"
          >
            Edit
          </button>
          <button
            onClick={() => exportPackagePdf(pkg)}
            className="rounded-md bg-navy-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800"
          >
            ⬇️ PDF
          </button>
          <button
            onClick={() => shareToWhatsApp(pkg)}
            className="rounded-md bg-green-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-600"
          >
            📱 WA
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-6 text-white shadow-md">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-500 text-2xl">🕌</div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">Teman Umrohmu</h2>
            <p className="text-xs font-semibold tracking-widest text-gold-300">BUAT PAKET UMROH</p>
          </div>
        </div>
        <div className="mb-4 h-0.5 w-16 bg-gold-400" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xs tracking-wide text-navy-300 uppercase">Paket</div>
            <div className="font-semibold">{pkg.name || "-"}</div>
          </div>
          <div>
            <div className="text-xs tracking-wide text-navy-300 uppercase">Tanggal</div>
            <div className="font-semibold">{formatTripDateRange(pkg)}</div>
          </div>
          <div>
            <div className="text-xs tracking-wide text-navy-300 uppercase">Jamaah</div>
            <div className="font-semibold">{participants} Orang</div>
          </div>
          <div>
            <div className="text-xs tracking-wide text-navy-300 uppercase">Durasi</div>
            <div className="font-semibold">
              {trip.totalDays} Hari · {pkg.nightsMakkah || 0} mlm Makkah · {pkg.nightsMadinah || 0} mlm Madinah
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold tracking-wide text-navy-800 uppercase">Invoice — Rincian Biaya</h3>
        <div className="space-y-5">
          {categories.length === 0 && (
            <p className="text-sm text-navy-400">Belum ada item biaya di paket ini.</p>
          )}
          {categories.map((cat) => (
            <div key={cat.key}>
              <div className="mb-3 inline-block rounded-r-md border-l-4 border-navy-700 bg-navy-50 px-3 py-1.5 text-xs font-bold tracking-wide text-navy-800">
                {cat.label}
              </div>
              <div className="space-y-3">
                {cat.items.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-gold-100 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-navy-900">{item.title}</div>
                        {item.subtitle && <div className="text-sm text-navy-400">{item.subtitle}</div>}
                      </div>
                      {item.badge && (
                        <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-navy-700">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.compositionRows && (
                      <div className="mb-3 rounded-md bg-navy-50/60 p-3">
                        <div className="mb-1 text-[10px] font-semibold tracking-wide text-navy-500 uppercase">
                          Komposisi Kamar
                        </div>
                        <ul className="space-y-1 text-sm text-navy-700">
                          {item.compositionRows.map((row, rIdx) => (
                            <li key={rIdx}>• {row}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-end justify-between border-t border-dashed border-navy-100 pt-2">
                      <div>
                        <div className="text-[10px] font-semibold tracking-wide text-navy-400 uppercase">
                          Harga / Jamaah
                        </div>
                        <div className="font-semibold text-navy-900">{formatMoneySAR(item.perJamaahSAR)}</div>
                        <div className="text-xs text-navy-500">{formatMoneyIDR(item.perJamaahIDR)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-semibold tracking-wide text-navy-400 uppercase">
                          Total ({participants} Jamaah)
                        </div>
                        <div className="font-semibold text-navy-900">{formatMoneySAR(item.totalSAR)}</div>
                        <div className="text-xs text-navy-500">{formatMoneyIDR(item.totalIDR)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-5 text-white shadow-md">
        <div className="flex items-center justify-between py-1.5 text-sm">
          <span className="text-navy-200">Subtotal HPP</span>
          <div className="text-right">
            <div className="font-semibold">{formatMoneySAR(hpp.subtotalSAR)}</div>
            <div className="text-xs text-navy-300">{formatMoneyIDR(hpp.subtotalIDR)}</div>
          </div>
        </div>
        <div className="flex items-center justify-between py-1.5 text-sm">
          <span className="text-navy-200">Jasa Kami ({pkg.marginPercent || 0}%)</span>
          <div className="text-right">
            <div className="font-semibold">{formatMoneySAR(hpp.marginSAR)}</div>
            <div className="text-xs text-navy-300">{formatMoneyIDR(hpp.marginIDR)}</div>
          </div>
        </div>
        <div className="my-2 border-t border-navy-700" />
        <div className="flex items-center justify-between py-1.5">
          <span className="font-bold text-gold-300">TOTAL {participants} JAMAAH</span>
          <div className="text-right">
            <div className="text-lg font-bold text-gold-300">{formatMoneySAR(hpp.grandTotalSAR)}</div>
            <div className="text-xs text-navy-300">{formatMoneyIDR(hpp.grandTotalIDR)}</div>
          </div>
        </div>
        <div className="flex items-center justify-between py-1.5 text-sm">
          <span className="text-navy-200">Per Jamaah</span>
          <div className="text-right">
            <div className="font-semibold">{formatMoneySAR(hpp.perParticipantSAR)}</div>
            <div className="text-xs text-navy-300">{formatMoneyIDR(hpp.perParticipantIDR)}</div>
          </div>
        </div>
      </div>

      <div className="pt-2 text-center text-xs text-navy-400">
        <p>Dokumen ini bersifat estimasi dan dapat berubah sesuai kondisi &amp; ketersediaan.</p>
        <p className="font-medium text-navy-500">Buat Paket Umroh — Safir Bi Salamah</p>
      </div>
    </div>
  );
}
