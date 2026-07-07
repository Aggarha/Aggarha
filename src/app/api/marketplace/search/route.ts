import { NextRequest, NextResponse } from "next/server";
import { runSearchIntelligence } from "@/lib/ai";
import { parseSearchFilters, searchListings } from "@/lib/marketplace/query";

export async function GET(request: NextRequest) {
  const filters = parseSearchFilters(Object.fromEntries(request.nextUrl.searchParams.entries()));
  const [data, intelligence] = await Promise.all([
    searchListings(filters),
    runSearchIntelligence(filters.keyword ?? "", {
      location: {
        governorate: filters.governorate,
        city: filters.city
      },
      recentKeywords: filters.keyword ? [filters.keyword] : []
    })
  ]);

  return NextResponse.json({
    status: "ok",
    filters,
    intelligence,
    ...data
  });
}
