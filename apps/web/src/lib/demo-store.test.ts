import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  authenticateDemo,
  buildDashboardSummary,
  createTransaction,
  getDemoCredentials,
  listTransactions,
} from "./demo-store.ts";

const USER_ID = "00000000-0000-4000-8000-000000000001";

describe("demo-store", () => {
  it("authenticates demo user", () => {
    const demo = getDemoCredentials();
    assert.equal(authenticateDemo(demo.email, demo.password)?.email, demo.email);
    assert.equal(authenticateDemo("nope@x.com", "bad"), null);
  });

  it("creates a transaction", () => {
    const before = listTransactions(USER_ID).length;
    const txn = createTransaction(USER_ID, {
      accountId: "a-ops",
      categoryId: "c-office",
      amount: 12.5,
      description: "Coffee",
      transactionDate: "2026-11-08",
    });
    assert.ok(txn.id);
    assert.ok(txn.amount < 0);
    assert.equal(listTransactions(USER_ID).length, before + 1);
  });

  it("builds dashboard summary", () => {
    const summary = buildDashboardSummary(USER_ID);
    assert.ok(summary.monthly.length >= 1);
    assert.ok(summary.totalRevenue >= 0);
    assert.ok(summary.totalExpenses >= 0);
  });
});
