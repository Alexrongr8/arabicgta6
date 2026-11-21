import { Bidi } from "./Bidi";
/** Renders the simple body format: paragraphs separated by blank lines, "- " bullet lines. */
export function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="prose-item text-[15.5px]">
      {blocks.map((b, i) => {
        let lines = b.split("\n").map((l) => l.trim());
        let heading: React.ReactNode = null;
        if (/^#{2,3} /.test(lines[0])) {
          heading = (
            <h2 className="mt-6 mb-2 text-[20px] text-accent">
              <Bidi text={lines[0].replace(/^#{2,3} /, "")} />
            </h2>
          );
          lines = lines.slice(1);
          if (!lines.length) return <div key={i}>{heading}</div>;
        }
        // keep order: group consecutive "- " lines into lists, other lines into paragraphs
        const groups: { list: boolean; lines: string[] }[] = [];
        for (const l of lines) {
          const list = l.startsWith("- ");
          const last = groups[groups.length - 1];
          if (last && last.list === list) last.lines.push(list ? l.slice(2) : l);
          else groups.push({ list, lines: [list ? l.slice(2) : l] });
        }
        return (
          <div key={i}>
            {heading}
            {groups.map((g, j) =>
              g.list ? (
                <ul key={j}>
                  {g.lines.map((l, k) => (
                    <li key={k}>
                      <Bidi text={l} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={j}>
                  <Bidi text={g.lines.join(" ")} />
                </p>
              ),
            )}
          </div>
        );
      })}
    </div>
  );
}
