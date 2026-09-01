import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { resend } from "@/lib/email/client";
import { bookingRequestedEmail } from "@/lib/email/templates/booking-requested";
import { bookingApprovedEmail } from "@/lib/email/templates/booking-approved";
import { bookingRejectedEmail } from "@/lib/email/templates/booking-rejected";

async function safeSend(subject: string, html: string, to: string | null): Promise<void> {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set, skipping send: "${subject}"`);
    return;
  }
  if (!to) {
    console.warn(`[email] recipient has no email on file, skipping send: "${subject}"`);
    return;
  }
  try {
    const { data, error } = await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html });
    if (error) {
      console.error(`[email] Resend rejected "${subject}"`, error);
      return;
    }
    console.log(`[email] sent "${subject}" to ${to} (id: ${data?.id})`);
  } catch (err) {
    console.error(`[email] failed to send "${subject}"`, err);
  }
}

export async function sendBookingRequestedEmail(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      listing: { select: { id: true, title: true, imageUrl: true } },
      owner: { select: { email: true } },
      requester: { select: { profile: { select: { displayName: true } } } }
    }
  });
  if (!booking) return;

  const { subject, html } = bookingRequestedEmail({
    listingTitle: booking.listing.title,
    listingImageUrl: booking.listing.imageUrl,
    requesterName: booking.requester.profile?.displayName ?? "A member",
    mode: booking.mode === "SWAP" ? "SWAP" : "RENT",
    startDate: booking.startDate,
    endDate: booking.endDate,
    message: booking.requesterMessage,
    viewUrl: `${env.APP_URL}/marketplace/${booking.listing.id}`
  });
  await safeSend(subject, html, booking.owner.email);
}

export async function sendBookingApprovedEmail(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      listing: { select: { id: true, title: true, imageUrl: true } },
      requester: { select: { email: true } },
      owner: { select: { profile: { select: { displayName: true } } } }
    }
  });
  if (!booking) return;

  const { subject, html } = bookingApprovedEmail({
    listingTitle: booking.listing.title,
    listingImageUrl: booking.listing.imageUrl,
    ownerName: booking.owner.profile?.displayName ?? "The owner",
    viewUrl: `${env.APP_URL}/marketplace/${booking.listing.id}`
  });
  await safeSend(subject, html, booking.requester.email);
}

export async function sendBookingRejectedEmail(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      listing: { select: { id: true, title: true, imageUrl: true } },
      requester: { select: { email: true } }
    }
  });
  if (!booking) return;

  const { subject, html } = bookingRejectedEmail({
    listingTitle: booking.listing.title,
    listingImageUrl: booking.listing.imageUrl,
    viewUrl: `${env.APP_URL}/marketplace/${booking.listing.id}`
  });
  await safeSend(subject, html, booking.requester.email);
}
