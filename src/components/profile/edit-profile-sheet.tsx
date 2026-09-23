"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sheet } from "@/components/premium/sheet";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { PremiumInput, PremiumTextarea } from "@/components/premium/system";
import { uploadAvatar } from "@/lib/listings/upload-client";
import { updateProfileAction } from "@/lib/profile/actions";
/**
 * Only the plain strings this sheet renders. The Dictionary itself must never
 * cross into a client component: it holds template helpers (functions), and
 * functions cannot be serialised across the server/client boundary.
 */
export type EditProfileCopy = {
  editProfile: string;
  editAvatar: string;
  removePhoto: string;
  displayNameLabel: string;
  bioLabel: string;
  cityLabel: string;
  save: string;
  saving: string;
  cancel: string;
  uploadFailed: string;
};

const BIO_LIMIT = 300;

/**
 * One sheet for the whole identity block — name, bio, city and photo — rather
 * than an inline editor per field. The avatar uploads as soon as it is picked
 * so the preview is real before saving, but the URL is only committed when the
 * form is saved, which keeps Cancel meaning "nothing changed".
 */
export function EditProfileSheet({
  open,
  onClose,
  copy,
  initial
}: {
  open: boolean;
  onClose: () => void;
  copy: EditProfileCopy;
  initial: { displayName: string; bio: string; city: string; avatarUrl: string | null };
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [bio, setBio] = useState(initial.bio);
  const [city, setCity] = useState(initial.city);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const avatarChanged = avatarUrl !== initial.avatarUrl;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    const result = await uploadAvatar(file);
    setUploading(false);
    if ("error" in result) {
      setError(copy.uploadFailed);
      return;
    }
    setAvatarUrl(result.url);
  };

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const result = await updateProfileAction({
        displayName: displayName.trim(),
        bio: bio.trim(),
        city: city.trim(),
        // Only sent when it actually changed, so saving the form without
        // touching the photo never rewrites the stored URL.
        ...(avatarChanged ? { avatarUrl } : {})
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }
      onClose();
      router.refresh();
    });
  };

  const busy = pending || uploading;
  const canSave = displayName.trim().length > 0 && !busy;

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="space-y-4 p-4 pb-6">
        <h2 className="text-lg font-bold text-white">{copy.editProfile}</h2>

        <div className="flex items-center gap-4">
          <ProfileAvatar name={displayName || initial.displayName} avatarUrl={avatarUrl} className="h-16 w-16" />
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/15 px-4 text-sm font-semibold text-white transition-colors duration-200 ease-[var(--ease-premium)] hover:bg-white/[0.06] disabled:opacity-50"
            >
              {uploading ? copy.saving : copy.editAvatar}
            </button>
            {avatarUrl ? (
              <button
                type="button"
                onClick={() => setAvatarUrl(null)}
                disabled={busy}
                className="text-xs font-medium text-white/50 transition-colors hover:text-white/80 disabled:opacity-50"
              >
                {copy.removePhoto}
              </button>
            ) : null}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(event) => {
              void handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-white/65">{copy.displayNameLabel}</span>
          <PremiumInput value={displayName} maxLength={60} onChange={(event) => setDisplayName(event.target.value)} />
        </label>

        <label className="block space-y-1.5">
          <span className="flex items-center justify-between text-xs font-semibold text-white/65">
            {copy.bioLabel}
            <span className="tabular-nums text-white/40">
              {bio.length}/{BIO_LIMIT}
            </span>
          </span>
          <PremiumTextarea
            value={bio}
            rows={3}
            maxLength={BIO_LIMIT}
            onChange={(event) => setBio(event.target.value)}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-white/65">{copy.cityLabel}</span>
          <PremiumInput value={city} maxLength={80} onChange={(event) => setCity(event.target.value)} />
        </label>

        {error ? <p className="text-sm font-medium text-[#ff8a8a]">{error}</p> : null}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="min-h-[48px] flex-1 rounded-2xl border border-white/15 text-sm font-semibold text-white transition-colors duration-200 ease-[var(--ease-premium)] hover:bg-white/[0.06] disabled:opacity-50"
          >
            {copy.cancel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="min-h-[48px] flex-1 rounded-2xl bg-[#ccff00] text-sm font-bold text-black transition-all duration-200 ease-[var(--ease-premium)] hover:bg-[#deff57] active:scale-[0.97] disabled:opacity-50"
          >
            {pending ? copy.saving : copy.save}
          </button>
        </div>
      </div>
    </Sheet>
  );
}
