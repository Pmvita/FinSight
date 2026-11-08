"use client";

import { FormEvent, useState } from "react";
import { getDemoCredentials } from "@/lib/demo-credentials";

export default function LoginPage() {
  const demo = getDemoCredentials();
  const [email, setEmail] = useState(demo.email);
  const [password, setPassword] = useState(demo.password);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      window.location.href = data.redirect || "/dashboard";
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <main className="fs-atmosphere fs-login">
      <section className="fs-card fs-card-pad fs-login-card fs-rise">
        <div className="fs-brand-row">
          <img className="fs-mark" src="/finsight-mark.jpg" alt="" width={56} height={56} />
          <div>
            <p className="fs-eyebrow">Personal finance</p>
            <h1 className="fs-brand">
              Fin<span>Sight</span>
            </h1>
          </div>
        </div>
        <p className="fs-lede">Cool forest-ledger clarity for balances, spend mix, and cashflow — without spreadsheet fog.</p>
        <form onSubmit={onSubmit} className="fs-login-form">
          {error && <p className="fs-error">{error}</p>}
          <label className="fs-field">
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="username" />
          </label>
          <label className="fs-field">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              autoComplete="current-password"
            />
          </label>
          <button className="fs-btn" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Enter dashboard"}
          </button>
        </form>
        <p className="fs-hint">
          Demo: {demo.email} / {demo.password}
        </p>
      </section>
    </main>
  );
}
