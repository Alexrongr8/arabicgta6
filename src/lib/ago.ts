import type { Locale } from "./types";
import { formatDate } from "./i18n";

/** Arabic counted noun: 1 دقيقة، 2 دقيقتين، 3-10 دقائق، 11+ دقيقة. */
export function arCount(n: number, one: string, two: string, few: string): string {
  if (n === 1) return one;
  if (n === 2) return two;
  return n <= 10 ? `${n} ${few}` : `${n} ${one}`;
}

/** "3 hours ago" for the last week, a plain date after that (and for future or invalid times). */
export function ago(iso: string, locale: Locale, now = Date.now()): string {
  const ar = locale === "ar";
  const diff = now - Date.parse(iso);
  if (!Number.isFinite(diff) || diff < 0 || diff > 7 * 864e5) return formatDate(iso, locale);
  const min = Math.max(1, Math.round(diff / 60_000));
  if (min < 60) return ar ? `قبل ${arCount(min, "دقيقة", "دقيقتين", "دقائق")}` : `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return ar ? `قبل ${arCount(h, "ساعة", "ساعتين", "ساعات")}` : `${h}h ago`;
  const d = Math.round(h / 24);
  return ar ? `قبل ${arCount(d, "يوم", "يومين", "أيام")}` : `${d}d ago`;
}
