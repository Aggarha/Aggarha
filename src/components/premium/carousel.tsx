"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export type CarouselPhoto = { id: string; url: string };

/**
 * Pointer Events (not separate touch/mouse handlers) so drag works with touch
 * AND mouse from one code path — same gesture logic ports cleanly to a future
 * React Native carousel (pan responder), which is the whole point of not
 * reaching for an external carousel library here.
 */
export function Carousel({
  photos,
  alt,
  className,
  imageClassName,
  priority = false
}: {
  photos: CarouselPhoto[];
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef<{ startX: number } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const clampIndex = (value: number) => Math.max(0, Math.min(photos.length - 1, value));
  const goTo = (value: number) => setIndex(clampIndex(value));

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (photos.length <= 1) return;
    dragState.current = { startX: event.clientX };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    setDragOffset(event.clientX - dragState.current.startX);
  };

  const endDrag = () => {
    if (!dragState.current) return;
    const width = trackRef.current?.offsetWidth || 1;
    const threshold = width * 0.18;
    if (dragOffset < -threshold) {
      goTo(index + 1);
    } else if (dragOffset > threshold) {
      goTo(index - 1);
    }
    dragState.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative select-none overflow-hidden", className)}>
      <div
        ref={trackRef}
        className="flex h-full touch-pan-y"
        style={{
          transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
          transition: isDragging ? "none" : "transform 320ms var(--ease-premium)"
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        {photos.map((photo, i) => (
          <div key={photo.id} className="relative h-full w-full shrink-0">
            <Image
              src={photo.url}
              alt={alt}
              fill
              unoptimized
              priority={priority && i === 0}
              className={cn("object-cover", imageClassName)}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {photos.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition-opacity duration-200 ease-[var(--ease-premium)] sm:flex disabled:opacity-0"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === photos.length - 1}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition-opacity duration-200 ease-[var(--ease-premium)] sm:flex disabled:opacity-0"
          >
            ›
          </button>
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Photo ${i + 1} of ${photos.length}`}
                aria-current={i === index}
                className="flex h-11 w-6 items-center justify-center"
              >
                <span
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 ease-[var(--ease-premium)]",
                    i === index ? "w-5 bg-[#ccff00]" : "w-1.5 bg-white/40"
                  )}
                />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
