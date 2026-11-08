"use client";

import type { Account } from "@/lib/types";
import { money } from "@/lib/format";

type Props = {
  accounts: Account[];
};

export function AccountsStrip({ accounts }: Props) {
  return (
    <section className="fs-card fs-card-pad fs-rise fs-rise-d5" aria-label="Accounts">
      <div className="fs-spend-head">
        <div>
          <p className="fs-eyebrow">Liquidity</p>
          <h2 className="fs-display fs-section-title">Accounts</h2>
        </div>
      </div>
      <div className="fs-account-strip">
        {accounts.map((a) => (
          <button key={a.id} type="button" className="fs-account-chip fs-interactive">
            <span className="fs-muted">{a.name}</span>
            <strong>{money(a.balance)}</strong>
            <em>{a.type}</em>
          </button>
        ))}
      </div>
    </section>
  );
}
