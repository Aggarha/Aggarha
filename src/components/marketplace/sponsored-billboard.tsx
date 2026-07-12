"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { Locale } from "@/lib/i18n/types";

type BillboardSlide = {
  id: string;
  title: string;
  /** The slide's own content language — independent of the interface language below. */
  titleLang: Locale;
  imageUrl: string;
  city: string;
  governorate: string;
};

const SLIDE_DURATION_MS = 5500;

const COPY = {
  en: { sponsored: "Sponsored", slide: (n: number) => `Slide ${n}` },
  ar: { sponsored: "إعلان ممول", slide: (n: number) => `الشريحة ${n}` }
};

export function SponsoredBillboard({ slides, lang = "en" }: { slides: BillboardSlide[]; lang?: Locale }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isRtl = lang === "ar";
  const copy = COPY[lang];
  const citySeparator = isRtl ? "،" : ",";

  useEffect(() => {
    if (slides.length <= 1 || paused) {
      return;
    }
    const id = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [slides.length, paused]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const viewportH = window.innerHeight || 1;
        const progress = 1 - Math.min(Math.max((rect.top + rect.height / 2) / viewportH, 0), 1);
        const offset = (progress - 0.5) * 14;
        node.style.setProperty("--billboard-parallax", `${offset}px`);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ transform: "translateY(var(--billboard-parallax, 0px))" }}
      className="animate-reveal-hero relative h-[62vh] max-h-[560px] min-h-[380px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0c0c0c] transition-transform duration-300 ease-[var(--ease-premium)]"
    >
      {slides.map((slide, index) => {
        const titleIsRtl = slide.titleLang === "ar";
        return (
          <Link
            key={slide.id}
            href={`/marketplace/${slide.id}` as Route}
            aria-hidden={index !== active}
            tabIndex={index === active ? 0 : -1}
            className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-[var(--ease-premium)] ${
              index === active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority={index === 0}
              className={`object-cover ${index === active ? "animate-ken-burns" : ""}`}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/25" />
            <div className={`absolute top-4 sm:top-8 ${isRtl ? "right-4 sm:right-8" : "left-4 sm:left-8"}`}>
              <span
                dir={isRtl ? "rtl" : "ltr"}
                className="inline-flex items-center gap-1 rounded-full border border-[#ffd27a]/45 bg-black/60 px-3 py-1.5 text-xs font-semibold text-[#ffd27a] backdrop-blur"
              >
                {copy.sponsored}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 space-y-2 p-6 sm:p-10">
              <p
                dir={titleIsRtl ? "rtl" : "ltr"}
                className={`${titleIsRtl ? "text-right" : "text-left"} font-[family-name:var(--font-space-grotesk)] text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl`}
              >
                {slide.title}
              </p>
              <p dir={isRtl ? "rtl" : "ltr"} className={`${isRtl ? "text-right" : "text-left"} text-sm text-white/70`}>
                {slide.city}
                {citySeparator} {slide.governorate}
              </p>
            </div>
          </Link>
        );
      })}

      {slides.length > 1 ? (
        <div className={`absolute bottom-5 z-20 flex gap-1.5 sm:bottom-8 ${isRtl ? "left-5 sm:left-8" : "right-5 sm:right-8"}`}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={copy.slide(index + 1)}
              className={`h-1.5 rounded-full transition-all duration-300 ease-[var(--ease-premium)] ${
                index === active ? "w-7 bg-[#ccff00]" : "w-1.5 bg-white/40 hover:bg-white/65"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
