"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "expense-tracker:theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative inline-flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] active:translate-y-0"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 120%, var(--ring), transparent 70%)",
        }}
      />
      {/* Render icon only after mount to avoid hydration mismatch */}
      <span className="relative transition-transform duration-300 group-hover:scale-110">
        {mounted &&
          (dark ? (
            <Moon size={18} style={{ color: "var(--primary-2)" }} />
          ) : (
            <Sun size={18} style={{ color: "var(--accent)" }} />
          ))}
      </span>
    </button>
  );
}
