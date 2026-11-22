"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

type Snaptr = ((...args: unknown[]) => void) & { queue?: unknown[]; handleRequest?: (...args: unknown[]) => void };
declare global {
  interface Window { snaptr?: Snaptr }
}

/** Snap Pixel id from Snap Ads Manager (Events Manager). Unset = the pixel never loads. */
const PIXEL_ID = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID?.trim() || "";
const VALID = /^[0-9a-f-]{20,40}$/i.test(PIXEL_ID);

function snaptr(): Snaptr | null {
  if (typeof window === "undefined") return null;
  if (!window.snaptr) {
    const q: Snaptr = (...args: unknown[]) => { if (q.handleRequest) q.handleRequest(...args); else q.queue!.push(args); };
    q.queue = [];
    window.snaptr = q;
    window.snaptr("init", PIXEL_ID, {});
  }
  return window.snaptr;
}

/**
 * Snap Pixel for Snapchat ad campaigns: one PAGE_VIEW per navigation, so Snap can measure
 * landing-page visits and build retargeting audiences. The Snap script loads after the page is
 * idle (lazyOnload), so it never delays the first paint inside Snapchat's in-app browser.
 */
export function SnapPixel() {
  const path = usePathname();
  const last = useRef<string | null>(null);
  useEffect(() => {
    if (!VALID || last.current === path) return;
    last.current = path;
    snaptr()?.("track", "PAGE_VIEW");
  }, [path]);
  if (!VALID) return null;
  return <Script id="snap-pixel" src="https://sc-static.net/scevent.min.js" strategy="lazyOnload" />;
}
