import { checkPublicHttpsUrl, type SafeResult } from "../../src/lib/safe-fetch";
import { urlKey } from "./url-key";
import { isSpoiler } from "../../src/lib/spoiler";
import type { AiItem } from "./ai";

const CREATOR_IDENTITIES = "Bilal Fadili UCw81FIQlzaVxgiQKiqTuCBQ; BanderitaX UCxEGVXh6fi-XYo58NZrbIHQ; RimaOsta UCFlp8ti7kvEMbiqAE8Zazag; 3mr https://kick.com/3mr and UC6gTOqPVfx6g6Cmi8Ah80pA; Drb7h https://kick.com/drb7h; Xzit UCUwf9tuytTCVP6SzMaGwDVA; SXB https://kick.com/SXB and UC5hnxbraFmMPxv63U4hCwTQ; AboFlah UCqq5n-Oe-r1EEHI3yvhVJcA and UCRu9mro2nPafhMxVy2CRfXA.";
export const BEAMS = [
  { id: "official", focus: "Official Rockstar/Take-Two/platform announcements, Newswire posts, patch notes, events and GTA Online/GTA VI updates.", domains: ["rockstargames.com", "take2games.com", "blog.playstation.com", "news.xbox.com"] },
  { id: "press-news", focus: "The newest GTA VI news stories from major English-language gaming press (IGN, GameSpot, Eurogamer, VGC, Polygon, PC Gamer, Kotaku, GamesRadar, TheGamer, Dexerto, Insider Gaming)." },
  { id: "business-sales", focus: "GTA VI sales figures, records, Take-Two earnings comments, charts, player counts, reviews and awards coverage." },
  { id: "patches-bugs", focus: "Title-update notes, known issues, glitches and fixes. Record the tested build, or unknown." },
  { id: "gameplay-discoveries", focus: "New secrets, easter eggs, collectibles, hidden places, strange or funny moments found by players, with video/screenshot evidence or press coverage." },
  { id: "money-guides", focus: "Money methods, businesses, heists, best cars/weapons to buy, and practical progression tips that players or press have documented." },
  { id: "missions-story", focus: "Mission guides, side activities, characters, choices and consequences, collectibles and 100% completion guides (spoiler-aware)." },
  { id: "reddit-leaks", focus: "Notable community findings, leaks and rumors from Reddit (r/GTA6, r/GTAVI, r/GamingLeaksAndRumours) and X/Twitter insiders. Label unverified claims as rumor or leak." },
  { id: "online-multiplayer", focus: "GTA VI Online / multiplayer news, rumors, datamines, roadmap and community events." },
  { id: "settings-hardware", focus: "PS5/Xbox, PS5 Pro, TV/HDR, Remote Play, accessibility and best settings; PC version rumors. Prefer manufacturer documentation." },
  { id: "community-creators", focus: `New in-game facts or notable events from known creators, never drama. Use exact identities, never free-name searches: ${CREATOR_IDENTITIES} Reactions, RP and general GTA footage are not GTA VI gameplay evidence.` },
  { id: "arabic-news", focus: "GTA VI news and guides covered by Arabic gaming outlets and Arab creators (True Gaming, Saudi Gamer, Arab Hardware, Sky News Arabia tech, YouTube/X in Arabic)." },
  { id: "europe-press", focus: "GTA VI news from non-English European gaming press: German (GameStar, PC Games, 4Players), French (Jeuxvideo.com, Gamekult, Millenium), Spanish (Vandal, 3DJuegos, MeriStation), Italian (Multiplayer.it, Everyeye), Portuguese, Polish, Turkish and Russian sites. Translate into Arabic and English." },
  { id: "asia-press", focus: "GTA VI news from Asian gaming press and communities: Japan (Famitsu, 4Gamer, Game Watch, Automaton), Korea (Inven, Ruliweb), China/Taiwan (Gamersky, 3DM, Bahamut), India and Southeast Asia. Translate into Arabic and English." },
  { id: "latam-press", focus: "GTA VI news from Latin American and Brazilian gaming press and creators (Tecmundo, The Enemy, Voxel, LevelUp, Atomix). Translate into Arabic and English." },
  { id: "social-viral", focus: "Viral GTA VI moments, memes, celebrity/athlete reactions to the game and trending clips on TikTok, YouTube Shorts and X (describe what happened; label unverified as rumor)." },
  { id: "mods-pc", focus: "GTA VI PC port news, modding scene, FiveM/roleplay plans and datamining findings (never piracy or cheats)." },
  { id: "world-places", focus: "Leonida locations, landmarks, real-life places they are based on, wildlife, vehicles and weapons newly documented by players or press." },
] as const;
export type BeamId = typeof BEAMS[number]["id"];
export type Lead = { headline: string; gist: string; url: string; category: string; confidence: "high" | "medium" | "low"; entity_name: string | null; interest?: number; kind?: string };
export type Usage = { requests: number; inputTokens: number; outputTokens: number; searchCalls: number };
export type Research<T> = { data: T; retrievedUrls: string[]; responseId: string; usage: Usage; completedSearches: number };
export type Support = { url: string; quote: string; fields: string[] };
export type Draft = { item: AiItem; proof: { support: Support[]; story_spoilers: boolean; game_build: string | null; in_scope: boolean } };
export type Pending = { lead: Lead; beam: BeamId; discoveredAt: string; retrievedUrls: string[]; responseId: string; attempts: number; queued?: boolean };
/** Extra fresh leads from a discovery wait here, so a later slot can write them without paying for another search. */
export type Queued = { lead: Lead; beam: BeamId; discoveredAt: string; responseId: string };
export type State = { version: 1; nextBeam: number; windows: Partial<Record<BeamId, string>>; pending: Pending | null; reviewedKeys: string[]; queue?: Queued[] };
export const QUEUE_MAX = 12;
export const QUEUE_TTL_MS = 36 * 3600e3;
/** Leads that are not news about the game: an outlet promoting itself, contests, expired events. */
export const BORING_KINDS = ["outlet-promo", "contest", "stats-page", "expired"];
export const acceptableLead = (l: Lead) => (l.interest === undefined || l.interest >= 3) && !BORING_KINDS.includes(l.kind ?? "");
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
  // UPDATE_MAX_ITEMS = topics (beams) researched per run (max 8); each costs at most two paid requests.
  if (!/^[0-8]$/.test(max)) throw new Error("RADAR-POLICY permits UPDATE_MAX_ITEMS between 0 and 8.");
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
const COMMON_WORDS = new Set("gta grand theft auto rockstar games take two playstation xbox series sony microsoft nintendo online leonida vice city jason lucia update patch notes trailer launch reddit youtube tiktok twitch kick report reports reportedly says said new official officially players player mission story mode game gaming news leak leaked leaks rumor rumour release date fans first after before with from that this will could would have here what when where which their they your about into over more most best guide found find finds discover discovered secret secrets hidden glitch money method early claims claim confirms confirmed reveals revealed shows adds fixes million billion sales record records week day days arabic english november december".split(" "));
/** Distinctive words of a headline: version/large numbers and capitalised names that are not everyday GTA vocabulary. */
export function keyTokens(title: string): Set<string> {
  const out = new Set<string>();
  const text = title.normalize("NFKC");
  for (const m of text.matchAll(/\d+(?:[.,]\d+)+|\b\d{3,}\b/g)) { const n = m[0].replace(/,/g, ""); if (!/^20\d\d$/.test(n)) out.add(n); }
  for (const m of text.matchAll(/\b[A-Z][A-Za-z0-9]{3,}\b/g)) { const w = m[0].toLowerCase(); if (!COMMON_WORDS.has(w)) out.add(w); }
  return out;
}
/** Same event told again (a follow-up of a story from the last five days): same version number, or the same distinctive names. */
export function sameStory(knownTitle: string, title: string): boolean {
  const a = keyTokens(knownTitle), b = keyTokens(title);
  if (!a.size || !b.size) return false;
  const shared = [...a].filter((w) => b.has(w));
  if (shared.some((w) => /^\d+(?:\.\d+){2,}$/.test(w))) return true; // build/version numbers such as 01.002.002
  if (shared.length >= 2 && shared.length / Math.min(a.size, b.size) >= 0.5) return true;
  return shared.length >= 1 && similar(knownTitle, title) >= 0.34; // one rare name plus overlapping wording
}
/** Same story already published? Stricter for the last 3 days, and Arabic titles are compared too. */
export function isDuplicateOf(known: Known, titleEn: string, titleAr: string | undefined, now: Date): boolean {
  const age = known.published_at ? now.getTime() - Date.parse(known.published_at) : Infinity;
  const recent = age < 72 * 3600e3;
  if (similar(known.title_en, titleEn) >= (recent ? 0.5 : 0.75)) return true;
  if (age < 120 * 3600e3 && sameStory(known.title_en, titleEn)) return true;
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
export const LEAD_KINDS = ["game-news", "patch", "discovery", "guide", "leak", "sales", "community", "viral", "outlet-promo", "contest", "stats-page", "expired", "other"];
export const leadSchema = { type: "object", additionalProperties: false, required: ["leads"], properties: { leads: { type: "array", maxItems: 3, items: { type: "object", additionalProperties: false,
  required: ["headline", "gist", "url", "category", "confidence", "entity_name", "interest", "kind"], properties: {
    headline: { type: "string" }, gist: { type: "string" }, url: { type: "string" }, category: { type: "string" },
    confidence: { type: "string", enum: ["high", "medium", "low"] }, entity_name: { type: ["string", "null"] },
    interest: { type: "integer", enum: [1, 2, 3, 4, 5] }, kind: { type: "string", enum: LEAD_KINDS },
  } } } } };
/** What counts as a story worth a player's click. Shared by discovery and the editor. */
export const INTEREST_PROMPT = `Only stories a GTA VI player would actually click: what is new in the game, what players found, what Rockstar/Take-Two/Sony/Microsoft did or said, money methods, secrets, glitches, patches, records, viral moments, credible leaks.
NOT a story (kind outlet-promo / contest / stats-page / expired, interest 1): a magazine, website or channel announcing its own issue, review video, livestream, marathon, podcast or guide page; giveaways, contests and bounties; a page of statistics about a streamer; a fan site saying it updated its database; anything whose deadline already passed; a generic aggregator page.
interest: 5 = everyone will talk about it, 4 = most players care, 3 = useful to some players, 2 = weak, 1 = not a story.
The same event must not be reported twice: if the list of covered titles already has this event (same patch number, same leak, same sales figure, same glitch), skip it unless there is a major new development, and then the headline must say what is new.`;
export function draftSchema(item: Record<string, unknown>) {
  return { type: "object", additionalProperties: false, required: ["item", "proof"], properties: { item, proof: { type: "object", additionalProperties: false,
    required: ["support", "story_spoilers", "game_build", "in_scope"], properties: { story_spoilers: { type: "boolean" }, game_build: { type: ["string", "null"] }, in_scope: { type: "boolean" },
      support: { type: "array", items: { type: "object", additionalProperties: false, required: ["url", "quote", "fields"], properties: { url: { type: "string" }, quote: { type: "string" }, fields: { type: "array", items: { type: "string" } } } } },
    } } } };
}
/** Established press. A story reported by one of these is not a rumor; it publishes as confirmed (never official). */
const PRESS = ["ign.com", "gamespot.com", "eurogamer.net", "polygon.com", "pcgamer.com", "videogameschronicle.com", "gamesradar.com", "pushsquare.com", "purexbox.com", "rockpapershotgun.com", "kotaku.com", "theverge.com", "true-gaming.net", "saudigamer.com",
  // English-language press and business/tech desks
  "dexerto.com", "insider-gaming.com", "thegamer.com", "gamerant.com", "vg247.com", "destructoid.com", "techradar.com", "engadget.com", "gamesindustry.biz", "gamedeveloper.com", "pcgamesn.com", "gematsu.com", "windowscentral.com", "tomshardware.com", "digitaltrends.com", "forbes.com", "bloomberg.com", "reuters.com", "bbc.com", "bbc.co.uk", "theguardian.com", "variety.com", "hollywoodreporter.com", "cnbc.com", "ft.com", "wsj.com", "nytimes.com", "apnews.com", "gameinformer.com", "nme.com", "pcmag.com", "cnet.com", "arstechnica.com", "wccftech.com", "videogamer.com", "gamingbolt.com", "twistedvoxel.com", "mp1st.com", "comicbook.com",
  // Arabic
  "arabhardware.net", "vga4a.com", "skynewsarabia.com", "aljazeera.net", "alarabiya.net", "aawsat.com", "ign.me", "tech-wd.com", "aitnews.com",
  // Europe
  "gamestar.de", "pcgames.de", "pcgameshardware.de", "4players.de", "golem.de", "heise.de", "jeuxvideo.com", "gamekult.com", "millenium.org", "jvfrance.com", "vandal.elespanol.com", "3djuegos.com", "as.com", "hobbyconsolas.com", "multiplayer.it", "everyeye.it", "eurogamer.de", "eurogamer.es", "eurogamer.it", "eurogamer.pt", "eurogamer.pl", "eurogamer.nl", "gry-online.pl", "ppe.pl", "dtf.ru", "igromania.ru",
  // Asia
  "famitsu.com", "4gamer.net", "automaton-media.com", "impress.co.jp", "inven.co.kr", "ruliweb.com", "gamersky.com", "3dmgame.com", "gamer.com.tw", "ign.com.cn", "indiatimes.com", "hindustantimes.com",
  // Latin America
  "levelup.com", "tecmundo.com.br", "theenemy.com.br", "atomix.vg", "uol.com.br", "globo.com", "infobae.com"];
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
/** Answers that mean "this site refuses automated readers", not "this page does not exist". */
const WALLED = new Set([401, 403, 406, 429, 451, 503]);
export type GateResult = { decision: "publish" | "review"; gates: string[]; item: AiItem; sourceChecks: { url: string; finalUrl: string; tier: string; status: number }[] };
/** Structural proof gates, not a claim of automatic semantic/video verification. Uncertain cases are held. */
/** Share of letters that are Arabic (names in Latin script are expected, so thresholds are low). */
export function arabicShare(text: string | undefined | null): number {
  const letters = (text ?? "").match(/\p{L}/gu) ?? [];
  if (!letters.length) return 0;
  return letters.filter((c) => /[\u0600-\u06FF]/.test(c)).length / letters.length;
}
/** First sentences of the Arabic body, used when the model left summary_ar in the source language. */
export function summaryFromBody(body: string): string {
  const text = body.replace(/^#{2,3} .*$/gm, " ").replace(/^- /gm, "").replace(/\s+/g, " ").trim();
  if (text.length <= 220) return text;
  const cut = text.slice(0, 240);
  const end = Math.max(cut.lastIndexOf("."), cut.lastIndexOf("؟"), cut.lastIndexOf("!"), cut.lastIndexOf("،"));
  return (end > 80 ? cut.slice(0, end + 1) : cut.slice(0, cut.lastIndexOf(" ")) + "…").trim();
}
/** Numbers worth checking against the source: versions, decimals, percentages and figures of 100+ (not days, small counts or years). */
export function significantNumbers(s: string): string[] {
  return numberTokens(s).filter((n) => !/[:/-]/.test(n) && (/[.%]/.test(n) || (Number(n) >= 100 && !/^20\d\d$/.test(n))));
}
/** Phrases that describe how the article was produced. A reader must never see them. */
const META = /المقتطف الحرفي|مقتطف حرفي|م[ُ]?ختصر حرفي|مقتبس[ةً]* حرفي|النصوص المقتبسة|المقتطف الداعم|الحقول الوقائعية|قسم (?:ال)?proof|طبق[اً]+ للسياسة|حسب السياسة|وفق السياسة|ملاحظة تحكّ?م|verbatim (?:excerpt|quote|summary)|supporting excerpt|proof section|factual fields|per (?:the )?policy|as per policy|RADAR-POLICY/i;
const PAD_BUTTONS = /L3\s*\+\s*R3\s*\/\s*LS\s*\+\s*RS/;
/**
 * Removes production artefacts from generated text: inline citations and URLs, sentences that talk
 * about excerpts/proof/policy, and the "L3 + R3 / LS + RS" example that the model pasted into news.
 */
export function cleanProse(text: string, opts: { dropPadButtons?: boolean } = {}): string {
  const lines = String(text ?? "").replace(/\r/g, "").split("\n").map((line) => {
    const unlinked = line
      .replace(/\s*[(（]\s*\[[^\]]*\]\(https?:\/\/[^)\s]+\)\s*[)）]/g, "")
      .replace(/\[([^\]]+)\]\(https?:\/\/[^)\s]+\)/g, "$1")
      .replace(/\s*[(（]\s*https?:\/\/[^)\s]+\s*[)）]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1");
    if (/^#{2,3} /.test(unlinked)) return META.test(unlinked) || (opts.dropPadButtons && /كنترول|controller|buttons|أزرار|زرّات/i.test(unlinked)) ? null : unlinked.trimEnd();
    const kept = unlinked.split(/(?<=[.!?؟。])\s+/).filter((sentence) => !META.test(sentence) && !(opts.dropPadButtons && PAD_BUTTONS.test(sentence)));
    return kept.join(" ").replace(/[ \t]{2,}/g, " ").replace(/\s+([.,،؛:!?؟])/g, "$1").trim();
  });
  const out: string[] = [];
  for (const line of lines) {
    if (line === null) continue;
    if (line === "" && (out.length === 0 || out[out.length - 1] === "")) continue;
    out.push(line);
  }
  // A heading left without any text under it is removed as well.
  return out.filter((line, i) => !(/^#{2,3} /.test(line) && (i === out.length - 1 || out.slice(i + 1).find((next) => next !== "") === undefined || /^#{2,3} /.test(out.slice(i + 1).find((next) => next !== "") ?? "")))).join("\n").trim();
}
/** Headlines: no "(reported)" suffixes, no stray label prefixes, no trailing punctuation. */
export function cleanTitle(title: string): string {
  return String(title ?? "").replace(/\s*[(（]\s*(?:مُ?بل[َّ]*غ عنه|حسب تقارير|reported|reportedly|unconfirmed|غير مؤكد)\s*[)）]\s*$/i, "").replace(/^(?:تبرير|توضيح)\s*:\s*/, "").replace(/\s+/g, " ").replace(/[.،؛:\s]+$/, "").trim();
}
/** Applies the text clean-up to every reader-facing field of a draft, in place. */
export function cleanItem(item: AiItem): string[] {
  const notes: string[] = [];
  const news = item.category === "news" || item.category === "streamers";
  for (const key of ["body_ar", "body_en", "summary_ar", "summary_en"] as const) {
    const before = item[key];
    if (typeof before !== "string") continue;
    const after = cleanProse(before, { dropPadButtons: news });
    if (after !== before.trim()) { item[key] = after; notes.push(`clean:${key}`); }
  }
  for (const key of ["title_ar", "title_en"] as const) if (typeof item[key] === "string") item[key] = cleanTitle(item[key]);
  if (typeof item.body_ar === "string" && typeof item.summary_ar === "string" && item.summary_ar.replace(/\s/g, "").length < 40 && item.body_ar.length > 200) { item.summary_ar = summaryFromBody(item.body_ar); notes.push("clean:summary_ar-rebuilt"); }
  if (typeof item.body_en === "string" && typeof item.summary_en === "string" && item.summary_en.replace(/\s/g, "").length < 30 && item.body_en.length > 200) { item.summary_en = summaryFromBody(item.body_en); notes.push("clean:summary_en-rebuilt"); }
  if (Array.isArray(item.facts)) item.facts = item.facts.filter((f) => f && ![f.k_ar, f.k_en, f.v_ar, f.v_en].some((v) => typeof v !== "string" || META.test(v) || /^(?:unknown|غير معروف|n\/a)$/i.test(v.trim())));
  return notes;
}
export async function verifyDraft(draft: Draft, retrieved: string[], read: SourceReader): Promise<GateResult> {
  const item = draft.item;
  const gates: string[] = [];
  const fields = ["title_ar", "title_en", "summary_ar", "summary_en", "body_ar", "body_en"] as const;
  if (item) gates.push(...cleanItem(item));
  const texts = fields.map((k) => item?.[k]);
  // Arabic fields must really be Arabic (foreign-press beams sometimes leave them in the source
  // language). A non-Arabic summary is rebuilt from the Arabic body; a non-Arabic body is held.
  if (item && typeof item.body_ar === "string" && arabicShare(item.body_ar) >= 0.5 && arabicShare(item.summary_ar) < 0.4) {
    item.summary_ar = summaryFromBody(item.body_ar);
    gates.push("arabic:summary-rebuilt-from-body");
  }
  if (texts.some((s) => typeof s !== "string" || !s.trim()) || (item?.body_ar?.trim().length ?? 0) < 300 || texts.some((s) => typeof s === "string" && s.length > 12_000)
    || arabicShare(item?.body_ar) < 0.5 || arabicShare(item?.title_ar) < 0.3) gates.push("3:bilingual-content");
  const found = new Set(retrieved.map(urlKey));
  const citations = [...new Map((Array.isArray(item?.sources) ? item.sources : []).filter((s) => typeof s.url === "string" && checkPublicHttpsUrl(s.url) && found.has(urlKey(s.url))).map((s) => [urlKey(s.url), s])).values()].slice(0, 6);
  if (!citations.length) gates.push("1:no-retrieved-source");
  const fetched = new Map<string, { text: string; tier: string }>();
  const sourceChecks: GateResult["sourceChecks"] = [];
  // A page the search tool opened but our own reader could not (bot wall, time-out, oversized page) is a real,
  // known source: its link stays on the article so readers can check it. Nothing from it counts as verified,
  // so it can never lift the status. A page that answers "not found" is dropped as before.
  const unread = new Set<string>();
  for (const s of citations) {
    const r = await read(s.url);
    if (!r || WALLED.has(r.status)) { unread.add(urlKey(s.url)); sourceChecks.push({ url: s.url, finalUrl: s.url, tier: "unread", status: r?.status ?? 0 }); continue; }
    if (r.status !== 200) continue;
    const t = tier(r.finalUrl);
    sourceChecks.push({ url: s.url, finalUrl: r.finalUrl, tier: t, status: r.status });
    fetched.set(urlKey(s.url), { text: /(?:html|text\/plain)/i.test(r.contentType) ? normalized(plainText(r.body.toString("utf8"))) : "", tier: t });
  }
  item.sources = citations.filter((s) => fetched.has(urlKey(s.url)) || unread.has(urlKey(s.url)));
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
  // Figures are checked against the full text of the fetched sources (not only the short excerpts),
  // and only when that text could be read: a page that renders with JavaScript cannot disprove a number.
  const sourceText = [...fetched.values()].map((f) => f.text).join(" ");
  const sourceNumbers = new Set(numberTokens(`${sourceText} ${quotes.join(" ")}`));
  if (sourceText.length >= 200 || quotes.length ? significantNumbers(claims).some((n) => !sourceNumbers.has(n)) : false) gates.push("7:unsupported-number");
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
    // Official needs a verified excerpt from the publisher's own page for the headline and for the text.
    const has = (...names: string[]) => names.some((n) => supported.has(n));
    const fullySupported = !unsupportedNumbers && has("title_ar", "title_en") && has("body_ar", "body_en", "summary_ar", "summary_en");
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
