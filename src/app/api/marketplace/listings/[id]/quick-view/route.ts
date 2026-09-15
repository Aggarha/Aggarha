import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { getListingQuickView, getViewerListingFlags } from "@/lib/marketplace/query";
import { listingQuickViewData } from "@/lib/marketplace/serializers";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [listing, locale, session] = await Promise.all([
    getListingQuickView(id),
    getLocale(),
    getOptionalSession()
  ]);

  if (!listing) {
    return NextResponse.json({ status: "error", message: "Listing not found" }, { status: 404 });
  }

  // Viewer-dependent flags are merged here rather than inside the serializer so
  // listingQuickViewData stays a pure shape function with no notion of "who".
  const flags = await getViewerListingFlags(session?.userId ?? null, listing.id);

  return NextResponse.json({ status: "ok", data: { ...listingQuickViewData(listing, locale), ...flags } });
}
