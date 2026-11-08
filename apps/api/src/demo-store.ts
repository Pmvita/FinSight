/** Shared demo store logic mirrored for the Express API (local dual-server demo). */
import { randomUUID } from "crypto";

export type Category = { id: string; name: string; type: "income" | "expense" };
export type Account = {
  id: string;
  userId: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
};
export type Transaction = {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  transactionDate: string;
  status: string;
  createdAt: string;
};
export type Budget = {
  id: string;
  userId: string;
  categoryId: string;
  allocatedAmount: number;
  periodStart: string;
  periodEnd: string;
};

const DEMO_USER = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "demo@finsight.dev",
  fullName: "Demo Analyst",
  role: "analyst",
};

function monthAgo(months: number, day = 15): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setDate(day);
  return d.toISOString().slice(0, 10);
}

const categories: Category[] = [
  { id: "c-saas", name: "SaaS Revenue", type: "income" },
  { id: "c-consult", name: "Consulting", type: "income" },
  { id: "c-payroll", name: "Payroll", type: "expense" },
  { id: "c-mkt", name: "Marketing", type: "expense" },
  { id: "c-infra", name: "Infrastructure", type: "expense" },
  { id: "c-office", name: "Office", type: "expense" },
];

const accounts: Account[] = [
  { id: "a-ops", userId: DEMO_USER.id, name: "Operating Checking", type: "checking", balance: 186400, currency: "USD" },
  { id: "a-rev", userId: DEMO_USER.id, name: "Revenue Clearing", type: "revenue", balance: 482300, currency: "USD" },
  { id: "a-sav", userId: DEMO_USER.id, name: "Reserve Savings", type: "savings", balance: 95000, currency: "USD" },
];

const transactions: Transaction[] = [
  { accountId: "a-rev", categoryId: "c-saas", amount: 72000, description: "Monthly SaaS billing", transactionDate: monthAgo(0, 1) },
  { accountId: "a-ops", categoryId: "c-payroll", amount: -48000, description: "Bi-weekly payroll", transactionDate: monthAgo(0, 5) },
  { accountId: "a-ops", categoryId: "c-mkt", amount: -9200, description: "Paid ads + content", transactionDate: monthAgo(0, 12) },
  { accountId: "a-rev", categoryId: "c-saas", amount: 68500, description: "Monthly SaaS billing", transactionDate: monthAgo(1, 1) },
  { accountId: "a-ops", categoryId: "c-payroll", amount: -47500, description: "Bi-weekly payroll", transactionDate: monthAgo(1, 5) },
  { accountId: "a-rev", categoryId: "c-saas", amount: 65000, description: "Monthly SaaS billing", transactionDate: monthAgo(2, 1) },
  { accountId: "a-ops", categoryId: "c-infra", amount: -3900, description: "Cloud invoice", transactionDate: monthAgo(2, 9) },
].map((t) => ({
  ...t,
  id: randomUUID(),
  userId: DEMO_USER.id,
  status: "cleared",
  createdAt: new Date().toISOString(),
}));

const budgets: Budget[] = [
  { id: "b1", userId: DEMO_USER.id, categoryId: "c-payroll", allocatedAmount: 290000, periodStart: monthAgo(5, 1), periodEnd: monthAgo(0, 28) },
  { id: "b2", userId: DEMO_USER.id, categoryId: "c-mkt", allocatedAmount: 45000, periodStart: monthAgo(5, 1), periodEnd: monthAgo(0, 28) },
];

export function authDemo(email: string, password: string) {
  if (email === DEMO_USER.email && password === "demo1234") return DEMO_USER;
  return null;
}

export function getAccounts() {
  return accounts;
}

export function getCategories() {
  return categories;
}

export function getTransactions() {
  return [...transactions].sort((a, b) => b.transactionDate.localeCompare(a.transactionDate));
}

export function getBudgets() {
  return budgets;
}

export function addTransaction(input: {
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
}) {
  const category = categories.find((c) => c.id === input.categoryId);
  const signed = category?.type === "expense" ? -Math.abs(input.amount) : Math.abs(input.amount);
  const tx: Transaction = {
    id: randomUUID(),
    userId: DEMO_USER.id,
    accountId: input.accountId,
    categoryId: input.categoryId,
    amount: signed,
    description: input.description || "Manual entry",
    transactionDate: new Date().toISOString().slice(0, 10),
    status: "cleared",
    createdAt: new Date().toISOString(),
  };
  transactions.push(tx);
  const account = accounts.find((a) => a.id === input.accountId);
  if (account) account.balance += signed;
  return tx;
}

export function dashboardSummary() {
  let totalRevenue = 0;
  let totalExpenses = 0;
  for (const tx of transactions) {
    if (tx.amount >= 0) totalRevenue += tx.amount;
    else totalExpenses += Math.abs(tx.amount);
  }
  return {
    period: "Demo window",
    totalRevenue,
    totalExpenses,
    netMargin: totalRevenue - totalExpenses,
    transactionCount: transactions.length,
  };
}

export function summarizeAmounts(txs: Array<{ amount: number }>) {
  let totalRevenue = 0;
  let totalExpenses = 0;
  for (const tx of txs) {
    if (tx.amount >= 0) totalRevenue += tx.amount;
    else totalExpenses += Math.abs(tx.amount);
  }
  return { totalRevenue, totalExpenses, netMargin: totalRevenue - totalExpenses };
}
