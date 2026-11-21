import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getViewer } from "@/lib/session";
import { getSubmissions, getVotes } from "@/lib/community/data";
import { CATEGORY_MAP, isCategory } from "@/lib/categories";
import { formatDate } from "@/lib/i18n";
import { SubmitForm } from "@/components/community/SubmitForm";
import { VoteBar } from "@/components/community/VoteBar";
import { Bidi } from "@/components/Bidi";
import { supabaseConfigured } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const ar = (await getLocale()) === "ar";
  return { title: ar ? "اكتشافات اللاعبين" : "Player discoveries", description: ar ? "أسرار وقلتشات ومواقف اكتشفها اللاعبين العرب في GTA 6" : "Secrets, glitches and moments found by Arab GTA 6 players" };
}

export default async function Community() {
  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  const ar = locale === "ar";
  const subs = await getSubmissions();
  const votes = await getVotes(subs.map((s) => `sub:${s.id}`), viewer.id);
  return (
    <main className="mx-auto max-w-5xl px-4 pt-5">
      <header className="mb-5 rounded-3xl p-5 text-white shadow-lg" style={{ background: "linear-gradient(135deg,#0f9f97,#7c3aed)" }}>
        <h1 className="text-[28px] leading-tight">{ar ? "اكتشافات اللاعبين 🕵️" : "Player discoveries 🕵️"}</h1>
        <p className="mt-2 text-[14.5px] text-white/90">
          {ar ? "أسرار وقلتشات ومواقف لقاها لاعبين مثلك — باسمهم. صوّت على الأفضل، وأقوى الاكتشافات تنضاف للموسوعة." : "Secrets, glitches and moments found by players like you — credited by name. Vote for the best; top finds join the encyclopedia."}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {!supabaseConfigured() && <p className="card p-4 text-[13.5px] text-muted">{ar ? "المشاركات بتظهر هنا أول ما نربط قاعدة البيانات." : "Submissions will appear here once the database is connected."}</p>}
          {supabaseConfigured() && !subs.length && <p className="card p-4 text-[13.5px] text-muted">{ar ? "لسه ما فيه مشاركات — كن الأول! 🚀" : "No submissions yet — be the first! 🚀"}</p>}
          {subs.map((s) => {
            const c = isCategory(s.category) ? CATEGORY_MAP[s.category] : null;
            return (
              <article key={s.id} className="card p-4">
                <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[12px] text-dim">
                  {c && (
                    <span className="rounded-full px-2 py-0.5 font-extrabold text-white" style={{ background: c.color }}>
                      {ar ? c.ar : c.en}
                    </span>
                  )}
                  <span className="rounded-full bg-chip2 px-2 py-0.5 font-bold">{ar ? "من اللاعبين — غير متحقق" : "From players — unverified"}</span>
                  <span>
                    {ar ? "بواسطة" : "by"} <b className="text-fg">{s.author_name}</b> · {formatDate(s.created_at, locale)}
                  </span>
                </div>
                <Link href={`/community/${s.id}`} className="font-head block text-[19px] leading-snug hover:text-pink">
                  <Bidi text={s.title} />
                </Link>
                <p className="mt-1 line-clamp-4 text-[14px] leading-relaxed whitespace-pre-line text-muted">
                  <Bidi text={s.body} />
                </p>
                {s.place && <p className="mt-1.5 text-[12.5px] font-bold text-pink">📍 <Bidi text={s.place} /></p>}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <VoteBar target={`sub:${s.id}`} votes={votes[`sub:${s.id}`]} path="/community" ar={ar} question={false} />
                  <Link href={`/community/${s.id}`} className="text-[13px] font-bold text-pink">
                    {ar ? "💬 التعليقات" : "💬 Comments"}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="md:sticky md:top-20 md:self-start">
          {viewer.signedIn ? (
            <SubmitForm ar={ar} />
          ) : (
            <Link href="/login?next=/community" className="card block p-5 text-center">
              <p className="font-head text-[19px]">{ar ? "🕵️ عندك اكتشاف؟" : "🕵️ Got a discovery?"}</p>
              <p className="mt-1 text-[13.5px] text-muted">{ar ? "سجّل بحساب Google وانشره باسمك — وتوصلك النشرة الأسبوعية بعد." : "Sign in with Google to publish it under your name — and get the weekly digest."}</p>
              <span className="mt-3 inline-block rounded-xl bg-pink px-5 py-2.5 text-sm font-extrabold text-white">{ar ? "سجّل الدخول" : "Sign in"}</span>
            </Link>
          )}
        </aside>
      </div>
    </main>
  );
}
