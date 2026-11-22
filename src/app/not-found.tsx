import Link from "next/link";
import { getLocale } from "@/lib/session";

export default async function NotFound() {
  const ar = (await getLocale()) === "ar";
  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <div className="card p-6 text-center">
        <p className="text-sm font-bold text-muted">404</p>
        <h1 className="mt-2 text-[26px]">{ar ? "ما لقينا هالصفحة" : "Page not found"}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {ar ? "الرابط ممكن يكون تغيّر أو الصفحة انحذفت. تقدر تبحث عن الموضوع أو ترجع للرئيسية." : "The link may have changed or the page may have been removed. Search for the topic or return home."}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/search" className="inline-flex h-11 items-center rounded-xl bg-pink px-5 text-sm font-extrabold text-black">
            {ar ? "ابحث عن موضوع" : "Search topics"}
          </Link>
          <Link href="/" className="inline-flex h-11 items-center rounded-xl border border-line px-5 text-sm font-bold">
            {ar ? "الرئيسية" : "Home"}
          </Link>
        </div>
      </div>
    </main>
  );
}
