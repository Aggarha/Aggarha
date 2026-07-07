import { NextRequest, NextResponse } from "next/server";
import { runMatchmaking, runPricingForListing, runTrustAndFraudForListing } from "@/lib/ai";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [pricing, trustFraud, matches] = await Promise.all([
    runPricingForListing(id),
    runTrustAndFraudForListing(id),
    runMatchmaking(id)
  ]);

  if (!pricing || !trustFraud) {
    return NextResponse.json({ status: "error", message: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: "ok",
    data: {
      pricing,
      trust: trustFraud.trust,
      fraud: trustFraud.fraud,
      matches
    }
  });
}
