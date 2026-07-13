import type { Transaction } from "@/hooks/use-finance";

export interface Totals {
  income: number;
  expense: number;
  balance: number;
  savingsRate: number;
}

export function computeTotals(txns: Transaction[]): Totals {
  const income = txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = txns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;
  return { income, expense, balance, savingsRate };
}

export function inMonth(txns: Transaction[], month: number, year: number): Transaction[] {
  return txns.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });
}

export function inYear(txns: Transaction[], year: number): Transaction[] {
  return txns.filter((t) => new Date(t.date).getFullYear() === year);
}

/** Expense totals grouped by category */
export function expensesByCategory(txns: Transaction[]): { name: string; value: number }[] {
  const map = new Map<string, number>();
  txns
    .filter((t) => t.type === "expense")
    .forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.amount));
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/** Monthly income vs expense series for a given year */
export function monthlySeries(
  txns: Transaction[],
  year: number,
): { month: string; income: number; expense: number }[] {
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(year, i, 1).toLocaleDateString(undefined, { month: "short" }),
    income: 0,
    expense: 0,
  }));
  txns.forEach((t) => {
    const d = new Date(t.date);
    if (d.getFullYear() !== year) return;
    const m = d.getMonth();
    if (t.type === "income") months[m].income += t.amount;
    else months[m].expense += t.amount;
  });
  return months;
}

export type Period = "daily" | "weekly" | "monthly" | "yearly";

export function filterByPeriod(txns: Transaction[], period: Period): Transaction[] {
  const now = new Date();
  const start = new Date(now);
  if (period === "daily") start.setHours(0, 0, 0, 0);
  else if (period === "weekly") start.setDate(now.getDate() - 7);
  else if (period === "monthly") start.setMonth(now.getMonth() - 1);
  else start.setFullYear(now.getFullYear() - 1);
  return txns.filter((t) => new Date(t.date) >= start);
}
