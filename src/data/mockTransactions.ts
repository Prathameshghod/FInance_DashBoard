import type { Transaction } from "../types";

/** Baseline before any transaction history (for trend narrative). */
export const BASELINE_BALANCE = 6200;

const categories = {
  expense: ["Food", "Transport", "Utilities", "Entertainment", "Shopping", "Health"],
  income: ["Salary", "Freelance", "Interest", "Other"],
} as const;

function id(): string {
  return crypto.randomUUID();
}

/** Curated mock list spanning several months for charts and insights. */
export function createInitialTransactions(): Transaction[] {
  const rows: Omit<Transaction, "id">[] = [
    { date: "2025-11-05", amount: 4200, category: "Salary", type: "income", description: "Monthly salary" },
    { date: "2025-11-08", amount: 340, category: "Food", type: "expense", description: "Groceries" },
    { date: "2025-11-12", amount: 89, category: "Transport", type: "expense", description: "Transit pass" },
    { date: "2025-11-18", amount: 650, category: "Freelance", type: "income", description: "Design gig" },
    { date: "2025-11-22", amount: 120, category: "Utilities", type: "expense", description: "Electric" },
    { date: "2025-12-03", amount: 4200, category: "Salary", type: "income", description: "Monthly salary" },
    { date: "2025-12-07", amount: 280, category: "Food", type: "expense", description: "Groceries" },
    { date: "2025-12-10", amount: 45, category: "Entertainment", type: "expense", description: "Streaming" },
    { date: "2025-12-15", amount: 1100, category: "Shopping", type: "expense", description: "Laptop accessories" },
    { date: "2025-12-20", amount: 200, category: "Health", type: "expense", description: "Pharmacy" },
    { date: "2026-01-04", amount: 4200, category: "Salary", type: "income", description: "Monthly salary" },
    { date: "2026-01-09", amount: 310, category: "Food", type: "expense", description: "Groceries" },
    { date: "2026-01-14", amount: 95, category: "Transport", type: "expense", description: "Fuel" },
    { date: "2026-01-21", amount: 800, category: "Freelance", type: "income", description: "Contract work" },
    { date: "2026-01-28", amount: 165, category: "Utilities", type: "expense", description: "Internet + mobile" },
    { date: "2026-02-02", amount: 4200, category: "Salary", type: "income", description: "Monthly salary" },
    { date: "2026-02-08", amount: 360, category: "Food", type: "expense", description: "Groceries" },
    { date: "2026-02-14", amount: 72, category: "Entertainment", type: "expense", description: "Concert" },
    { date: "2026-02-19", amount: 240, category: "Health", type: "expense", description: "Gym + checkup" },
    { date: "2026-02-25", amount: 55, category: "Interest", type: "income", description: "Savings interest" },
    { date: "2026-03-01", amount: 4200, category: "Salary", type: "income", description: "Monthly salary" },
    { date: "2026-03-06", amount: 295, category: "Food", type: "expense", description: "Groceries" },
    { date: "2026-03-11", amount: 128, category: "Transport", type: "expense", description: "Ride share" },
    { date: "2026-03-18", amount: 450, category: "Shopping", type: "expense", description: "Clothing" },
    { date: "2026-03-24", amount: 980, category: "Freelance", type: "income", description: "Quarterly invoice" },
    { date: "2026-03-29", amount: 142, category: "Utilities", type: "expense", description: "Water + electric" },
    { date: "2026-04-01", amount: 4200, category: "Salary", type: "income", description: "Monthly salary" },
    { date: "2026-04-02", amount: 88, category: "Food", type: "expense", description: "Coffee & lunch" },
  ];

  return rows.map((r) => ({ ...r, id: id() }));
}

export { categories };
