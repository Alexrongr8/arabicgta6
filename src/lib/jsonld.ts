/** Serialise JSON-LD for a <script> tag; escapes "<" so stored text can never close the tag (Next.js JSON-LD guide). */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
