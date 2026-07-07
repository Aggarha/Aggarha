import { NextRequest, NextResponse } from "next/server";
import { analyzeListingImages } from "@/lib/ai/engines/image-analyzer";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as { imageUrls?: string[] };
  const imageUrls = Array.isArray(payload.imageUrls) ? payload.imageUrls : [];

  const data = analyzeListingImages(imageUrls);
  return NextResponse.json({ status: "ok", data });
}
