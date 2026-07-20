import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { SESSION_COOKIE } from "@/lib/auth/constants";

export type AuthSession = {
  userId: string;
  sessionToken: string;
  expires: Date;
};

export async function createSession(userId: string): Promise<AuthSession> {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + env.AUTH_SESSION_TTL_HOURS * 60 * 60 * 1000);

  const session = await prisma.session.create({
    data: {
      userId,
      sessionToken,
      expires
    }
  });

  return {
    userId: session.userId,
    sessionToken: session.sessionToken,
    expires: session.expires
  };
}

export async function getSession(sessionToken: string): Promise<AuthSession | null> {
  const session = await prisma.session.findUnique({ where: { sessionToken } });

  if (!session || session.expires < new Date()) {
    return null;
  }

  return {
    userId: session.userId,
    sessionToken: session.sessionToken,
    expires: session.expires
  };
}

export async function revokeSession(sessionToken: string): Promise<void> {
  await prisma.session.deleteMany({ where: { sessionToken } });
}

export async function setSessionCookie(session: AuthSession): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, session.sessionToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    expires: session.expires,
    path: "/"
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Reads the session cookie and validates it against the DB. Returns null instead of redirecting — safe to call from layouts/pages that render for logged-out users too. */
export async function getOptionalSession(): Promise<AuthSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return getSession(token);
}

/** The authoritative auth check for protected pages — middleware only checks cookie presence (Edge-safe, no DB access), this does the real DB-backed validation. */
export async function requireSession(): Promise<AuthSession> {
  const session = await getOptionalSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}
