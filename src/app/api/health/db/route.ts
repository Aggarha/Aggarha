import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [users, listings] = await Promise.all([prisma.user.count(), prisma.listing.count()]);

  return NextResponse.json({
    status: "ok",
    users,
    listings
  });
}
