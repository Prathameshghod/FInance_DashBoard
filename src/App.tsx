import { useEffect } from "react";
import { AppHeader } from "./components/AppHeader";
import { ChartsSection } from "./components/ChartsSection";
import { InsightsPanel } from "./components/InsightsPanel";
import { SummaryCards } from "./components/SummaryCards";
import { TransactionsSection } from "./components/TransactionsSection";
import { useFinanceStore } from "./store/useFinanceStore";

export default function App() {
  const theme = useFinanceStore((s) => s.theme);
  const txCount = useFinanceStore((s) => s.transactions.length);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="page-shell min-h-screen text-[var(--color-ink)]">
      <AppHeader />
      <main className="mx-auto max-w-6xl space-y-14 px-4 pb-16 pt-8 sm:px-5 sm:pt-10">
        <section id="overview" className="scroll-mt-28 space-y-8">
          <div className="animate-fade-up space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">Overview</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Your money, at a glance
                </h1>
                <p className="mt-3 text-pretty text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
                  Balances, trends, and spending split — powered by local mock data and your edits. Switch role in the
                  header to try viewer vs admin.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-surface-elevated)]/80 px-4 py-3 text-sm shadow-[var(--shadow-card)] backdrop-blur-sm">
                <span className="text-[var(--color-ink-muted)]">Records</span>
                <span className="rounded-lg bg-[var(--color-accent-soft)] px-2.5 py-0.5 font-semibold tabular-nums text-[var(--color-accent)]">
                  {txCount}
                </span>
              </div>
            </div>
          </div>
          <SummaryCards />
          <ChartsSection />
        </section>

        <TransactionsSection />
        <InsightsPanel />
      </main>
      <footer className="border-t border-[var(--color-ink)]/10 bg-[var(--color-surface)]/80 py-10 text-center text-xs text-[var(--color-ink-muted)] backdrop-blur-sm">
        <p>Finance Dashboard · React · Zustand · client-side only</p>
      </footer>
    </div>
  );
}
