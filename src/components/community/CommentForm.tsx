"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { addComment } from "@/lib/community/actions";

const ERR = {
  ar: { auth: "سجّل دخولك عشان تعلّق.", invalid: "التعليق قصير أو فيه روابط.", limit: "وصلت الحد اليومي للتعليقات.", offline: "التعليقات تشتغل بعد ربط قاعدة البيانات." },
  en: { auth: "Sign in to comment.", invalid: "Comment too short or contains links.", limit: "Daily comment limit reached.", offline: "Comments work once the database is connected." },
};

export function CommentForm({ target, path, ar, signedIn }: { target: string; path: string; ar: boolean; signedIn: boolean }) {
  const [text, setText] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  if (!signedIn)
    return (
      <Link href={`/login?next=${encodeURIComponent(path)}`} className="block rounded-2xl border border-dashed border-line bg-chip p-4 text-center text-[14px] font-bold text-muted hover:text-pink">
        {ar ? "💬 سجّل بحساب Google وشاركنا رأيك أو تجربتك" : "💬 Sign in with Google to share your take"}
      </Link>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await addComment(target, text, path);
          if (r.ok) {
            setText("");
            setMsg(null);
          } else setMsg(ERR[ar ? "ar" : "en"][r.error]);
        });
      }}
      className="space-y-2"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1500}
        rows={3}
        placeholder={ar ? "اكتب تعليقك… جربتها؟ لقيت شي زيادة؟" : "Write a comment… tried it? found more?"}
        className="w-full rounded-2xl border border-line bg-card p-3 text-[15px] outline-none focus:border-pink"
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] text-[#dc2626]">{msg}</span>
        <button disabled={pending || text.trim().length < 2} className="h-10 rounded-xl bg-pink px-5 text-sm font-extrabold text-white disabled:opacity-50">
          {pending ? "…" : ar ? "انشر" : "Post"}
        </button>
      </div>
    </form>
  );
}
