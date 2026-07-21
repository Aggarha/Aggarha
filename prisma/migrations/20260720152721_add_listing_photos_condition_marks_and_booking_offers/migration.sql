/*
  Warnings:

  - Added the required column `mode` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."DefectSeverity" AS ENUM ('MINOR', 'MEDIUM', 'MAJOR');

-- AlterTable
-- "mode" is added nullable first, backfilled, then set NOT NULL — the table is not empty
-- in the shared database, so adding it directly as NOT NULL with no default would fail.
ALTER TABLE "public"."Booking" ADD COLUMN     "mode" "public"."ListingMode",
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL,
ALTER COLUMN "totalDays" DROP NOT NULL;

-- Backfill: every booking created before swap-request support existed was a rental request.
UPDATE "public"."Booking" SET "mode" = 'RENT' WHERE "mode" IS NULL;

ALTER TABLE "public"."Booking" ALTER COLUMN "mode" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."ListingPhoto" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ListingConditionMark" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "public"."DefectSeverity" NOT NULL,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingConditionMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookingOfferedListing" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "BookingOfferedListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListingPhoto_listingId_idx" ON "public"."ListingPhoto"("listingId");

-- CreateIndex
CREATE INDEX "ListingConditionMark_listingId_idx" ON "public"."ListingConditionMark"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingOfferedListing_bookingId_listingId_key" ON "public"."BookingOfferedListing"("bookingId", "listingId");

-- AddForeignKey
ALTER TABLE "public"."ListingPhoto" ADD CONSTRAINT "ListingPhoto_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ListingConditionMark" ADD CONSTRAINT "ListingConditionMark_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingOfferedListing" ADD CONSTRAINT "BookingOfferedListing_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingOfferedListing" ADD CONSTRAINT "BookingOfferedListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
