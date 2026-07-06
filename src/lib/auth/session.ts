import crypto from "crypto";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

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
