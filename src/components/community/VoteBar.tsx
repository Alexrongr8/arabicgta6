"use client";
import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { vote } from "@/lib/community/actions";
import { communityFeedback } from "@/lib/community/feedback";
import type { Votes } from "@/lib/community/data";

export function VoteBar({ target, votes, path, ar, question = true }: { target: string; votes: Votes; path: string; ar: boolean; question?: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [v, setV] = useOptimistic(votes);
  const [error, setError] = useState<string | null>(null);
  const click = (val: 1 | -1) =>
    start(async () => {
      setError(null);
      const next = v.mine === val ? 0 : val;
      setV({
        up: v.up + (next === 1 ? 1 : 0) - (v.mine === 1 ? 1 : 0),
        down: v.down + (next === -1 ? 1 : 0) - (v.mine === -1 ? 1 : 0),
        mine: next,
      });
      try {
        const r = await vote(target, next, path);
        if (!r.ok) {
          setV(votes);
          setError(communityFeedback(r.error, ar, "vote"));
          if (r.error === "auth") router.push(`/login?next=${encodeURIComponent(path)}`);
        }
      } catch {
        setV(votes);
        setError(communityFeedback("unavailable", ar, "vote"));
      }
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
      {error && <p role="alert" className="w-full text-[12px] text-error">{error}</p>}
    </div>
  );
}
