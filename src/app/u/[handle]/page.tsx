import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileListingGrid } from "@/components/profile/profile-listing-grid";
import { getOptionalSession } from "@/lib/auth/session";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { getProfileByHandle, getProfileListings } from "@/lib/profile/query";
import { profileListingCardData } from "@/lib/profile/serializers";

type ProfilePageProps = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle, null);
  if (!profile) {
    return { title: "Profile not found" };
  }
  return {
    title: `${profile.displayName} (@${profile.handle}) · Aggarha`,
    description: profile.bio ?? undefined
  };
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { handle } = await params;
  const [session, { locale, t }] = await Promise.all([getOptionalSession(), getLocaleAndDictionary()]);
  const profile = await getProfileByHandle(handle, session?.userId ?? null);

  if (!profile) {
    notFound();
  }

  const listings = await getProfileListings(profile.userId, profile.isSelf);
  const cards = listings.map(profileListingCardData);

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16"
    >
      <ProfileHeader
        profile={profile}
        t={t}
        lang={locale}
        bioSlot={
          profile.bio ? (
            <p className="text-sm leading-relaxed text-white/72">{profile.bio}</p>
          ) : null
        }
      />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-white/70">
          {t.profile.tabListings} · {t.profile.listingsCount(profile.listingCount)}
        </h2>
        <ProfileListingGrid
          listings={cards}
          lang={locale}
          emptyTitle={profile.isSelf ? t.profile.listingsEmptyOwn : t.profile.listingsEmptyOther(profile.displayName)}
          emptyDescription={profile.isSelf ? t.profile.listingsEmptyOwnHint : t.profile.listingsEmptyOtherHint}
          emptyAction={
            profile.isSelf ? (
              <Link
                href={"/listings/new" as Route}
                className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-[#ccff00] px-5 text-sm font-bold text-black transition-all duration-200 ease-[var(--ease-premium)] hover:bg-[#deff57] active:scale-[0.97]"
              >
                {t.myListings.listItem}
              </Link>
            ) : null
          }
        />
      </section>
    </div>
  );
}
