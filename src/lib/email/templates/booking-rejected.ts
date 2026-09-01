import { emailLayout, listingImageBlock, ctaButton } from "@/lib/email/templates/layout";
import { escapeHtml } from "@/lib/email/escape";

export function bookingRejectedEmail(params: {
  listingTitle: string;
  listingImageUrl: string | null;
  viewUrl: string;
}): { subject: string; html: string } {
  const listingTitle = escapeHtml(params.listingTitle);
  return {
    subject: `Your request for "${params.listingTitle}" was declined`,
    html: emailLayout(`
      ${listingImageBlock(params.listingImageUrl, params.listingTitle)}
      <p>Your request for <strong>${listingTitle}</strong> was declined by the owner.</p>
      ${ctaButton(params.viewUrl, "View listing")}
    `)
  };
}
