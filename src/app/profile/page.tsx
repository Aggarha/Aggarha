import type { Route } from "next";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { buildProfilePath } from "@/lib/profile/identity";
import { getOwnHandle } from "@/lib/profile/query";

/**
 * /profile is a convenience entry point for the signed-in user — profiles are
 * addressed by handle so the URL stays shareable. requireSession() sends a
 * logged-out visitor to /login rather than 404ing.
 */
export default async function OwnProfilePage() {
  const session = await requireSession();
  const handle = await getOwnHandle(session.userId);

  if (!handle) {
    redirect("/" as Route);
  }

  redirect(buildProfilePath(handle) as Route);
}
