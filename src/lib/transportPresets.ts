import type { PricingMode } from "./types";

export type TransportCategory =
  | "BANDARA"
  | "KERETA_HARAMAIN"
  | "KENDARAAN_STASIUN"
  | "CITY_TOUR"
  | "LAINNYA";

export type TransportFieldMode = "vehicle" | "perOrang";

export interface TransportCategoryDef {
  key: TransportCategory;
  icon: string;
  title: string;
}

export interface TransportPreset {
  key: string;
  category: TransportCategory;
  label: string;
  subtitle: string;
  mode: TransportFieldMode;
  defaultPricingMode: PricingMode;
}

export const TRANSPORT_CATEGORIES: TransportCategoryDef[] = [
  { key: "BANDARA", icon: "✈️", title: "Bandara" },
  { key: "KERETA_HARAMAIN", icon: "🚄", title: "Tiket Kereta Haramain (Per Orang)" },
  { key: "KENDARAAN_STASIUN", icon: "🚌", title: "Kendaraan Stasiun" },
  { key: "CITY_TOUR", icon: "🗺️", title: "City Tour" },
];

export const TRANSPORT_PRESETS: TransportPreset[] = [
  {
    key: "PENJEMPUTAN_BANDARA",
    category: "BANDARA",
    label: "Penjemputan Bandara",
    subtitle: "Bandara → Hotel",
    mode: "vehicle",
    defaultPricingMode: "TOTAL",
  },
  {
    key: "KEPULANGAN_BANDARA",
    category: "BANDARA",
    label: "Kepulangan Bandara",
    subtitle: "Hotel → Bandara",
    mode: "vehicle",
    defaultPricingMode: "TOTAL",
  },

  {
    key: "KERETA_MAKKAH_MADINAH",
    category: "KERETA_HARAMAIN",
    label: "Makkah → Madinah",
    subtitle: "Kereta Haramain · per orang",
    mode: "perOrang",
    defaultPricingMode: "PER_PERSON",
  },
  {
    key: "KERETA_MADINAH_MAKKAH",
    category: "KERETA_HARAMAIN",
    label: "Madinah → Makkah",
    subtitle: "Kereta Haramain · per orang",
    mode: "perOrang",
    defaultPricingMode: "PER_PERSON",
  },
  {
    key: "KERETA_JEDDAH_MAKKAH",
    category: "KERETA_HARAMAIN",
    label: "Jeddah → Makkah",
    subtitle: "Kereta Haramain · per orang",
    mode: "perOrang",
    defaultPricingMode: "PER_PERSON",
  },
  {
    key: "KERETA_MAKKAH_JEDDAH",
    category: "KERETA_HARAMAIN",
    label: "Makkah → Jeddah",
    subtitle: "Kereta Haramain · per orang",
    mode: "perOrang",
    defaultPricingMode: "PER_PERSON",
  },
  {
    key: "KERETA_JEDDAH_MADINAH",
    category: "KERETA_HARAMAIN",
    label: "Jeddah → Madinah",
    subtitle: "Kereta Haramain · per orang",
    mode: "perOrang",
    defaultPricingMode: "PER_PERSON",
  },
  {
    key: "KERETA_MADINAH_JEDDAH",
    category: "KERETA_HARAMAIN",
    label: "Madinah → Jeddah",
    subtitle: "Kereta Haramain · per orang",
    mode: "perOrang",
    defaultPricingMode: "PER_PERSON",
  },

  {
    key: "STASIUN_HOTEL_MAKKAH",
    category: "KENDARAAN_STASIUN",
    label: "Stasiun → Hotel Makkah",
    subtitle: "Haramain → Hotel",
    mode: "vehicle",
    defaultPricingMode: "TOTAL",
  },
  {
    key: "HOTEL_MAKKAH_STASIUN",
    category: "KENDARAAN_STASIUN",
    label: "Hotel Makkah → Stasiun",
    subtitle: "Hotel → Haramain",
    mode: "vehicle",
    defaultPricingMode: "TOTAL",
  },
  {
    key: "STASIUN_HOTEL_MADINAH",
    category: "KENDARAAN_STASIUN",
    label: "Stasiun → Hotel Madinah",
    subtitle: "Haramain → Hotel",
    mode: "vehicle",
    defaultPricingMode: "TOTAL",
  },
  {
    key: "HOTEL_MADINAH_STASIUN",
    category: "KENDARAAN_STASIUN",
    label: "Hotel Madinah → Stasiun",
    subtitle: "Hotel → Haramain",
    mode: "vehicle",
    defaultPricingMode: "TOTAL",
  },

  {
    key: "CITY_TOUR_MADINAH",
    category: "CITY_TOUR",
    label: "City Tour Madinah",
    subtitle: "Ziarah Madinah",
    mode: "vehicle",
    defaultPricingMode: "TOTAL",
  },
  {
    key: "CITY_TOUR_MAKKAH",
    category: "CITY_TOUR",
    label: "City Tour Makkah",
    subtitle: "Ziarah Makkah",
    mode: "vehicle",
    defaultPricingMode: "TOTAL",
  },
];
