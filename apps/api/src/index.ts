import "dotenv/config";
import cors from "cors";
import express from "express";
import {
  addTransaction,
  authDemo,
  dashboardSummary,
  getAccounts,
  getBudgets,
  getCategories,
  getTransactions,
} from "./demo-store";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

function requireDemoAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = req.header("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token === "demo-token" || process.env.ALLOW_ANON === "true") {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized — use Bearer demo-token after POST /auth/login" });
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", mode: "demo-store" });
});

app.post("/auth/login", (req, res) => {
  const email = String(req.body?.email || "");
  const password = String(req.body?.password || "");
  const user = authDemo(email, password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  return res.json({ token: "demo-token", user });
});

app.get("/api/accounts", requireDemoAuth, (_req, res) => {
  res.json({ data: getAccounts() });
});

app.get("/api/categories", requireDemoAuth, (_req, res) => {
  res.json({ data: getCategories() });
});

app.get("/api/transactions", requireDemoAuth, (_req, res) => {
  res.json({ data: getTransactions() });
});

app.post("/api/transactions", requireDemoAuth, (req, res) => {
  const accountId = String(req.body?.accountId || "");
  const categoryId = String(req.body?.categoryId || "");
  const amount = Number(req.body?.amount);
  const description = String(req.body?.description || "");
  if (!accountId || !categoryId || !Number.isFinite(amount) || amount === 0) {
    return res.status(400).json({ error: "accountId, categoryId, and non-zero amount required" });
  }
  const tx = addTransaction({ accountId, categoryId, amount, description });
  return res.status(201).json({ data: tx });
});

app.get("/api/budgets", requireDemoAuth, (_req, res) => {
  res.json({ data: getBudgets() });
});

app.get("/api/dashboard/summary", requireDemoAuth, (_req, res) => {
  res.json({ data: dashboardSummary() });
});

app.listen(port, () => {
  console.log(`FinSight API running on http://localhost:${port}`);
});
