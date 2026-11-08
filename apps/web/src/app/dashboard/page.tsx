"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { DualBarChart, DualLineChart } from "@/components/SimpleCharts";
import type { Account, Category, DashboardSummary, Transaction } from "@/lib/types";

function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

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
      if (!accountId && aj.data?.[0]) setAccountId(aj.data[0].id);
      if (!categoryId && cj.data?.[0]) setCategoryId(cj.data[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const expenseCats = useMemo(() => categories.filter((c) => c.type === "expense"), [categories]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          categoryId,
          amount: Number(amount),
          description,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not create transaction");
      }
      setAmount("");
      setDescription("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    window.location.href = "/login";
  }

  if (loading && !summary) {
    return (
      <main className="dash-shell">
        <p className="muted">Loading dashboard…</p>
      </main>
    );
  }

  const lineData = (summary?.monthly || []).map((m) => ({
    label: m.month,
    a: m.revenue,
    b: m.expenses,
  }));
  const barData = (summary?.budgets || []).map((b) => ({
    label: b.category,
    a: b.allocated,
    b: b.actual,
  }));

  return (
    <main className="dash-shell">
      <header className="dash-header">
        <div>
          <p className="eyebrow">FinSight</p>
          <h1>Cashflow dashboard</h1>
          <p className="lede">{summary?.period || "Demo period"}</p>
        </div>
        <button className="ghost" onClick={logout} type="button">
          Sign out
        </button>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="kpi-row">
        <article className="kpi">
          <span>Revenue</span>
          <strong>{money(summary?.totalRevenue || 0)}</strong>
        </article>
        <article className="kpi">
          <span>Expenses</span>
          <strong>{money(summary?.totalExpenses || 0)}</strong>
        </article>
        <article className="kpi">
          <span>Net margin</span>
          <strong className={(summary?.netMargin || 0) >= 0 ? "up" : "down"}>
            {money(summary?.netMargin || 0)}
          </strong>
        </article>
      </section>

      <section className="chart-grid">
        <article className="panel">
          <h2>Revenue vs expenses</h2>
          <div className="chart-box">
            <DualLineChart data={lineData} />
          </div>
        </article>

        <article className="panel">
          <h2>Budget vs actual</h2>
          <div className="chart-box">
            <DualBarChart data={barData} />
          </div>
        </article>
      </section>

      <section className="split-grid">
        <article className="panel">
          <h2>Add transaction</h2>
          <form className="tx-form" onSubmit={onCreate}>
            <label>
              Account
              <select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Category
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Amount
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1200"
                required
              />
            </label>
            <label>
              Description
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional note" />
            </label>
            <button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Create transaction"}
            </button>
          </form>
          <p className="hint">Expense categories store amounts as outflows automatically.</p>
        </article>

        <article className="panel">
          <h2>Recent transactions</h2>
          <ul className="tx-list">
            {transactions.slice(0, 10).map((t) => {
              const cat = categories.find((c) => c.id === t.categoryId)?.name || t.categoryId;
              return (
                <li key={t.id}>
                  <div>
                    <strong>{t.description || cat}</strong>
                    <span>
                      {t.transactionDate} · {cat}
                    </span>
                  </div>
                  <em className={t.amount >= 0 ? "up" : "down"}>{money(t.amount)}</em>
                </li>
              );
            })}
          </ul>
        </article>
      </section>

      <section className="panel">
        <h2>Accounts</h2>
        <div className="account-row">
          {accounts.map((a) => (
            <div key={a.id} className="account-chip">
              <span>{a.name}</span>
              <strong>{money(a.balance)}</strong>
            </div>
          ))}
        </div>
        <p className="hint">Top expense categories: {expenseCats.map((c) => c.name).join(", ")}</p>
      </section>
    </main>
  );
}
