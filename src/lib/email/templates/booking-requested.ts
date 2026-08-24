import { emailLayout } from "@/lib/email/templates/layout";

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
  const dates =
    params.startDate && params.endDate
      ? `<p><strong>Dates:</strong> ${params.startDate.toLocaleDateString()} – ${params.endDate.toLocaleDateString()}</p>`
      : "";
  const message = params.message
    ? `<p><strong>Message:</strong> ${params.message}</p>`
    : "";

  return {
    subject: `New ${kind} request for "${params.listingTitle}"`,
    html: emailLayout(`
      <p>Hi,</p>
      <p><strong>${params.requesterName}</strong> sent you a ${kind} request for <strong>${params.listingTitle}</strong>.</p>
      ${dates}
      ${message}
      <p><a href="${params.viewUrl}" style="color:#2563eb;">View request</a></p>
    `)
  };
}
