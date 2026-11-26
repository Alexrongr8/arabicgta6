"use client";
import { Bookmark } from "lucide-react";
import { toggleSaved, usePlayer } from "@/lib/player";

export function SaveButton({ slug, ar }: { slug: string; ar: boolean }) {
  const p = usePlayer();
  const saved = Boolean(p?.saved.includes(slug));
  return (
    <button type="button" onClick={() => toggleSaved(slug)} aria-pressed={saved}
      className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-extrabold ${saved ? "border-transparent bg-[#ffd166] text-[#241338]" : "border-line bg-card text-fg"}`}>
      <Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} /> {saved ? (ar ? "محفوظ" : "Saved") : (ar ? "احفظ" : "Save")}
    </button>
  );
}
