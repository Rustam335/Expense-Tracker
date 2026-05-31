"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatIDR, formatIDRCompact } from "@/lib/currency";
import { CATEGORY_COLORS, type Category, type Transaction } from "@/lib/types";

interface Props {
  transactions: Transaction[];
}

interface Slice {
  category: Category;
  value: number;
}

export default function CategoryPieChart({ transactions }: Props) {
  const totals = new Map<Category, number>();
  for (const tx of transactions) {
    if (tx.type !== "expense") continue;
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
  }

  const data: Slice[] = Array.from(totals.entries())
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const top = data[0];

  return (
    <div className="card card-edge h-full p-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold tracking-tight">By Category</h2>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Where your money goes
          </p>
        </div>
        {top && (
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
            Top: {top.category}
          </span>
        )}
      </div>

      {data.length === 0 ? (
        <EmptyChart label="No expense data to chart yet." />
      ) : (
        <div className="mt-2 grid grid-cols-1 items-center gap-2 sm:grid-cols-[1.1fr_1fr]">
          <div className="relative h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="category"
                  innerRadius="62%"
                  outerRadius="88%"
                  paddingAngle={3}
                  cornerRadius={6}
                  stroke="transparent"
                  startAngle={90}
                  endAngle={-270}
                  animationDuration={900}
                  animationBegin={150}
                >
                  {data.map((d) => (
                    <Cell
                      key={d.category}
                      fill={CATEGORY_COLORS[d.category]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  cursor={false}
                  formatter={(value, name) => {
                    const num = Number(value);
                    return [
                      `${formatIDR(num)} · ${((num / total) * 100).toFixed(0)}%`,
                      String(name),
                    ];
                  }}
                  contentStyle={{
                    background: "var(--surface-solid)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "0.85rem",
                    fontSize: "0.78rem",
                    boxShadow: "0 18px 40px -18px rgba(0,0,0,0.6)",
                    padding: "0.55rem 0.75rem",
                  }}
                  labelStyle={{ color: "var(--muted)" }}
                  itemStyle={{
                    color: "var(--foreground)",
                    fontFamily: "var(--font-mono), monospace",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--faint)]">
                Spent
              </span>
              <span
                className="text-lg font-bold tabular-nums"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {formatIDRCompact(total)}
              </span>
            </div>
          </div>

          {/* Custom legend */}
          <ul className="space-y-2">
            {data.map((d) => {
              const pct = ((d.value / total) * 100).toFixed(0);
              return (
                <li key={d.category} className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: CATEGORY_COLORS[d.category] }}
                  />
                  <span className="flex-1 truncate text-xs font-medium">
                    {d.category}
                  </span>
                  <span
                    className="text-xs font-semibold tabular-nums text-[var(--muted)]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {pct}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-56 items-center justify-center text-sm text-[var(--muted)]">
      {label}
    </div>
  );
}
