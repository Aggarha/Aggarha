import { emailLayout } from "@/lib/email/templates/layout";

export function bookingRejectedEmail(params: {
  listingTitle: string;
  viewUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `Your request for "${params.listingTitle}" was declined`,
    html: emailLayout(`
      <p>Your request for <strong>${params.listingTitle}</strong> was declined by the owner.</p>
      <p><a href="${params.viewUrl}" style="color:#2563eb;">Browse other listings</a></p>
    `)
  };
}
