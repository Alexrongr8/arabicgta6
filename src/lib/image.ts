/** Who to credit for a cover image. */
export function imageCredit(src: string): string {
  if (src.startsWith("/img/")) return "Rockstar Games";
  try {
    return new URL(src).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
