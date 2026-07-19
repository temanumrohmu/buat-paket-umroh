import type {
  PackageData,
  HotelItem,
  FlightItem,
  DocumentItem,
  TransportItem,
  GuideItem,
  AdditionalItem,
  HandlingItem,
  ConsumptionItem,
  Currency,
} from "./types";

export interface Rates {
  exchangeRate: number;
  usdRate: number;
}

export function toSAR(price: number, currency: Currency, rates: Rates): number {
  if (currency === "SAR") return price;
  if (!rates.exchangeRate) return 0;
  if (currency === "IDR") return price / rates.exchangeRate;
  // USD -> IDR -> SAR
  return (price * rates.usdRate) / rates.exchangeRate;
}

export function hotelTotal(item: HotelItem, rates: Rates): number {
  return toSAR(item.ratePerNight, item.currency, rates) * item.nights * item.rooms;
}

export function flightTotal(item: FlightItem, participants: number, rates: Rates): number {
  const priceSAR = toSAR(item.price, item.currency, rates);
  return item.pricingMode === "TOTAL" ? priceSAR : priceSAR * participants;
}

export function documentTotal(item: DocumentItem, participants: number, rates: Rates): number {
  const priceSAR = toSAR(item.price, item.currency, rates);
  return item.pricingMode === "TOTAL" ? priceSAR * item.qty : priceSAR * participants;
}

export function transportTotal(item: TransportItem, participants: number, rates: Rates): number {
  const priceSAR = toSAR(item.price, item.currency, rates);
  return item.pricingMode === "TOTAL" ? priceSAR * item.qty : priceSAR * participants;
}

export function guideTotal(item: GuideItem, participants: number, rates: Rates): number {
  const base = toSAR(item.rate, item.currency, rates) * item.days;
  return item.pricingMode === "TOTAL" ? base : base * participants;
}

export function additionalTotal(item: AdditionalItem, participants: number, rates: Rates): number {
  const priceSAR = toSAR(item.price, item.currency, rates);
  return item.pricingMode === "TOTAL" ? priceSAR * item.qty : priceSAR * participants;
}

export function handlingTotal(item: HandlingItem, participants: number, rates: Rates): number {
  const priceSAR = toSAR(item.price, item.currency, rates);
  return item.pricingMode === "TOTAL" ? priceSAR : priceSAR * participants;
}

export function consumptionTotal(item: ConsumptionItem, participants: number, rates: Rates): number {
  const priceSAR = toSAR(item.price, item.currency, rates) * (item.days || 1);
  return item.pricingMode === "TOTAL" ? priceSAR : priceSAR * participants;
}

export interface SectionSubtotal {
  hotels: number;
  flights: number;
  documents: number;
  transports: number;
  guides: number;
  additionals: number;
  handlings: number;
  consumptions: number;
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
  grandTotalUSD: number;
}

export function calculateHpp(pkg: PackageData): HppResult {
  const participants = Math.max(1, pkg.participants || 1);
  const rates: Rates = { exchangeRate: pkg.exchangeRate || 0, usdRate: pkg.usdRate || 0 };

  const sections: SectionSubtotal = {
    hotels: pkg.hotels.reduce((sum, i) => sum + hotelTotal(i, rates), 0),
    flights: pkg.flights.reduce((sum, i) => sum + flightTotal(i, participants, rates), 0),
    documents: pkg.documents.reduce((sum, i) => sum + documentTotal(i, participants, rates), 0),
    transports: pkg.transports.reduce((sum, i) => sum + transportTotal(i, participants, rates), 0),
    guides: pkg.guides.reduce((sum, i) => sum + guideTotal(i, participants, rates), 0),
    additionals: pkg.additionals.reduce((sum, i) => sum + additionalTotal(i, participants, rates), 0),
    handlings: pkg.handlings.reduce((sum, i) => sum + handlingTotal(i, participants, rates), 0),
    consumptions: pkg.consumptions.reduce((sum, i) => sum + consumptionTotal(i, participants, rates), 0),
  };

  const subtotalSAR =
    sections.hotels +
    sections.flights +
    sections.documents +
    sections.transports +
    sections.guides +
    sections.additionals +
    sections.handlings +
    sections.consumptions;

  const marginSAR = subtotalSAR * ((pkg.marginPercent || 0) / 100);
  const grandTotalSAR = subtotalSAR + marginSAR;
  const perParticipantSAR = grandTotalSAR / participants;

  const idrRate = pkg.exchangeRate || 0;
  const grandTotalIDR = grandTotalSAR * idrRate;

  return {
    sections,
    subtotalSAR,
    marginSAR,
    grandTotalSAR,
    perParticipantSAR,
    subtotalIDR: subtotalSAR * idrRate,
    marginIDR: marginSAR * idrRate,
    grandTotalIDR,
    perParticipantIDR: perParticipantSAR * idrRate,
    grandTotalUSD: pkg.usdRate ? grandTotalIDR / pkg.usdRate : 0,
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

export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);
}
