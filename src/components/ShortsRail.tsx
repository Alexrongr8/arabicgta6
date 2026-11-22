import Link from "next/link";
import { Play } from "lucide-react";
import type { Short } from "@/lib/data";
import type { Locale } from "@/lib/types";

/** Homepage strip of vertical GTA 6 Shorts; each opens the full-screen feed at that video. */
export function ShortsRail({ shorts, locale }: { shorts: Short[]; locale: Locale }) {
  const ar = locale === "ar";
  if (!shorts.length) return null;
  return (
    <section className="mx-auto mt-6 max-w-6xl px-4" aria-labelledby="shorts-title">
      <div className="mb-3 flex items-end justify-between">
        <h2 id="shorts-title" className="flex items-center gap-2 text-lg font-extrabold md:text-xl">
          <span className="grid size-7 place-items-center rounded-full bg-[#ff0033] text-white"><Play className="size-3.5 fill-white" /></span>
          {ar ? "شورتس GTA 6 🎬" : "GTA 6 Shorts 🎬"}
        </h2>
        <Link href="/shorts" className="text-sm font-bold text-accent">{ar ? "شوف الكل" : "Watch all"}</Link>
      </div>
      <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
        {shorts.map((s) => (
          <li key={s.video_id} className="shrink-0 snap-start">
            <Link href={`/shorts?v=${s.video_id}`} className="card-hover relative block aspect-[9/16] w-[38vw] max-w-[180px] overflow-hidden rounded-2xl bg-black shadow-md sm:w-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://i.ytimg.com/vi/${s.video_id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" width={480} height={360} className="absolute inset-0 size-full scale-[1.02] object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <span className="absolute top-2 grid size-8 place-items-center rounded-full bg-black/45 text-white ltr:left-2 rtl:right-2"><Play className="size-4 fill-white" /></span>
              <span className="absolute inset-x-2 bottom-2 line-clamp-3 text-[12px] font-bold leading-snug text-white" dir="auto">{s.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
