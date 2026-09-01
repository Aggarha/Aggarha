export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

export type UploadListingPhotoResult = { url: string } | { error: "invalid_type" | "too_large" | "presign_failed" | "upload_failed" };

/**
 * Wrapped in try/catch end-to-end: a CORS-blocked or network-failed fetch() *rejects*
 * rather than resolving with a non-ok response, and an uncaught rejection here used to
 * leave the calling UI's "uploading" state stuck forever with no way to know why.
 */
export async function uploadListingPhoto(file: File): Promise<UploadListingPhotoResult> {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type as (typeof ALLOWED_PHOTO_TYPES)[number])) {
    return { error: "invalid_type" };
  }
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return { error: "too_large" };
  }

  try {
    const presignResponse = await fetch("/api/listings/photos/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: file.type, contentLength: file.size })
    });
    if (!presignResponse.ok) {
      return { error: "presign_failed" };
    }
    const presignBody = (await presignResponse.json()) as { data: { uploadUrl: string; publicUrl: string } };

    const uploadResponse = await fetch(presignBody.data.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file
    });
    if (!uploadResponse.ok) {
      return { error: "upload_failed" };
    }

    return { url: presignBody.data.publicUrl };
  } catch {
    return { error: "upload_failed" };
  }
}
