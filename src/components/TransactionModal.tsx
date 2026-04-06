import { useEffect, useMemo, useState, type FormEvent } from "react";
import { categories } from "../data/mockTransactions";
import type { Transaction, TransactionType } from "../types";
import { useFinanceStore } from "../store/useFinanceStore";

type Mode = "add" | "edit";

const allPresetCategories = [...categories.expense, ...categories.income];

interface Props {
  open: boolean;
  mode: Mode;
  initial?: Transaction | null;
  onClose: () => void;
}

export function TransactionModal({ open, mode, initial, onClose }: Props) {
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);
  const transactions = useFinanceStore((s) => s.transactions);
  const existingCategories = useMemo(() => {
    const set = new Set<string>(allPresetCategories);
    for (const t of transactions) set.add(t.category);
    return [...set].sort();
  }, [transactions]);

  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initial) {
      setDate(initial.date);
      setAmount(String(initial.amount));
      setCategory(initial.category);
      setType(initial.type);
      setDescription(initial.description);
    } else {
      setDate(new Date().toISOString().slice(0, 10));
      setAmount("");
      setCategory("Food");
      setType("expense");
      setDescription("");
    }
  }, [open, mode, initial]);

  if (!open) return null;

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = Number(amount);
    if (!date || !category.trim() || !description.trim() || Number.isNaN(n) || n < 0) return;

    if (mode === "add") {
      addTransaction({ date, amount: n, category: category.trim(), type, description: description.trim() });
    } else if (initial) {
      updateTransaction(initial.id, {
        date,
        amount: n,
        category: category.trim(),
        type,
        description: description.trim(),
      });
    }
    onClose();
  }

  return (
    <div
      className="animate-modal-in fixed inset-0 z-50 flex items-end justify-center bg-[var(--color-ink)]/45 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-modal-panel w-full max-w-md rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-float)] ring-1 ring-[var(--color-ink)]/5">
        <h2 id="tx-modal-title" className="text-lg font-semibold text-[var(--color-ink)]">
          {mode === "add" ? "Add transaction" : "Edit transaction"}
        </h2>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          {mode === "add" ? "Creates a new row at the top of your list." : "Updates this row everywhere in the dashboard."}
        </p>
        <form className="mt-5 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium text-[var(--color-ink-muted)]">
            Date
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="ui-input mt-1.5 w-full"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--color-ink-muted)]">
            Amount (USD)
            <input
              type="number"
              min={0}
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="ui-input mt-1.5 w-full"
            />
          </label>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-[var(--color-ink-muted)]">Type</legend>
            <div className="flex gap-3">
              {(["expense", "income"] as const).map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-ink)]">
                  <input
                    type="radio"
                    name="type"
                    checked={type === t}
                    onChange={() => setType(t)}
                    className="accent-[var(--color-accent)]"
                  />
                  <span className="capitalize">{t}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm font-medium text-[var(--color-ink-muted)]">
            Category
            <input
              list="cat-suggestions"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="ui-input mt-1.5 w-full"
            />
            <datalist id="cat-suggestions">
              {existingCategories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label className="block text-sm font-medium text-[var(--color-ink-muted)]">
            Description
            <input
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="ui-input mt-1.5 w-full"
            />
          </label>
          <div className="flex justify-end gap-2 border-t border-[var(--color-ink)]/8 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
            >
              {mode === "add" ? "Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
