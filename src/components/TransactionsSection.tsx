import { useMemo, useState } from "react";
import {
  selectFilteredTransactions,
  selectUniqueCategories,
  useFinanceStore,
} from "../store/useFinanceStore";
import type { Transaction } from "../types";
import { TransactionModal } from "./TransactionModal";
import { downloadText, transactionsToCsv } from "../utils/exportCsv";

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-ink)]/12 bg-[var(--color-surface-elevated)] px-3 py-2.5 text-sm font-medium text-[var(--color-ink)] shadow-sm transition hover:bg-[var(--color-surface-muted)]";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110";

const btnDangerOutline =
  "inline-flex items-center justify-center rounded-xl border border-[var(--color-expense)]/35 bg-transparent px-3 py-2.5 text-sm font-medium text-[var(--color-expense)] transition hover:bg-[var(--color-expense)]/10";

export function TransactionsSection() {
  const role = useFinanceStore((s) => s.role);
  const transactions = useFinanceStore((s) => s.transactions);
  const filterCategory = useFinanceStore((s) => s.filterCategory);
  const filterType = useFinanceStore((s) => s.filterType);
  const searchQuery = useFinanceStore((s) => s.searchQuery);
  const sortBy = useFinanceStore((s) => s.sortBy);
  const sortDir = useFinanceStore((s) => s.sortDir);
  const setFilterCategory = useFinanceStore((s) => s.setFilterCategory);
  const setFilterType = useFinanceStore((s) => s.setFilterType);
  const setSearchQuery = useFinanceStore((s) => s.setSearchQuery);
  const setSort = useFinanceStore((s) => s.setSort);
  const resetDemoData = useFinanceStore((s) => s.resetDemoData);

  const filtered = useMemo(
    () =>
      selectFilteredTransactions({
        transactions,
        filterCategory,
        filterType,
        searchQuery,
        sortBy,
        sortDir,
      }),
    [transactions, filterCategory, filterType, searchQuery, sortBy, sortDir],
  );

  const categories = useMemo(() => ["all", ...selectUniqueCategories(transactions)], [transactions]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<Transaction | null>(null);

  const isAdmin = role === "admin";
  const emptyAll = transactions.length === 0;
  const emptyFiltered = !emptyAll && filtered.length === 0;

  function openAdd() {
    setModalMode("add");
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(t: Transaction) {
    setModalMode("edit");
    setEditing(t);
    setModalOpen(true);
  }

  function exportCsv() {
    const csv = transactionsToCsv(filtered);
    downloadText("transactions.csv", csv, "text/csv;charset=utf-8");
  }

  function exportJson() {
    downloadText("transactions.json", JSON.stringify(filtered, null, 2), "application/json");
  }

  const sortBtn =
    "inline-flex items-center gap-1 rounded-lg px-1 py-0.5 font-semibold tracking-wide text-[var(--color-ink)] transition hover:bg-[var(--color-surface)]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/35";

  return (
    <section id="transactions" className="scroll-mt-24 space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">Transactions</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            Search and slice your ledger.{" "}
            {isAdmin ? (
              <span className="text-[var(--color-ink)]">Admin:</span>
            ) : (
              <span className="text-[var(--color-ink)]">Viewer:</span>
            )}{" "}
            {isAdmin ? "add, edit, or reset demo data." : "read-only — switch role in the header to edit."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <button type="button" onClick={exportCsv} className={btnSecondary}>
            Export CSV
          </button>
          <button type="button" onClick={exportJson} className={btnSecondary}>
            Export JSON
          </button>
          {isAdmin && (
            <>
              <button type="button" onClick={openAdd} className={btnPrimary}>
                Add transaction
              </button>
              <button type="button" onClick={() => resetDemoData()} className={btnDangerOutline}>
                Reset demo
              </button>
            </>
          )}
        </div>
      </div>

      <div className="ui-card flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">Filters</p>
          <p className="text-sm text-[var(--color-ink-muted)]">
            Showing{" "}
            <span className="font-semibold tabular-nums text-[var(--color-ink)]">{filtered.length}</span> of{" "}
            <span className="font-semibold tabular-nums text-[var(--color-ink)]">{transactions.length}</span>
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block text-xs font-medium text-[var(--color-ink-muted)]">
            Search
            <input
              type="search"
              placeholder="Description, category, amount…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ui-input mt-1.5 w-full"
            />
          </label>
          <label className="block text-xs font-medium text-[var(--color-ink-muted)]">
            Category
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="ui-input mt-1.5 w-full cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All categories" : c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-[var(--color-ink-muted)]">
            Type
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "income" | "expense")}
              className="ui-input mt-1.5 w-full cursor-pointer"
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
        </div>
      </div>

      <div className="ui-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-[var(--color-ink)]/10 bg-[var(--color-surface-muted)]/95 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)] backdrop-blur-sm">
              <tr>
                <th className="px-4 py-3.5">
                  <button type="button" className={sortBtn} onClick={() => setSort("date")}>
                    Date
                    {sortBy === "date" && <span aria-hidden>{sortDir === "desc" ? "↓" : "↑"}</span>}
                  </button>
                </th>
                <th className="px-4 py-3.5">Description</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5 text-right">
                  <button type="button" className={`${sortBtn} w-full justify-end`} onClick={() => setSort("amount")}>
                    Amount
                    {sortBy === "amount" && <span aria-hidden>{sortDir === "desc" ? "↓" : "↑"}</span>}
                  </button>
                </th>
                {isAdmin && <th className="px-4 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-ink)]/8">
              {emptyAll && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-20 text-center">
                    <p className="text-base font-semibold text-[var(--color-ink)]">No transactions yet</p>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {isAdmin
                        ? "Add a transaction or use Reset demo to reload the sample dataset."
                        : "Switch to Admin in the header to add data, or open Mock sync after switching roles."}
                    </p>
                  </td>
                </tr>
              )}
              {emptyFiltered && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-14 text-center text-sm text-[var(--color-ink-muted)]">
                    Nothing matches these filters. Try clearing search or setting category/type to “All”.
                  </td>
                </tr>
              )}
              {filtered.map((t, idx) => (
                <tr
                  key={t.id}
                  className={`transition-colors hover:bg-[var(--color-surface-muted)]/40 ${
                    idx % 2 === 0 ? "bg-[var(--color-surface)]/40" : "bg-transparent"
                  }`}
                >
                  <td className="whitespace-nowrap px-4 py-3.5 text-[var(--color-ink-muted)] tabular-nums">
                    {new Date(t.date + "T12:00:00").toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3.5 font-medium text-[var(--color-ink)]" title={t.description}>
                    {t.description}
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-ink)]">{t.category}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${
                        t.type === "income"
                          ? "bg-[var(--color-income)]/12 text-[var(--color-income)] ring-[var(--color-income)]/25"
                          : "bg-[var(--color-expense)]/12 text-[var(--color-expense)] ring-[var(--color-expense)]/25"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right text-sm font-semibold tabular-nums ${
                      t.type === "income" ? "text-[var(--color-income)]" : "text-[var(--color-expense)]"
                    }`}
                  >
                    {t.type === "expense" ? "−" : "+"}
                    {formatMoney(t.amount)}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        className="text-sm font-semibold text-[var(--color-accent)] underline-offset-4 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal open={modalOpen} mode={modalMode} initial={editing} onClose={() => setModalOpen(false)} />
    </section>
  );
}
