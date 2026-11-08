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
      <main className="fs-atmosphere">
        <div className="fs-shell">
          <p className="fs-muted fs-rise">Loading forest ledger…</p>
        </div>
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

        {error && <p className="fs-error fs-rise">{error}</p>}

        <section className="fs-kpi-row">
          <article className="fs-card fs-card-pad fs-interactive fs-rise fs-rise-d1">
            <p className="fs-kpi-label">Revenue</p>
            <p className="fs-kpi-value fs-up">{money(summary?.totalRevenue || 0)}</p>
          </article>
          <article className="fs-card fs-card-pad fs-interactive fs-rise fs-rise-d2">
            <p className="fs-kpi-label">Expenses</p>
            <p className="fs-kpi-value fs-down">{money(summary?.totalExpenses || 0)}</p>
          </article>
          <article className="fs-card fs-card-pad fs-interactive fs-rise fs-rise-d3">
            <p className="fs-kpi-label">Net margin</p>
            <p className={`fs-kpi-value ${(summary?.netMargin || 0) >= 0 ? "fs-up" : "fs-down"}`}>
              {money(summary?.netMargin || 0)}
            </p>
          </article>
        </section>

        <section className="fs-chart-grid">
          <article className="fs-card fs-card-pad fs-rise fs-rise-d2">
            <h2 className="fs-panel-title">Revenue vs expenses</h2>
            <div className="fs-chart-box">
              <DualLineChart data={lineData} />
            </div>
          </article>
          <article className="fs-card fs-card-pad fs-rise fs-rise-d3">
            <h2 className="fs-panel-title">Budget vs actual</h2>
            <div className="fs-chart-box">
              <DualBarChart data={barData} />
            </div>
          </article>
        </section>

        <section className="fs-split-grid">
          <article className="fs-card fs-card-pad fs-rise">
            <h2 className="fs-panel-title">Add transaction</h2>
            <form className="fs-tx-form" onSubmit={onCreate}>
              <label className="fs-field">
                Account
                <select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="fs-field">
                Category
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </label>
              <label className="fs-field">
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
              <label className="fs-field">
                Description
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional note"
                />
              </label>
              <button className="fs-btn" type="submit" disabled={saving}>
                {saving ? "Saving…" : "Create transaction"}
              </button>
            </form>
            <p className="fs-hint">Expense categories store amounts as outflows automatically.</p>
          </article>

          <article className="fs-card fs-card-pad fs-rise">
            <h2 className="fs-panel-title">Recent transactions</h2>
            <ul className="fs-tx-list">
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
                    <em className={t.amount >= 0 ? "fs-up" : "fs-down"}>{money(t.amount)}</em>
                  </li>
                );
              })}
            </ul>
          </article>
        </section>

        <section className="fs-card fs-card-pad fs-rise">
          <h2 className="fs-panel-title">Accounts</h2>
          <div className="fs-account-row">
            {accounts.map((a) => (
              <div key={a.id} className="fs-account-chip">
                <span>{a.name}</span>
                <strong>{money(a.balance)}</strong>
              </div>
            ))}
          </div>
          <p className="fs-hint">Top expense categories: {expenseCats.map((c) => c.name).join(", ")}</p>
        </section>
      </div>
    </main>
  );
}
