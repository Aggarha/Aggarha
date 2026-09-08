import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PremiumCard } from "@/components/premium/system";
import { requireSession } from "@/lib/auth/session";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { prisma } from "@/lib/db";

const COPY = {
  en: {
    title: "Listing published!",
    hint: "Your listing is live and ready for renters and swappers to find.",
    viewListing: "View listing",
    addAnother: "Add another listing"
  },
  ar: {
    title: "تم نشر الإعلان!",
    hint: "إعلانك أصبح متاحًا الآن ويمكن للمستأجرين والمتبادلين رؤيته.",
    viewListing: "عرض الإعلان",
    addAnother: "أضف إعلانًا آخر"
  }
};

export default async function ListingPublishedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [, { locale }] = await Promise.all([requireSession(), getLocaleAndDictionary()]);
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { id: true, title: true, imageUrl: true }
  });

  if (!listing) {
    notFound();
  }

  const copy = COPY[locale];
  const isRtl = locale === "ar";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6">
      <PremiumCard className="space-y-6 bg-[#171717] text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#ccff00]/40 bg-[#ccff00]/10 text-3xl">
          🎉
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-white">{copy.title}</h1>
          <p className="text-sm text-white/55">{copy.hint}</p>
        </div>

        {listing.imageUrl ? (
          <div className="relative mx-auto h-40 w-full overflow-hidden rounded-2xl border border-white/[0.08]">
            <Image src={listing.imageUrl} alt={listing.title} fill className="object-cover" sizes="100vw" unoptimized />
          </div>
        ) : null}

        <p className="line-clamp-1 text-base font-semibold text-white">{listing.title}</p>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href={`/marketplace/${listing.id}` as Route}
            className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-white/10 bg-[#ccff00] px-4 py-2.5 text-sm font-semibold text-black transition-all duration-200 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-[#deff57]"
          >
            {copy.viewListing}
          </Link>
          <Link
            href={"/listings/new" as Route}
            className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-white/10 bg-[#1b1b1b] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-[#202020]"
          >
            {copy.addAnother}
          </Link>
        </div>
      </PremiumCard>
    </div>
  );
}
