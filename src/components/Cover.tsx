"use client";
import { useState } from "react";
import type { Locale } from "@/lib/types";

/** Try the real image, then its local category fallback; never loop on a broken fallback. */
function useCover(src: string, fallback: string) {
  const [failed, setFailed] = useState<string[]>([]);
  const current = [src, fallback].find((candidate) => !failed.includes(candidate));
  const fail = () => { if (current) setFailed((prior) => prior.includes(current) ? prior : [...prior, current]); };
  // Cached failures can fire before hydration attaches onError. Inspect the mounted image too.
  const inspect = (image: HTMLImageElement | null) => { if (image?.complete && image.naturalWidth === 0) fail(); };
  return { current, fail, inspect };
}

export function Cover({ src, fallback, className = "", alt = "", eager = false }: { src: string; fallback: string; className?: string; alt?: string; eager?: boolean }) {
  const { current, fail, inspect } = useCover(src, fallback);
  if (!current) return null; // The card's category icon remains visible if even local assets are unavailable.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={inspect}
      src={current}
      alt={current === src ? alt : ""}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={fail}
      className={className}
    />
  );
}

/** A stable article banner; fallback imagery is credited as illustrative, not the specific subject. */
export function CoverFigure({ src, fallback, alt, credit, locale }: { src: string; fallback: string; alt: string; credit: string; locale: Locale }) {
  const { current, fail, inspect } = useCover(src, fallback);
  const illustration = current === fallback;
  const ar = locale === "ar";
  return (
    <figure className="relative mb-4 overflow-hidden rounded-3xl border border-line bg-chip">
      {current ? <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={inspect} src={current} alt={illustration ? "" : alt} width={1280} height={720} fetchPriority="high" decoding="async"
          referrerPolicy="no-referrer" onError={fail} className="aspect-[16/9] w-full object-cover" />
        <figcaption className="absolute bottom-2 end-2 max-w-[90%] rounded-full bg-black/75 px-2 py-0.5 text-[10px] text-white/85" dir={ar ? "rtl" : "ltr"}>
          📷 {illustration ? (ar ? "صورة توضيحية — Rockstar Games" : "Illustrative image — Rockstar Games") : credit}
        </figcaption>
      </> : <div className="grid aspect-[16/9] place-items-center p-4 text-sm text-muted" role="status">
        {ar ? "الصورة غير متاحة حالياً" : "Image currently unavailable"}
      </div>}
    </figure>
  );
}
