import { emailLayout } from "@/lib/email/templates/layout";
import { escapeHtml } from "@/lib/email/escape";

export function bookingRequestedEmail(params: {
  listingTitle: string;
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
      <p>Hi,</p>
      <p><strong>${requesterName}</strong> sent you a ${kind} request for <strong>${listingTitle}</strong>.</p>
      ${dates}
      ${message}
      <p><a href="${params.viewUrl}" style="color:#2563eb;">View request</a></p>
    `)
  };
}
