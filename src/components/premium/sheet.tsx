"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

/**
 * One component, two renderings via CSS breakpoint (not JS matchMedia, so it's
 * SSR-safe and has no hydration flash): a draggable bottom-sheet below `sm`,
 * a centered modal at `sm` and up. Drag-to-dismiss only attaches to the grab
 * handle, which is itself hidden on desktop — so desktop never gets the drag
 * gesture, matching a plain modal's click-outside/Escape-to-close behavior.
 */
export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef<{ startY: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragState.current = { startY: event.clientY };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    setDragY(Math.max(0, event.clientY - dragState.current.startY));
  };

  const endDrag = () => {
    if (!dragState.current) return;
    const panelHeight = panelRef.current?.offsetHeight ?? 0;
    if (dragY > panelHeight * 0.22 || dragY > 120) {
      onClose();
    }
    dragState.current = null;
    setIsDragging(false);
    setDragY(0);
  };

  return (
    <div className="fixed inset-0 z-50 sm:flex sm:items-center sm:justify-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-page-enter bg-black/60 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 max-h-[90dvh] overflow-y-auto rounded-t-[1.75rem] border border-white/[0.1] bg-[#161616] shadow-[0_-14px_32px_rgba(0,0,0,0.45)] sm:static sm:max-h-[85dvh] sm:w-full sm:max-w-lg sm:rounded-3xl"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? "none" : "transform 280ms var(--ease-premium)"
        }}
      >
        <div
          className="flex touch-none justify-center py-2.5 sm:hidden"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span className="h-1.5 w-10 rounded-full bg-white/25" />
        </div>
        {children}
      </div>
    </div>
  );
}
