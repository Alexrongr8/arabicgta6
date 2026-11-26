"use client";
import { useRef, useState } from "react";
import { Share2 } from "lucide-react";
import type { Locale } from "@/lib/types";
import { recordShare } from "@/lib/player";

export function ShareButton({ title, label, locale }: { title: string; label: string; locale: Locale }) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const sharing = useRef(false);
  const ar = locale === "ar";

  async function share() {
    if (sharing.current) return;
    sharing.current = true;
    setBusy(true);
    setCopied(false);
    setManualUrl("");
    // Share the article itself, without advertising parameters or a fragment.
    const url = new URL(window.location.pathname, window.location.origin).href;
    try {
      if (navigator.share) {
        try {
          await navigator.share({ title, url });
          recordShare();
          return;
        } catch (error) {
          if (error && typeof error === "object" && "name" in error && error.name === "AbortError") return;
        }
      }
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(url);
        setCopied(true);
        recordShare();
      } catch {
        setManualUrl(url);
      }
    } finally {
      sharing.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="max-w-full">
      <button type="button" onClick={share} disabled={busy} aria-busy={busy}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-panel px-4 text-sm font-bold disabled:opacity-60">
        <Share2 className="size-4" aria-hidden="true" /> {label}
      </button>
      <span role="status" className="ms-2 text-xs text-muted">{copied ? (ar ? "تم نسخ الرابط" : "Link copied") : ""}</span>
      {manualUrl && <label className="mt-2 block text-xs text-muted">
        {ar ? "ما قدرنا ننسخه تلقائياً. انسخ الرابط من هنا:" : "Copy wasn't available. Select and copy this link:"}
        <input readOnly value={manualUrl} onFocus={(event) => event.currentTarget.select()} dir="ltr"
          className="mt-1 block h-11 w-full min-w-0 rounded-xl border border-line bg-panel px-3 text-sm text-fg" />
      </label>}
    </div>
  );
}
