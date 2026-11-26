import Link from "next/link";
import { categoryThumb, thumbFor } from "@/lib/image";
import { Gamepad2, KeyRound, Shuffle, Target } from "lucide-react";
import type { ItemCard, Locale } from "@/lib/types";
import type { Challenge } from "../../data/challenges";
import { Bidi } from "./Bidi";
import { Cover } from "./Cover";
import { StatusBadge } from "./StatusBadge";

export function DailyCards({ secret, challenge, locale }: { secret: ItemCard | null; challenge: Challenge; locale: Locale }) {
  const ar = locale === "ar";
  return (
    <section className="mx-auto mt-6 grid max-w-6xl gap-3 px-4 md:grid-cols-2 lg:grid-cols-3">
      {secret && (
        <Link href={`/item/${secret.slug}`} className="card-hover relative flex min-h-[170px] flex-col justify-end overflow-hidden rounded-3xl p-4 text-white shadow-lg" style={{ background: "linear-gradient(150deg,#7c3aed,#2a1240)" }}>
          <Cover src={thumbFor(secret, 640)} fallback={categoryThumb(secret.category, 640)} className="absolute inset-0 size-full object-cover opacity-60" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <span className="relative mb-2 inline-flex w-fit -rotate-2 items-center gap-1.5 rounded-full bg-[#ffd166] px-3 py-1 text-[12px] font-extrabold text-[#2a1240]">
            <KeyRound className="size-3.5" /> {ar ? "سر اليوم" : "Secret of the day"}
          </span>
          <span className="relative mb-1.5 w-fit">
            <StatusBadge status={secret.status} locale={locale} />
          </span>
          <span className="font-head relative text-[20px] leading-snug">
            <Bidi text={ar ? secret.title_ar : secret.title_en} />
          </span>
          <span className="relative mt-1 line-clamp-2 text-[12.5px] text-white/85">
            <Bidi text={ar ? secret.summary_ar : secret.summary_en} />
          </span>
        </Link>
      )}
      <Link
        href={challenge.link ? `/item/${challenge.link}` : "/explore"}
        className="card-hover relative flex min-h-[170px] flex-col justify-end overflow-hidden rounded-3xl p-4 text-white shadow-lg"
        style={{ background: "linear-gradient(#0006,#0006), linear-gradient(150deg,#ff8a1f,#f0287a 70%)" }}
      >
        <Target className="absolute end-3 top-3 size-20 opacity-20" />
        <span className="relative mb-2 inline-flex w-fit rotate-2 items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[12px] font-extrabold text-[#b91358]">
          <Target className="size-3.5" /> {ar ? "تحدي الأسبوع" : "Challenge of the week"}
        </span>
        <span className="font-head relative text-[21px] leading-snug">
          <Bidi text={ar ? challenge.ar : challenge.en} />
        </span>
        <span className="relative mt-1 text-[12.5px] text-white/90">
          💡 <Bidi text={ar ? challenge.hintAr : challenge.hintEn} />
        </span>
      </Link>
      <div className="grid gap-3 md:col-span-2 md:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
        <Link href="/play" className="card-hover relative flex min-h-[80px] items-center gap-3 overflow-hidden rounded-3xl p-4 text-white shadow-lg" style={{ background: "linear-gradient(135deg,#2a1240,#7c3aed)" }}>
          <Gamepad2 className="absolute -end-2 -bottom-3 size-24 opacity-15" />
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/15"><Gamepad2 className="size-6" /></span>
          <span className="relative">
            <span className="font-head block text-[20px] leading-tight">{ar ? "تحدي اليوم 🎮" : "Daily challenge 🎮"}</span>
            <span className="block text-[12.5px] text-white/85">{ar ? "5 أسئلة جديدة عن سيارات وأسلحة Leonida. كم تجيب؟" : "5 new questions on Leonida's cars and weapons. How many can you get?"}</span>
          </span>
        </Link>
        <a href="/random" className="card-hover relative flex min-h-[80px] items-center gap-3 overflow-hidden rounded-3xl p-4 text-[#241338] shadow-lg" style={{ background: "linear-gradient(135deg,#ffd166,#ff8a1f)" }}>
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/40"><Shuffle className="size-6" /></span>
          <span>
            <span className="font-head block text-[20px] leading-tight">{ar ? "فاجئني 🎲" : "Surprise me 🎲"}</span>
            <span className="block text-[12.5px] font-bold opacity-80">{ar ? "سر أو موقف عشوائي ما تتوقعه" : "A random secret or moment you didn't expect"}</span>
          </span>
        </a>
      </div>
    </section>
  );
}
