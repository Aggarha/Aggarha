import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOptionalSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { buildListingPhotoKey, buildPublicUrl, createPresignedUploadUrl } from "@/lib/storage/r2";

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const presignSchema = z.object({
  contentType: z.enum(ALLOWED_CONTENT_TYPES),
  contentLength: z.number().int().positive().max(MAX_FILE_SIZE_BYTES)
});

export async function POST(request: NextRequest) {
  const session = await getOptionalSession();
  if (!session) {
    return NextResponse.json({ status: "error", error: "unauthorized" }, { status: 401 });
  }

  const { limited } = await checkRateLimit({ route: "listings.photos.presign", limit: 20, windowMinutes: 15 });
  if (limited) {
    return NextResponse.json({ status: "error", error: "rate_limited" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = presignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ status: "error", error: "validation_error" }, { status: 400 });
  }

  const key = buildListingPhotoKey({ userId: session.userId, contentType: parsed.data.contentType });
  const uploadUrl = await createPresignedUploadUrl({
    key,
    contentType: parsed.data.contentType,
    contentLength: parsed.data.contentLength
  });

  return NextResponse.json({
    status: "ok",
    data: { uploadUrl, publicUrl: buildPublicUrl(key), key }
  });
}
