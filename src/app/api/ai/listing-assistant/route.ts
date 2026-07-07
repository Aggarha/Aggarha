import { NextRequest, NextResponse } from "next/server";
import { parseMode, runListingAssistant } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as {
    seedTitle?: string;
    userNotes?: string;
    mode?: string;
    categoryHint?: string;
    city?: string;
    governorate?: string;
  };

  const data = await runListingAssistant({
    seedTitle: payload.seedTitle,
    userNotes: payload.userNotes,
    mode: parseMode(payload.mode),
    categoryHint: payload.categoryHint,
    city: payload.city,
    governorate: payload.governorate
  });

  return NextResponse.json({ status: "ok", data });
}
