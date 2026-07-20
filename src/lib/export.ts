import { calculateTripLength, toDateInputValue, type PackageData } from "./types";
import { calculateHpp, formatIDR, formatSAR, type Rates } from "./calc";
import { buildInvoiceCategories, formatMoneySAR, formatMoneyIDR, formatTripDateRange } from "./invoiceReport";

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

const PDF_COLORS = {
  navy950: "#0a1a33",
  navy900: "#0f2a52",
  navy700: "#1e4a89",
  navy500: "#4574b8",
  navy300: "#96b3da",
  navy100: "#dbe6f5",
  navy50: "#f1f5fc",
  gold500: "#c9982e",
  gold400: "#d9b34d",
  gold100: "#f6ecd1",
  gold50: "#fbf5e6",
  white: "#ffffff",
  gray: "#64748b",
  zebra: "#f7f9fd",
};

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;
const COL1_X = MARGIN;
const COL1_W = CONTENT_W * 0.42;
const COL2_X = COL1_X + COL1_W;
const COL2_W = CONTENT_W * 0.16;
const COL3_X = COL2_X + COL2_W;
const COL3_W = CONTENT_W * 0.2;
const COL3_END = COL3_X + COL3_W;
const COL4_END = MARGIN + CONTENT_W;

function loadImageDataUrl(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("no canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = src;
  });
}

function drawWatermark(doc: import("jspdf").jsPDF) {
  doc.saveGraphicsState();
  doc.setGState(doc.GState({ opacity: 0.06 }));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.setTextColor(PDF_COLORS.navy900);
  for (let y = 40; y < PAGE_H; y += 60) {
    for (let x = -20; x < PAGE_W + 40; x += 90) {
      doc.text("TEMAN UMROHMU", x, y, { angle: 35 });
    }
  }
  doc.restoreGraphicsState();
}

function drawFooter(doc: import("jspdf").jsPDF) {
  const footerH = 20;
  const y0 = PAGE_H - footerH;
  doc.setFillColor(PDF_COLORS.navy950);
  doc.rect(0, y0, PAGE_W, footerH, "F");
  doc.setFillColor(PDF_COLORS.gold500);
  doc.rect(0, y0, PAGE_W, 0.8, "F");

  const disclaimer =
    "Dokumen ini merupakan estimasi biaya perjalanan Umrah. Harga dapat berubah sewaktu-waktu sesuai perubahan tarif maskapai, hotel, transportasi, kurs, dan ketersediaan layanan.";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(PDF_COLORS.navy300);
  const wrapped = doc.splitTextToSize(disclaimer, CONTENT_W);
  let ty = y0 + 8;
  for (const line of wrapped) {
    doc.text(line, PAGE_W / 2, ty, { align: "center" });
    ty += 3.2;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(PDF_COLORS.gold400);
  doc.text(
    "Buat Paket Umroh — Safir Bi Salamah  |  083832525104  |  temanumrohmu.idn@gmail.com",
    PAGE_W / 2,
    y0 + footerH - 4,
    { align: "center" },
  );
}

function rightAlignedMoney(
  doc: import("jspdf").jsPDF,
  sar: string,
  idr: string,
  rightX: number,
  y: number,
  boldSize: number,
  darkColor: string,
) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(boldSize);
  doc.setTextColor(darkColor);
  doc.text(sar, rightX, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(boldSize - 2);
  doc.setTextColor(PDF_COLORS.gray);
  doc.text(idr, rightX, y + boldSize * 0.42, { align: "right" });
}

export async function exportPackagePdf(pkg: PackageData) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const participants = Math.max(1, pkg.participants || 1);
  const rates: Rates = { exchangeRate: pkg.exchangeRate || 0, usdRate: pkg.usdRate || 0 };
  const hpp = calculateHpp(pkg);
  const trip = calculateTripLength({ ...pkg, departureDate: toDateInputValue(pkg.departureDate) });
  const categories = buildInvoiceCategories(pkg, rates, participants);
  const invoiceNo = `BPU-${(pkg.id ?? Date.now().toString(36)).slice(-6).toUpperCase()}`;

  let logoDataUrl: string | null = null;
  try {
    logoDataUrl = await loadImageDataUrl("/logo-icon.png");
  } catch {
    logoDataUrl = null;
  }

  drawWatermark(doc);

  // Header band
  const headerH = 48;
  doc.setFillColor(PDF_COLORS.navy950);
  doc.rect(0, 0, PAGE_W, headerH, "F");
  doc.setFillColor(PDF_COLORS.gold500);
  doc.rect(0, headerH, PAGE_W, 1.2, "F");

  if (logoDataUrl) {
    const logoH = 15;
    const logoW = logoH * (471 / 300);
    doc.addImage(logoDataUrl, "PNG", MARGIN, 9, logoW, logoH);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(PDF_COLORS.white);
  doc.text("Teman Umrohmu", MARGIN + 30, 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(PDF_COLORS.gold400);
  doc.text("BUAT PAKET UMROH", MARGIN + 30, 21);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(PDF_COLORS.navy300);
  doc.text("INVOICE", MARGIN + 30, 32);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(PDF_COLORS.gold400);
  doc.text(invoiceNo, MARGIN + 30, 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(PDF_COLORS.navy300);
  doc.text("083832525104", PAGE_W - MARGIN, 12, { align: "right" });
  doc.text("temanumrohmu.idn@gmail.com", PAGE_W - MARGIN, 17, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(PDF_COLORS.white);
  doc.text("INVOICE", PAGE_W - MARGIN, 30, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(PDF_COLORS.gold400);
  doc.text("Umrah Private", PAGE_W - MARGIN, 36, { align: "right" });

  // Info bar
  const infoY = headerH + 7;
  const infoH = 22;
  doc.setFillColor(PDF_COLORS.navy50);
  doc.roundedRect(MARGIN, infoY, CONTENT_W, infoH, 2, 2, "F");

  const infoColW = CONTENT_W / 3;
  const infoRows: [string, string][][] = [
    [
      ["PAKET", pkg.name || "-"],
      ["BERANGKAT", toDateInputValue(pkg.departureDate) ? formatTripDateRange(pkg).split(" s/d ")[0] : "-"],
      ["JAMAAH", `${participants} Orang`],
    ],
    [
      ["DURASI", `${trip.totalDays} Hari ${trip.totalNights} Malam`],
      ["MAKKAH", `${pkg.nightsMakkah || 0} Malam`],
      ["MADINAH", `${pkg.nightsMadinah || 0} Malam`],
    ],
  ];
  infoRows.forEach((row, rIdx) => {
    row.forEach(([label, value], cIdx) => {
      const x = MARGIN + 4 + cIdx * infoColW;
      const y = infoY + 7 + rIdx * 10.5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(PDF_COLORS.gray);
      doc.text(label, x, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(PDF_COLORS.navy900);
      doc.text(value, x, y + 4.5);
    });
  });

  // Table header
  let y = infoY + infoH + 8;
  function drawTableHeader() {
    doc.setFillColor(PDF_COLORS.navy900);
    doc.rect(MARGIN, y, CONTENT_W, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(PDF_COLORS.white);
    doc.text("ITEM", COL1_X + 3, y + 5.3);
    doc.text("QTY", COL2_X + 3, y + 5.3);
    doc.text("HARGA/PAX", COL3_END, y + 5.3, { align: "right" });
    doc.text("TOTAL", COL4_END, y + 5.3, { align: "right" });
    y += 8;
  }
  drawTableHeader();

  function ensureSpace(neededH: number) {
    if (y + neededH > PAGE_H - 24) {
      doc.addPage();
      drawWatermark(doc);
      y = MARGIN;
    }
  }

  let zebraToggle = false;
  for (const cat of categories) {
    ensureSpace(10);
    doc.setFillColor(PDF_COLORS.navy50);
    doc.rect(MARGIN, y, CONTENT_W, 6.5, "F");
    doc.setFillColor(PDF_COLORS.navy700);
    doc.rect(MARGIN, y, 1.2, 6.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(PDF_COLORS.navy900);
    doc.text(cat.label, COL1_X + 3, y + 4.5);
    y += 6.5;
    zebraToggle = false;

    for (const item of cat.items) {
      const compositionLines = item.compositionRows?.length
        ? item.compositionRows.flatMap((row) => doc.splitTextToSize(`•  ${row}`, COL1_W - 6))
        : [];
      const titleLines = item.subtitle ? 2 : 1;
      const rowH = 6 + titleLines * 4.2 + compositionLines.length * 4;

      ensureSpace(rowH + 2);

      doc.setFillColor(zebraToggle ? PDF_COLORS.zebra : PDF_COLORS.white);
      doc.rect(MARGIN, y, CONTENT_W, rowH, "F");
      zebraToggle = !zebraToggle;

      let ty = y + 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(PDF_COLORS.navy900);
      doc.text(item.title, COL1_X + 3, ty);

      if (item.subtitle) {
        ty += 4.2;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(PDF_COLORS.gray);
        doc.text(item.subtitle, COL1_X + 3, ty);
      }

      for (const line of compositionLines) {
        ty += 4;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(PDF_COLORS.navy500);
        doc.text(line, COL1_X + 5, ty);
      }

      if (item.badge) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(PDF_COLORS.gray);
        doc.text(item.badge, COL2_X + 3, y + 5);
      }

      rightAlignedMoney(doc, formatMoneySAR(item.perJamaahSAR), formatMoneyIDR(item.perJamaahIDR), COL3_END, y + 5, 8.5, PDF_COLORS.navy900);
      rightAlignedMoney(doc, formatMoneySAR(item.totalSAR), formatMoneyIDR(item.totalIDR), COL4_END, y + 5, 9.5, PDF_COLORS.navy900);

      y += rowH;
    }
  }

  // Summary rows
  ensureSpace(24);
  doc.setFillColor(PDF_COLORS.navy50);
  doc.rect(MARGIN, y, CONTENT_W, 11, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(PDF_COLORS.navy900);
  doc.text("SUBTOTAL HPP", COL1_X + 3, y + 5);
  rightAlignedMoney(doc, formatMoneySAR(hpp.subtotalSAR / participants), formatMoneyIDR(hpp.subtotalIDR / participants), COL3_END, y + 5, 8, PDF_COLORS.navy900);
  rightAlignedMoney(doc, formatMoneySAR(hpp.subtotalSAR), formatMoneyIDR(hpp.subtotalIDR), COL4_END, y + 5, 8.5, PDF_COLORS.navy900);
  y += 11;

  ensureSpace(12);
  doc.setFillColor(PDF_COLORS.white);
  doc.rect(MARGIN, y, CONTENT_W, 10, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(PDF_COLORS.gray);
  doc.text(`Jasa Kami (${pkg.marginPercent || 0}%)`, COL1_X + 3, y + 4.8);
  rightAlignedMoney(doc, formatMoneySAR(hpp.marginSAR / participants), formatMoneyIDR(hpp.marginIDR / participants), COL3_END, y + 4.8, 7.5, PDF_COLORS.navy900);
  rightAlignedMoney(doc, formatMoneySAR(hpp.marginSAR), formatMoneyIDR(hpp.marginIDR), COL4_END, y + 4.8, 8, PDF_COLORS.navy900);
  y += 10;

  doc.setDrawColor(PDF_COLORS.navy900);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 4;

  // Harga per jamaah box
  ensureSpace(22);
  doc.setFillColor(PDF_COLORS.navy900);
  doc.rect(MARGIN, y, CONTENT_W, 16, "F");
  doc.setFillColor(PDF_COLORS.gold500);
  doc.rect(MARGIN, y, CONTENT_W, 0.8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(PDF_COLORS.navy300);
  doc.text("HARGA PER JAMAAH", COL1_X + 3, y + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(PDF_COLORS.white);
  doc.text(formatMoneySAR(hpp.perParticipantSAR), COL1_X + 3, y + 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(PDF_COLORS.navy300);
  doc.text(`Sudah termasuk jasa ${pkg.marginPercent || 0}%`, COL4_END, y + 6, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(PDF_COLORS.gold400);
  doc.text(formatMoneyIDR(hpp.perParticipantIDR), COL4_END, y + 13, { align: "right" });
  y += 20;

  // Total semua jamaah box
  ensureSpace(20);
  doc.setDrawColor(PDF_COLORS.gold500);
  doc.setLineWidth(0.6);
  doc.setFillColor(PDF_COLORS.gold50);
  doc.roundedRect(MARGIN, y, CONTENT_W, 16, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(PDF_COLORS.gray);
  doc.text(`TOTAL SEMUA JAMAAH (${participants} ORANG)`, COL1_X + 3, y + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(PDF_COLORS.navy900);
  doc.text(formatMoneyIDR(hpp.grandTotalIDR), COL1_X + 3, y + 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(PDF_COLORS.gray);
  doc.text(`Kurs: 1 SAR = IDR ${new Intl.NumberFormat("id-ID").format(pkg.exchangeRate || 0)}`, COL4_END, y + 6, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(PDF_COLORS.gold500);
  doc.text(formatMoneySAR(hpp.grandTotalSAR), COL4_END, y + 13, { align: "right" });

  drawFooter(doc);

  doc.save(`BPU-${(pkg.name || "paket").replace(/\s+/g, "-")}.pdf`);
}

export function shareToWhatsApp(pkg: PackageData) {
  const text = buildSummaryLines(pkg).join("\n");
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
