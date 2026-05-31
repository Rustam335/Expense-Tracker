"use client";

import { Receipt, Trash2 } from "lucide-react";
import { formatIDR } from "@/lib/currency";
import { CATEGORY_COLORS, type Transaction } from "@/lib/types";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TransactionList({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)] px-6 py-16 text-center">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-[var(--primary)]"
          style={{ background: "var(--surface-3)" }}
        >
          <Receipt size={24} strokeWidth={1.8} />
        </div>
        <p className="text-sm font-bold">Nothing here yet</p>
        <p className="mt-1.5 max-w-xs text-sm text-[var(--muted)]">
          Add your first transaction or adjust the filters to see your activity
          appear in this feed.
        </p>
      </div>
    );
  }

  return (
    <ul className="scroll-area max-h-[28rem] space-y-2 overflow-y-auto pr-1">
      {transactions.map((tx) => {
        const isIncome = tx.type === "income";
        return (
          <li
            key={tx.id}
            className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)]"
          >
            {/* Color rail keyed to type */}
            <span
              aria-hidden="true"
              className="absolute inset-y-2 left-0 w-[3px] rounded-full"
              style={{
                background: isIncome ? "var(--income)" : "var(--expense)",
                opacity: 0.85,
              }}
            />
            <span
              className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
              style={{ background: CATEGORY_COLORS[tx.category] }}
              title={tx.category}
            >
              {tx.category.slice(0, 2).toUpperCase()}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold">
                  {tx.note || tx.category}
                </p>
                <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]">
                  {tx.category}
                </span>
              </div>
              <p className="text-xs text-[var(--faint)]">{formatDate(tx.date)}</p>
            </div>

            <p
              className="shrink-0 text-sm font-bold tabular-nums"
              style={{
                color: isIncome ? "var(--income)" : "var(--expense)",
                fontFamily: "var(--font-mono), monospace",
              }}
            >
              {isIncome ? "+" : "−"}
              {formatIDR(tx.amount)}
            </p>

            <button
              type="button"
              onClick={() => onDelete(tx.id)}
              aria-label="Delete transaction"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--faint)] opacity-0 transition duration-200 hover:bg-[var(--expense-soft)] hover:text-[var(--expense)] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--expense)] group-hover:opacity-100"
            >
              <Trash2 size={16} strokeWidth={2} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
