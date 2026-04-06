import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFinanceStore, selectBalanceTrend, selectSpendingByCategory } from "../store/useFinanceStore";

const PIE_COLORS = [
  "oklch(0.55 0.14 165)",
  "oklch(0.55 0.18 25)",
  "oklch(0.52 0.14 145)",
  "oklch(0.55 0.12 280)",
  "oklch(0.6 0.12 45)",
  "oklch(0.5 0.08 220)",
];

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function ChartsSection() {
  const transactions = useFinanceStore((s) => s.transactions);
  const trend = selectBalanceTrend(transactions);
  const spending = selectSpendingByCategory(transactions);

  const emptyTrend = trend.length === 0;
  const emptyPie = spending.length === 0;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <section className="ui-card p-5 lg:col-span-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">Balance trend</h2>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">Running balance by month from your activity</p>
          </div>
        </div>
        <div className="mt-5 h-[280px] min-h-[220px] w-full min-w-0">
          {emptyTrend ? (
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-ink)]/15 bg-[var(--color-surface)]/50 px-4 text-center">
              <p className="text-sm font-medium text-[var(--color-ink)]">No trend yet</p>
              <p className="mt-1 max-w-xs text-sm text-[var(--color-ink-muted)]">Add dated transactions to see balance over time.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minHeight={220}>
              <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                <defs>
                  <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.14 165)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.55 0.14 165)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklch, var(--color-ink) 12%, transparent)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(v >= 10000 ? 0 : 1)}k`}
                  tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
                  width={52}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface-elevated)",
                    border: "1px solid color-mix(in oklch, var(--color-ink) 12%, transparent)",
                    borderRadius: "12px",
                    boxShadow: "var(--shadow-card)",
                  }}
                  formatter={(value) => [formatMoney(Number(value)), "Balance"]}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="oklch(0.55 0.14 165)"
                  strokeWidth={2.5}
                  fill="url(#balFill)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <section className="ui-card p-5 lg:col-span-2">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">Spending by category</h2>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">Expense totals across your dataset</p>
        <div className="mt-5 h-[280px] min-h-[220px] w-full min-w-0">
          {emptyPie ? (
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-ink)]/15 bg-[var(--color-surface)]/50 px-4 text-center">
              <p className="text-sm font-medium text-[var(--color-ink)]">No expenses</p>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">Expense rows will appear here as a breakdown.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minHeight={220}>
              <PieChart>
                <Pie
                  data={spending}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={86}
                  paddingAngle={2}
                  stroke="var(--color-surface-elevated)"
                  strokeWidth={2}
                >
                  {spending.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatMoney(Number(value))}
                  contentStyle={{
                    background: "var(--color-surface-elevated)",
                    border: "1px solid color-mix(in oklch, var(--color-ink) 12%, transparent)",
                    borderRadius: "12px",
                    boxShadow: "var(--shadow-card)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        {!emptyPie && (
          <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[var(--color-ink-muted)]">
            {spending.map((s, i) => (
              <li key={s.name} className="flex items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="max-w-[140px] truncate">{s.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
