import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Indian-format currency, e.g. 3499 -> ₹3,499 */
export function inr(value: number, withSymbol = true) {
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
  return withSymbol ? `₹${formatted}` : formatted;
}

/** Indian short scale: 420000 -> ₹4.2L, 12000000 -> ₹1.2Cr */
export function inrCompact(value: number) {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(1)}Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(1)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`;
  return `₹${value}`;
}

export function usd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
