import { useMemo } from "react";
import { IconTrendDown, IconTrendUp, IconWallet } from "./icons";
import { selectSummary, useFinanceStore } from "../store/useFinanceStore";

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function SummaryCards() {
  const transactions = useFinanceStore((s) => s.transactions);
  const summary = useMemo(() => selectSummary(transactions), [transactions]);

  const cards = [
    {
      label: "Total balance",
      value: formatMoney(summary.totalBalance),
      hint: "Baseline + net from all activity",
      icon: IconWallet,
      ring: "ring-[var(--color-accent)]/25",
      valueClass: "text-[var(--color-accent)]",
      iconBg: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
    },
    {
      label: "Total income",
      value: formatMoney(summary.income),
      hint: "Credits in the dataset",
      icon: IconTrendUp,
      ring: "ring-[var(--color-income)]/25",
      valueClass: "text-[var(--color-income)]",
      iconBg: "bg-[var(--color-income)]/12 text-[var(--color-income)]",
    },
    {
      label: "Total expenses",
      value: formatMoney(summary.expenses),
      hint: "Debits in the dataset",
      icon: IconTrendDown,
      ring: "ring-[var(--color-expense)]/25",
      valueClass: "text-[var(--color-expense)]",
      iconBg: "bg-[var(--color-expense)]/12 text-[var(--color-expense)]",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <article
            key={c.label}
            className={`ui-card group relative overflow-hidden p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] ${c.ring} ring-1`}
          >
            <div className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[var(--color-ink-muted)]">{c.label}</p>
                <p
                  className={`mt-3 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl ${c.valueClass}`}
                >
                  {c.value}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-ink-muted)]">{c.hint}</p>
              </div>
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${c.iconBg} shadow-inner`}
                aria-hidden
              >
                <Icon className="size-5" />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
