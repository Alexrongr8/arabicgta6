"use client";
import { useState, useTransition } from "react";
import { hideContent } from "@/lib/community/actions";
import { communityFeedback } from "@/lib/community/feedback";

export function ModerationButton({ kind, id, ar }: { kind: "comment" | "submission"; id: string; ar: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="max-w-56 shrink-0 text-end">
      <button type="button" disabled={pending} className="h-11 rounded-lg bg-[#ef4444] px-3 text-[12px] font-bold text-black disabled:opacity-50"
        onClick={() => start(async () => {
          setError(null);
          try {
            const result = await hideContent(kind, id);
            if (!result.ok) setError(communityFeedback(result.error, ar, "moderation"));
          } catch {
            setError(communityFeedback("unavailable", ar, "moderation"));
          }
        })}>
        {pending ? (ar ? "جاري الإخفاء…" : "Hiding…") : (ar ? "إخفاء" : "Hide")}
      </button>
      {error && <p role="alert" className="mt-1 text-[12px] text-error">{error}</p>}
    </div>
  );
}
