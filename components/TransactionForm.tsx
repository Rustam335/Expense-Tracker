"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  type Category,
  type Transaction,
  type TransactionType,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/lib/types";

interface Props {
  onAdd: (tx: Omit<Transaction, "id">) => void;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function TransactionForm({ onAdd }: Props) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const categoryOptions =
    type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function switchType(next: TransactionType) {
    setType(next);
    // Keep category valid for the chosen type.
    const opts = next === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!opts.includes(category)) setCategory(opts[0]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!amount || Number.isNaN(value) || value <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    if (!date) {
      setError("Pick a date.");
      return;
    }
    setError("");
    onAdd({
      amount: Math.round(value),
      type,
      category,
      date,
      note: note.trim() || undefined,
    });
    setAmount("");
    setNote("");
  }

  const inputClass = "field";

  return (
    <form onSubmit={handleSubmit} className="card card-edge p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-2)] text-[var(--primary)]">
          <Plus size={15} strokeWidth={2.4} />
        </span>
        <h2 className="text-base font-bold tracking-tight">Add Transaction</h2>
      </div>

      {/* Type toggle */}
      <div className="seg mb-4 grid grid-cols-2 gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-1">
        {(["expense", "income"] as TransactionType[]).map((t) => {
          const active = type === t;
          const color = t === "income" ? "var(--income)" : "var(--expense)";
          const soft =
            t === "income" ? "var(--income-soft)" : "var(--expense-soft)";
          return (
            <button
              key={t}
              type="button"
              onClick={() => switchType(t)}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold capitalize transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              style={
                active
                  ? {
                      background: soft,
                      color,
                      boxShadow: `inset 0 0 0 1px ${color}`,
                    }
                  : { color: "var(--muted)" }
              }
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--faint)]">
            Amount (Rp)
          </label>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            step="1000"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${inputClass} tabular-nums`}
            style={{ fontFamily: "var(--font-mono), monospace" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--faint)]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={inputClass}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--faint)]">
              Date
            </label>
            <input
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--faint)]">
            Note (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Lunch with team"
            value={note}
            maxLength={80}
            onChange={(e) => setNote(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-[var(--expense)]">{error}</p>
        )}

        <button
          type="submit"
          className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--ring)] transition duration-200 hover:shadow-xl hover:shadow-[var(--ring)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] active:scale-[0.99]"
        >
          <span className="relative">Add Transaction</span>
        </button>
      </div>
    </form>
  );
}
