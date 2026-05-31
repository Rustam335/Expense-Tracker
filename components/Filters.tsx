"use client";

import { CATEGORIES, type Category, type TransactionType } from "@/lib/types";

export interface FilterState {
  type: TransactionType | "all";
  category: Category | "all";
  month: string | "all"; // YYYY-MM
}

interface Props {
  filters: FilterState;
  months: string[]; // available YYYY-MM values
  onChange: (next: FilterState) => void;
}

function monthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function Filters({ filters, months, onChange }: Props) {
  const selectClass = "field !w-auto !py-2 text-xs font-medium";

  const hasActive =
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.month !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-[var(--faint)] sm:inline">
        Filter
      </span>

      <select
        value={filters.type}
        onChange={(e) =>
          onChange({ ...filters, type: e.target.value as FilterState["type"] })
        }
        className={selectClass}
        aria-label="Filter by type"
      >
        <option value="all">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        value={filters.category}
        onChange={(e) =>
          onChange({
            ...filters,
            category: e.target.value as FilterState["category"],
          })
        }
        className={selectClass}
        aria-label="Filter by category"
      >
        <option value="all">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={filters.month}
        onChange={(e) => onChange({ ...filters, month: e.target.value })}
        className={selectClass}
        aria-label="Filter by month"
      >
        <option value="all">All months</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {monthLabel(m)}
          </option>
        ))}
      </select>

      {hasActive && (
        <button
          type="button"
          onClick={() =>
            onChange({ type: "all", category: "all", month: "all" })
          }
          className="cursor-pointer rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--muted)] transition duration-200 hover:border-[var(--expense)] hover:text-[var(--expense)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        >
          Clear
        </button>
      )}
    </div>
  );
}
