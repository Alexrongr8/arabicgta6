import Link from "next/link";
import { STATUS_META } from "@/lib/categories";
import { t } from "@/lib/i18n";
import type { Locale, Status } from "@/lib/types";

export function StatusFilter({ locale, active }: { locale: Locale; active?: Status }) {
  const opts: (Status | undefined)[] = [undefined, "official", "confirmed", "leak", "rumor"];
  return (
    <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
      {opts.map((s) => {
        const on = s === active;
        const m = s ? STATUS_META[s] : null;
        return (
          <Link
            key={s ?? "all"}
            href={s ? `?status=${s}` : "?"}
            scroll={false}
            className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-bold ${on ? "border-pink/50 bg-chip2 text-fg" : "border-line text-muted"}`}
          >
            {m && <span className="size-2 rounded-full" style={{ background: m.color }} />}
            {m ? (locale === "ar" ? m.ar : m.en) : t(locale, "all")}
          </Link>
        );
      })}
    </div>
  );
}
