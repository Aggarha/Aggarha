import { emailLayout, listingImageBlock, ctaButton } from "@/lib/email/templates/layout";
import { escapeHtml } from "@/lib/email/escape";

export function bookingApprovedEmail(params: {
  listingTitle: string;
  listingImageUrl: string | null;
  ownerName: string;
  viewUrl: string;
}): { subject: string; html: string } {
  const listingTitle = escapeHtml(params.listingTitle);
  const ownerName = escapeHtml(params.ownerName);
  return {
    subject: `Your request for "${params.listingTitle}" was accepted`,
    html: emailLayout(`
      ${listingImageBlock(params.listingImageUrl, params.listingTitle)}
      <p>Good news!</p>
      <p><strong>${ownerName}</strong> accepted your request for <strong>${listingTitle}</strong>.</p>
      ${ctaButton(params.viewUrl, "View listing")}
    `)
  };
}
