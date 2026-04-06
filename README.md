# Finance Dashboard

A responsive finance dashboard built with **React**, **TypeScript**, and **Vite**. It shows balance summaries, balance trend and spending-by-category charts, a filterable transaction list, role-based UI (viewer vs admin), and a short insights section. State is handled with **Zustand**; optional **localStorage** persistence keeps data across reloads.

## Stack

- React 19, TypeScript, Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Recharts (area + donut charts)
- Zustand + `persist` middleware

## Getting started

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

```bash
npm run build   # production build → dist/
npm run preview # preview production build locally
```

## Features

- **Overview**: Total balance (with baseline), total income, total expenses
- **Charts**: Monthly balance trend; spending breakdown by category
- **Transactions**: Search, category/type filters, sort by date or amount; CSV/JSON export
- **Roles**: Viewer (read-only) vs Admin (add/edit transactions, reset demo data) — simulated on the client only
- **Insights**: Top spending category, month-over-month spending comparison, latest-period net
- **UX**: Dark/light theme, responsive layout, empty states

## Data

Mock seed data lives in `src/data/mockTransactions.ts`. There is no backend; “Mock API sync” simulates a short delay and reloads the seed dataset.

## Project structure

```
src/
  App.tsx
  components/     # layout, charts, table, modal, insights
  data/           # seed transactions
  store/          # Zustand store + selectors
  types.ts
  utils/
```

## License

Private / educational use unless otherwise specified.
