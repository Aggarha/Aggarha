-- Manual rollback companion for A5 migration.
-- NOTE: Execute manually if rollback is needed.

-- Recreate legacy state and restore from governorate.
ALTER TABLE "public"."Location" ADD COLUMN IF NOT EXISTS "state" TEXT;
UPDATE "public"."Location" SET "state" = COALESCE("state", "governorate");

-- Recreate legacy ListingStatus enum shape and map values back.
CREATE TYPE "public"."ListingStatus_rollback" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED', 'FLAGGED');

UPDATE "public"."Listing" SET "status" = 'DRAFT' WHERE "status" = 'DRAFT';
UPDATE "public"."Listing" SET "status" = 'ACTIVE' WHERE "status" IN ('PUBLISHED', 'RESERVED', 'RENTED', 'SWAPPED', 'COMPLETED');
UPDATE "public"."Listing" SET "status" = 'PAUSED' WHERE "status" = 'EXPIRED';
UPDATE "public"."Listing" SET "status" = 'ARCHIVED' WHERE "status" = 'ARCHIVED';
UPDATE "public"."Listing" SET "status" = 'FLAGGED' WHERE "status" IN ('PENDING_REVIEW', 'REJECTED');

ALTER TABLE "public"."Listing" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Listing" ALTER COLUMN "status" TYPE "public"."ListingStatus_rollback" USING ("status"::text::"public"."ListingStatus_rollback");
ALTER TYPE "public"."ListingStatus" RENAME TO "ListingStatus_a5";
ALTER TYPE "public"."ListingStatus_rollback" RENAME TO "ListingStatus";
DROP TYPE "public"."ListingStatus_a5";
ALTER TABLE "public"."Listing" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- Roll back required references safely.
ALTER TABLE "public"."Review" DROP CONSTRAINT IF EXISTS "Review_listingId_fkey";
ALTER TABLE "public"."Review" DROP COLUMN IF EXISTS "listingId";

-- Drop A5-only tables.
DROP TABLE IF EXISTS "public"."RateLimitEvent";
DROP TABLE IF EXISTS "public"."SuspiciousUserSignal";
DROP TABLE IF EXISTS "public"."DuplicateListingSignal";
DROP TABLE IF EXISTS "public"."FraudReport";
DROP TABLE IF EXISTS "public"."RecentlyViewed";
DROP TABLE IF EXISTS "public"."SavedSearch";
DROP TABLE IF EXISTS "public"."SavedListing";
DROP TABLE IF EXISTS "public"."Favorite";
DROP TABLE IF EXISTS "public"."Booking";
DROP TABLE IF EXISTS "public"."AvailabilityDate";
DROP TABLE IF EXISTS "public"."AvailabilityRule";
