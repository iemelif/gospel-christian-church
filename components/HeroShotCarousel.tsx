"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Slide } from "@/lib/carousel";

export const AUTOPLAY_MS = 5000;
const SWIPE_PX = 40;

/** Index of the slide `step` away from `i`, wrapping around. */
export const wrapIndex = (i: number, step: number, count: number) => (i + step + count) % count;

/**
 * Image carousel for the top of the Home page. Autoplays every 5s, pauses while hovered, resumes on mouse leave;
 * buttons, dots and swipes work at any time and never stop autoplay. No autoplay (and no fade) for users who
 * prefer reduced motion. Images keep their aspect ratio inside a 16:9 frame (object-contain, no cropping).
 * Presentation only: the page passes the slides, discovered from the carousel folder by `carouselSlides()`.
 */
export default function HeroShotCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchX = useRef<number | null>(null);
  const go = (step: number) => setIndex((i) => wrapIndex(i, step, slides.length));

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Restarts after every slide change, so a manual change gives the new slide a full 5s.
  useEffect(() => {
    if (hovered || reducedMotion || slides.length < 2) return;
    const t = setTimeout(() => setIndex((i) => wrapIndex(i, 1, slides.length)), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, hovered, reducedMotion, slides.length]);

  const btn = "absolute top-[calc(50%-12px)] grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-[rgba(255,255,255,.9)] text-brand shadow-[0_2px_8px_rgba(43,34,38,.2)] hover:bg-gold hover:text-[#1b1404]";
  return (
    <section aria-roledescription="carousel" aria-label="Church photos" className="relative"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current; touchX.current = null;
        if (Math.abs(dx) >= SWIPE_PX) go(dx < 0 ? 1 : -1);
      }}>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_6px_24px_rgba(43,34,38,.08)]" aria-live={hovered || reducedMotion ? "polite" : "off"}>
        {slides.map((s, i) => (
          <div key={s.src} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`} aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${i === index ? "opacity-100" : "opacity-0"}`}>
            <Image src={s.src} alt={s.alt} fill sizes="(max-width: 1080px) 100vw, 1080px" priority={i === 0} unoptimized className="block object-contain" />
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button type="button" className={`${btn} left-3`} aria-label="Previous slide" onClick={() => go(-1)}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" className={`${btn} right-3`} aria-label="Next slide" onClick={() => go(1)}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="mt-3 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button key={s.src} type="button" aria-label={`Show slide ${i + 1} of ${slides.length}`} aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className={`h-2.5 cursor-pointer rounded-full border-0 p-0 transition-all motion-reduce:transition-none ${i === index ? "w-7 bg-brand" : "w-2.5 bg-line hover:bg-gold"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
