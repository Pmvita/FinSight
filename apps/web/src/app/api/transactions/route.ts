import { NextResponse } from "next/server";
import { createTransaction, listTransactions } from "@/lib/demo-store";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ data: listTransactions(user.id) });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const accountId = String(body.accountId || "");
  const categoryId = String(body.categoryId || "");
  const amount = Number(body.amount);
  const description = String(body.description || "");
  const transactionDate = body.transactionDate ? String(body.transactionDate) : undefined;

  if (!accountId || !categoryId || !Number.isFinite(amount) || amount === 0) {
    return NextResponse.json({ error: "accountId, categoryId, and non-zero amount are required" }, { status: 400 });
  }

  const tx = createTransaction(user.id, {
    accountId,
    categoryId,
    amount,
    description,
    transactionDate,
  });
  return NextResponse.json({ data: tx }, { status: 201 });
}
