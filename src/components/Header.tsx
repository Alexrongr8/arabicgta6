import Link from "next/link";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import type { Viewer } from "@/lib/session";
import { LangToggle } from "./LangToggle";
import { Logo } from "./Logo";
import { TopLinks } from "./Nav";
import { ThemeToggle } from "./ThemeToggle";
import { digestEnabled } from "@/lib/digest-config";

export function Header({ locale, viewer, labels, theme }: { locale: Locale; viewer: Viewer; labels: Parameters<typeof TopLinks>[0]["labels"]; theme: "light" | "dark" }) {
  const digest = digestEnabled();
  return (
    <header className="glass sticky top-0 z-40 border-b border-line">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 md:px-4">
        <Link href="/" aria-label={t(locale, "siteName")} dir="ltr" className="min-w-0 shrink-0">
          <Logo />
        </Link>
        <TopLinks labels={labels} />
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle initial={theme} label={locale === "ar" ? "الوضع الداكن" : "Dark mode"} />
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
            <Link
              href="/login"
              aria-label={digest ? (locale === "ar" ? "النشرة الأسبوعية" : "Weekly digest") : t(locale, "signIn")}
              className="bg-sunset inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-full px-2.5 text-[13px] font-extrabold text-[#241338] shadow-md shadow-pink/30 min-[480px]:px-3.5"
            >
              {digest ? "✉️" : "👤"}<span className="hidden min-[480px]:inline">{digest ? (locale === "ar" ? "النشرة" : "Digest") : t(locale, "signIn")}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
