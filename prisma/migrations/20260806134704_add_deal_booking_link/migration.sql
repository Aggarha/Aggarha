-- AlterTable
ALTER TABLE "public"."Deal" ADD COLUMN     "bookingId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Deal_bookingId_key" ON "public"."Deal"("bookingId");

-- AddForeignKey
ALTER TABLE "public"."Deal" ADD CONSTRAINT "Deal_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
