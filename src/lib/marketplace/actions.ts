"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getOptionalSession } from "@/lib/auth/session";

/**
 * Both toggles return "unauthorized" instead of redirecting: the heart lives
 * inside a half-sheet, and redirecting out of it would lose the listing the
 * visitor was looking at. The caller sends them to /login with a return path.
 */
export type ToggleResult = { error: "unauthorized" | "failed" } | { active: boolean; count: number };

export async function toggleFavoriteAction(listingId: string): Promise<ToggleResult> {
  const session = await getOptionalSession();
  if (!session) {
    return { error: "unauthorized" };
  }

  try {
    const existing = await prisma.favorite.findUnique({
      where: { userId_listingId: { userId: session.userId, listingId } },
      select: { id: true }
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
    } else {
      await prisma.favorite.create({ data: { userId: session.userId, listingId } });
    }

    const count = await prisma.favorite.count({ where: { listingId } });
    revalidatePath(`/marketplace/${listingId}`);
    return { active: !existing, count };
  } catch {
    return { error: "failed" };
  }
}

/** Saving is the quieter, private counterpart to a like — no public count is shown for it. */
export async function toggleSavedListingAction(listingId: string): Promise<ToggleResult> {
  const session = await getOptionalSession();
  if (!session) {
    return { error: "unauthorized" };
  }

  try {
    const existing = await prisma.savedListing.findUnique({
      where: { userId_listingId: { userId: session.userId, listingId } },
      select: { id: true }
    });

    if (existing) {
      await prisma.savedListing.delete({ where: { id: existing.id } });
    } else {
      await prisma.savedListing.create({ data: { userId: session.userId, listingId } });
    }

    const count = await prisma.savedListing.count({ where: { listingId } });
    return { active: !existing, count };
  } catch {
    return { error: "failed" };
  }
}
