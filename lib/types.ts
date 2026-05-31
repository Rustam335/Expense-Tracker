export type TransactionType = "income" | "expense";

export type Category =
  | "Food"
  | "Transport"
  | "Salary"
  | "Shopping"
  | "Bills"
  | "Other";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // ISO date string (YYYY-MM-DD)
  note?: string;
}

export const CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Salary",
  "Shopping",
  "Bills",
  "Other",
];

export const INCOME_CATEGORIES: Category[] = ["Salary", "Other"];
export const EXPENSE_CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Other",
];

// Stable, accessible color per category (used across charts + badges).
// Harmonized around the spec palette: trust-blue, profit-green, supporting
// hues kept legible on both the light (#F8FAFC) and dark (#0F172A) surfaces.
export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "#d97706", // amber
  Transport: "#3b82f6", // secondary blue
  Salary: "#059669", // profit green (matches income accent)
  Shopping: "#1e40af", // primary trust-blue
  Bills: "#dc2626", // destructive red (matches expense accent)
  Other: "#64748b", // slate
};
