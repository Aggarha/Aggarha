-- A5 manual safe migration
-- Strategy:
-- 1) Additive schema changes first (nullable/defaulted)
-- 2) Backfill legacy data
-- 3) Enforce NOT NULL and final enum model
-- 4) Drop legacy fields/indexes last

-- =========================================================
-- ENUMS: additive first
-- =========================================================
CREATE TYPE "public"."ListingVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'HIDDEN', 'FEATURED', 'BOOSTED');
CREATE TYPE "public"."BookingStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'CANCELED', 'COMPLETED', 'EXPIRED');
CREATE TYPE "public"."AvailabilityDateStatus" AS ENUM ('AVAILABLE', 'BLOCKED', 'RESERVED');
CREATE TYPE "public"."FraudReportStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'CONFIRMED', 'DISMISSED');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'VerificationLevel' AND e.enumlabel = 'BUSINESS_VERIFIED'
  ) THEN
    ALTER TYPE "public"."VerificationLevel" ADD VALUE 'BUSINESS_VERIFIED';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'VerificationLevel' AND e.enumlabel = 'PROFESSIONAL_SELLER'
  ) THEN
    ALTER TYPE "public"."VerificationLevel" ADD VALUE 'PROFESSIONAL_SELLER';
  END IF;
END $$;


-- =========================================================
-- ADD COLUMNS (nullable/defaulted first)
-- =========================================================
ALTER TABLE "public"."Location"
  ADD COLUMN IF NOT EXISTS "governorate" TEXT,
  ADD COLUMN IF NOT EXISTS "district" TEXT,
  ADD COLUMN IF NOT EXISTS "searchRadiusKm" INTEGER DEFAULT 10;

ALTER TABLE "public"."Review"
  ADD COLUMN IF NOT EXISTS "listingId" TEXT;

ALTER TABLE "public"."Listing"
  ADD COLUMN IF NOT EXISTS "boostedUntil" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "cooldownDays" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "imageUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "maxRentalDays" INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS "minRentalDays" INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "preparationDays" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "visibility" "public"."ListingVisibility" NOT NULL DEFAULT 'PUBLIC';

ALTER TABLE "public"."User"
  ADD COLUMN IF NOT EXISTS "accountAgeDays" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "aiFraudScore" DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS "businessVerifiedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "cancellationRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "fraudReportsCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "professionalSellerVerifiedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "responseRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "responseSpeedMinutes" INTEGER NOT NULL DEFAULT 0;

-- =========================================================
-- BACKFILL EXISTING DATA SAFELY
-- =========================================================
-- 1) Review.listingId from Deal relation
UPDATE "public"."Review" r
SET "listingId" = d."listingId"
FROM "public"."Deal" d
WHERE r."dealId" = d."id"
  AND r."listingId" IS NULL;

-- 2) Legacy Location.state -> governorate
UPDATE "public"."Location"
SET "governorate" = COALESCE("governorate", "state", "city", 'Unknown')
WHERE "governorate" IS NULL;

-- 4) Ensure every Review row has listingId; if not, attach to safe placeholder listing
INSERT INTO "public"."User" ("id", "email", "role", "verificationLevel", "trustScore", "trustTier", "xp", "level", "isBanned", "createdAt", "updatedAt")
VALUES ('sys_user_legacy_migration', 'system.legacy@aggarha.local', 'ADMIN', 'EMAIL_VERIFIED', 100, 4, 0, 1, false, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "public"."Category" ("id", "slug", "name", "description", "createdAt", "updatedAt")
VALUES ('sys_category_legacy_migration', 'legacy-data', 'Legacy Data', 'System fallback category for migrated legacy records.', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "public"."Location" ("id", "country", "governorate", "city", "district", "searchRadiusKm", "formattedAddress", "createdAt", "updatedAt")
VALUES ('sys_location_legacy_migration', 'Egypt', 'Cairo', 'Cairo', 'Legacy', 10, 'Legacy placeholder location, Cairo, Egypt', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "public"."Listing" (
  "id", "ownerId", "categoryId", "locationId", "title", "description", "mode", "status", "visibility", "quantity",
  "minRentalDays", "maxRentalDays", "preparationDays", "cooldownDays", "viewCount", "createdAt", "updatedAt"
)
VALUES (
  'sys_listing_legacy_migration', 'sys_user_legacy_migration', 'sys_category_legacy_migration', 'sys_location_legacy_migration',
  'Legacy Migrated Listing', 'Auto-generated placeholder to preserve legacy review integrity during migration.',
  'BOTH', 'DRAFT', 'HIDDEN', 1,
  1, 30, 0, 0, 0, NOW(), NOW()
)
ON CONFLICT ("id") DO NOTHING;

UPDATE "public"."Review"
SET "listingId" = 'sys_listing_legacy_migration'
WHERE "listingId" IS NULL;

-- =========================================================
-- ENFORCE CONSTRAINTS ONLY AFTER BACKFILL
-- =========================================================
ALTER TABLE "public"."Review"
  ALTER COLUMN "listingId" SET NOT NULL;

ALTER TABLE "public"."Location"
  ALTER COLUMN "governorate" SET NOT NULL;

-- =========================================================
-- FINALIZE LISTING STATUS ENUM (remove legacy values last)
-- =========================================================
CREATE TYPE "public"."ListingStatus_new" AS ENUM (
  'DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'RESERVED', 'RENTED', 'SWAPPED', 'COMPLETED', 'EXPIRED', 'ARCHIVED', 'REJECTED'
);

ALTER TABLE "public"."Listing" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Listing"
  ALTER COLUMN "status" TYPE "public"."ListingStatus_new"
  USING (
    CASE
      WHEN "status"::text = 'ACTIVE' THEN 'PUBLISHED'
      WHEN "status"::text = 'PAUSED' THEN 'ARCHIVED'
      WHEN "status"::text = 'FLAGGED' THEN 'REJECTED'
      ELSE "status"::text
    END::"public"."ListingStatus_new"
  );

ALTER TYPE "public"."ListingStatus" RENAME TO "ListingStatus_old";
ALTER TYPE "public"."ListingStatus_new" RENAME TO "ListingStatus";
DROP TYPE "public"."ListingStatus_old";
ALTER TABLE "public"."Listing" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- =========================================================
-- CREATE NEW TABLES
-- =========================================================
CREATE TABLE IF NOT EXISTS "public"."AvailabilityRule" (
  "id" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "dayOfWeek" INTEGER NOT NULL,
  "startHour" INTEGER NOT NULL,
  "endHour" INTEGER NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "isRecurring" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AvailabilityRule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."AvailabilityDate" (
  "id" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "status" "public"."AvailabilityDateStatus" NOT NULL DEFAULT 'AVAILABLE',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AvailabilityDate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."Booking" (
  "id" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "requesterId" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "status" "public"."BookingStatus" NOT NULL DEFAULT 'REQUESTED',
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "totalDays" INTEGER NOT NULL,
  "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "approvedAt" TIMESTAMP(3),
  "rejectedAt" TIMESTAMP(3),
  "canceledAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "ownerMessage" TEXT,
  "requesterMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."Favorite" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."SavedListing" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SavedListing_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."SavedSearch" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "keyword" TEXT,
  "categorySlug" TEXT,
  "governorate" TEXT,
  "city" TEXT,
  "district" TEXT,
  "radiusKm" INTEGER,
  "minPrice" DECIMAL(12,2),
  "maxPrice" DECIMAL(12,2),
  "mode" "public"."ListingMode",
  "verifiedOnly" BOOLEAN NOT NULL DEFAULT false,
  "minTrustScore" DECIMAL(5,2),
  "minLevel" INTEGER,
  "sortBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."RecentlyViewed" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RecentlyViewed_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."FraudReport" (
  "id" TEXT NOT NULL,
  "reporterId" TEXT NOT NULL,
  "targetUserId" TEXT,
  "listingId" TEXT,
  "reason" TEXT NOT NULL,
  "details" TEXT,
  "status" "public"."FraudReportStatus" NOT NULL DEFAULT 'OPEN',
  "aiScore" DECIMAL(5,2),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FraudReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."DuplicateListingSignal" (
  "id" TEXT NOT NULL,
  "primaryListingId" TEXT NOT NULL,
  "suspectedListingId" TEXT NOT NULL,
  "similarityScore" DECIMAL(5,2) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DuplicateListingSignal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."SuspiciousUserSignal" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "signalType" TEXT NOT NULL,
  "severity" INTEGER NOT NULL DEFAULT 1,
  "score" DECIMAL(5,2),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SuspiciousUserSignal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."RateLimitEvent" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "ipAddress" TEXT NOT NULL,
  "route" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RateLimitEvent_pkey" PRIMARY KEY ("id")
);

-- =========================================================
-- INDEXES
-- =========================================================
DROP INDEX IF EXISTS "public"."Listing_status_mode_idx";
DROP INDEX IF EXISTS "public"."Location_city_country_idx";

CREATE INDEX IF NOT EXISTS "AvailabilityRule_listingId_dayOfWeek_idx" ON "public"."AvailabilityRule"("listingId", "dayOfWeek");
CREATE INDEX IF NOT EXISTS "AvailabilityDate_listingId_status_idx" ON "public"."AvailabilityDate"("listingId", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "AvailabilityDate_listingId_date_key" ON "public"."AvailabilityDate"("listingId", "date");
CREATE INDEX IF NOT EXISTS "Booking_listingId_status_idx" ON "public"."Booking"("listingId", "status");
CREATE INDEX IF NOT EXISTS "Booking_requesterId_startDate_idx" ON "public"."Booking"("requesterId", "startDate");
CREATE INDEX IF NOT EXISTS "Booking_ownerId_startDate_idx" ON "public"."Booking"("ownerId", "startDate");
CREATE INDEX IF NOT EXISTS "Favorite_listingId_idx" ON "public"."Favorite"("listingId");
CREATE UNIQUE INDEX IF NOT EXISTS "Favorite_userId_listingId_key" ON "public"."Favorite"("userId", "listingId");
CREATE INDEX IF NOT EXISTS "SavedListing_listingId_idx" ON "public"."SavedListing"("listingId");
CREATE UNIQUE INDEX IF NOT EXISTS "SavedListing_userId_listingId_key" ON "public"."SavedListing"("userId", "listingId");
CREATE INDEX IF NOT EXISTS "SavedSearch_userId_idx" ON "public"."SavedSearch"("userId");
CREATE INDEX IF NOT EXISTS "RecentlyViewed_viewedAt_idx" ON "public"."RecentlyViewed"("viewedAt");
CREATE UNIQUE INDEX IF NOT EXISTS "RecentlyViewed_userId_listingId_key" ON "public"."RecentlyViewed"("userId", "listingId");
CREATE INDEX IF NOT EXISTS "FraudReport_status_idx" ON "public"."FraudReport"("status");
CREATE INDEX IF NOT EXISTS "FraudReport_targetUserId_idx" ON "public"."FraudReport"("targetUserId");
CREATE INDEX IF NOT EXISTS "FraudReport_listingId_idx" ON "public"."FraudReport"("listingId");
CREATE UNIQUE INDEX IF NOT EXISTS "DuplicateListingSignal_primaryListingId_suspectedListingId_key" ON "public"."DuplicateListingSignal"("primaryListingId", "suspectedListingId");
CREATE INDEX IF NOT EXISTS "SuspiciousUserSignal_userId_idx" ON "public"."SuspiciousUserSignal"("userId");
CREATE INDEX IF NOT EXISTS "SuspiciousUserSignal_signalType_idx" ON "public"."SuspiciousUserSignal"("signalType");
CREATE INDEX IF NOT EXISTS "RateLimitEvent_ipAddress_route_idx" ON "public"."RateLimitEvent"("ipAddress", "route");
CREATE INDEX IF NOT EXISTS "RateLimitEvent_createdAt_idx" ON "public"."RateLimitEvent"("createdAt");
CREATE INDEX IF NOT EXISTS "Listing_status_mode_visibility_idx" ON "public"."Listing"("status", "mode", "visibility");
CREATE INDEX IF NOT EXISTS "Listing_viewCount_idx" ON "public"."Listing"("viewCount");
CREATE INDEX IF NOT EXISTS "Location_country_governorate_city_idx" ON "public"."Location"("country", "governorate", "city");
CREATE INDEX IF NOT EXISTS "Review_listingId_idx" ON "public"."Review"("listingId");

-- =========================================================
-- FOREIGN KEYS
-- =========================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Review_listingId_fkey') THEN
    ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AvailabilityRule_listingId_fkey') THEN ALTER TABLE "public"."AvailabilityRule" ADD CONSTRAINT "AvailabilityRule_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AvailabilityDate_listingId_fkey') THEN ALTER TABLE "public"."AvailabilityDate" ADD CONSTRAINT "AvailabilityDate_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Booking_listingId_fkey') THEN ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Booking_requesterId_fkey') THEN ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Booking_ownerId_fkey') THEN ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Favorite_userId_fkey') THEN ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Favorite_listingId_fkey') THEN ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SavedListing_userId_fkey') THEN ALTER TABLE "public"."SavedListing" ADD CONSTRAINT "SavedListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SavedListing_listingId_fkey') THEN ALTER TABLE "public"."SavedListing" ADD CONSTRAINT "SavedListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SavedSearch_userId_fkey') THEN ALTER TABLE "public"."SavedSearch" ADD CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RecentlyViewed_userId_fkey') THEN ALTER TABLE "public"."RecentlyViewed" ADD CONSTRAINT "RecentlyViewed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RecentlyViewed_listingId_fkey') THEN ALTER TABLE "public"."RecentlyViewed" ADD CONSTRAINT "RecentlyViewed_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FraudReport_reporterId_fkey') THEN ALTER TABLE "public"."FraudReport" ADD CONSTRAINT "FraudReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FraudReport_targetUserId_fkey') THEN ALTER TABLE "public"."FraudReport" ADD CONSTRAINT "FraudReport_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FraudReport_listingId_fkey') THEN ALTER TABLE "public"."FraudReport" ADD CONSTRAINT "FraudReport_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DuplicateListingSignal_primaryListingId_fkey') THEN ALTER TABLE "public"."DuplicateListingSignal" ADD CONSTRAINT "DuplicateListingSignal_primaryListingId_fkey" FOREIGN KEY ("primaryListingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DuplicateListingSignal_suspectedListingId_fkey') THEN ALTER TABLE "public"."DuplicateListingSignal" ADD CONSTRAINT "DuplicateListingSignal_suspectedListingId_fkey" FOREIGN KEY ("suspectedListingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SuspiciousUserSignal_userId_fkey') THEN ALTER TABLE "public"."SuspiciousUserSignal" ADD CONSTRAINT "SuspiciousUserSignal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RateLimitEvent_userId_fkey') THEN ALTER TABLE "public"."RateLimitEvent" ADD CONSTRAINT "RateLimitEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;

-- =========================================================
-- DROP LEGACY COLUMNS LAST
-- =========================================================
ALTER TABLE "public"."Location" DROP COLUMN IF EXISTS "state";
