import { NextResponse } from "next/server";
import { getDemoCredentials, loginWithDemo, sessionCookieOptions } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim();
  const password = String(body.password || "");

  const user = loginWithDemo(email, password);
  if (!user) {
    const demo = getDemoCredentials();
    return NextResponse.json(
      {
        error: "Invalid credentials",
        hint: `Demo login: ${demo.email} / ${demo.password}`,
      },
      { status: 401 }
    );
  }

  const cookie = sessionCookieOptions(user);
  const res = NextResponse.json({ success: true, user, redirect: "/dashboard" });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("finsight_session", "", { path: "/", maxAge: 0 });
  return res;
}
