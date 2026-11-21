import { getComments } from "@/lib/community/data";
import { formatDate } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { Bidi } from "../Bidi";
import { CommentForm } from "./CommentForm";

export async function Comments({ target, path, locale, signedIn }: { target: string; path: string; locale: Locale; signedIn: boolean }) {
  const ar = locale === "ar";
  const comments = await getComments(target);
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-[20px]">
        💬 {ar ? "تعليقات اللاعبين" : "Player comments"} <span className="text-[15px] text-dim">({comments.length})</span>
      </h2>
      <div className="mb-3 space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="card flex gap-3 p-3">
            {c.author_avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.author_avatar} alt="" referrerPolicy="no-referrer" className="size-9 shrink-0 rounded-full" />
            ) : (
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-chip2 font-bold">{c.author_name[0]}</span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[13px]">
                <b>{c.author_name}</b> <span className="text-dim">· {formatDate(c.created_at, locale)}</span>
              </p>
              <p className="mt-0.5 text-[14.5px] leading-relaxed whitespace-pre-line">
                <Bidi text={c.body} />
              </p>
            </div>
          </div>
        ))}
        {!comments.length && <p className="text-[13px] text-dim">{ar ? "كن أول واحد يعلّق 👋" : "Be the first to comment 👋"}</p>}
      </div>
      <CommentForm target={target} path={path} ar={ar} signedIn={signedIn} />
    </section>
  );
}
