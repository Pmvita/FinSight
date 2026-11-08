"use client";

import { FormEvent, useState } from "react";
import type { Account, Category, Transaction } from "@/lib/types";
import { money } from "@/lib/format";

type Props = {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  onCreated: () => Promise<void>;
};

export function TransactionsPanel({ accounts, categories, transactions, onCreated }: Props) {
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: accountId || accounts[0]?.id,
          categoryId: categoryId || categories[0]?.id,
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
      await onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fs-tx-grid">
      <form className="fs-card fs-card-pad fs-interactive" onSubmit={onCreate}>
        <p className="fs-eyebrow">Ledger</p>
        <h2 className="fs-display fs-section-title">Add transaction</h2>
        {error && <p className="fs-error" style={{ marginTop: "0.85rem" }}>{error}</p>}
        <div className="fs-form-grid">
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
              placeholder="1200"
              required
            />
          </label>
          <label className="fs-field">
            Description
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional note" />
          </label>
        </div>
        <button className="fs-btn" type="submit" disabled={saving} style={{ marginTop: "1rem", width: "100%" }}>
          {saving ? "Saving…" : "Create transaction"}
        </button>
      </form>

      <section className="fs-card fs-card-pad">
        <p className="fs-eyebrow">Activity</p>
        <h2 className="fs-display fs-section-title">Recent transactions</h2>
        <ul className="fs-tx-list">
          {transactions.slice(0, 10).map((t) => {
            const cat = categories.find((c) => c.id === t.categoryId)?.name || t.categoryId;
            return (
              <li key={t.id} className="fs-tx-row fs-interactive">
                <div>
                  <strong>{t.description || cat}</strong>
                  <span className="fs-muted">
                    {t.transactionDate} · {cat}
                  </span>
                </div>
                <em className={t.amount >= 0 ? "fs-up" : "fs-down"}>{money(t.amount)}</em>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
