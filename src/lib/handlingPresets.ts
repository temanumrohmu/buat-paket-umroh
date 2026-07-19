import type { PricingMode } from "./types";

export type HandlingCategory = "KEDATANGAN" | "KEPULANGAN" | "KEDATANGAN_KEPULANGAN";

export interface HandlingCategoryDef {
  key: HandlingCategory;
  icon: string;
  title: string;
}

export interface HandlingPreset {
  key: string;
  category: HandlingCategory;
  label: string;
  subtitle: string;
  defaultPricingMode: PricingMode;
}

export const HANDLING_CATEGORIES: HandlingCategoryDef[] = [
  { key: "KEDATANGAN", icon: "🛬", title: "Handling Kedatangan" },
  { key: "KEPULANGAN", icon: "🛫", title: "Handling Kepulangan" },
  { key: "KEDATANGAN_KEPULANGAN", icon: "🤝", title: "Handling Kedatangan + Kepulangan" },
];

export const HANDLING_PRESETS: HandlingPreset[] = [
  {
    key: "HANDLING_KEDATANGAN_BANDARA",
    category: "KEDATANGAN",
    label: "Handling Kedatangan Bandara",
    subtitle: "per sesi",
    defaultPricingMode: "TOTAL",
  },
  {
    key: "WELCOME_DRINK_ALBAIK",
    category: "KEDATANGAN",
    label: "Welcome Drink + Al Baik",
    subtitle: "per orang",
    defaultPricingMode: "TOTAL",
  },

  {
    key: "HANDLING_KEPULANGAN_BANDARA",
    category: "KEPULANGAN",
    label: "Handling Kepulangan Bandara",
    subtitle: "per sesi",
    defaultPricingMode: "TOTAL",
  },
  {
    key: "MEALS_KEPULANGAN",
    category: "KEPULANGAN",
    label: "Meals Kepulangan (Menu Indonesia)",
    subtitle: "per orang",
    defaultPricingMode: "TOTAL",
  },

  {
    key: "CHECKIN_HOTEL_MADINAH",
    category: "KEDATANGAN_KEPULANGAN",
    label: "Check In Hotel Madinah",
    subtitle: "per sesi",
    defaultPricingMode: "TOTAL",
  },
  {
    key: "CHECKOUT_MADINAH_BELLBOY",
    category: "KEDATANGAN_KEPULANGAN",
    label: "Check Out Madinah + Bellboy",
    subtitle: "per sesi",
    defaultPricingMode: "TOTAL",
  },
  {
    key: "CHECKIN_MAKKAH_BELLBOY",
    category: "KEDATANGAN_KEPULANGAN",
    label: "Check In Hotel Makkah + Bellboy",
    subtitle: "per sesi",
    defaultPricingMode: "TOTAL",
  },
  {
    key: "CHECKOUT_MAKKAH_BELLBOY",
    category: "KEDATANGAN_KEPULANGAN",
    label: "Check Out Makkah + Bellboy",
    subtitle: "per sesi",
    defaultPricingMode: "TOTAL",
  },
];
