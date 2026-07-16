import type {
  PackageData,
  HotelItem,
  FlightItem,
  DocumentItem,
  TransportItem,
  GuideItem,
  AdditionalItem,
} from "./types";

export function hotelTotal(item: HotelItem, participants: number): number {
  const base = item.ratePerNight * item.nights;
  return item.pricingMode === "TOTAL"
    ? base * item.rooms
    : base * participants;
}

export function flightTotal(item: FlightItem, participants: number): number {
  return item.pricingMode === "TOTAL"
    ? item.price * item.qty
    : item.price * participants;
}

export function documentTotal(item: DocumentItem, participants: number): number {
  return item.pricingMode === "TOTAL"
    ? item.price * item.qty
    : item.price * participants;
}

export function transportTotal(item: TransportItem, participants: number): number {
  return item.pricingMode === "TOTAL"
    ? item.price * item.qty
    : item.price * participants;
}

export function guideTotal(item: GuideItem, participants: number): number {
  const base = item.rate * item.days;
  return item.pricingMode === "TOTAL" ? base : base * participants;
}

export function additionalTotal(item: AdditionalItem, participants: number): number {
  return item.pricingMode === "TOTAL"
    ? item.price * item.qty
    : item.price * participants;
}

export interface SectionSubtotal {
  hotels: number;
  flights: number;
  documents: number;
  transports: number;
  guides: number;
  additionals: number;
}

export interface HppResult {
  sections: SectionSubtotal;
  subtotalSAR: number;
  marginSAR: number;
  grandTotalSAR: number;
  perParticipantSAR: number;
  subtotalIDR: number;
  marginIDR: number;
  grandTotalIDR: number;
  perParticipantIDR: number;
}

export function calculateHpp(pkg: PackageData): HppResult {
  const participants = Math.max(1, pkg.participants || 1);

  const sections: SectionSubtotal = {
    hotels: pkg.hotels.reduce((sum, i) => sum + hotelTotal(i, participants), 0),
    flights: pkg.flights.reduce((sum, i) => sum + flightTotal(i, participants), 0),
    documents: pkg.documents.reduce((sum, i) => sum + documentTotal(i, participants), 0),
    transports: pkg.transports.reduce((sum, i) => sum + transportTotal(i, participants), 0),
    guides: pkg.guides.reduce((sum, i) => sum + guideTotal(i, participants), 0),
    additionals: pkg.additionals.reduce((sum, i) => sum + additionalTotal(i, participants), 0),
  };

  const subtotalSAR =
    sections.hotels +
    sections.flights +
    sections.documents +
    sections.transports +
    sections.guides +
    sections.additionals;

  const marginSAR = subtotalSAR * ((pkg.marginPercent || 0) / 100);
  const grandTotalSAR = subtotalSAR + marginSAR;
  const perParticipantSAR = grandTotalSAR / participants;

  const rate = pkg.exchangeRate || 0;

  return {
    sections,
    subtotalSAR,
    marginSAR,
    grandTotalSAR,
    perParticipantSAR,
    subtotalIDR: subtotalSAR * rate,
    marginIDR: marginSAR * rate,
    grandTotalIDR: grandTotalSAR * rate,
    perParticipantIDR: perParticipantSAR * rate,
  };
}

export function formatSAR(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}
