"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

function subscribeLocale(changed: () => void) {
  const observer = new MutationObserver(changed);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  return () => observer.disconnect();
}

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  const locale = useSyncExternalStore(subscribeLocale, () => document.documentElement.lang, () => "ar");
  const ar = locale !== "en";
  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <div className="card p-6 text-center">
        <h1 className="text-[26px]">{ar ? "ما قدرنا نحمّل الصفحة الحين" : "We couldn't load this page"}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted" role="alert">
          {ar ? "صار خلل مؤقت. جرّب مرة ثانية بعد شوي." : "Something went wrong temporarily. Please try again in a moment."}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={retry} className="h-11 rounded-xl bg-pink px-5 text-sm font-extrabold text-black">
            {ar ? "حاول مرة ثانية" : "Try again"}
          </button>
          <Link href="/" className="inline-flex h-11 items-center rounded-xl border border-line px-5 text-sm font-bold">
            {ar ? "الرئيسية" : "Home"}
          </Link>
        </div>
      </div>
    </main>
  );
}
