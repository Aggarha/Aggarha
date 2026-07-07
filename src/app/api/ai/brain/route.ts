import { NextRequest, NextResponse } from "next/server";
import { runAIBrainSnapshot } from "@/lib/ai";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city") ?? undefined;
  const governorate = request.nextUrl.searchParams.get("governorate") ?? undefined;
  const userId = request.nextUrl.searchParams.get("userId") ?? undefined;

  const data = await runAIBrainSnapshot({
    userId,
    location: { city, governorate }
  });

  return NextResponse.json({ status: "ok", data });
}
