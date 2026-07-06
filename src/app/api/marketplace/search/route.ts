import { NextRequest, NextResponse } from "next/server";
import { parseSearchFilters, searchListings } from "@/lib/marketplace/query";

export async function GET(request: NextRequest) {
  const filters = parseSearchFilters(Object.fromEntries(request.nextUrl.searchParams.entries()));
  const data = await searchListings(filters);

  return NextResponse.json({
    status: "ok",
    filters,
    ...data
  });
}
