/**
 * Format a number as Indonesian Rupiah, e.g. 1500000 -> "Rp 1.500.000".
 */
export function formatIDR(value: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));

  const sign = value < 0 ? "-" : "";
  // Intl renders "Rp1.500.000"; add a space for readability.
  return `${sign}${formatted.replace(/^Rp\s?/, "Rp ")}`;
}

/**
 * Compact format for axis ticks, e.g. 1500000 -> "Rp 1,5jt".
 */
export function formatIDRCompact(value: number): string {
  const abs = Math.abs(value);
  let out: string;
  if (abs >= 1_000_000_000) {
    out = `${(abs / 1_000_000_000).toFixed(1).replace(".0", "")}M`;
  } else if (abs >= 1_000_000) {
    out = `${(abs / 1_000_000).toFixed(1).replace(".0", "")}jt`;
  } else if (abs >= 1_000) {
    out = `${Math.round(abs / 1_000)}rb`;
  } else {
    out = `${abs}`;
  }
  return `${value < 0 ? "-" : ""}Rp ${out}`;
}
