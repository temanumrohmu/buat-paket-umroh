"use client";

import { useState } from "react";
import Image from "next/image";
import Collapsible from "@/components/Collapsible";
import HotelSection from "@/components/sections/HotelSection";
import FlightSection from "@/components/sections/FlightSection";
import GuideSection from "@/components/sections/GuideSection";
import GenericItemsTable from "@/components/sections/GenericItemsTable";
import SummaryPanel from "@/components/SummaryPanel";
import LaporanView from "@/components/LaporanView";
import { emptyPackage, toDateInputValue, calculateTripLength, type PackageData } from "@/lib/types";
import { documentTotal, transportTotal, additionalTotal } from "@/lib/calc";
import { exportPackagePdf, shareToWhatsApp } from "@/lib/export";

type View = "input" | "laporan";

export default function PackageApp({ initialList }: { initialList: PackageData[] }) {
  const [view, setView] = useState<View>("input");
  const [pkg, setPkg] = useState<PackageData>(emptyPackage());
  const [list, setList] = useState<PackageData[]>(initialList);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshList() {
    const res = await fetch("/api/packages");
    if (res.ok) setList(await res.json());
  }

  async function loadPackage(id: string) {
    setError(null);
    const res = await fetch(`/api/packages/${id}`);
    if (!res.ok) {
      setError("Gagal memuat paket");
      return;
    }
    const data = await res.json();
    setPkg({ ...data, departureDate: toDateInputValue(data.departureDate) });
    setView("input");
  }

  function startNew() {
    setPkg(emptyPackage());
    setError(null);
  }

  async function savePackage() {
    if (!pkg.name.trim()) {
      setError("Nama paket wajib diisi");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(pkg.id ? `/api/packages/${pkg.id}` : "/api/packages", {
        method: pkg.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pkg),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Gagal menyimpan paket");
        return;
      }
      const saved = await res.json();
      setPkg({ ...saved, departureDate: toDateInputValue(saved.departureDate) });
      await refreshList();
    } finally {
      setSaving(false);
    }
  }

  async function deletePackage() {
    if (!pkg.id) return;
    if (!confirm(`Hapus paket "${pkg.name}"?`)) return;
    await fetch(`/api/packages/${pkg.id}`, { method: "DELETE" });
    startNew();
    await refreshList();
  }

  const participants = Math.max(1, pkg.participants || 1);
  const tripLength = calculateTripLength(pkg);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gold-50 via-[#fbf7ec] to-navy-50">
      <header className="border-b-4 border-gold-400 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 shadow-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/logo-icon.png"
              alt="Teman Umrohmu"
              width={471}
              height={300}
              className="h-10 w-auto shrink-0 sm:h-16"
              priority
            />
            <div className="flex flex-col justify-center gap-0.5">
              <h1 className="font-display text-base leading-tight font-bold tracking-wide text-gold-300 sm:text-2xl">
                Teman Umrohmu
              </h1>
              <p className="font-display text-xs leading-tight font-bold tracking-wide text-navy-100 sm:text-lg">
                buat paket umroh
              </p>
            </div>
          </div>

          <nav className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => setView("input")}
              className={`rounded-full px-3 py-1 text-xs font-semibold sm:px-4 sm:py-1.5 sm:text-sm ${
                view === "input"
                  ? "bg-gold-500 text-navy-950"
                  : "border border-gold-300/60 text-gold-200 hover:bg-navy-800"
              }`}
            >
              Input
            </button>
            <button
              onClick={() => setView("laporan")}
              className={`rounded-full px-3 py-1 text-xs font-semibold sm:px-4 sm:py-1.5 sm:text-sm ${
                view === "laporan"
                  ? "bg-gold-500 text-navy-950"
                  : "border border-gold-300/60 text-gold-200 hover:bg-navy-800"
              }`}
            >
              Laporan
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {view === "input" ? (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-gold-200 bg-white p-3 shadow-sm">
              <select
                className="rounded border border-navy-100 px-2 py-1.5 text-sm text-navy-900 focus:border-gold-400 focus:outline-none"
                value={pkg.id ?? ""}
                onChange={(e) => (e.target.value ? loadPackage(e.target.value) : startNew())}
              >
                <option value="">-- Pilih paket tersimpan --</option>
                {list.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.participants} org)
                  </option>
                ))}
              </select>
              <button
                onClick={startNew}
                className="rounded-md border border-navy-200 px-3 py-1.5 text-sm text-navy-700 hover:bg-navy-50"
              >
                Paket Baru
              </button>
              <button
                onClick={savePackage}
                disabled={saving}
                className="rounded-md bg-gold-500 px-3 py-1.5 text-sm font-medium text-navy-950 hover:bg-gold-600 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
              {pkg.id && (
                <button
                  onClick={deletePackage}
                  className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Hapus
                </button>
              )}
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => exportPackagePdf(pkg)}
                  className="rounded-md border border-navy-700 px-3 py-1.5 text-sm text-navy-800 hover:bg-navy-50"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => shareToWhatsApp(pkg)}
                  className="rounded-md bg-green-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-600"
                >
                  Share WhatsApp
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="rounded-lg border border-gold-200 bg-white p-4 shadow-sm">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="text-sm">
                      <span className="mb-1 block text-navy-700">Nama Paket</span>
                      <input
                        className="w-full rounded border border-navy-100 px-2 py-1.5 focus:border-gold-400 focus:outline-none"
                        placeholder="cth. Umrah Private 9 Hari - Keluarga Fulan"
                        value={pkg.name}
                        onChange={(e) => setPkg({ ...pkg, name: e.target.value })}
                      />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-navy-700">Tgl Berangkat</span>
                      <input
                        type="date"
                        className="w-full rounded border border-navy-100 px-2 py-1.5 focus:border-gold-400 focus:outline-none"
                        value={pkg.departureDate}
                        onChange={(e) => setPkg({ ...pkg, departureDate: e.target.value })}
                      />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-navy-700">Jumlah Pax</span>
                      <input
                        type="number"
                        min={1}
                        className="w-full rounded border border-navy-100 px-2 py-1.5 focus:border-gold-400 focus:outline-none"
                        value={pkg.participants}
                        onChange={(e) => setPkg({ ...pkg, participants: Number(e.target.value) })}
                      />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-navy-700">Mlm Makkah</span>
                      <input
                        type="number"
                        min={0}
                        className="w-full rounded border border-navy-100 px-2 py-1.5 focus:border-gold-400 focus:outline-none"
                        value={pkg.nightsMakkah}
                        onChange={(e) => setPkg({ ...pkg, nightsMakkah: Number(e.target.value) })}
                      />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-navy-700">Mlm Madinah</span>
                      <input
                        type="number"
                        min={0}
                        className="w-full rounded border border-navy-100 px-2 py-1.5 focus:border-gold-400 focus:outline-none"
                        value={pkg.nightsMadinah}
                        onChange={(e) => setPkg({ ...pkg, nightsMadinah: Number(e.target.value) })}
                      />
                    </label>
                    {tripLength.totalNights > 0 && (
                      <div className="rounded-md border border-gold-300 bg-gold-50 px-3 py-2 text-sm text-navy-800 sm:col-span-2">
                        <span className="font-semibold">
                          {tripLength.totalDays} hari / {tripLength.totalNights} malam
                        </span>
                        {tripLength.returnDate && (
                          <span className="text-navy-600">
                            {" "}
                            ({pkg.departureDate.split("-").reverse().join("/")} –{" "}
                            {tripLength.returnDate.split("-").reverse().join("/")})
                          </span>
                        )}
                      </div>
                    )}
                    <label className="text-sm">
                      <span className="mb-1 block text-navy-700">Margin Keuntungan (%)</span>
                      <input
                        type="number"
                        min={0}
                        className="w-full rounded border border-navy-100 px-2 py-1.5 focus:border-gold-400 focus:outline-none"
                        value={pkg.marginPercent}
                        onChange={(e) => setPkg({ ...pkg, marginPercent: Number(e.target.value) })}
                      />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-navy-700">Kurs SAR → IDR</span>
                      <input
                        type="number"
                        min={0}
                        className="w-full rounded border border-navy-100 px-2 py-1.5 focus:border-gold-400 focus:outline-none"
                        value={pkg.exchangeRate}
                        onChange={(e) => setPkg({ ...pkg, exchangeRate: Number(e.target.value) })}
                      />
                    </label>
                    <label className="text-sm sm:col-span-2">
                      <span className="mb-1 block text-navy-700">Catatan</span>
                      <textarea
                        className="w-full rounded border border-navy-100 px-2 py-1.5 focus:border-gold-400 focus:outline-none"
                        rows={2}
                        value={pkg.notes}
                        onChange={(e) => setPkg({ ...pkg, notes: e.target.value })}
                      />
                    </label>
                  </div>
                </div>

                <Collapsible title="Hotel" subtitle="Mekkah & Madinah">
                  <HotelSection
                    items={pkg.hotels}
                    onChange={(hotels) => setPkg({ ...pkg, hotels })}
                    participants={participants}
                  />
                </Collapsible>

                <Collapsible title="Tiket Pesawat">
                  <FlightSection
                    items={pkg.flights}
                    onChange={(flights) => setPkg({ ...pkg, flights })}
                    participants={participants}
                  />
                </Collapsible>

                <Collapsible title="Visa & Dokumen">
                  <GenericItemsTable
                    items={pkg.documents}
                    onChange={(documents) => setPkg({ ...pkg, documents: documents as PackageData["documents"] })}
                    labelPlaceholder="cth. Visa Umrah"
                    addLabel="Tambah Dokumen"
                    totalFn={(item) => documentTotal(item, participants)}
                  />
                </Collapsible>

                <Collapsible title="Transportasi">
                  <GenericItemsTable
                    items={pkg.transports}
                    onChange={(transports) => setPkg({ ...pkg, transports: transports as PackageData["transports"] })}
                    labelPlaceholder="cth. Bus AC Mekkah-Madinah"
                    addLabel="Tambah Transportasi"
                    totalFn={(item) => transportTotal(item, participants)}
                  />
                </Collapsible>

                <Collapsible title="Muthawwif / Guide">
                  <GuideSection
                    items={pkg.guides}
                    onChange={(guides) => setPkg({ ...pkg, guides })}
                    participants={participants}
                  />
                </Collapsible>

                <Collapsible title="Biaya Tambahan" defaultOpen={false}>
                  <GenericItemsTable
                    items={pkg.additionals}
                    onChange={(additionals) => setPkg({ ...pkg, additionals: additionals as PackageData["additionals"] })}
                    labelPlaceholder="cth. Ziarah, Air Zamzam"
                    addLabel="Tambah Biaya"
                    totalFn={(item) => additionalTotal(item, participants)}
                  />
                </Collapsible>
              </div>

              <div>
                <SummaryPanel pkg={pkg} />
              </div>
            </div>
          </>
        ) : (
          <LaporanView packages={list} onSelect={loadPackage} />
        )}
      </main>
    </div>
  );
}
