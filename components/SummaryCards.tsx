"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { formatIDR } from "@/lib/currency";

interface Props {
  income: number;
  expense: number;
}

export default function SummaryCards({ income, expense }: Props) {
  const cards = [
    {
      label: "Income",
      hint: "Money in",
      value: income,
      accent: "var(--income)",
      soft: "var(--income-soft)",
      icon: <TrendingUp size={18} strokeWidth={2.2} />,
      delay: "120ms",
    },
    {
      label: "Expense",
      hint: "Money out",
      value: expense,
      accent: "var(--expense)",
      soft: "var(--expense-soft)",
      icon: <TrendingDown size={18} strokeWidth={2.2} />,
      delay: "200ms",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {cards.map((c) => (
        <div
          key={c.label}
          className="reveal card card-hover relative overflow-hidden p-5"
          style={{ animationDelay: c.delay }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full blur-2xl"
            style={{ background: c.soft }}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{c.label}</p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--faint)]">
                {c.hint}
              </p>
            </div>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: c.soft, color: c.accent }}
            >
              {c.icon}
            </span>
          </div>
          <p
            className="relative mt-5 text-2xl font-bold leading-none tabular-nums"
            style={{
              color: c.accent,
              fontFamily: "var(--font-mono), monospace",
              letterSpacing: "-0.03em",
            }}
          >
            {formatIDR(c.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
