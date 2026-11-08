import { cookies } from "next/headers";
import type { User } from "./types";
import { authenticateDemo, getDemoCredentials } from "./demo-store";

const COOKIE = "finsight_session";

export async function getSessionUser(): Promise<User | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as User;
    if (parsed?.id && parsed?.email) return parsed;
  } catch {
    return null;
  }
  return null;
}

export async function requireSessionUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export function sessionCookieOptions(user: User) {
  return {
    name: COOKIE,
    value: JSON.stringify(user),
    options: {
      path: "/",
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}

export function loginWithDemo(email: string, password: string): User | null {
  return authenticateDemo(email, password);
}

export { getDemoCredentials, COOKIE as SESSION_COOKIE };
