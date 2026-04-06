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

## Deployment

This app is a static Vite build (`dist/`). Use any static host; two common options:

### Vercel (recommended)

1. Push this repo to GitHub (already done if you use the remote below).
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import the repository.
3. Leave defaults: **Framework Preset** = Vite (or Other), **Build Command** `npm run build`, **Output Directory** `dist`.
4. Deploy. Vercel reads `vercel.json` for the SPA rewrite.

CLI (optional): `npx vercel` from the project root and follow the prompts.

### Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project** → connect the repo.
2. Build: `npm run build`, publish: `dist` (or rely on `netlify.toml` in the repo).
3. Deploy.

### Preview locally (production build)

```bash
npm run build && npm run preview
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
