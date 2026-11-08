import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { summarizeAmounts } from "./demo-store";

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
