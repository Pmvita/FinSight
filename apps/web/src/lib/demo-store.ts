import { randomUUID } from "crypto";
import type {
  Account,
  Budget,
  Category,
  DashboardSummary,
  Transaction,
  User,
} from "./types.ts";

const DEMO_USER: User = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "demo@finsight.dev",
  fullName: "Demo Analyst",
  role: "analyst",
};

const DEMO_PASSWORD = "demo1234";

function monthAgo(months: number, day = 15): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setDate(day);
  return d.toISOString().slice(0, 10);
}

function seed() {
  const categories: Category[] = [
    { id: "c-saas", name: "SaaS Revenue", type: "income" },
    { id: "c-consult", name: "Consulting", type: "income" },
    { id: "c-payroll", name: "Payroll", type: "expense" },
    { id: "c-mkt", name: "Marketing", type: "expense" },
    { id: "c-infra", name: "Infrastructure", type: "expense" },
    { id: "c-office", name: "Office", type: "expense" },
  ];

  const accounts: Account[] = [
    {
      id: "a-ops",
      userId: DEMO_USER.id,
      name: "Operating Checking",
      type: "checking",
      balance: 186400,
      currency: "USD",
    },
    {
      id: "a-rev",
      userId: DEMO_USER.id,
      name: "Revenue Clearing",
      type: "revenue",
      balance: 482300,
      currency: "USD",
    },
    {
      id: "a-sav",
      userId: DEMO_USER.id,
      name: "Reserve Savings",
      type: "savings",
      balance: 95000,
      currency: "USD",
    },
  ];

  const txDefs: Array<Omit<Transaction, "id" | "userId" | "createdAt" | "status">> = [
    { accountId: "a-rev", categoryId: "c-saas", amount: 72000, description: "Monthly SaaS billing", transactionDate: monthAgo(0, 1) },
    { accountId: "a-rev", categoryId: "c-consult", amount: 18500, description: "Implementation project", transactionDate: monthAgo(0, 8) },
    { accountId: "a-ops", categoryId: "c-payroll", amount: -48000, description: "Bi-weekly payroll", transactionDate: monthAgo(0, 5) },
    { accountId: "a-ops", categoryId: "c-mkt", amount: -9200, description: "Paid ads + content", transactionDate: monthAgo(0, 12) },
    { accountId: "a-ops", categoryId: "c-infra", amount: -4100, description: "Cloud + observability", transactionDate: monthAgo(0, 3) },
    { accountId: "a-rev", categoryId: "c-saas", amount: 68500, description: "Monthly SaaS billing", transactionDate: monthAgo(1, 1) },
    { accountId: "a-rev", categoryId: "c-consult", amount: 12000, description: "Advisory retainer", transactionDate: monthAgo(1, 18) },
    { accountId: "a-ops", categoryId: "c-payroll", amount: -47500, description: "Bi-weekly payroll", transactionDate: monthAgo(1, 5) },
    { accountId: "a-ops", categoryId: "c-mkt", amount: -7800, description: "Campaign spend", transactionDate: monthAgo(1, 14) },
    { accountId: "a-ops", categoryId: "c-office", amount: -3200, description: "Office lease", transactionDate: monthAgo(1, 2) },
    { accountId: "a-rev", categoryId: "c-saas", amount: 65000, description: "Monthly SaaS billing", transactionDate: monthAgo(2, 1) },
    { accountId: "a-ops", categoryId: "c-payroll", amount: -47000, description: "Bi-weekly payroll", transactionDate: monthAgo(2, 5) },
    { accountId: "a-ops", categoryId: "c-infra", amount: -3900, description: "Cloud invoice", transactionDate: monthAgo(2, 9) },
    { accountId: "a-ops", categoryId: "c-mkt", amount: -6400, description: "Growth experiments", transactionDate: monthAgo(2, 20) },
    { accountId: "a-rev", categoryId: "c-saas", amount: 61000, description: "Monthly SaaS billing", transactionDate: monthAgo(3, 1) },
    { accountId: "a-ops", categoryId: "c-payroll", amount: -46500, description: "Bi-weekly payroll", transactionDate: monthAgo(3, 5) },
    { accountId: "a-ops", categoryId: "c-office", amount: -3200, description: "Office lease", transactionDate: monthAgo(3, 2) },
    { accountId: "a-rev", categoryId: "c-consult", amount: 22000, description: "Q kickoff workshop", transactionDate: monthAgo(3, 22) },
    { accountId: "a-rev", categoryId: "c-saas", amount: 58000, description: "Monthly SaaS billing", transactionDate: monthAgo(4, 1) },
    { accountId: "a-ops", categoryId: "c-payroll", amount: -46000, description: "Bi-weekly payroll", transactionDate: monthAgo(4, 5) },
    { accountId: "a-ops", categoryId: "c-mkt", amount: -5100, description: "Brand partnership", transactionDate: monthAgo(4, 16) },
    { accountId: "a-rev", categoryId: "c-saas", amount: 54000, description: "Monthly SaaS billing", transactionDate: monthAgo(5, 1) },
    { accountId: "a-ops", categoryId: "c-payroll", amount: -45500, description: "Bi-weekly payroll", transactionDate: monthAgo(5, 5) },
    { accountId: "a-ops", categoryId: "c-infra", amount: -3600, description: "Cloud invoice", transactionDate: monthAgo(5, 11) },
  ];

  const transactions: Transaction[] = txDefs.map((t) => ({
    ...t,
    id: randomUUID(),
    userId: DEMO_USER.id,
    status: "cleared",
    createdAt: new Date().toISOString(),
  }));

  const start = monthAgo(5, 1);
  const end = monthAgo(0, 28);
  const budgets: Budget[] = [
    { id: "b1", userId: DEMO_USER.id, categoryId: "c-payroll", allocatedAmount: 290000, periodStart: start, periodEnd: end },
    { id: "b2", userId: DEMO_USER.id, categoryId: "c-mkt", allocatedAmount: 45000, periodStart: start, periodEnd: end },
    { id: "b3", userId: DEMO_USER.id, categoryId: "c-infra", allocatedAmount: 25000, periodStart: start, periodEnd: end },
    { id: "b4", userId: DEMO_USER.id, categoryId: "c-office", allocatedAmount: 20000, periodStart: start, periodEnd: end },
  ];

  return { categories, accounts, transactions, budgets };
}

type Store = ReturnType<typeof seed> & { user: User };

const globalForStore = globalThis as unknown as { __finsightStore?: Store };

function getStore(): Store {
  if (!globalForStore.__finsightStore) {
    globalForStore.__finsightStore = { user: DEMO_USER, ...seed() };
  }
  return globalForStore.__finsightStore;
}

export function authenticateDemo(email: string, password: string): User | null {
  if (email.trim().toLowerCase() === DEMO_USER.email && password === DEMO_PASSWORD) {
    return DEMO_USER;
  }
  return null;
}

export function getDemoCredentials() {
  return { email: DEMO_USER.email, password: DEMO_PASSWORD };
}

export { DEMO_USER };

export function listAccounts(userId: string) {
  return getStore().accounts.filter((a) => a.userId === userId);
}

export function listCategories() {
  return getStore().categories;
}

export function listTransactions(userId: string) {
  return [...getStore().transactions]
    .filter((t) => t.userId === userId)
    .sort((a, b) => b.transactionDate.localeCompare(a.transactionDate));
}

export function listBudgets(userId: string) {
  return getStore().budgets.filter((b) => b.userId === userId);
}

export function createTransaction(
  userId: string,
  input: {
    accountId: string;
    categoryId: string;
    amount: number;
    description: string;
    transactionDate?: string;
  }
): Transaction {
  const store = getStore();
  const category = store.categories.find((c) => c.id === input.categoryId);
  const signed =
    category?.type === "expense" ? -Math.abs(input.amount) : Math.abs(input.amount);

  const tx: Transaction = {
    id: randomUUID(),
    userId,
    accountId: input.accountId,
    categoryId: input.categoryId,
    amount: signed,
    description: input.description || "Manual entry",
    transactionDate: input.transactionDate || new Date().toISOString().slice(0, 10),
    status: "cleared",
    createdAt: new Date().toISOString(),
  };
  store.transactions.push(tx);
  const account = store.accounts.find((a) => a.id === input.accountId);
  if (account) account.balance += signed;
  return tx;
}

export function buildDashboardSummary(userId: string): DashboardSummary {
  const store = getStore();
  const txs = store.transactions.filter((t) => t.userId === userId);
  const catMap = Object.fromEntries(store.categories.map((c) => [c.id, c]));

  let totalRevenue = 0;
  let totalExpenses = 0;
  const byCat = new Map<string, { category: string; amount: number; type: "income" | "expense" }>();
  const monthly = new Map<string, { month: string; revenue: number; expenses: number }>();

  for (const tx of txs) {
    const cat = catMap[tx.categoryId];
    const month = tx.transactionDate.slice(0, 7);
    if (!monthly.has(month)) monthly.set(month, { month, revenue: 0, expenses: 0 });
    const m = monthly.get(month)!;

    if (tx.amount >= 0) {
      totalRevenue += tx.amount;
      m.revenue += tx.amount;
    } else {
      totalExpenses += Math.abs(tx.amount);
      m.expenses += Math.abs(tx.amount);
    }

    if (cat) {
      const key = cat.id;
      if (!byCat.has(key)) byCat.set(key, { category: cat.name, amount: 0, type: cat.type });
      byCat.get(key)!.amount += Math.abs(tx.amount);
    }
  }

  const budgets = store.budgets
    .filter((b) => b.userId === userId)
    .map((b) => {
      const cat = catMap[b.categoryId];
      const actual = txs
        .filter((t) => t.categoryId === b.categoryId && t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return {
        category: cat?.name || b.categoryId,
        allocated: b.allocatedAmount,
        actual,
        variance: b.allocatedAmount - actual,
      };
    });

  return {
    period: "Last 6 months",
    totalRevenue,
    totalExpenses,
    netMargin: totalRevenue - totalExpenses,
    byCategory: [...byCat.values()].sort((a, b) => b.amount - a.amount),
    monthly: [...monthly.values()].sort((a, b) => a.month.localeCompare(b.month)),
    budgets,
  };
}
