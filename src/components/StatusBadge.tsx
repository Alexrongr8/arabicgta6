import { STATUS_META } from "@/lib/categories";
import type { Locale, Status } from "@/lib/types";

export function StatusBadge({ status, locale, size = "sm" }: { status: Status; locale: Locale; size?: "sm" | "md" }) {
  const m = STATUS_META[status];
  return (
    <span
      title={locale === "ar" ? m.hintAr : m.hintEn}
      className={`inline-flex items-center gap-1.5 rounded-full font-bold whitespace-nowrap ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      }`}
      style={{ color: m.color, background: `${m.color}1f`, border: `1px solid ${m.color}55` }}
    >
      <span className="size-1.5 rounded-full" style={{ background: m.color }} />
      {locale === "ar" ? m.ar : m.en}
    </span>
  );
}
