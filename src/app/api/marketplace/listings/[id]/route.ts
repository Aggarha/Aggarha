import { NextResponse } from "next/server";
import { getListingDetails } from "@/lib/marketplace/query";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const listing = await getListingDetails(id);

  if (!listing) {
    return NextResponse.json({ status: "error", message: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ status: "ok", listing });
}
