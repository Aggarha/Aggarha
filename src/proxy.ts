import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Edge-safe fast path only: checks whether a session cookie is present, nothing more.
 * Prisma (src/lib/db.ts) doesn't run reliably on the Edge runtime, so the real DB-backed
 * validation happens in requireSession() (src/lib/auth/session.ts) on each protected page.
 */
export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);

  if (!hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/listings/new", "/bookings", "/swap-proposal", "/rent"]
};
