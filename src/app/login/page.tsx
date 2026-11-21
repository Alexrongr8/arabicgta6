import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { getLocale, getViewer } from "@/lib/session";
import { SignInGate } from "@/components/SignInGate";

export async function generateMetadata(): Promise<Metadata> {
  return { title: t(await getLocale(), "signIn") };
}

export default async function Login({ searchParams }: PageProps<"/login">) {
  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  const sp = await searchParams;
  const next = typeof sp.next === "string" && sp.next.startsWith("/") ? sp.next : "/";
  if (viewer.member && !viewer.demo) redirect(next);
  return (
    <main className="mx-auto max-w-md px-4 pt-10">
      {sp.error && <p className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-sm text-red-300">{t(locale, "loginError")}</p>}
      <SignInGate locale={locale} next={next} />
      <p className="mt-6 text-center text-xs leading-relaxed text-dim">
        {locale === "ar" ? "بتسجيل الدخول أنت توافق على " : "By signing in you agree to our "}
        <Link href="/privacy" className="text-muted underline">
          {locale === "ar" ? "سياسة الخصوصية" : "privacy policy"}
        </Link>
        .
      </p>
    </main>
  );
}
