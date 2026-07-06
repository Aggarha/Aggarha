import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [users, listings, categories, locations, bookings, reviews] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.category.count(),
    prisma.location.count(),
    prisma.booking.count(),
    prisma.review.count()
  ]);

  return NextResponse.json({
    status: "ok",
    users,
    listings,
    categories,
    locations,
    bookings,
    reviews
  });
}
