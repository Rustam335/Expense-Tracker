"use client";

import { useEffect, useMemo, useState } from "react";
import { LineChart } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import BalanceHero from "@/components/BalanceHero";
import SummaryCards from "@/components/SummaryCards";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import Filters, { type FilterState } from "@/components/Filters";
import CategoryPieChart from "@/components/CategoryPieChart";
import TrendChart from "@/components/TrendChart";
import { loadTransactions, saveTransactions } from "@/lib/storage";
import type { Transaction } from "@/lib/types";

function createId() {
  return `tx_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    category: "all",
    month: "all",
  });

  // Load persisted data (and seed sample data) on first mount.
  useEffect(() => {
    setTransactions(loadTransactions());
    setHydrated(true);
  }, []);

  // Persist on every change after hydration.
  useEffect(() => {
    if (hydrated) saveTransactions(transactions);
  }, [transactions, hydrated]);

  function addTransaction(tx: Omit<Transaction, "id">) {
    setTransactions((prev) => [{ ...tx, id: createId() }, ...prev]);
  }

  function deleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  // Available months for the filter, newest first.
  const months = useMemo(() => {
    const set = new Set(transactions.map((t) => t.date.slice(0, 7)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  // Apply filters; sort newest first.
  const filtered = useMemo(() => {
    return transactions
      .filter((t) => filters.type === "all" || t.type === filters.type)
      .filter(
        (t) => filters.category === "all" || t.category === filters.category
      )
      .filter(
        (t) => filters.month === "all" || t.date.slice(0, 7) === filters.month
      )
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  }, [transactions, filters]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of filtered) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, balance: income - expense };
  }, [filtered]);

  const savingsRate =
    summary.income > 0
      ? Math.max(0, Math.round((summary.balance / summary.income) * 100))
      : 0;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white shadow-lg shadow-[var(--ring)]">
            <LineChart size={22} strokeWidth={2.2} />
          </span>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">Ledger</h1>
            <p className="text-xs font-medium text-[var(--muted)]">
              Personal finance dashboard
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {!hydrated ? (
        <LoadingState />
      ) : (
        <div className="space-y-6">
          {/* Hero + summary band */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr]">
            <div className="reveal" style={{ animationDelay: "40ms" }}>
              <BalanceHero
                balance={summary.balance}
                income={summary.income}
                savingsRate={savingsRate}
                count={filtered.length}
              />
            </div>
            <SummaryCards income={summary.income} expense={summary.expense} />
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.25fr]">
            <div className="reveal" style={{ animationDelay: "260ms" }}>
              <CategoryPieChart transactions={filtered} />
            </div>
            <div className="reveal" style={{ animationDelay: "320ms" }}>
              <TrendChart transactions={filtered} />
            </div>
          </section>

          {/* Main grid: form + list */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[20rem_1fr]">
            <div
              className="reveal lg:sticky lg:top-6 lg:self-start"
              style={{ animationDelay: "380ms" }}
            >
              <TransactionForm onAdd={addTransaction} />
            </div>

            <div
              className="reveal card card-edge p-5"
              style={{ animationDelay: "440ms" }}
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-bold tracking-tight">
                    Transactions
                  </h2>
                  <p className="text-xs text-[var(--muted)]">
                    {filtered.length}{" "}
                    {filtered.length === 1 ? "entry" : "entries"} shown
                  </p>
                </div>
                <Filters
                  filters={filters}
                  months={months}
                  onChange={setFilters}
                />
              </div>
              <TransactionList
                transactions={filtered}
                onDelete={deleteTransaction}
              />
            </div>
          </section>
        </div>
      )}

      <footer className="mt-12 flex flex-col items-center gap-1 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--faint)]">
        <p>
          Built with Next.js, TypeScript, Tailwind CSS &amp; Recharts
        </p>
        <p>Your data never leaves this browser.</p>
      </footer>
    </main>
  );
}

function LoadingState() {
  return (
    <div className="animate-in space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="skeleton h-44 rounded-2xl" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="skeleton h-44 rounded-2xl" />
          <div className="skeleton h-44 rounded-2xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="skeleton h-72 rounded-2xl" />
        <div className="skeleton h-72 rounded-2xl" />
      </div>
    </div>
  );
}
