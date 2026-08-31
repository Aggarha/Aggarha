import { emailLayout } from "@/lib/email/templates/layout";
import { escapeHtml } from "@/lib/email/escape";

export function bookingApprovedEmail(params: {
  listingTitle: string;
  ownerName: string;
  viewUrl: string;
}): { subject: string; html: string } {
  const listingTitle = escapeHtml(params.listingTitle);
  const ownerName = escapeHtml(params.ownerName);
  return {
    subject: `Your request for "${params.listingTitle}" was accepted`,
    html: emailLayout(`
      <p>Good news!</p>
      <p><strong>${ownerName}</strong> accepted your request for <strong>${listingTitle}</strong>.</p>
      <p><a href="${params.viewUrl}" style="color:#2563eb;">View booking</a></p>
    `)
  };
}
