-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "currencyCode" VARCHAR(3),
ADD COLUMN     "dailyPrice" DECIMAL(12,2);

-- Backfill: snapshot each existing booking's daily price from its listing as it stands
-- today (low end of the range, falling back to the legacy single price), so later
-- listing price edits no longer rewrite booking history.
UPDATE "Booking" AS b
SET "dailyPrice" = COALESCE(l."minPrice", l."priceAmount"),
    "currencyCode" = COALESCE(l."currencyCode", 'EGP')
FROM "Listing" AS l
WHERE b."listingId" = l."id"
  AND COALESCE(l."minPrice", l."priceAmount") IS NOT NULL;
