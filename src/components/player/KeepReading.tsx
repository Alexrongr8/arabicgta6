"use client";
import { usePlayer } from "@/lib/player";
import type { ItemCard as Card, Locale } from "@/lib/types";
import { ItemCard } from "../ItemCard";

/** End of an article: the newest stories the reader has not opened yet come first. */
export function KeepReading({ items, locale, count = 4 }: { items: Card[]; locale: Locale; count?: number }) {
  const p = usePlayer();
  const ordered = p ? [...items.filter((i) => !p.read[i.slug]), ...items.filter((i) => p.read[i.slug])] : items;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {ordered.slice(0, count).map((item, i) => <ItemCard key={item.slug} item={item} locale={locale} index={i} />)}
    </div>
  );
}
