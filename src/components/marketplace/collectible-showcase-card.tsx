import Image from "next/image";
import { buildCollectibleImageUrl } from "@/lib/marketplace/demo-content";

type CollectibleShowcaseCardProps = {
  listingId: string;
  title: string;
  value: string;
  rarity: string;
};

export function CollectibleShowcaseCard({ listingId, title, value, rarity }: CollectibleShowcaseCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#d4af37]/20 bg-[#141210] transition-all duration-300 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-[#d4af37]/45 hover:shadow-[0_24px_48px_rgba(0,0,0,0.55)]">
      <div className="relative h-64 w-full overflow-hidden bg-neutral-900">
        <Image
          src={buildCollectibleImageUrl(listingId)}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 ease-[var(--ease-premium)] group-hover:scale-[1.045]"
          sizes="(max-width: 1024px) 100vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full border border-[#d4af37]/45 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-[#e8c76b] backdrop-blur">
            {rarity}
          </span>
        </div>
      </div>
      <div className="space-y-1.5 p-4">
        <p className="line-clamp-1 text-base font-bold leading-snug text-white">{title}</p>
        <p className="text-sm font-bold text-[#e8c76b]">{value}</p>
      </div>
    </article>
  );
}
