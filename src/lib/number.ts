export function parseNumericInput(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
}
