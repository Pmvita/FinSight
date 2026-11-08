import { NextResponse } from "next/server";
import { buildDashboardSummary } from "@/lib/demo-store";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ data: buildDashboardSummary(user.id) });
}
