import { headers } from "next/headers";
import { prisma } from "@/lib/db";

/**
 * Real client IP behind Nginx — the production vhost sets both X-Real-IP and
 * X-Forwarded-For ($proxy_add_x_forwarded_for). Falls back to "unknown" for local
 * dev without a reverse proxy in front, where rate-limit realism doesn't matter.
 */
async function getClientIp(): Promise<string> {
  const store = await headers();
  const realIp = store.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  const forwardedFor = store.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "unknown";
}

/**
 * Sliding-window limiter backed by RateLimitEvent — every attempt (successful or
 * not) counts toward the window, and survives pm2 restarts unlike an in-memory
 * counter would. Checked BEFORE any real work (no user lookup, no password
 * verification) so a rejected attempt costs almost nothing.
 */
export async function checkRateLimit(input: { route: string; limit: number; windowMinutes: number }): Promise<{ limited: boolean }> {
  const ipAddress = await getClientIp();
  const windowStart = new Date(Date.now() - input.windowMinutes * 60 * 1000);

  const count = await prisma.rateLimitEvent.count({
    where: { ipAddress, route: input.route, createdAt: { gte: windowStart } }
  });

  if (count >= input.limit) {
    return { limited: true };
  }

  await prisma.rateLimitEvent.create({
    data: { ipAddress, route: input.route, action: input.route }
  });

  return { limited: false };
}
