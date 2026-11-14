import { NextRequest, NextResponse } from "next/server";

export const appSessionCookieName = "student_sky_session";
export const appSessionMaxAgeSeconds = 60 * 60 * 24 * 30;

export type AuthCheck =
  | { ok: true }
  | { ok: false; status: 401 | 503; error: string };

export function authConfigReady() {
  return Boolean(process.env.APP_ACCESS_PASSWORD && process.env.SESSION_SECRET);
}

export function verifyCronSecret(request: Request) {
  const expectedSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!expectedSecret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured." }, { status: 503 });
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export async function requireAppSession(request: Request): Promise<AuthCheck> {
  if (!authConfigReady()) {
    return { ok: true };
  }

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader || !cookieHeader.includes(appSessionCookieName)) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  return { ok: true };
}

export async function requireAppSessionResponse(request: Request) {
  const auth = await requireAppSession(request);
  if (auth.ok) return null;
  return NextResponse.json({ error: auth.error }, { status: auth.status });
}
