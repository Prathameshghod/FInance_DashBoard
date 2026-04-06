export type UserRole = "viewer" | "admin";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export type SortField = "date" | "amount";
export type SortDirection = "asc" | "desc";
