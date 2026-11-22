"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function visitorId(): string | null {
  try {
    let id = localStorage.getItem("vid");
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
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
    let ref: string | null = null;
    try { ref = document.referrer ? new URL(document.referrer).origin : null; } catch {}
    const body = JSON.stringify({
      path,
      ref,
      vid: visitorId(),
      utm_source: q.get("utm_source")?.slice(0, 80) ?? null,
      utm_campaign: q.get("utm_campaign")?.slice(0, 80) ?? null,
    });
    try {
      const sent = navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" })) ?? false;
      if (!sent) void fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } }).catch(() => {});
    } catch {}
  }, [path]);
  return null;
}
