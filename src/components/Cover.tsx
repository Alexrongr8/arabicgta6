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

export function imageCredit(src: string): string {
  if (src.startsWith("/img/")) return "Rockstar Games";
  try {
    return new URL(src).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
