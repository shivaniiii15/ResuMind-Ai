import {
  UtensilsCrossed,
  Plane,
  ShoppingBag,
  GraduationCap,
  HeartPulse,
  Clapperboard,
  ReceiptText,
  Boxes,
  Briefcase,
  TrendingUp,
  Gift,
  Coins,
  type LucideIcon,
} from "lucide-react";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Education",
  "Healthcare",
  "Entertainment",
  "Bills",
  "Other",
] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Business",
  "Investment",
  "Gift",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Food: UtensilsCrossed,
  Travel: Plane,
  Shopping: ShoppingBag,
  Education: GraduationCap,
  Healthcare: HeartPulse,
  Entertainment: Clapperboard,
  Bills: ReceiptText,
  Salary: Briefcase,
  Business: TrendingUp,
  Investment: Coins,
  Gift: Gift,
  Other: Boxes,
};

// Distinct chart palette (oklch tokens referenced via inline style where needed)
export const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-expense)",
];

export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "NGN", symbol: "₦", label: "Nigerian Naira" },
] as const;
