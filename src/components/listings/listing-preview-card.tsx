import Image from "next/image";
import { ListingModeBadge } from "@/components/marketplace/listing-mode-badge";
import { buildCategoryImageUrl } from "@/lib/marketplace/demo-content";
import { formatPrice } from "@/lib/marketplace/format";
import type { Locale } from "@/lib/i18n/types";

const COPY = {
  en: { untitled: "Your listing title", noCity: "City", photos: (n: number) => `${n}/4 photos` },
  ar: { untitled: "عنوان إعلانك", noCity: "المدينة", photos: (n: number) => `${n}/4 صور` }
};

export function ListingPreviewCard({
  title,
  categorySlug,
  mode,
  priceAmount,
  city,
  photoCount,
  lang = "en"
}: {
  title: string;
  categorySlug: string | null;
  mode: "RENT" | "SWAP" | "BOTH";
  priceAmount: number | null;
  city: string;
  photoCount: number;
  lang?: Locale;
}) {
  const isRtl = lang === "ar";
  const copy = COPY[lang];
  const image = categorySlug ? buildCategoryImageUrl(categorySlug) : buildCategoryImageUrl("");

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="pointer-events-none block overflow-hidden rounded-3xl border border-white/[0.07] bg-[#171717] shadow-panel"
    >
      <div className="relative h-56 w-full overflow-hidden bg-neutral-900">
        <Image
          src={image}
          alt={title || copy.untitled}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 25vw"
        />
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white/70">
            {copy.photos(photoCount)}
          </span>
        </div>
      </div>

      <div className="space-y-1 p-3.5">
        <div className={isRtl ? "flex justify-end" : "flex justify-start"}>
          <ListingModeBadge mode={mode} lang={lang} />
        </div>
        <h3 className={`line-clamp-1 ${isRtl ? "text-right" : "text-left"} text-base font-bold leading-snug text-white`}>
          {title || copy.untitled}
        </h3>
        <p className="text-sm font-bold text-[#ccff00]">{formatPrice(priceAmount, "EGP", lang)}</p>
        <p className={`${isRtl ? "text-right" : "text-left"} truncate text-xs text-white/50`}>{city || copy.noCity}</p>
      </div>
    </div>
  );
}
