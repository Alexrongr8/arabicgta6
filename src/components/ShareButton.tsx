"use client";
import { Share2 } from "lucide-react";

export function ShareButton({ title, label }: { title: string; label: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        const url = window.location.href;
        if (navigator.share) {
          try {
            await navigator.share({ title, url });
          } catch {}
        } else {
          await navigator.clipboard?.writeText(url);
        }
      }}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-black/30 px-4 text-sm font-bold"
    >
      <Share2 className="size-4" /> {label}
    </button>
  );
}
