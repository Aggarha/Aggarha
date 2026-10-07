import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/auth/session";
import { canViewListing } from "@/lib/listings/access";
import { getListingDetails } from "@/lib/marketplace/query";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [listing, session] = await Promise.all([getListingDetails(id), getOptionalSession()]);

  if (!listing || !(await canViewListing(listing, session?.userId ?? null))) {
    return NextResponse.json({ status: "error", message: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ status: "ok", listing });
}
