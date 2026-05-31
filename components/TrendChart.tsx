"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatIDR, formatIDRCompact } from "@/lib/currency";
import type { Transaction } from "@/lib/types";

interface Props {
  transactions: Transaction[];
}

interface DayPoint {
  key: string; // YYYY-MM-DD
  label: string;
  income: number;
  expense: number;
}

export default function TrendChart({ transactions }: Props) {
  const byDay = new Map<string, DayPoint>();

  for (const tx of transactions) {
    let point = byDay.get(tx.date);
    if (!point) {
      const d = new Date(tx.date + "T00:00:00");
      point = {
        key: tx.date,
        label: d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
        income: 0,
        expense: 0,
      };
      byDay.set(tx.date, point);
    }
    if (tx.type === "income") point.income += tx.amount;
    else point.expense += tx.amount;
  }

  const data = Array.from(byDay.values()).sort((a, b) =>
    a.key.localeCompare(b.key)
  );

  return (
    <div className="card card-edge h-full p-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold tracking-tight">Cash Flow</h2>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Daily income vs. expense
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium text-[var(--muted)]">
          <Dot color="var(--income)" label="Income" />
          <Dot color="var(--expense)" label="Expense" />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-sm text-[var(--muted)]">
          No activity to chart yet.
        </div>
      ) : (
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barGap={4}
              barCategoryGap="22%"
              margin={{ left: 4, right: 4, top: 4 }}
            >
              <defs>
                <linearGradient id="grad-income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--income)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--income)" stopOpacity={0.45} />
                </linearGradient>
                <linearGradient id="grad-expense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--expense)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--expense)" stopOpacity={0.45} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="2 6"
                stroke="var(--border-strong)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--faint)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                dy={6}
              />
              <YAxis
                tickFormatter={(v) => formatIDRCompact(Number(v))}
                tick={{
                  fill: "var(--faint)",
                  fontSize: 10,
                  fontFamily: "var(--font-mono), monospace",
                }}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip
                cursor={{ fill: "var(--surface-3)", radius: 8, opacity: 0.5 }}
                formatter={(value, name) => [
                  formatIDR(Number(value)),
                  String(name),
                ]}
                contentStyle={{
                  background: "var(--surface-solid)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "0.85rem",
                  fontSize: "0.78rem",
                  boxShadow: "0 18px 40px -18px rgba(0,0,0,0.6)",
                  padding: "0.55rem 0.75rem",
                }}
                labelStyle={{
                  color: "var(--muted)",
                  fontWeight: 600,
                  marginBottom: "0.25rem",
                }}
                itemStyle={{
                  color: "var(--foreground)",
                  fontFamily: "var(--font-mono), monospace",
                }}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="url(#grad-income)"
                radius={[5, 5, 0, 0]}
                maxBarSize={26}
                animationDuration={800}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="url(#grad-expense)"
                radius={[5, 5, 0, 0]}
                maxBarSize={26}
                animationDuration={800}
                animationBegin={120}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
