import { CURRENCIES } from "./constants";

export function currencySymbol(code: string | undefined | null): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? "$";
}

export function formatCurrency(amount: number, code?: string | null): string {
  const symbol = currencySymbol(code);
  const formatted = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount < 0 ? "-" : ""}${symbol}${formatted}`;
}

export function formatCompact(amount: number, code?: string | null): string {
  const symbol = currencySymbol(code);
  return `${symbol}${amount.toLocaleString(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  })}`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function monthLabel(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleDateString(undefined, { month: "long" });
}
