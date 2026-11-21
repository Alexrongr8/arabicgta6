import Link from "next/link";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import type { Viewer } from "@/lib/session";
import { LangToggle } from "./LangToggle";
import { Logo } from "./Logo";
import { TopLinks } from "./Nav";

export function Header({ locale, viewer, labels }: { locale: Locale; viewer: Viewer; labels: Parameters<typeof TopLinks>[0]["labels"] }) {
  return (
    <header className="glass sticky top-0 z-40 border-b border-line">
      <div className="mx-auto flex h-15 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" aria-label={t(locale, "siteName")}>
          <Logo />
        </Link>
        <TopLinks labels={labels} />
        <div className="flex items-center gap-2">
          <LangToggle locale={locale} />
          {viewer.member && !viewer.demo ? (
            <Link href="/account" className="grid size-9 place-items-center overflow-hidden rounded-full border border-line bg-white/5" aria-label={t(locale, "account")}>
              {viewer.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={viewer.avatar} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-sm font-bold">{(viewer.name ?? viewer.email ?? "?").slice(0, 1).toUpperCase()}</span>
              )}
            </Link>
          ) : !viewer.member ? (
            <Link href="/login" className="bg-sunset inline-flex h-9 items-center rounded-full px-4 text-sm font-black text-white shadow-md shadow-pink/30">
              {t(locale, "signIn")}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
