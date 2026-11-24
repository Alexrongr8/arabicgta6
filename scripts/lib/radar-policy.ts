import { checkPublicHttpsUrl, type SafeResult } from "../../src/lib/safe-fetch";
import { urlKey } from "./url-key";
import { isSpoiler } from "../../src/lib/spoiler";
import type { AiItem } from "./ai";

const CREATOR_IDENTITIES = "Bilal Fadili UCw81FIQlzaVxgiQKiqTuCBQ; BanderitaX UCxEGVXh6fi-XYo58NZrbIHQ; RimaOsta UCFlp8ti7kvEMbiqAE8Zazag; 3mr https://kick.com/3mr and UC6gTOqPVfx6g6Cmi8Ah80pA; Drb7h https://kick.com/drb7h; Xzit UCUwf9tuytTCVP6SzMaGwDVA; SXB https://kick.com/SXB and UC5hnxbraFmMPxv63U4hCwTQ; AboFlah UCqq5n-Oe-r1EEHI3yvhVJcA and UCRu9mro2nPafhMxVy2CRfXA.";
export const BEAMS = [
  { id: "official", focus: "Official Rockstar/Take-Two/platform announcements, Newswire posts, patch notes, events and GTA Online/GTA VI updates.", domains: ["rockstargames.com", "take2games.com", "blog.playstation.com", "news.xbox.com"] },
  { id: "press-news", focus: "The newest GTA VI news stories from major gaming press (sales records, updates, features, interviews, guides, controversies about the game itself)." },
  { id: "patches-bugs", focus: "Title-update notes, known issues, glitches and fixes. Record the tested build, or unknown." },
  { id: "gameplay-discoveries", focus: "New secrets, easter eggs, collectibles, hidden places, strange or funny moments found by players, with video/screenshot evidence or press coverage." },
  { id: "money-guides", focus: "Money methods, businesses, heists, best cars/weapons to buy, and practical progression tips that players or press have documented." },
  { id: "reddit-leaks", focus: "Notable community findings, leaks and rumors from Reddit (r/GTA6, r/GTAVI, r/GrandTheftAutoV_PC) and X insiders. Always label unverified claims as rumor or leak." },
  { id: "settings-hardware", focus: "PS5/Xbox, TV/HDR, Remote Play, accessibility and best settings; prefer manufacturer documentation. Stream/TV interpolation is not game FPS." },
  { id: "community-creators", focus: `New in-game facts or notable events from known creators, never drama. Use exact identities, never free-name searches: ${CREATOR_IDENTITIES} Reactions, RP and general GTA footage are not GTA VI gameplay evidence.` },
  { id: "arabic-news", focus: "GTA VI news and guides covered by Arabic gaming outlets and Arab creators (True Gaming, Saudi Gamer, Arab Hardware, YouTube/X in Arabic)." },
] as const;
export type BeamId = typeof BEAMS[number]["id"];
export type Lead = { headline: string; gist: string; url: string; category: string; confidence: "high" | "medium" | "low"; entity_name: string | null };
export type Usage = { requests: number; inputTokens: number; outputTokens: number; searchCalls: number };
export type Research<T> = { data: T; retrievedUrls: string[]; responseId: string; usage: Usage; completedSearches: number };
export type Support = { url: string; quote: string; fields: string[] };
export type Draft = { item: AiItem; proof: { support: Support[]; story_spoilers: boolean; game_build: string | null; in_scope: boolean } };
export type Pending = { lead: Lead; beam: BeamId; discoveredAt: string; retrievedUrls: string[]; responseId: string; attempts: number };
export type State = { version: 1; nextBeam: number; windows: Partial<Record<BeamId, string>>; pending: Pending | null; reviewedKeys: string[] };
export type Known = { slug: string; title_en: string; title_ar?: string; published_at?: string; sources: { url: string }[]; videos?: string[] };
export const emptyState = (): State => ({ version: 1, nextBeam: 0, windows: {}, pending: null, reviewedKeys: [] });
const normalized = (s: string) => s.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
export function similar(a: string, b: string): number {
  const aa = new Set(normalized(a).split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 2));
  const bb = new Set(normalized(b).split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 2));
  return aa.size && bb.size ? [...aa].filter((w) => bb.has(w)).length / Math.min(aa.size, bb.size) : 0;
}
export function config(env: Record<string, string | undefined>) {
  const max = env.UPDATE_MAX_ITEMS?.trim() || "1";
  // UPDATE_MAX_ITEMS = topics (beams) researched per run; each costs at most two paid requests.
  if (!/^[0-4]$/.test(max)) throw new Error("RADAR-POLICY permits UPDATE_MAX_ITEMS between 0 and 4.");
  if (env.ENRICH_PER_RUN?.trim() && env.ENRICH_PER_RUN !== "0") throw new Error("Automatic enrichment is disabled by RADAR-POLICY.");
  const beam = env.RADAR_BEAMS?.trim();
  if (beam && beam !== "rotate" && !BEAMS.some((b) => b.id === beam)) throw new Error("Use RADAR_BEAMS=rotate or one policy beam; multiple/all/legacy beams are disabled.");
  return { enabled: max !== "0", beamsPerRun: Number(max), pinnedBeam: beam && beam !== "rotate" ? beam as BeamId : undefined };
}
export function chooseBeam(state: State, pinned?: BeamId) {
  return BEAMS.find((b) => b.id === (state.pending?.beam ?? pinned)) ?? BEAMS[state.nextBeam % BEAMS.length];
}
export function sinceFor(state: State, beam: BeamId, now: Date): string {
  const prior = state.windows[beam] ? Date.parse(state.windows[beam]!) : now.getTime() - 48 * 3600e3;
  return new Date(prior - 6 * 3600e3).toISOString();
}
export function finishState(state: State, beam: BeamId, at: string, reviewKey?: string): State {
  return { ...state, nextBeam: (BEAMS.findIndex((b) => b.id === beam) + 1) % BEAMS.length,
    windows: { ...state.windows, [beam]: at }, pending: null,
    reviewedKeys: [...new Set([...(reviewKey ? [reviewKey] : []), ...state.reviewedKeys])].slice(0, 100) };
}
/** Same story already published? Stricter for the last 3 days, and Arabic titles are compared too. */
export function isDuplicateOf(known: Known, titleEn: string, titleAr: string | undefined, now: Date): boolean {
  const recent = known.published_at ? now.getTime() - Date.parse(known.published_at) < 72 * 3600e3 : false;
  if (similar(known.title_en, titleEn) >= (recent ? 0.5 : 0.75)) return true;
  return Boolean(titleAr && known.title_ar && similar(known.title_ar, titleAr) >= (recent ? 0.5 : 0.7));
}
export function knownKeys(rows: Known[]): Set<string> {
  return new Set(rows.flatMap((r) => [...(r.sources ?? []).map((s) => urlKey(s.url)), ...(r.videos ?? []).map((v) => /^[\w-]{11}$/.test(v) ? `youtube:${v}` : urlKey(v))]));
}
export function existingEntity(lead: Lead, names: string[]): boolean {
  const entity = lead.entity_name ? normalized(lead.entity_name) : "";
  return names.some((n) => normalized(n) === entity || normalized(n) === normalized(lead.headline));
}
export const POLICY_PROMPT = `Follow docs/RADAR-POLICY: no personal information, piracy/online-cheating tools, gossip, unreleased-content claims or link spam. Sources must be actually retrieved. Wikis alone never establish a fact. Do not infer gameplay from trailer reactions. For every factual field, supply a short verbatim supporting excerpt and its retrieved URL. Do not invent numbers. Do not claim official/confirmed certainty without the right source. Negated wording (not confirmed / غير مؤكد) is legitimate and must not be changed into certainty. Story outcomes require spoiler handling. Leave image selection to the server; do not suggest generated or guessed pictures.`;
export const leadSchema = { type: "object", additionalProperties: false, required: ["leads"], properties: { leads: { type: "array", maxItems: 1, items: { type: "object", additionalProperties: false,
  required: ["headline", "gist", "url", "category", "confidence", "entity_name"], properties: {
    headline: { type: "string" }, gist: { type: "string" }, url: { type: "string" }, category: { type: "string" },
    confidence: { type: "string", enum: ["high", "medium", "low"] }, entity_name: { type: ["string", "null"] },
  } } } } };
export function draftSchema(item: Record<string, unknown>) {
  return { type: "object", additionalProperties: false, required: ["item", "proof"], properties: { item, proof: { type: "object", additionalProperties: false,
    required: ["support", "story_spoilers", "game_build", "in_scope"], properties: { story_spoilers: { type: "boolean" }, game_build: { type: ["string", "null"] }, in_scope: { type: "boolean" },
      support: { type: "array", items: { type: "object", additionalProperties: false, required: ["url", "quote", "fields"], properties: { url: { type: "string" }, quote: { type: "string" }, fields: { type: "array", items: { type: "string" } } } } },
    } } } };
}
const PRESS = ["ign.com", "gamespot.com", "eurogamer.net", "polygon.com", "pcgamer.com", "videogameschronicle.com", "gamesradar.com", "pushsquare.com", "purexbox.com", "rockpapershotgun.com", "kotaku.com", "theverge.com", "true-gaming.net", "saudigamer.com"];
const domainIs = (host: string, domain: string) => host === domain || host.endsWith("." + domain);
export function tier(raw: string): "A" | "C" | "review" {
  const u = checkPublicHttpsUrl(raw); if (!u) return "review";
  const h = u.hostname.toLowerCase();
  if (["rockstargames.com", "take2games.com", "blog.playstation.com", "news.xbox.com", "support.microsoft.com", "learn.microsoft.com"].some((d) => domainIs(h, d))) return "A";
  if (["playstation.com", "sony.com", "lg.com", "samsung.com", "nvidia.com"].some((d) => domainIs(h, d)) && (/^support\./.test(h) || /\/support(?:\/|$)/i.test(u.pathname))) return "A";
  return PRESS.some((d) => domainIs(h, d)) ? "C" : "review";
}
export function plainText(html: string): string {
  return html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ").replace(/<!--[^]*?-->/g, " ").replace(/<[^>]*>/g, " ")
    .replace(/&(?:nbsp|amp|quot|apos|lt|gt);/gi, (m) => ({ "&nbsp;": " ", "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" })[m.toLowerCase()] ?? m)
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, n: string) => { const c = n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : Number(n); return c <= 0x10ffff ? String.fromCodePoint(c) : ""; }).slice(0, 400_000);
}
export function numberTokens(s: string): string[] {
  const text = s.replace(/[٠-٩]/g, (n) => String(n.charCodeAt(0) - 0x660)).replace(/\b(?:GTA\s*6|PS5)\b/gi, "");
  return [...new Set(text.match(/\d+(?:[.,:/-]\d+)*(?:%|٪)?/g) ?? [])].map((n) => n.replace(/,/g, "").replace(/٪/g, "%"));
}
export type SourceReader = (url: string) => Promise<SafeResult | null>;
export type GateResult = { decision: "publish" | "review"; gates: string[]; item: AiItem; sourceChecks: { url: string; finalUrl: string; tier: string; status: number }[] };
/** Structural proof gates, not a claim of automatic semantic/video verification. Uncertain cases are held. */
export async function verifyDraft(draft: Draft, retrieved: string[], read: SourceReader): Promise<GateResult> {
  const item = draft.item;
  const gates: string[] = [];
  const fields = ["title_ar", "title_en", "summary_ar", "summary_en", "body_ar", "body_en"] as const;
  const texts = fields.map((k) => item?.[k]);
  if (texts.some((s) => typeof s !== "string" || !s.trim()) || (item?.body_ar?.trim().length ?? 0) < 300 || texts.some((s) => typeof s === "string" && s.length > 12_000)) gates.push("3:bilingual-content");
  const found = new Set(retrieved.map(urlKey));
  const citations = [...new Map((Array.isArray(item?.sources) ? item.sources : []).filter((s) => typeof s.url === "string" && checkPublicHttpsUrl(s.url) && found.has(urlKey(s.url))).map((s) => [urlKey(s.url), s])).values()].slice(0, 6);
  if (!citations.length) gates.push("1:no-retrieved-source");
  const fetched = new Map<string, { text: string; tier: string }>();
  const sourceChecks: GateResult["sourceChecks"] = [];
  for (const s of citations) {
    const r = await read(s.url);
    if (!r || r.status !== 200) continue;
    const t = tier(r.finalUrl);
    sourceChecks.push({ url: s.url, finalUrl: r.finalUrl, tier: t, status: r.status });
    fetched.set(urlKey(s.url), { text: /(?:html|text\/plain)/i.test(r.contentType) ? normalized(plainText(r.body.toString("utf8"))) : "", tier: t });
  }
  item.sources = citations.filter((s) => fetched.has(urlKey(s.url)));
  if (!item.sources.length) gates.push("2:no-reachable-source");
  const proof = draft.proof;
  if (!proof?.in_scope) gates.push("scope:review-required");
  // No text-only model assertion can certify a screenshot, video segment or source independence.
  // Official text with actual supporting excerpts is eligible; the rest awaits editorial review.
  if (![...fetched.values()].some((s) => s.tier === "A")) gates.push("4:visual-or-independent-source-review");
  if (item.status !== "official") gates.push("4:status-claim-review"); // retains honest negated language unchanged
  if (proof?.story_spoilers || isSpoiler(item)) { item.tags = [...new Set([...(item.tags ?? []), "story-spoilers"])]; gates.push("5:spoiler-headline-review"); }
  if (item.location) gates.push("7:manual-map-evidence");
  const required = new Set<string>([...fields, ...(item.facts ?? []).map((_, i) => `facts:${i}`), ...(item.event_date ? ["event_date"] : [])]);
  const supported = new Set<string>(); const quotes: string[] = [];
  for (const p of (proof?.support ?? []).slice(0, 12)) {
    const source = fetched.get(urlKey(p.url)); const quote = typeof p.quote === "string" ? normalized(p.quote) : "";
    if (!source || source.tier !== "A" || quote.length < 12 || quote.length > 180 || !source.text.includes(quote)) continue;
    quotes.push(p.quote); for (const f of p.fields ?? []) if (required.has(f)) supported.add(f);
  }
  if ([...required].some((f) => !supported.has(f))) gates.push("4:missing-retrieved-support");
  const claims = [...texts, ...(item.facts ?? []).flatMap((f) => [f.k_en, f.k_ar, f.v_en, f.v_ar]), item.event_date ?? ""].join(" ");
  const sourceNumbers = new Set(numberTokens(quotes.join(" ")));
  if (numberTokens(claims).some((n) => !sourceNumbers.has(n))) gates.push("7:unsupported-number");
  if (item.category === "glitches" && !proof?.game_build) gates.push("7:missing-tested-build-or-unknown");
  // Owner decision 2026-11-22: publish automatically, but keep the status badge honest.
  // Only missing/unreachable sources, out-of-scope or incomplete text are held (never published).
  // Owner decision 2026-11-22 (2): items without a verifiable source are still published,
  // as rumor and visibly marked "unknown source". Only off-topic or incomplete drafts are held.
  const hard = gates.some((g) => /^3:|^scope:/.test(g));
  const unsourced = gates.some((g) => /^(1|2):/.test(g));
  if (!hard && unsourced) {
    item.status = item.status === "leak" ? "leak" : "rumor";
    item.tags = [...new Set([...(item.tags ?? []), "source-unknown"])];
    item.location = null;
  } else if (!hard) {
    const tiers = [...fetched.values()].map((f) => f.tier);
    const unsupportedNumbers = gates.includes("7:unsupported-number");
    const fullySupported = !gates.includes("4:missing-retrieved-support") && !unsupportedNumbers;
    const honest: AiItem["status"] =
      item.status === "official" && tiers.includes("A") && fullySupported ? "official"
      : item.status === "leak" ? "leak"
      : (item.status === "official" || item.status === "confirmed") && !unsupportedNumbers && tiers.some((t) => t === "A" || t === "C") ? "confirmed"
      : "rumor";
    if (honest !== item.status) gates.push(`status:${item.status}->${honest}`);
    item.status = honest;
    item.location = null; // map pins stay a manual, evidence-based step
  }
  return { decision: hard ? "review" : "publish", gates, item, sourceChecks };
}
