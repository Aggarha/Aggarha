import { escapeHtml } from "@/lib/email/escape";

const HEADING_FONT = "'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif";
const BODY_FONT = "'Manrope', 'Avenir Next', 'Segoe UI', sans-serif";
const BG = "#000000";
const FG = "#f6f7f2";
const LIME = "#ccff00";

export function emailLayout(bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BG};font-family:${BODY_FONT};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
            <tr>
              <td style="background:${BG};padding:24px;border-bottom:2px solid ${LIME};">
                <span style="font-family:${HEADING_FONT};color:${LIME};font-size:20px;font-weight:700;letter-spacing:0.02em;">Aggarha</span>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;color:${FG};font-size:15px;line-height:1.6;font-family:${BODY_FONT};">
                ${bodyHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function listingImageBlock(imageUrl: string | null, listingTitle: string): string {
  if (!imageUrl) return "";
  const safeUrl = escapeHtml(imageUrl);
  const safeAlt = escapeHtml(listingTitle);
  return `<img src="${safeUrl}" alt="${safeAlt}" width="480" style="width:100%;max-width:480px;height:auto;display:block;border-radius:8px;margin:0 0 16px;" />`;
}

export function ctaButton(url: string, label: string): string {
  return `<p style="margin:24px 0 0;"><a href="${url}" style="display:inline-block;background:${LIME};color:#000000;font-family:${HEADING_FONT};font-weight:700;font-size:14px;text-decoration:none;padding:12px 20px;border-radius:999px;">${escapeHtml(label)}</a></p>`;
}
