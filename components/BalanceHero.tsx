"use client";

import { useEffect, useRef, useState } from "react";
import { formatIDR } from "@/lib/currency";

interface Props {
  balance: number;
  income: number;
  savingsRate: number;
  count: number;
}

/** Animate a number from 0 to `value` with an ease-out curve. */
function useCountUp(value: number, duration = 900) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      fromRef.current = to;
      setDisplay(to);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = to;
    };
  }, [value, duration]);

  return display;
}

export default function BalanceHero({
  balance,
  income,
  savingsRate,
  count,
}: Props) {
  const animated = useCountUp(balance);
  const positive = balance >= 0;

  return (
    <div className="card card-edge relative h-full overflow-hidden p-6 sm:p-7">
      {/* Ambient glow inside the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 45%, transparent), transparent 70%)",
        }}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Net Balance
          </span>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{
            background: positive ? "var(--income-soft)" : "var(--expense-soft)",
            color: positive ? "var(--income)" : "var(--expense)",
          }}
        >
          {positive ? "In surplus" : "Overspending"}
        </span>
      </div>

      <p className="hero-figure mt-4 text-4xl font-bold leading-none sm:text-5xl">
        {formatIDR(animated)}
      </p>

      <div className="relative mt-6 grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-5">
        <Stat label="Savings rate" value={`${savingsRate}%`} accent="var(--primary)" />
        <Stat
          label="Income base"
          value={formatIDR(income)}
          accent="var(--income)"
          small
        />
        <Stat label="Entries" value={String(count)} accent="var(--accent)" />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  small,
}: {
  label: string;
  value: string;
  accent: string;
  small?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--faint)]">
        {label}
      </p>
      <p
        className={`mt-1 font-semibold tabular-nums ${
          small ? "text-sm" : "text-lg"
        }`}
        style={{ color: accent, fontFamily: "var(--font-mono), monospace" }}
      >
        {value}
      </p>
    </div>
  );
}
