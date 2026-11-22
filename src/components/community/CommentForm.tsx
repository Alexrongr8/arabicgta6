"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { addComment } from "@/lib/community/actions";

import { communityFeedback } from "@/lib/community/feedback";

export function CommentForm({ target, path, ar, signedIn }: { target: string; path: string; ar: boolean; signedIn: boolean }) {
  const [text, setText] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  if (!signedIn)
    return (
      <Link href={`/login?next=${encodeURIComponent(path)}`} className="block rounded-2xl border border-dashed border-line bg-chip p-4 text-center text-[14px] font-bold text-muted hover:text-accent">
        {ar ? "💬 سجّل بحساب Google وشاركنا رأيك أو تجربتك" : "💬 Sign in with Google to share your take"}
      </Link>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (pending) return;
        start(async () => {
          setMsg(null);
          try {
            const r = await addComment(target, text, path);
            if (r.ok) {
              setText("");
              setMsg({ ok: true, text: ar ? "تم نشر تعليقك." : "Your comment was posted." });
            } else setMsg({ ok: false, text: communityFeedback(r.error, ar, "comment") });
          } catch {
            setMsg({ ok: false, text: communityFeedback("unavailable", ar, "comment") });
          }
        });
      }}
      className="space-y-2"
      aria-busy={pending}
    >
      <label className="block space-y-1.5">
        <span className="block text-[13px] font-bold">{ar ? "تعليقك" : "Your comment"}</span>
        <textarea
          disabled={pending}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1500}
          rows={3}
          placeholder={ar ? "اكتب تعليقك… جربتها؟ لقيت شي زيادة؟" : "Write a comment… tried it? found more?"}
          className="w-full rounded-2xl border border-control bg-card p-3 text-[16px] outline-none focus:border-pink"
        />
      </label>
      <div className="flex items-center justify-between gap-2">
        <span role="status" aria-live="polite" aria-atomic="true" className={`text-[12px] ${msg?.ok ? "text-success" : "text-error"}`}>{msg?.text}</span>
        <button disabled={pending || text.trim().length < 2} className="h-10 rounded-xl bg-pink px-5 text-sm font-extrabold text-black disabled:opacity-50">
          {pending ? (ar ? "جاري النشر…" : "Posting…") : ar ? "انشر" : "Post"}
        </button>
      </div>
    </form>
  );
}
