"use client";

import { useEffect, useState } from "react";
import { AccountsStrip } from "@/components/AccountsStrip";
import { CashflowChart } from "@/components/CashflowChart";
import { KpiRow } from "@/components/KpiRow";
import { SpendingChart } from "@/components/SpendingChart";
import { TransactionsPanel } from "@/components/TransactionsPanel";
import type { Account, Category, DashboardSummary, Transaction } from "@/lib/types";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [s, a, c, t] = await Promise.all([
        fetch("/api/dashboard/summary"),
        fetch("/api/accounts"),
        fetch("/api/categories"),
        fetch("/api/transactions"),
      ]);
      if ([s, a, c, t].some((r) => r.status === 401)) {
        window.location.href = "/login";
        return;
      }
      if (!s.ok) throw new Error("Failed to load dashboard");
      const sj = await s.json();
      const aj = await a.json();
      const cj = await c.json();
      const tj = await t.json();
      setSummary(sj.data);
      setAccounts(aj.data || []);
      setCategories(cj.data || []);
      setTransactions(tj.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function logout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    window.location.href = "/login";
  }

  if (loading && !summary) {
    return (
      <main className="fs-atmosphere">
        <div className="fs-shell">
          <p className="fs-muted fs-rise">Loading FinSight…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="fs-atmosphere">
      <div className="fs-shell">
        <header className="fs-topbar fs-rise">
          <div className="fs-brand-row">
            <img className="fs-mark" src="/finsight-mark.jpg" alt="" width={52} height={52} />
            <div>
              <p className="fs-eyebrow">Forest ledger</p>
              <h1 className="fs-brand">
                Fin<span>Sight</span>
              </h1>
              <p className="fs-lede" style={{ marginTop: "0.35rem" }}>
                {summary?.period || "Demo period"} — balances, spend mix, and cashflow without spreadsheet fog.
              </p>
            </div>
          </div>
          <button className="fs-btn fs-btn-ghost" onClick={logout} type="button">
            Sign out
          </button>
        </header>

        {error && (
          <p className="fs-error fs-rise" style={{ marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <KpiRow
          revenue={summary?.totalRevenue || 0}
          expenses={summary?.totalExpenses || 0}
          net={summary?.netMargin || 0}
        />

        <section className="fs-charts fs-rise fs-rise-d3" aria-label="Charts">
          <CashflowChart data={summary?.monthly || []} />
          <SpendingChart data={summary?.byCategory || []} />
        </section>

        <div className="fs-rise fs-rise-d4">
          <TransactionsPanel
            accounts={accounts}
            categories={categories}
            transactions={transactions}
            onCreated={load}
          />
        </div>

        <AccountsStrip accounts={accounts} />
      </div>
    </main>
  );
}
