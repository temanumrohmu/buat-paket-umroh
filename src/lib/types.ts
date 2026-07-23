export type PricingMode = "TOTAL" | "PER_PERSON";

export type Currency = "IDR" | "SAR" | "USD";

export const CURRENCY_LABELS: Record<Currency, string> = {
  SAR: "SAR",
  IDR: "IDR",
  USD: "USD",
};

export interface HotelItem {
  id?: string;
  city: string;
  name: string;
  stars: number;
  roomType: string;
  nights: number;
  rooms: number;
  ratePerNight: number;
  currency: Currency;
  pricingMode: PricingMode;
}

export interface FlightItem {
  id?: string;
  route: string;
  airline: string;
  qty: number;
  price: number;
  currency: Currency;
  pricingMode: PricingMode;
}

export interface DocumentItem {
  id?: string;
  presetKey?: string | null;
  label: string;
  notes: string;
  qty: number;
  price: number;
  currency: Currency;
  pricingMode: PricingMode;
}

export interface TransportItem {
  id?: string;
  category: string;
  presetKey?: string | null;
  label: string;
  vehicleType: string;
  notes: string;
  qty: number;
  price: number;
  currency: Currency;
  pricingMode: PricingMode;
}

export interface GuideItem {
  id?: string;
  label: string;
  days: number;
  rate: number;
  notes: string;
  currency: Currency;
  pricingMode: PricingMode;
}

export interface AdditionalItem {
  id?: string;
  label: string;
  qty: number;
  price: number;
  currency: Currency;
  pricingMode: PricingMode;
}

export interface HandlingItem {
  id?: string;
  category: string;
  presetKey?: string | null;
  label: string;
  notes: string;
  price: number;
  currency: Currency;
  pricingMode: PricingMode;
}

export interface ConsumptionItem {
  id?: string;
  presetKey?: string | null;
  label: string;
  days: number;
  price: number;
  currency: Currency;
  pricingMode: PricingMode;
}

export interface PackageData {
  id?: string;
  name: string;
  participants: number;
  departureDate: string;
  nightsMakkah: number;
  nightsMadinah: number;
  marginPercent: number;
  exchangeRate: number;
  usdRate: number;
  notes: string;
  hotels: HotelItem[];
  flights: FlightItem[];
  documents: DocumentItem[];
  transports: TransportItem[];
  guides: GuideItem[];
  additionals: AdditionalItem[];
  handlings: HandlingItem[];
  consumptions: ConsumptionItem[];
}

// Nested items coming back from the API carry server-only fields (packageId,
// createdAt) that Prisma's nested `create` rejects. These pick only the
// fields a client is allowed to write.
export function toHotelCreateInput(item: HotelItem) {
  return {
    city: item.city,
    name: item.name,
    stars: item.stars,
    roomType: item.roomType,
    nights: item.nights,
    rooms: item.rooms,
    ratePerNight: item.ratePerNight,
    currency: item.currency,
    pricingMode: item.pricingMode,
  };
}

export function toFlightCreateInput(item: FlightItem) {
  return {
    route: item.route,
    airline: item.airline,
    qty: item.qty,
    price: item.price,
    currency: item.currency,
    pricingMode: item.pricingMode,
  };
}

export function toLineItemCreateInput(item: AdditionalItem) {
  return {
    label: item.label,
    qty: item.qty,
    price: item.price,
    currency: item.currency,
    pricingMode: item.pricingMode,
  };
}

export function toDocumentCreateInput(item: DocumentItem) {
  return {
    presetKey: item.presetKey ?? null,
    label: item.label,
    notes: item.notes,
    qty: item.qty,
    price: item.price,
    currency: item.currency,
    pricingMode: item.pricingMode,
  };
}

export function toTransportCreateInput(item: TransportItem) {
  return {
    category: item.category,
    presetKey: item.presetKey ?? null,
    label: item.label,
    vehicleType: item.vehicleType,
    notes: item.notes,
    qty: item.qty,
    price: item.price,
    currency: item.currency,
    pricingMode: item.pricingMode,
  };
}

export function toGuideCreateInput(item: GuideItem) {
  return {
    label: item.label,
    days: item.days,
    rate: item.rate,
    notes: item.notes,
    currency: item.currency,
    pricingMode: item.pricingMode,
  };
}

export function toHandlingCreateInput(item: HandlingItem) {
  return {
    category: item.category,
    presetKey: item.presetKey ?? null,
    label: item.label,
    notes: item.notes,
    price: item.price,
    currency: item.currency,
    pricingMode: item.pricingMode,
  };
}

export function toConsumptionCreateInput(item: ConsumptionItem) {
  return {
    presetKey: item.presetKey ?? null,
    label: item.label,
    days: item.days,
    price: item.price,
    currency: item.currency,
    pricingMode: item.pricingMode,
  };
}

export function emptyPackage(): PackageData {
  return {
    name: "",
    participants: 1,
    departureDate: "",
    nightsMakkah: 0,
    nightsMadinah: 0,
    marginPercent: 15,
    exchangeRate: 4300,
    usdRate: 15800,
    notes: "",
    hotels: [],
    flights: [],
    documents: [],
    transports: [],
    guides: [],
    additionals: [],
    handlings: [],
    consumptions: [],
  };
}

export function toDateInputValue(value: string | Date | null | undefined): string {
  if (!value) return "";
  const iso = typeof value === "string" ? value : value.toISOString();
  return iso.slice(0, 10);
}

export interface TripLength {
  totalNights: number;
  totalDays: number;
  returnDate: string;
}

export function calculateTripLength(pkg: Pick<PackageData, "departureDate" | "nightsMakkah" | "nightsMadinah">): TripLength {
  const totalNights = (pkg.nightsMakkah || 0) + (pkg.nightsMadinah || 0);
  const totalDays = totalNights > 0 ? totalNights + 1 : 0;

  let returnDate = "";
  if (pkg.departureDate && totalNights > 0) {
    const [year, month, day] = pkg.departureDate.split("-").map(Number);
    if (year && month && day) {
      const endUtc = new Date(Date.UTC(year, month - 1, day + totalNights));
      returnDate = endUtc.toISOString().slice(0, 10);
    }
  }

  return { totalNights, totalDays, returnDate };
}
