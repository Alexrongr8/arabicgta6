"use client";
import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { vote } from "@/lib/community/actions";
import type { Votes } from "@/lib/community/data";

export function VoteBar({ target, votes, path, ar, question = true }: { target: string; votes: Votes; path: string; ar: boolean; question?: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [v, setV] = useOptimistic(votes);
  const click = (val: 1 | -1) =>
    start(async () => {
      const next = v.mine === val ? 0 : val;
      setV({
        up: v.up + (next === 1 ? 1 : 0) - (v.mine === 1 ? 1 : 0),
        down: v.down + (next === -1 ? 1 : 0) - (v.mine === -1 ? 1 : 0),
        mine: next,
      });
      const r = await vote(target, next, path);
      if (!r.ok && r.error === "auth") router.push(`/login?next=${encodeURIComponent(path)}`);
    });
  const btn = (on: boolean) => `inline-flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-sm font-extrabold transition ${on ? "border-transparent bg-pink text-black" : "border-line bg-chip text-fg"}`;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {question && <span className="text-[13px] font-bold text-muted">{ar ? "هل أفادك؟" : "Was this useful?"}</span>}
      <button type="button" disabled={pending} onClick={() => click(1)} aria-label={ar ? `أفادني — ${v.up} صوت` : `Helpful — ${v.up} votes`} aria-pressed={v.mine === 1} className={btn(v.mine === 1)}>
        <ThumbsUp aria-hidden="true" className="size-4" /> {v.up}
      </button>
      <button type="button" disabled={pending} onClick={() => click(-1)} aria-label={ar ? `لم يفدني — ${v.down} صوت` : `Not helpful — ${v.down} votes`} aria-pressed={v.mine === -1} className={btn(v.mine === -1)}>
        <ThumbsDown aria-hidden="true" className="size-4" /> {v.down}
      </button>
    </div>
  );
}
