import type { PricingMode } from "./types";

export interface ConsumptionPreset {
  key: string;
  label: string;
  subtitle: string;
  defaultPricingMode: PricingMode;
  hasDays: boolean;
}

export const CONSUMPTION_PRESETS: ConsumptionPreset[] = [
  {
    key: "MAKAN_FNB",
    label: "Makan / F&B",
    subtitle: "per hari",
    defaultPricingMode: "TOTAL",
    hasDays: true,
  },
  {
    key: "SNACK_CITY_TOUR_MAKKAH",
    label: "Snack City Tour Makkah",
    subtitle: "per orang",
    defaultPricingMode: "TOTAL",
    hasDays: false,
  },
  {
    key: "SNACK_CITY_TOUR_MADINAH",
    label: "Snack City Tour Madinah",
    subtitle: "per orang",
    defaultPricingMode: "TOTAL",
    hasDays: false,
  },
];
