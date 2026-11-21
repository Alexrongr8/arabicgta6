"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Sends one lightweight page-view beacon per navigation (owner analytics). */
export function Tracker() {
  const path = usePathname();
  useEffect(() => {
    const body = JSON.stringify({ path, ref: document.referrer || null });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      else fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
    } catch {}
  }, [path]);
  return null;
}
