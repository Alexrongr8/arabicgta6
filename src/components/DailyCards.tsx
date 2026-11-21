import Link from "next/link";
import { thumbFor } from "@/lib/image";
import { KeyRound, Target } from "lucide-react";
import type { ItemCard, Locale } from "@/lib/types";
import type { Challenge } from "../../data/challenges";
import { Bidi } from "./Bidi";
import { Cover } from "./Cover";
import { StatusBadge } from "./StatusBadge";

export function DailyCards({ secret, challenge, locale }: { secret: ItemCard | null; challenge: Challenge; locale: Locale }) {
  const ar = locale === "ar";
  return (
    <section className="mx-auto mt-6 grid max-w-6xl gap-3 px-4 md:grid-cols-2">
      {secret && (
        <Link href={`/item/${secret.slug}`} className="card-hover relative flex min-h-[170px] flex-col justify-end overflow-hidden rounded-3xl p-4 text-white shadow-lg" style={{ background: "linear-gradient(150deg,#7c3aed,#2a1240)" }}>
          <Cover src={thumbFor(secret, 640)} className="absolute inset-0 size-full object-cover opacity-60" />
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
    </section>
  );
}
