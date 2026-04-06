import { useMemo } from "react";
import { IconSparkles } from "./icons";
import {
  selectBalanceTrend,
  selectSpendingByCategory,
  useFinanceStore,
} from "../store/useFinanceStore";

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function InsightsPanel() {
  const transactions = useFinanceStore((s) => s.transactions);

  const insights = useMemo(() => {
    const spending = selectSpendingByCategory(transactions);
    const top = spending[0];
    const trend = selectBalanceTrend(transactions);
    const last = trend[trend.length - 1];
    const prev = trend.length >= 2 ? trend[trend.length - 2] : null;

    let monthlyCompare: string | null = null;
    if (last && prev) {
      const diff = last.expense - prev.expense;
      const pct = prev.expense ? Math.round((diff / prev.expense) * 100) : 0;
      monthlyCompare =
        diff === 0
          ? `Spending held steady between ${prev.label} and ${last.label}.`
          : diff > 0
            ? `Spending was ${formatMoney(Math.abs(diff))} higher (${pct >= 0 ? "+" : ""}${pct}%) in ${last.label} vs ${prev.label}.`
            : `Spending dropped by ${formatMoney(Math.abs(diff))} in ${last.label} compared to ${prev.label}.`;
    }

    const netNote =
      last && last.net >= 0
        ? `${last.label} closed with a positive net of ${formatMoney(last.net)}.`
        : last
          ? `${last.label} had a net outflow of ${formatMoney(Math.abs(last?.net ?? 0))}.`
          : null;

    return { top, monthlyCompare, netNote };
  }, [transactions]);

  const items = [
    insights.top
      ? {
          title: "Highest spending category",
          body: `${insights.top.name} leads your expenses at ${formatMoney(insights.top.value)} total.`,
        }
      : {
          title: "Highest spending category",
          body: "No expense categories yet — add expenses to see a leader.",
        },
    insights.monthlyCompare
      ? { title: "Month over month", body: insights.monthlyCompare }
      : { title: "Month over month", body: "Need at least two months of data to compare spending." },
    insights.netNote
      ? { title: "Latest period", body: insights.netNote }
      : { title: "Latest period", body: "Track income and expenses to surface period insights." },
  ];

  return (
    <section
      id="insights"
      className="ui-card scroll-mt-24 overflow-hidden p-0 sm:p-0"
    >
      <div className="flex flex-col gap-1 border-b border-[var(--color-ink)]/8 bg-gradient-to-r from-[var(--color-accent-soft)]/40 to-transparent px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-elevated)] text-[var(--color-accent)] shadow-sm ring-1 ring-[var(--color-accent)]/20">
            <IconSparkles className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">Insights</h2>
            <p className="mt-0.5 text-sm text-[var(--color-ink-muted)]">Automated observations from your dataset</p>
          </div>
        </div>
      </div>
      <ul className="grid gap-0 divide-y divide-[var(--color-ink)]/8 md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map((item, i) => (
          <li key={item.title} className="group p-6 transition-colors hover:bg-[var(--color-surface)]/60">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">Insight {i + 1}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
