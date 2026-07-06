import Image from "next/image";
import Link from "next/link";
import { formatPrice, listingStatusLabel, listingVisibilityLabel } from "@/lib/marketplace/format";
import { ListingModeBadge } from "@/components/marketplace/listing-mode-badge";
import { VerificationBadge } from "@/components/marketplace/verification-badge";

type ListingCardProps = {
  id: string;
  title: string;
  description: string;
  mode: "RENT" | "SWAP" | "BOTH";
  status: string;
  visibility: string;
  imageUrl: string | null;
  priceAmount: number | null;
  currencyCode: string | null;
  city: string;
  governorate: string;
  trustScore: number;
  level: number;
  verificationLevel: string;
  viewCount: number;
};

export function ListingCard(props: ListingCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-panel">
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <Image
          src={props.imageUrl ?? "https://picsum.photos/seed/aggarha-fallback/960/640"}
          alt={props.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 25vw"
          unoptimized
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <ListingModeBadge mode={props.mode} />
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            {listingVisibilityLabel(props.visibility as never)}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-base font-bold text-slate-900">{props.title}</h3>
          <p className="line-clamp-2 text-sm text-slate-600">{props.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-1">{props.city}, {props.governorate}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1">{listingStatusLabel(props.status as never)}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1">{props.viewCount} views</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-900">{formatPrice(props.priceAmount, props.currencyCode ?? "EGP")}</p>
            <p className="text-xs text-slate-500">Trust {props.trustScore.toFixed(1)} · Level {props.level}</p>
          </div>
          <VerificationBadge level={props.verificationLevel} />
        </div>

        <Link
          href={`/marketplace/${props.id}` as import("next").Route}
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          View Listing
        </Link>
      </div>
    </article>
  );
}
