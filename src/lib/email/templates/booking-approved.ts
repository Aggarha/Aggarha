import { emailLayout } from "@/lib/email/templates/layout";

export function bookingApprovedEmail(params: {
  listingTitle: string;
  ownerName: string;
  viewUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `Your request for "${params.listingTitle}" was accepted`,
    html: emailLayout(`
      <p>Good news!</p>
      <p><strong>${params.ownerName}</strong> accepted your request for <strong>${params.listingTitle}</strong>.</p>
      <p><a href="${params.viewUrl}" style="color:#2563eb;">View booking</a></p>
    `)
  };
}
