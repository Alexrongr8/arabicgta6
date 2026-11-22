import { publicMetadata } from "@/lib/public-metadata";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { TROPHIES, TROPHY_SOURCES, TROPHY_VIDEOS } from "../../../data/trophies";
import { getLocale } from "@/lib/session";
import { TrophyList } from "@/components/TrophyList";
import { Videos } from "@/components/Videos";

export async function generateMetadata(): Promise<Metadata> {
  const ar = (await getLocale()) === "ar";
  return publicMetadata("/trophies", ar ? "ar" : "en", { title: ar ? "كل كؤوس GTA 6 — بلايستيشن وإكس بوكس" : "All GTA 6 trophies & achievements" });
}

export default async function TrophiesPage() {
  const locale = await getLocale();
  const ar = locale === "ar";
  const count = (g: string) => TROPHIES.filter((t) => t.grade === g).length;
  return (
    <main className="mx-auto max-w-5xl px-4 pt-5">
      <header className="relative mb-5 overflow-hidden rounded-3xl p-5 text-white shadow-lg md:p-7" style={{ background: "linear-gradient(#0006,#0006), linear-gradient(135deg,#2a1240,#7c3aed 55%,#f0287a)" }}>
        <p className="mb-1 text-[12px] font-bold text-white/80">PS5 🏆 · Xbox Series X|S 🎮</p>
        <h1 className="text-[30px] leading-tight md:text-4xl">{ar ? "كل كؤوس GTA 6" : "Every GTA 6 trophy"}</h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-white/90">
          {ar
            ? "55 كأس — نفس الأسماء والشروط في البلايستيشن (تروفيات) والإكس بوكس (إنجازات بمجموع 1,000 نقطة). كؤوس القصة مخفية عشان ما نحرق عليك، اضغط عليها لو تبغى تشوفها."
            : "55 trophies — same names and conditions on PlayStation (trophies) and Xbox (achievements, 1,000 Gamerscore). Story trophies are blurred to avoid spoilers; tap to reveal."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[12.5px] font-extrabold">
          <span className="rounded-full bg-white/20 px-3 py-1">💎 {ar ? "بلاتينيوم" : "Platinum"} {count("platinum")}</span>
          <span className="rounded-full bg-white/20 px-3 py-1">🥇 {ar ? "ذهبي" : "Gold"} {count("gold")}</span>
          <span className="rounded-full bg-white/20 px-3 py-1">🥈 {ar ? "فضي" : "Silver"} {count("silver")}</span>
          <span className="rounded-full bg-white/20 px-3 py-1">🥉 {ar ? "برونزي" : "Bronze"} {count("bronze")}</span>
          <span className="rounded-full bg-white/20 px-3 py-1">⏱️ {ar ? "~200 ساعة للبلاتينيوم" : "~200 h to Platinum"}</span>
        </div>
      </header>

      <div className="card mb-5 border-[#ef4444]/40 p-4 text-[14px] leading-relaxed">
        <b className="text-error">{ar ? "⚠️ الكأس الوحيد اللي ممكن يفوت: " : "⚠️ The only possibly missable trophy: "}</b>
        <span dir="ltr">Positive Mental Attitude</span>
        {ar ? " — سوّ تأمل Lucia في البلكونة بالفصل الأول قبل ما يخلص، وبعدها تأمّل في كل أماكن التأمل." : " — do Lucia's balcony meditation in Chapter 1 before it ends, then meditate at every spot."}
      </div>

      <Videos ids={TROPHY_VIDEOS} locale={locale} title={ar ? "شوف دليل البلاتينيوم بالفيديو" : "Platinum guides on video"} />

      <TrophyList trophies={TROPHIES} locale={locale} />

      <section className="mt-6">
        <h2 className="mb-2 text-[17px] text-muted">{ar ? "المصادر" : "Sources"}</h2>
        <ul className="space-y-1.5">
          {TROPHY_SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 text-[13px] text-success hover:underline" dir="ltr">
                <ExternalLink className="size-3.5" /> {s.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
