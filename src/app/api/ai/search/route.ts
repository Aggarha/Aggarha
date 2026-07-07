import { NextRequest, NextResponse } from "next/server";
import { runSearchIntelligence } from "@/lib/ai";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const city = request.nextUrl.searchParams.get("city") ?? undefined;
  const governorate = request.nextUrl.searchParams.get("governorate") ?? undefined;

  const data = await runSearchIntelligence(query, {
    location: {
      city,
      governorate
    }
  });

  return NextResponse.json({ status: "ok", data });
}
