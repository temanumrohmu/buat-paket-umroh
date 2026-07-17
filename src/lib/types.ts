export type PricingMode = "TOTAL" | "PER_PERSON";

export interface HotelItem {
  id?: string;
  city: string;
  name: string;
  nights: number;
  rooms: number;
  ratePerNight: number;
  pricingMode: PricingMode;
}

export interface FlightItem {
  id?: string;
  route: string;
  airline: string;
  qty: number;
  price: number;
  pricingMode: PricingMode;
}

export interface DocumentItem {
  id?: string;
  label: string;
  qty: number;
  price: number;
  pricingMode: PricingMode;
}

export interface TransportItem {
  id?: string;
  label: string;
  qty: number;
  price: number;
  pricingMode: PricingMode;
}

export interface GuideItem {
  id?: string;
  label: string;
  days: number;
  rate: number;
  pricingMode: PricingMode;
}

export interface AdditionalItem {
  id?: string;
  label: string;
  qty: number;
  price: number;
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
  notes: string;
  hotels: HotelItem[];
  flights: FlightItem[];
  documents: DocumentItem[];
  transports: TransportItem[];
  guides: GuideItem[];
  additionals: AdditionalItem[];
}

export interface PackageSummaryListItem {
  id: string;
  name: string;
  participants: number;
  updatedAt: string;
}

export function stripId<T extends { id?: string }>(item: T): Omit<T, "id"> {
  const rest: Partial<T> = { ...item };
  delete rest.id;
  return rest as Omit<T, "id">;
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
    notes: "",
    hotels: [],
    flights: [],
    documents: [],
    transports: [],
    guides: [],
    additionals: [],
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
