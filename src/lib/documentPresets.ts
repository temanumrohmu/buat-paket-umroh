import type { PricingMode } from "./types";

export interface DocumentPreset {
  key: string;
  label: string;
  subtitle: string;
  defaultPricingMode: PricingMode;
}

export const DOCUMENT_PRESETS: DocumentPreset[] = [
  {
    key: "VISA_UMRAH",
    label: "Visa Umrah",
    subtitle: "per orang",
    defaultPricingMode: "PER_PERSON",
  },
  {
    key: "SISKOPATUH",
    label: "Siskopatuh",
    subtitle: "per orang",
    defaultPricingMode: "PER_PERSON",
  },
  {
    key: "TASREH_RAUDHAH",
    label: "Tasreh Raudhah",
    subtitle: "per orang",
    defaultPricingMode: "PER_PERSON",
  },
];
