import { NextResponse } from "next/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getListingQuickView } from "@/lib/marketplace/query";
import { listingQuickViewData } from "@/lib/marketplace/serializers";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [listing, locale] = await Promise.all([getListingQuickView(id), getLocale()]);

  if (!listing) {
    return NextResponse.json({ status: "error", message: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ status: "ok", data: listingQuickViewData(listing, locale) });
}
