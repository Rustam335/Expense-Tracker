import type { Transaction } from "./types";

const STORAGE_KEY = "expense-tracker:transactions";

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

/** Sensible sample data so the dashboard + charts look alive on first load. */
export function sampleTransactions(): Transaction[] {
  return [
    { id: "s1", amount: 8500000, type: "income", category: "Salary", date: isoDaysAgo(28), note: "Monthly salary" },
    { id: "s2", amount: 1200000, type: "income", category: "Other", date: isoDaysAgo(20), note: "Freelance project" },
    { id: "s3", amount: 75000, type: "expense", category: "Food", date: isoDaysAgo(26), note: "Lunch with team" },
    { id: "s4", amount: 250000, type: "expense", category: "Transport", date: isoDaysAgo(24), note: "Fuel" },
    { id: "s5", amount: 1500000, type: "expense", category: "Bills", date: isoDaysAgo(22), note: "Electricity & internet" },
    { id: "s6", amount: 430000, type: "expense", category: "Shopping", date: isoDaysAgo(18), note: "New headphones" },
    { id: "s7", amount: 120000, type: "expense", category: "Food", date: isoDaysAgo(14), note: "Groceries" },
    { id: "s8", amount: 60000, type: "expense", category: "Transport", date: isoDaysAgo(11), note: "Ride share" },
    { id: "s9", amount: 320000, type: "expense", category: "Shopping", date: isoDaysAgo(7), note: "Clothes" },
    { id: "s10", amount: 95000, type: "expense", category: "Food", date: isoDaysAgo(4), note: "Dinner" },
    { id: "s11", amount: 200000, type: "expense", category: "Bills", date: isoDaysAgo(2), note: "Phone credit" },
    { id: "s12", amount: 45000, type: "expense", category: "Other", date: isoDaysAgo(1), note: "Coffee" },
  ];
}

export function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const seed = sampleTransactions();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Transaction[]) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    // Ignore quota / serialization errors — non-critical for a demo app.
  }
}
