import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BASELINE_BALANCE, createInitialTransactions } from "../data/mockTransactions";
import type { SortDirection, SortField, Transaction, TransactionType, UserRole } from "../types";

export interface FinanceState {
  transactions: Transaction[];
  role: UserRole;
  theme: "light" | "dark";
  filterCategory: string;
  filterType: "all" | TransactionType;
  searchQuery: string;
  sortBy: SortField;
  sortDir: SortDirection;
  setRole: (role: UserRole) => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  setFilterCategory: (c: string) => void;
  setFilterType: (t: "all" | TransactionType) => void;
  setSearchQuery: (q: string) => void;
  setSort: (by: SortField) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, patch: Partial<Omit<Transaction, "id">>) => void;
  resetDemoData: () => void;
}

function sortTransactions(
  list: Transaction[],
  sortBy: SortField,
  sortDir: SortDirection,
): Transaction[] {
  const mul = sortDir === "asc" ? 1 : -1;
  return [...list].sort((a, b) => {
    if (sortBy === "amount") return (a.amount - b.amount) * mul;
    return (new Date(a.date).getTime() - new Date(b.date).getTime()) * mul;
  });
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: createInitialTransactions(),
      role: "viewer",
      theme: "light",
      filterCategory: "all",
      filterType: "all",
      searchQuery: "",
      sortBy: "date",
      sortDir: "desc",

      setRole: (role) => set({ role }),
      setTheme: (theme) => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        set({ theme });
      },
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        document.documentElement.classList.toggle("dark", next === "dark");
        set({ theme: next });
      },
      setFilterCategory: (filterCategory) => set({ filterCategory }),
      setFilterType: (filterType) => set({ filterType }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSort: (sortBy) =>
        set((s) => {
          const same = s.sortBy === sortBy;
          return {
            sortBy,
            sortDir: same ? (s.sortDir === "desc" ? "asc" : "desc") : "desc",
          };
        }),

      addTransaction: (t) =>
        set((s) => ({
          transactions: [{ ...t, id: crypto.randomUUID() }, ...s.transactions],
        })),

      updateTransaction: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),

      resetDemoData: () => set({ transactions: createInitialTransactions() }),
    }),
    {
      name: "finance-dashboard-storage",
      partialize: (s) => ({
        transactions: s.transactions,
        role: s.role,
        theme: s.theme,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    },
  ),
);

export function selectFilteredTransactions(s: Pick<
  FinanceState,
  "transactions" | "filterCategory" | "filterType" | "searchQuery" | "sortBy" | "sortDir"
>): Transaction[] {
  let list = s.transactions;
  if (s.filterCategory !== "all") {
    list = list.filter((t) => t.category === s.filterCategory);
  }
  if (s.filterType !== "all") {
    list = list.filter((t) => t.type === s.filterType);
  }
  const q = s.searchQuery.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.amount.toString().includes(q),
    );
  }
  return sortTransactions(list, s.sortBy, s.sortDir);
}

export function selectSummary(transactions: Transaction[]) {
  const income = transactions.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const net = income - expenses;
  return { income, expenses, net, totalBalance: BASELINE_BALANCE + net };
}

/** Month key YYYY-MM */
function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export function selectBalanceTrend(transactions: Transaction[]) {
  const byMonth = new Map<string, { income: number; expense: number }>();
  for (const t of transactions) {
    const k = monthKey(t.date);
    const cur = byMonth.get(k) ?? { income: 0, expense: 0 };
    if (t.type === "income") cur.income += t.amount;
    else cur.expense += t.amount;
    byMonth.set(k, cur);
  }
  const keys = [...byMonth.keys()].sort();
  let balance = 0;
  return keys.map((k) => {
    const { income, expense } = byMonth.get(k)!;
    const net = income - expense;
    balance += net;
    return {
      month: k,
      label: new Date(k + "-01").toLocaleDateString(undefined, { month: "short", year: "2-digit" }),
      balance,
      income,
      expense: expense,
      net,
    };
  });
}

export function selectSpendingByCategory(transactions: Transaction[]) {
  const map = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function selectUniqueCategories(transactions: Transaction[]): string[] {
  return [...new Set(transactions.map((t) => t.category))].sort();
}
