"use client";

import { useEditProfile } from "@/components/profile/edit-profile-provider";

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/** Sits on the avatar's corner: 44px hit area, 30px visual dot. */
export function AvatarEditButton({ label }: { label: string }) {
  const { open } = useEditProfile();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={label}
      className="absolute -bottom-1 -right-1 flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
    >
      <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-black bg-[#ccff00] text-black shadow-[0_4px_10px_rgba(0,0,0,0.45)] transition-transform duration-200 ease-[var(--ease-premium)] active:scale-[0.92]">
        <PencilIcon />
      </span>
    </button>
  );
}

/** The bio itself when there is one, a dashed "Add bio" affordance when there isn't. */
export function BioEditButton({ bio, addLabel }: { bio: string; addLabel: string }) {
  const { open } = useEditProfile();

  if (bio) {
    return (
      <button
        type="button"
        onClick={open}
        className="block w-full rounded-xl text-start text-sm leading-relaxed text-white/72 transition-colors duration-200 ease-[var(--ease-premium)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
      >
        {bio}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-dashed border-white/20 px-3.5 text-sm font-semibold text-white/70 transition-colors duration-200 ease-[var(--ease-premium)] hover:border-[#ccff00]/50 hover:text-[#ccff00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
    >
      <PlusIcon />
      {addLabel}
    </button>
  );
}

export function EditProfileButton({ label }: { label: string }) {
  const { open } = useEditProfile();
  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white transition-colors duration-200 ease-[var(--ease-premium)] hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
    >
      {label}
    </button>
  );
}
