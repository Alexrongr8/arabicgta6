import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, LogOut, Mail, Shield } from "lucide-react";
import { t } from "@/lib/i18n";
import { getLocale, getViewer } from "@/lib/session";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { isOwner } from "@/lib/admin";
import { SignInGate } from "@/components/SignInGate";
import { LangToggle } from "@/components/LangToggle";
import { setDigest } from "./actions";
import { TipsToggle } from "@/components/TipOfVisit";

export async function generateMetadata(): Promise<Metadata> {
  return { title: t(await getLocale(), "account") };
}

export default async function Account() {
  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  if (!viewer.signedIn) {
    return (
      <main className="mx-auto max-w-md px-4 pt-8">
        <SignInGate locale={locale} next="/account" />
        <div className="mt-6 flex justify-center">
          <LangToggle locale={locale} />
        </div>
      </main>
    );
  }
  let optIn = true;
  if (supabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.from("profiles").select("digest_opt_in").eq("id", viewer.id!).maybeSingle();
    optIn = data?.digest_opt_in ?? true;
  }
  return (
    <main className="mx-auto max-w-md px-4 pt-8">
      <div className="card mb-4 flex items-center gap-4 p-5">
        {viewer.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={viewer.avatar} alt="" referrerPolicy="no-referrer" className="size-14 rounded-2xl" />
        ) : (
          <span className="bg-sunset grid size-14 place-items-center rounded-2xl text-xl font-extrabold">{(viewer.name ?? viewer.email ?? "?")[0]}</span>
        )}
        <div className="min-w-0">
          <p className="text-xs text-dim">{t(locale, "welcome")}</p>
          <p className="truncate text-lg font-extrabold">{viewer.name ?? viewer.email}</p>
          <p className="truncate text-xs text-muted" dir="ltr">{viewer.email}</p>
        </div>
      </div>

      <div className="card mb-4 p-5">
        <div className="mb-2 flex items-center gap-2 font-extrabold">
          <Mail className="size-5 text-pink" /> {t(locale, "digest")}
        </div>
        <p className="mb-4 text-sm text-muted">{t(locale, "digestDesc")}</p>
        <form action={setDigest.bind(null, !optIn)}>
          <button className={`h-11 w-full rounded-xl font-extrabold ${optIn ? "border border-line" : "bg-sunset text-[#241338]"}`}>
            {optIn ? `${t(locale, "subscribed")} ✓ — ${t(locale, "unsubscribe")}` : t(locale, "subscribe")}
          </button>
        </form>
      </div>

      <div className="card mb-4 flex items-center justify-between p-5">
        <span className="font-bold">{locale === "ar" ? "اللغة" : "Language"}</span>
        <LangToggle locale={locale} />
      </div>

      <div className="card mb-4 flex items-center justify-between gap-3 p-5">
        <div>
          <p className="font-bold">{locale === "ar" ? "نصيحة كل زيارة" : "Tip on every visit"}</p>
          <p className="text-xs text-muted">{locale === "ar" ? "نصيحة جديدة كل ما تفتح الموقع" : "A new tip each time you open the site"}</p>
        </div>
        <TipsToggle locale={locale} />
      </div>

      {isOwner(viewer.email) && (
        <Link href="/admin" className="card card-hover mb-4 flex items-center gap-3 p-5 font-extrabold">
          <BarChart3 className="size-5 text-teal" /> {locale === "ar" ? "لوحة المالك: الزوار والأعضاء" : "Owner dashboard: visitors & members"}
        </Link>
      )}

      <Link href="/privacy" className="mb-4 flex items-center gap-2 px-1 text-sm text-muted">
        <Shield className="size-4" /> {locale === "ar" ? "سياسة الخصوصية" : "Privacy policy"}
      </Link>

      <form action="/auth/signout" method="post">
        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 font-bold text-red-300">
          <LogOut className="size-4" /> {t(locale, "signOut")}
        </button>
      </form>
    </main>
  );
}
