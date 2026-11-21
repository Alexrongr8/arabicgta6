"use client";
import { useState } from "react";

/** Image with graceful fallback (hides itself if a remote image fails to load). */
export function Cover({ src, className = "", alt = "", eager = false }: { src: string; className?: string; alt?: string; eager?: boolean }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setOk(false)}
      className={className}
    />
  );
}

/** Article banner: the whole figure disappears if the remote image can't be loaded. */
export function CoverFigure({ src, alt, credit }: { src: string; alt: string; credit: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <figure className="relative mb-4 overflow-hidden rounded-3xl border border-line bg-chip">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} referrerPolicy="no-referrer" onError={() => setOk(false)} className="aspect-[16/9] w-full object-cover" />
      <figcaption className="absolute bottom-2 end-2 rounded-full bg-black/75 px-2 py-0.5 text-[10px] text-white/85" dir="ltr">
        📷 {credit}
      </figcaption>
    </figure>
  );
}
