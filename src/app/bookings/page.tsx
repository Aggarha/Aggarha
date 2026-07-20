import { BookingStatusDemo } from "@/components/bookings/booking-status-demo";
import { requireSession } from "@/lib/auth/session";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";

export default async function BookingsPage() {
  await requireSession();
  const { locale } = await getLocaleAndDictionary();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <BookingStatusDemo lang={locale} />
    </div>
  );
}
