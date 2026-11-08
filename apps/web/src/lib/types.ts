export type CategoryType = "income" | "expense";
export type AccountType = "checking" | "savings" | "credit" | "investment" | "revenue" | "expense" | "asset";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  parentId?: string | null;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  transactionDate: string;
  status: "pending" | "cleared";
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  allocatedAmount: number;
  periodStart: string;
  periodEnd: string;
}

export interface DashboardSummary {
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netMargin: number;
  byCategory: Array<{ category: string; amount: number; type: CategoryType }>;
  monthly: Array<{ month: string; revenue: number; expenses: number }>;
  budgets: Array<{
    category: string;
    allocated: number;
    actual: number;
    variance: number;
  }>;
}
