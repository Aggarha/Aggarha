import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditProfileProvider } from "@/components/profile/edit-profile-provider";
import {
  AvatarEditButton,
  BioEditButton,
  EditProfileButton
} from "@/components/profile/edit-profile-triggers";
import { FollowButton } from "@/components/profile/follow-button";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileListingGrid } from "@/components/profile/profile-listing-grid";
import { ProfileTabs, type ProfileTabKey } from "@/components/profile/profile-tabs";
import { getOptionalSession } from "@/lib/auth/session";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import {
  getProfileByHandle,
  getProfileListings,
  getViewerFavorites,
  getViewerSavedListings
} from "@/lib/profile/query";
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

  // Liked and Saved are the viewer's own lists, so they are only fetched — and
  // only shown — on the viewer's own profile. What someone hearted is private.
  const [listings, favorites, saved] = await Promise.all([
    getProfileListings(profile.userId, profile.isSelf),
    profile.isSelf ? getViewerFavorites(profile.userId) : Promise.resolve([]),
    profile.isSelf ? getViewerSavedListings(profile.userId) : Promise.resolve([])
  ]);

  const listingsGrid = (
    <ProfileListingGrid
      listings={listings.map(profileListingCardData)}
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
  );

  const tabs: Array<{ key: ProfileTabKey; label: string; count: number | null }> = [
    { key: "listings", label: t.profile.tabListings, count: profile.listingCount },
    { key: "liked", label: t.profile.tabLiked, count: favorites.length },
    { key: "saved", label: t.profile.tabSaved, count: saved.length }
  ];

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16"
    >
      <EditProfileProvider
        copy={{
          editProfile: t.profile.editProfile,
          editAvatar: t.profile.editAvatar,
          removePhoto: t.profile.removePhoto,
          displayNameLabel: t.profile.displayNameLabel,
          bioLabel: t.profile.bioLabel,
          cityLabel: t.profile.cityLabel,
          save: t.profile.save,
          saving: t.profile.saving,
          cancel: t.profile.cancel,
          uploadFailed: t.profile.uploadFailed
        }}
        initial={
          profile.isSelf
            ? {
                displayName: profile.displayName,
                bio: profile.bio ?? "",
                city: profile.city ?? "",
                avatarUrl: profile.avatarUrl
              }
            : null
        }
      >
        <ProfileHeader
          profile={profile}
          t={t}
          lang={locale}
          avatarSlot={profile.isSelf ? <AvatarEditButton label={t.profile.editAvatar} /> : null}
          bioSlot={
            profile.isSelf ? (
              <BioEditButton bio={profile.bio ?? ""} addLabel={t.profile.addBio} />
            ) : profile.bio ? (
              <p className="text-sm leading-relaxed text-white/72">{profile.bio}</p>
            ) : null
          }
          actionsSlot={
            profile.isSelf ? (
              <EditProfileButton label={t.profile.editProfile} />
            ) : (
              <div className="flex items-center gap-2">
                <FollowButton
                  targetUserId={profile.userId}
                  initialFollowing={profile.isFollowing}
                  followLabel={t.profile.follow}
                  followingLabel={t.profile.unfollow}
                />
                {/* Chat is out of scope, so Message stays the same disabled
                    stub the listing detail page already uses. */}
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title={t.nav.comingSoon}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-2xl border border-white/12 px-5 text-sm font-semibold text-white/40"
                >
                  {t.profile.message}
                </button>
              </div>
            )
          }
        />
      </EditProfileProvider>

      {profile.isSelf ? (
        <ProfileTabs
          tabs={tabs}
          panels={{
            listings: listingsGrid,
            liked: (
              <ProfileListingGrid
                listings={favorites.map(profileListingCardData)}
                lang={locale}
                emptyTitle={t.profile.likedEmpty}
                emptyDescription={t.profile.likedEmptyHint}
                emptyAction={
                  <Link
                    href={"/marketplace" as Route}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] px-5 text-sm font-semibold text-white transition-all duration-200 ease-[var(--ease-premium)] hover:bg-white/10 active:scale-[0.97]"
                  >
                    {t.common.browseMarketplace}
                  </Link>
                }
              />
            ),
            saved: (
              <ProfileListingGrid
                listings={saved.map(profileListingCardData)}
                lang={locale}
                emptyTitle={t.profile.savedEmpty}
                emptyDescription={t.profile.savedEmptyHint}
                emptyAction={
                  <Link
                    href={"/marketplace" as Route}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] px-5 text-sm font-semibold text-white transition-all duration-200 ease-[var(--ease-premium)] hover:bg-white/10 active:scale-[0.97]"
                  >
                    {t.common.browseMarketplace}
                  </Link>
                }
              />
            )
          }}
        />
      ) : (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-white/70">
            {t.profile.tabListings} · {t.profile.listingsCount(profile.listingCount)}
          </h2>
          {listingsGrid}
        </section>
      )}
    </div>
  );
}
