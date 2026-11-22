"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Play } from "lucide-react";
import type { Short } from "@/lib/data";

/** Full-screen, swipe-up feed like TikTok/Shorts. Only the video on screen loads a player. */
export function ShortsFeed({ shorts, start, ar }: { shorts: Short[]; start: string | null; ar: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const refs = useRef(new Map<string, HTMLElement>());
  const Back = ar ? ArrowRight : ArrowLeft;

  useEffect(() => {
    const first = start && refs.current.get(start);
    if (first) first.scrollIntoView({ block: "start" });
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting && e.intersectionRatio > 0.6) setActive((e.target as HTMLElement).dataset.id ?? null);
    }, { threshold: [0.6] });
    refs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [start]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <Link href="/" className="absolute top-3 z-10 inline-flex h-11 items-center gap-1 rounded-full bg-black/50 px-4 text-sm font-bold text-white backdrop-blur ltr:left-3 rtl:right-3">
        <Back className="size-4" /> {ar ? "رجوع" : "Back"}
      </Link>
      <div className="no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll">
        {shorts.map((s) => (
          <section key={s.video_id} data-id={s.video_id} ref={(el) => { if (el) refs.current.set(s.video_id, el); else refs.current.delete(s.video_id); }}
            className="relative flex h-dvh snap-start snap-always items-center justify-center">
            <div className="relative aspect-[9/16] h-full max-h-dvh max-w-full">
              {active === s.video_id ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${s.video_id}?autoplay=1&playsinline=1&rel=0&loop=1&playlist=${s.video_id}`}
                  title={s.title}
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 size-full"
                />
              ) : (
                <button type="button" onClick={() => setActive(s.video_id)} className="absolute inset-0 size-full" aria-label={(ar ? "شغّل: " : "Play: ") + s.title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.ytimg.com/vi/${s.video_id}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                  <span className="absolute inset-0 grid place-items-center"><span className="grid size-16 place-items-center rounded-full bg-black/50 text-white"><Play className="size-7 fill-white" /></span></span>
                </button>
              )}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-8 text-white">
              <p className="line-clamp-2 text-[15px] font-bold" dir="auto">{s.title}</p>
              {s.channel && <p className="mt-1 text-[12px] text-white/75" dir="auto">{s.channel}</p>}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
