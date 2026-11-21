"use client";
import { useState } from "react";
import { Play } from "lucide-react";

/** Lightweight YouTube embeds: show the thumbnail, load the player only when tapped. */
export function Videos({ ids, title }: { ids: string[]; title: string }) {
  const [playing, setPlaying] = useState<string | null>(null);
  if (!ids.length) return null;
  return (
    <section className="mb-5">
      <h2 className="mb-3 flex items-center gap-2 text-[20px]">
        <span className="grid size-7 place-items-center rounded-full bg-[#ff0033] text-white">
          <Play className="size-3.5 fill-white" />
        </span>
        {title}
      </h2>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
        {ids.map((id) => (
          <div key={id} className="relative aspect-video w-[86%] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-black shadow-md sm:w-[420px]">
            {playing === id ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 size-full"
              />
            ) : (
              <button type="button" onClick={() => setPlaying(id)} className="group absolute inset-0" aria-label="Play video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="size-full object-cover opacity-90 transition group-hover:opacity-100" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-12 w-16 place-items-center rounded-2xl bg-[#ff0033] shadow-lg transition group-active:scale-95">
                    <Play className="size-6 fill-white text-white" />
                  </span>
                </span>
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
