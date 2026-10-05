import { SectionHeader, StatsCard } from "@/components/premium/system";
import { requireAdminSession } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/i18n/get-locale";
import type { Locale } from "@/lib/i18n/types";

const COPY = {
  en: {
    eyebrow: "Overview",
    title: "Dashboard",
    subtitle: "Live platform numbers at a glance.",
    users: "Users",
    activeListings: "Active listings",
    activeListingsNote: "Published, reserved, or rented",
    bookings: "Bookings",
    reviews: "Reviews",
    openReports: "Open reports",
    openReportsNote: "Fraud reports awaiting review"
  },
  ar: {
    eyebrow: "نظرة عامة",
    title: "لوحة التحكم",
    subtitle: "أرقام المنصة الحالية في لمحة.",
    users: "المستخدمون",
    activeListings: "الإعلانات النشطة",
    activeListingsNote: "منشورة أو محجوزة أو مؤجرة",
    bookings: "الحجوزات",
    reviews: "التقييمات",
    openReports: "البلاغات المفتوحة",
    openReportsNote: "بلاغات احتيال بانتظار المراجعة"
  }
};

const formatCount = (value: number, lang: Locale) =>
  new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US").format(value);

export default async function AdminHomePage() {
  await requireAdminSession();
  const locale = await getLocale();
  const copy = COPY[locale];

  const [users, activeListings, bookings, reviews, openReports] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count({ where: { status: { in: ["PUBLISHED", "RESERVED", "RENTED"] } } }),
    prisma.booking.count(),
    prisma.review.count(),
    prisma.fraudReport.count({ where: { status: "OPEN" } })
  ]);

  const stats = [
    { label: copy.users, value: users },
    { label: copy.activeListings, value: activeListings, note: copy.activeListingsNote },
    { label: copy.bookings, value: bookings },
    { label: copy.reviews, value: reviews },
    { label: copy.openReports, value: openReports, note: copy.openReportsNote }
  ];

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} level={1} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard
            key={stat.label}
            label={stat.label}
            value={formatCount(stat.value, locale)}
            note={stat.note}
          />
        ))}
      </div>
    </div>
  );
}
