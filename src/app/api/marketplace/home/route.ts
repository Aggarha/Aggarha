import { NextResponse } from "next/server";
import { getHomepageShowcase } from "@/lib/marketplace/query";

export async function GET() {
  const data = await getHomepageShowcase();
  return NextResponse.json({ status: "ok", data });
}
