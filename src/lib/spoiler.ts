/** Story-spoiler articles: their summary/cover/videos stay hidden until the reader chooses to see them. */
export function isSpoiler(i: { category: string; tags?: string[] | null }): boolean {
  return i.category === "choices" || (i.tags ?? []).some((t) => /spoiler/i.test(t));
}

export const SPOILER_TEASER = {
  ar: "⚠️ فيه حرق لأحداث القصة — افتحه لما تكون جاهز.",
  en: "⚠️ Contains story spoilers — open it when you're ready.",
};
