import Link from "next/link";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import type { Viewer } from "@/lib/session";
import { LangToggle } from "./LangToggle";
import { Logo } from "./Logo";
import { TopLinks } from "./Nav";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ locale, viewer, labels, theme }: { locale: Locale; viewer: Viewer; labels: Parameters<typeof TopLinks>[0]["labels"]; theme: "light" | "dark" }) {
  return (
    <header className="glass sticky top-0 z-40 border-b border-line">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 md:px-4">
        <Link href="/" aria-label={t(locale, "siteName")} dir="ltr">
          <Logo />
        </Link>
        <TopLinks labels={labels} />
        <div className="flex items-center gap-2">
          <ThemeToggle initial={theme} label={locale === "ar" ? "الوضع الفاتح / الداكن" : "Light / dark mode"} />
          <LangToggle locale={locale} />
          {viewer.signedIn ? (
            <Link href="/account" className="grid size-9 place-items-center overflow-hidden rounded-full border border-line bg-chip" aria-label={t(locale, "account")}>
              {viewer.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={viewer.avatar} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-sm font-bold">{(viewer.name ?? viewer.email ?? "?").slice(0, 1).toUpperCase()}</span>
              )}
            </Link>
          ) : (
            <Link href="/login" className="bg-sunset inline-flex h-9 items-center gap-1 rounded-full px-3.5 text-[13px] font-extrabold text-white shadow-md shadow-pink/30">
              ✉️ {locale === "ar" ? "النشرة" : "Digest"}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
