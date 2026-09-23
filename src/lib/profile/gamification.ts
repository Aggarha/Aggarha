import { BookingStatus, ListingStatus, VerificationLevel } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/i18n/types";

/** Six tiers of five, matching the design prototype's 30-level ladder. */
const LEVEL_TIERS: Array<{ max: number; en: string; ar: string }> = [
  { max: 5, en: "Starter", ar: "مبتدئ" },
  { max: 10, en: "Trusted", ar: "موثوق" },
  { max: 15, en: "Expert", ar: "خبير" },
  { max: 20, en: "Elite", ar: "نخبة" },
  { max: 25, en: "Legend", ar: "أسطورة" },
  { max: 30, en: "Icon", ar: "أيقونة" }
];

export const MAX_LEVEL = 30;

/**
 * Display rule, not an economy: there is no XP ledger yet, so the bar shows
 * where User.xp sits inside a flat 1000-point band. Level itself comes from
 * User.level — the same column the listing cards and OwnerCard already show,
 * so the profile can never disagree with them about what level someone is.
 * Replace both halves together when a real XP curve exists.
 */
const XP_PER_LEVEL = 1000;

export function levelTierName(level: number, lang: Locale): string {
  const tier = LEVEL_TIERS.find((entry) => level <= entry.max) ?? LEVEL_TIERS[LEVEL_TIERS.length - 1];
  return lang === "ar" ? tier.ar : tier.en;
}

export function buildLevelProgress(xp: number, level: number, lang: Locale) {
  const safeLevel = Math.min(Math.max(level, 1), MAX_LEVEL);
  const into = Math.max(0, Math.min(xp, Number.MAX_SAFE_INTEGER)) % XP_PER_LEVEL;
  return {
    level: safeLevel,
    maxLevel: MAX_LEVEL,
    tierName: levelTierName(safeLevel, lang),
    xpCurrent: into,
    xpTarget: XP_PER_LEVEL,
    percent: Math.round((into / XP_PER_LEVEL) * 100)
  };
}

export type AchievementKey =
  | "fastResponder"
  | "tenRentals"
  | "cleanHandover"
  | "fiveStar"
  | "verifiedId"
  | "swapper"
  | "fiftyRentals"
  | "topLister";

const ACHIEVEMENTS: Array<{ key: AchievementKey; icon: string; en: string; ar: string }> = [
  { key: "fastResponder", icon: "⚡", en: "Fast Responder", ar: "رد سريع" },
  { key: "tenRentals", icon: "📦", en: "10 Rentals", ar: "١٠ عمليات إيجار" },
  { key: "cleanHandover", icon: "🧾", en: "10 Problem-Free Handovers", ar: "١٠ تسليمات من غير أي مشاكل" },
  { key: "fiveStar", icon: "★", en: "5-Star Streak", ar: "تقييم ٥ نجوم" },
  { key: "verifiedId", icon: "🪪", en: "Verified ID", ar: "هوية موثّقة" },
  { key: "swapper", icon: "🔁", en: "Active Swapper", ar: "مبدّل نشط" },
  { key: "fiftyRentals", icon: "🎖️", en: "50 Rentals Milestone", ar: "٥٠ عملية إيجار" },
  { key: "topLister", icon: "🏆", en: "Top Lister", ar: "أفضل مؤجر" }
];

export type ProfileActivity = {
  completedAsOwner: number;
  completedSwaps: number;
  publishedListings: number;
  reviewCount: number;
  averageRating: number;
  fraudReportsCount: number;
  responseSpeedMinutes: number;
  hasVerifiedId: boolean;
  listingsMissingPhotos: number;
  staleRequests: number;
  unreviewedCompleted: number;
};

const AN_HOUR_AGO = () => new Date(Date.now() - 60 * 60 * 1000);

/**
 * One round-trip's worth of counts backing both the achievements and the
 * task list. Everything here is derived from rows that already exist — no
 * achievement or task table — so a badge can never claim something the
 * account's own history doesn't support.
 */
export async function getProfileActivity(userId: string): Promise<ProfileActivity> {
  const [
    user,
    completedAsOwner,
    completedSwaps,
    publishedListings,
    rating,
    listingsMissingPhotos,
    staleRequests,
    unreviewedCompleted
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { responseSpeedMinutes: true, fraudReportsCount: true, verificationLevel: true, idVerifiedAt: true }
    }),
    prisma.booking.count({ where: { ownerId: userId, status: BookingStatus.COMPLETED } }),
    prisma.booking.count({ where: { ownerId: userId, status: BookingStatus.COMPLETED, mode: "SWAP" } }),
    prisma.listing.count({ where: { ownerId: userId, status: ListingStatus.PUBLISHED } }),
    prisma.review.aggregate({
      where: { revieweeId: userId, isHidden: false },
      _avg: { rating: true },
      _count: { _all: true }
    }),
    prisma.listing.count({ where: { ownerId: userId, photos: { none: {} } } }),
    prisma.booking.count({
      where: { ownerId: userId, status: BookingStatus.REQUESTED, requestedAt: { lt: AN_HOUR_AGO() } }
    }),
    prisma.booking.count({
      where: {
        requesterId: userId,
        status: BookingStatus.COMPLETED,
        deal: { is: { reviews: { none: { reviewerId: userId } } } }
      }
    })
  ]);

  return {
    completedAsOwner,
    completedSwaps,
    publishedListings,
    reviewCount: rating._count._all,
    averageRating: Number(rating._avg.rating ?? 0),
    fraudReportsCount: user?.fraudReportsCount ?? 0,
    responseSpeedMinutes: user?.responseSpeedMinutes ?? 0,
    hasVerifiedId:
      user?.idVerifiedAt !== null && user?.idVerifiedAt !== undefined
        ? true
        : user?.verificationLevel === VerificationLevel.ID_VERIFIED ||
          user?.verificationLevel === VerificationLevel.BUSINESS_VERIFIED ||
          user?.verificationLevel === VerificationLevel.PROFESSIONAL_SELLER,
    listingsMissingPhotos,
    staleRequests,
    unreviewedCompleted
  };
}

export function buildAchievements(activity: ProfileActivity, lang: Locale) {
  const unlocked: Record<AchievementKey, boolean> = {
    fastResponder: activity.responseSpeedMinutes > 0 && activity.responseSpeedMinutes <= 60,
    tenRentals: activity.completedAsOwner >= 10,
    cleanHandover: activity.completedAsOwner >= 10 && activity.fraudReportsCount === 0,
    fiveStar: activity.reviewCount >= 3 && activity.averageRating >= 4.8,
    verifiedId: activity.hasVerifiedId,
    swapper: activity.completedSwaps >= 5,
    fiftyRentals: activity.completedAsOwner >= 50,
    topLister: activity.publishedListings >= 20
  };

  return ACHIEVEMENTS.map((entry) => ({
    key: entry.key,
    icon: entry.icon,
    label: lang === "ar" ? entry.ar : entry.en,
    unlocked: unlocked[entry.key]
  }));
}

const TASKS = [
  {
    key: "photo",
    en: "Add a fresh photo to an old listing",
    ar: "ضيف صورة جديدة لإعلان قديم",
    rewardEn: "+10% reach",
    rewardAr: "+10% ظهور"
  },
  {
    key: "respond",
    en: "Reply to a booking request within an hour",
    ar: "رد على طلب حجز خلال ساعة",
    rewardEn: "+15 XP",
    rewardAr: "+15 نقطة"
  },
  {
    key: "review",
    en: "Rate your last completed rental",
    ar: "قيّم آخر عملية إيجار خلصت",
    rewardEn: "+10 XP",
    rewardAr: "+10 نقطة"
  }
] as const;

/**
 * Done-ness is read back out of the account rather than stored, so a task
 * ticks itself the moment the underlying thing is true and un-ticks if it
 * stops being true. That makes the list an honest to-do rather than a set of
 * checkboxes someone could tick without doing anything.
 */
export function buildDailyTasks(activity: ProfileActivity, lang: Locale) {
  const done: Record<(typeof TASKS)[number]["key"], boolean> = {
    photo: activity.listingsMissingPhotos === 0,
    respond: activity.staleRequests === 0,
    review: activity.unreviewedCompleted === 0
  };

  return TASKS.map((task) => ({
    key: task.key,
    label: lang === "ar" ? task.ar : task.en,
    reward: lang === "ar" ? task.rewardAr : task.rewardEn,
    done: done[task.key]
  }));
}
