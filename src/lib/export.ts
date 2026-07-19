import type { PackageData } from "./types";
import { calculateHpp, formatIDR, formatSAR } from "./calc";

const sectionLabels: Record<string, string> = {
  hotels: "Hotel",
  flights: "Tiket Pesawat",
  documents: "Dokumen & Visa",
  transports: "Transportasi",
  handlings: "Handling",
  consumptions: "Konsumsi",
  guides: "Muthawwif / Guide",
  additionals: "Item Tambahan",
};

export function buildSummaryLines(pkg: PackageData): string[] {
  const hpp = calculateHpp(pkg);
  const lines: string[] = [];
  lines.push(`Paket: ${pkg.name || "(tanpa nama)"}`);
  lines.push(`Peserta: ${pkg.participants || 1} orang`);
  lines.push("");
  lines.push("Rincian Biaya:");
  for (const [key, value] of Object.entries(hpp.sections)) {
    lines.push(`- ${sectionLabels[key]}: ${formatSAR(value)}`);
  }
  lines.push("");
  lines.push(`Subtotal: ${formatSAR(hpp.subtotalSAR)}`);
  lines.push(`Margin (${pkg.marginPercent || 0}%): ${formatSAR(hpp.marginSAR)}`);
  lines.push(`Grand Total: ${formatSAR(hpp.grandTotalSAR)} (${formatIDR(hpp.grandTotalIDR)})`);
  lines.push("");
  lines.push(`Harga per Peserta: ${formatSAR(hpp.perParticipantSAR)} (${formatIDR(hpp.perParticipantIDR)})`);
  if (pkg.notes) {
    lines.push("");
    lines.push(`Catatan: ${pkg.notes}`);
  }
  return lines;
}

export async function exportPackagePdf(pkg: PackageData) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const lines = buildSummaryLines(pkg);

  doc.setFontSize(14);
  doc.text("HPP Umrah Private", 14, 16);
  doc.setFontSize(10);

  let y = 28;
  for (const line of lines) {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 14, y);
    y += 6;
  }

  doc.save(`HPP-${(pkg.name || "paket").replace(/\s+/g, "-")}.pdf`);
}

export function shareToWhatsApp(pkg: PackageData) {
  const text = buildSummaryLines(pkg).join("\n");
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
