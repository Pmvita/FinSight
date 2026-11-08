import assert from "node:assert/strict";
import { describe, it } from "node:test";

/** Mirrors apps/api/src/demo-store.ts summarizeAmounts for ESM strip-types runs. */
function summarizeAmounts(txs: Array<{ amount: number }>) {
  let totalRevenue = 0;
  let totalExpenses = 0;
  for (const tx of txs) {
    if (tx.amount >= 0) totalRevenue += tx.amount;
    else totalExpenses += Math.abs(tx.amount);
  }
  return { totalRevenue, totalExpenses, netMargin: totalRevenue - totalExpenses };
}

describe("summarizeAmounts", () => {
  it("splits revenue and expenses", () => {
    const result = summarizeAmounts([
      { amount: 100 },
      { amount: 50 },
      { amount: -30 },
      { amount: -20 },
    ]);
    assert.equal(result.totalRevenue, 150);
    assert.equal(result.totalExpenses, 50);
    assert.equal(result.netMargin, 100);
  });
});
