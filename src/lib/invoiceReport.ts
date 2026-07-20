import {
  hotelTotal,
  flightTotal,
  documentTotal,
  transportTotal,
  guideTotal,
  additionalTotal,
  handlingTotal,
  consumptionTotal,
  type Rates,
} from "./calc";
import { calculateTripLength, toDateInputValue, type PackageData, type RoomType } from "./types";

const ROOM_TYPE_SHORT: Record<RoomType, string> = {
  DOUBLE: "Double",
  TRIPLE: "Triple",
  QUAD: "Quad",
  QUINT: "Quint",
  CUSTOM: "Custom",
};

const MONTHS_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

export function formatMoneySAR(value: number): string {
  return `SAR ${new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value || 0)}`;
}

export function formatMoneyIDR(value: number): string {
  return `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value || 0)}`;
}

function formatDisplayDateID(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "-";
  return `${day} ${MONTHS_ID[month - 1]} ${year}`;
}

export function formatTripDateRange(pkg: PackageData): string {
  const departureDate = toDateInputValue(pkg.departureDate);
  if (!departureDate) return "-";
  const trip = calculateTripLength({ ...pkg, departureDate });
  if (!trip.returnDate) return formatDisplayDateID(departureDate);
  return `${formatDisplayDateID(departureDate)} s/d ${formatDisplayDateID(trip.returnDate)}`;
}

export interface InvoiceLineItem {
  title: string;
  subtitle?: string;
  badge?: string;
  compositionRows?: string[];
  perJamaahSAR: number;
  perJamaahIDR: number;
  totalSAR: number;
  totalIDR: number;
}

export interface InvoiceCategory {
  key: string;
  label: string;
  items: InvoiceLineItem[];
}

function badgeForPricing(pricingMode: string, participants: number): string | undefined {
  return pricingMode === "PER_PERSON" ? `${participants} pax` : undefined;
}

export function buildInvoiceCategories(pkg: PackageData, rates: Rates, participants: number): InvoiceCategory[] {
  const idrRate = pkg.exchangeRate || 0;
  const categories: InvoiceCategory[] = [];

  // Hotel — grouped by city, with per-room-type composition rows
  const hotelItems: InvoiceLineItem[] = [];
  for (const city of ["Mekkah", "Madinah"]) {
    const rows = pkg.hotels.filter((h) => h.city === city);
    if (rows.length === 0) continue;
    const propertyName = rows.find((r) => r.name)?.name || "";
    const compositionRows = rows.map((r) => {
      const amount = hotelTotal(r, rates);
      return `${ROOM_TYPE_SHORT[r.roomType]}: ${r.rooms} kmr x ${r.nights} mlm = ${formatMoneySAR(amount)}`;
    });
    const totalSAR = rows.reduce((sum, r) => sum + hotelTotal(r, rates), 0);
    hotelItems.push({
      title: `Hotel ${city === "Mekkah" ? "Makkah" : "Madinah"}`,
      subtitle: propertyName,
      compositionRows,
      perJamaahSAR: totalSAR / participants,
      perJamaahIDR: (totalSAR / participants) * idrRate,
      totalSAR,
      totalIDR: totalSAR * idrRate,
    });
  }
  if (hotelItems.length > 0) categories.push({ key: "hotels", label: "HOTEL", items: hotelItems });

  // Tiket Pesawat
  if (pkg.flights.length > 0) {
    categories.push({
      key: "flights",
      label: "TIKET PESAWAT",
      items: pkg.flights.map((item) => {
        const totalSAR = flightTotal(item, participants, rates);
        return {
          title: item.airline ? `${item.route} (${item.airline})` : item.route,
          badge: badgeForPricing(item.pricingMode, participants),
          perJamaahSAR: totalSAR / participants,
          perJamaahIDR: (totalSAR / participants) * idrRate,
          totalSAR,
          totalIDR: totalSAR * idrRate,
        };
      }),
    });
  }

  // Dokumen
  if (pkg.documents.length > 0) {
    categories.push({
      key: "documents",
      label: "DOKUMEN",
      items: pkg.documents.map((item) => {
        const totalSAR = documentTotal(item, participants, rates);
        return {
          title: item.label,
          badge: badgeForPricing(item.pricingMode, participants),
          perJamaahSAR: totalSAR / participants,
          perJamaahIDR: (totalSAR / participants) * idrRate,
          totalSAR,
          totalIDR: totalSAR * idrRate,
        };
      }),
    });
  }

  // Transportasi
  if (pkg.transports.length > 0) {
    categories.push({
      key: "transports",
      label: "TRANSPORTASI",
      items: pkg.transports.map((item) => {
        const totalSAR = transportTotal(item, participants, rates);
        return {
          title: item.label,
          badge: badgeForPricing(item.pricingMode, participants),
          perJamaahSAR: totalSAR / participants,
          perJamaahIDR: (totalSAR / participants) * idrRate,
          totalSAR,
          totalIDR: totalSAR * idrRate,
        };
      }),
    });
  }

  // Handling
  if (pkg.handlings.length > 0) {
    categories.push({
      key: "handlings",
      label: "HANDLING",
      items: pkg.handlings.map((item) => {
        const totalSAR = handlingTotal(item, participants, rates);
        return {
          title: item.label,
          badge: badgeForPricing(item.pricingMode, participants),
          perJamaahSAR: totalSAR / participants,
          perJamaahIDR: (totalSAR / participants) * idrRate,
          totalSAR,
          totalIDR: totalSAR * idrRate,
        };
      }),
    });
  }

  // Konsumsi
  if (pkg.consumptions.length > 0) {
    categories.push({
      key: "consumptions",
      label: "KONSUMSI",
      items: pkg.consumptions.map((item) => {
        const totalSAR = consumptionTotal(item, participants, rates);
        const badge = item.days > 1 ? `${item.days} hari` : badgeForPricing(item.pricingMode, participants);
        return {
          title: item.label,
          badge,
          perJamaahSAR: totalSAR / participants,
          perJamaahIDR: (totalSAR / participants) * idrRate,
          totalSAR,
          totalIDR: totalSAR * idrRate,
        };
      }),
    });
  }

  // Muthawwif / Guide
  if (pkg.guides.length > 0) {
    categories.push({
      key: "guides",
      label: "MUTHAWWIF",
      items: pkg.guides.map((item) => {
        const totalSAR = guideTotal(item, participants, rates);
        const badge = item.days > 1 ? `${item.days} hari` : badgeForPricing(item.pricingMode, participants);
        return {
          title: item.label,
          badge,
          perJamaahSAR: totalSAR / participants,
          perJamaahIDR: (totalSAR / participants) * idrRate,
          totalSAR,
          totalIDR: totalSAR * idrRate,
        };
      }),
    });
  }

  // Item Tambahan
  if (pkg.additionals.length > 0) {
    categories.push({
      key: "additionals",
      label: "ITEM TAMBAHAN",
      items: pkg.additionals.map((item) => {
        const totalSAR = additionalTotal(item, participants, rates);
        return {
          title: item.label,
          badge: badgeForPricing(item.pricingMode, participants),
          perJamaahSAR: totalSAR / participants,
          perJamaahIDR: (totalSAR / participants) * idrRate,
          totalSAR,
          totalIDR: totalSAR * idrRate,
        };
      }),
    });
  }

  return categories;
}
