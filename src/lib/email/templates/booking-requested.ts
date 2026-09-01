import { emailLayout, listingImageBlock, ctaButton } from "@/lib/email/templates/layout";
import { escapeHtml } from "@/lib/email/escape";

export function bookingRequestedEmail(params: {
  listingTitle: string;
  listingImageUrl: string | null;
  requesterName: string;
  mode: "RENT" | "SWAP";
  startDate: Date | null;
  endDate: Date | null;
  message: string | null;
  viewUrl: string;
}): { subject: string; html: string } {
  const kind = params.mode === "RENT" ? "rent" : "swap";
  const listingTitle = escapeHtml(params.listingTitle);
  const requesterName = escapeHtml(params.requesterName);
  const dates =
    params.startDate && params.endDate
      ? `<p><strong>Dates:</strong> ${params.startDate.toLocaleDateString()} – ${params.endDate.toLocaleDateString()}</p>`
      : "";
  const message = params.message
    ? `<p><strong>Message:</strong> ${escapeHtml(params.message)}</p>`
    : "";

  return {
    subject: `New ${kind} request for "${params.listingTitle}"`,
    html: emailLayout(`
      ${listingImageBlock(params.listingImageUrl, params.listingTitle)}
      <p>Hi,</p>
      <p><strong>${requesterName}</strong> sent you a ${kind} request for <strong>${listingTitle}</strong>.</p>
      ${dates}
      ${message}
      ${ctaButton(params.viewUrl, "View listing")}
    `)
  };
}
