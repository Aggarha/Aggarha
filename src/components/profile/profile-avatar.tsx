import Image from "next/image";
import { cn } from "@/lib/cn";
import { buildInitials } from "@/lib/profile/identity";

/**
 * Initials rather than a generic silhouette when there's no photo: a profile
 * with no avatar should still look like a specific person's page, and the
 * silhouette in SellerMiniCard reads as "no data" at this size.
 */
export function ProfileAvatar({
  name,
  avatarUrl,
  className,
  priority = false
}: {
  name: string;
  avatarUrl: string | null;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-[#242424]",
        className
      )}
    >
      {avatarUrl ? (
        <Image src={avatarUrl} alt={name} fill unoptimized priority={priority} className="object-cover" sizes="120px" />
      ) : (
        <span
          aria-hidden="true"
          className="font-[family-name:var(--font-space-grotesk)] text-[1.6em] font-black leading-none tracking-tight text-white/70"
        >
          {buildInitials(name)}
        </span>
      )}
    </span>
  );
}
