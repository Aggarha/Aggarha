"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { EditProfileSheet } from "@/components/profile/edit-profile-sheet";
import type { EditProfileCopy } from "@/components/profile/edit-profile-sheet";

export type EditableProfile = {
  displayName: string;
  bio: string;
  city: string;
  avatarUrl: string | null;
};

const EditProfileContext = createContext<{ open: () => void } | null>(null);

/**
 * Wraps the server-rendered header so the avatar pencil, the bio affordance
 * and the Edit profile button all drive one sheet instance. Without this each
 * trigger would carry its own copy of the sheet and its own open state.
 *
 * `initial` is null on someone else's profile: there is nothing to edit, so no
 * sheet and no client state are created at all.
 */
export function EditProfileProvider({
  copy,
  initial,
  children
}: {
  copy: EditProfileCopy;
  initial: EditableProfile | null;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open: () => setOpen(true) }), []);

  if (!initial) {
    return <>{children}</>;
  }

  return (
    <EditProfileContext.Provider value={value}>
      {children}
      <EditProfileSheet open={open} onClose={() => setOpen(false)} copy={copy} initial={initial} />
    </EditProfileContext.Provider>
  );
}

/** Throws rather than silently doing nothing if a trigger is rendered outside the provider. */
export function useEditProfile() {
  const context = useContext(EditProfileContext);
  if (!context) {
    throw new Error("useEditProfile must be used inside EditProfileProvider");
  }
  return context;
}
