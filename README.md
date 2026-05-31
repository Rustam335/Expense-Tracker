# Expense Tracker

> A modern, fully client-side personal finance dashboard to track income and expenses, visualize spending, and stay on top of your money — no account, no backend, no setup.

Everything runs in your browser and your data is persisted to `localStorage`, so it survives reloads while never leaving your device.

## Screenshots

<!-- add screenshot here -->

## Features

- **Add transactions** — amount, type (income/expense), category (Food, Transport, Salary, Shopping, Bills, Other), date, and an optional note.
- **Transaction list** — newest first, with category badges, formatted dates, and one-click delete.
- **Summary cards** — total income, total expense, and current balance at a glance.
- **Charts** (powered by Recharts):
  - Donut chart of expenses by category.
  - Bar chart of daily cash flow (income vs. expense over time).
- **Filters** — slice your data by type, category, and/or month. Summary cards and charts react to the active filters.
- **Persistence** — all data saved to `localStorage` and restored on reload.
- **Dark mode** — premium light/dark themes with a persisted toggle and no flash on load.
- **Polished UX** — responsive layout, sensible sample data on first load, currency formatted as Indonesian Rupiah (e.g. `Rp 1.500.000`), and clean empty states.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Recharts](https://recharts.org/) for data visualization
- 100% client-side — no database, no API keys, no environment variables.

## Getting Started

```bash
yarn install
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
yarn build
yarn start
```

## Deploy

Deploy in seconds on [Vercel](https://vercel.com/): import the repository and accept the defaults — Vercel auto-detects Next.js. No environment variables are required.

## License

[MIT](./LICENSE)
