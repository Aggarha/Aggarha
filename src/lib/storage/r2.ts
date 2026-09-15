import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY
  }
});

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

/** Presigned PUT URL expires quickly — the client is expected to upload immediately after requesting it. */
const PRESIGN_EXPIRY_SECONDS = 60;

export function buildListingPhotoKey(input: { userId: string; contentType: string }): string {
  const extension = EXTENSION_BY_CONTENT_TYPE[input.contentType];
  return `listings/photos/${input.userId}/${randomUUID()}.${extension}`;
}

/**
 * Avatars live under their own prefix rather than alongside listing photos so
 * the two can be told apart by URL — isOwnedAvatarUrl() below is what stops a
 * client from passing off an arbitrary URL, or someone else's listing photo,
 * as their profile picture.
 */
export function buildAvatarKey(input: { userId: string; contentType: string }): string {
  const extension = EXTENSION_BY_CONTENT_TYPE[input.contentType];
  return `profiles/avatars/${input.userId}/${randomUUID()}.${extension}`;
}

export async function createPresignedUploadUrl(input: {
  key: string;
  contentType: string;
  contentLength: number;
}): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: input.key,
    ContentType: input.contentType,
    ContentLength: input.contentLength
  });

  return getSignedUrl(r2Client, command, { expiresIn: PRESIGN_EXPIRY_SECONDS });
}

export function buildPublicUrl(key: string): string {
  return `${env.R2_PUBLIC_URL}/${key}`;
}

const LISTING_PHOTO_URL_PREFIX = `${env.R2_PUBLIC_URL}/listings/photos/`;
const AVATAR_URL_PREFIX = `${env.R2_PUBLIC_URL}/profiles/avatars/`;

/** Guards against a client submitting an arbitrary external URL as a "listing photo" — only URLs this server itself issued a presigned upload for are accepted. */
export function isOwnedListingPhotoUrl(url: string): boolean {
  return url.startsWith(LISTING_PHOTO_URL_PREFIX);
}

/**
 * Same guard for avatars, but bound to the uploader: the key embeds the user
 * id, so requiring it here means a client cannot claim a URL from anyone
 * else's avatar prefix, only one this server issued to them.
 */
export function isOwnedAvatarUrl(url: string, userId: string): boolean {
  return url.startsWith(`${AVATAR_URL_PREFIX}${userId}/`);
}
