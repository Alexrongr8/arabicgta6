"use client";
import { useEffect, useRef } from "react";
import { markRead } from "@/lib/player";

/**
 * Article page: a thin reading-progress bar under the header, and the article counts as read
 * (XP, mission, badge progress) once the reader has stayed 8 seconds and scrolled a little.
 */
export function ReadTracker({ slug, category }: { slug: string; category: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let scrolled = false; let waited = false; let done = false;
    const settle = () => { if (!done && scrolled && waited) { done = true; markRead(slug, category); } };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 1;
      if (bar.current) bar.current.style.transform = `scaleX(${ratio})`;
      if (ratio > 0.2 || max < 400) { scrolled = true; settle(); }
    };
    const timer = window.setTimeout(() => { waited = true; settle(); }, 8000);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, [slug, category]);
  return <div className="pointer-events-none fixed inset-x-0 top-16 z-40 h-[3px]" aria-hidden><div ref={bar} className="bg-sunset h-full origin-left rtl:origin-right" style={{ transform: "scaleX(0)" }} /></div>;
}
