import { Bidi } from "./Bidi";
/** Renders the simple body format: paragraphs separated by blank lines, "- " bullet lines. */
export function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="prose-item text-[15.5px]">
      {blocks.map((b, i) => {
        const lines = b.split("\n").map((l) => l.trim());
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}><Bidi text={l.slice(2)} /></li>
              ))}
            </ul>
          );
        }
        const intro = lines.filter((l) => !l.startsWith("- "));
        const bullets = lines.filter((l) => l.startsWith("- "));
        return (
          <div key={i}>
            <p><Bidi text={intro.join(" ")} /></p>
            {bullets.length > 0 && (
              <ul>
                {bullets.map((l, j) => (
                  <li key={j}><Bidi text={l.slice(2)} /></li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
