"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function visitorId(): string | null {
  try {
    let id = localStorage.getItem("vid");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("vid", id);
    }
    return id;
  } catch {
    return null;
  }
}

/** One lightweight page-view beacon per navigation (owner analytics). */
export function Tracker() {
  const path = usePathname();
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const body = JSON.stringify({
      path,
      ref: document.referrer || null,
      vid: visitorId(),
      utm_source: q.get("utm_source"),
      utm_campaign: q.get("utm_campaign"),
    });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      else fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
    } catch {}
  }, [path]);
  return null;
}
