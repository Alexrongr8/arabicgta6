import { Fragment } from "react";

// Middle characters include all Unicode hyphens/dashes (U+2010-2015), so "Take‑Two" stays one run.
const LATIN = /[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F0-9 .,'’&\-\u2010-\u2015:+#|$/_@]*[A-Za-z\u00C0-\u024F0-9.'$]|[A-Za-z\u00C0-\u024F]/g;

/** Isolates Latin runs inside Arabic text so names like "(Lucia Caminos)" render correctly in RTL. */
export function Bidi({ text }: { text: string }) {
  if (!/[؀-ۿ]/.test(text) || !/[A-Za-z]/.test(text)) return <>{text}</>;
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LATIN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    out.push(
      <bdi key={i} dir="ltr">
        {m[0]}
      </bdi>,
    );
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return (
    <>
      {out.map((n, i) => (
        <Fragment key={i}>{n}</Fragment>
      ))}
    </>
  );
}
