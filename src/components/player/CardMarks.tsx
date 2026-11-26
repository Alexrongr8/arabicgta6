"use client";
import { usePlayer } from "@/lib/player";

/** On a card: "new" when it was published after the visitor's last visit, a tick once they have read it. */
export function CardMarks({ slug, at, ar }: { slug: string; at: string; ar: boolean }) {
  const p = usePlayer();
  if (!p) return null;
  if (p.read[slug]) return <span className="rounded-full bg-chip2 px-1.5 py-0.5 text-[10.5px] font-bold text-muted">✓ {ar ? "قريته" : "Read"}</span>;
  if (p.prev && Date.parse(at) > p.prev) return <span className="rounded-full bg-[#f0287a] px-1.5 py-0.5 text-[10.5px] font-extrabold text-black">{ar ? "جديد" : "NEW"}</span>;
  return null;
}
