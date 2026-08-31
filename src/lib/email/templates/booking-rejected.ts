import { emailLayout } from "@/lib/email/templates/layout";
import { escapeHtml } from "@/lib/email/escape";

export function bookingRejectedEmail(params: {
  listingTitle: string;
  viewUrl: string;
}): { subject: string; html: string } {
  const listingTitle = escapeHtml(params.listingTitle);
  return {
    subject: `Your request for "${params.listingTitle}" was declined`,
    html: emailLayout(`
      <p>Your request for <strong>${listingTitle}</strong> was declined by the owner.</p>
      <p><a href="${params.viewUrl}" style="color:#2563eb;">Browse other listings</a></p>
    `)
  };
}
