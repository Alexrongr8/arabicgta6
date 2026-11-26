import { createHash } from "node:crypto";
import { checkPublicHttpsUrl } from "../../src/lib/safe-fetch";
import { searchText, slugify } from "../../src/lib/normalize";
import { urlKey } from "./url-key";
import { BEAMS, chooseBeam, finishState, knownKeys, similar, sameStory, isDuplicateOf, sinceFor, existingEntity, verifyDraft, acceptableLead, QUEUE_MAX, QUEUE_TTL_MS, type State, type Known, type Lead, type Research, type Draft, type SourceReader, type BeamId, type Queued } from "./radar-policy";

type Review = { key: string; kind: "article" | "catalog-update"; reasons: string[]; lead: Lead; draft?: Draft; evidence?: unknown };
export type RadarDeps = {
  state: State; known: Known[]; catalogNames: string[]; now: Date; pinnedBeam?: BeamId;
  discover: (beam: typeof BEAMS[number], since: string, knownTitles: string[]) => Promise<Research<{ leads: Lead[] }>>;
  edit: (lead: Lead, beam: BeamId) => Promise<Research<Draft>>;
  readSource: SourceReader;
  save: (state: State) => Promise<void>; review: (record: Review) => Promise<void>;
  insert: (row: Record<string, unknown>) => Promise<boolean>;
  log: (record: Record<string, unknown>, complete: boolean, added: number) => Promise<void>;
  isFatal: (e: unknown) => boolean;
  /** When true and no lead is pending, a queued lead is written instead of paying for a new search. */
  useQueue?: boolean;
  /** Cover picture for a published article: the source page's own preview image (free, no AI). */
  findImage?: (url: string) => Promise<string | null>;
};
const leadSlug = (l: Lead) => `${slugify(l.headline).slice(0, 100) || "gta6-update"}-${createHash("sha256").update(urlKey(l.url)).digest("hex").slice(0, 10)}`;
/** One discovery (or one queued lead) plus at most one editor; retries consume one later scheduled run, never a loop. */
export async function runRadar(d: RadarDeps): Promise<{ added: number; requests: number; held: boolean }> {
  let state = structuredClone(d.state);
  const now = d.now.toISOString(); let requests = 0; let leads = 0; const rejected: string[] = [];
  const keys = knownKeys(d.known);
  const covered = (l: Lead) => { const key = urlKey(l.url); return keys.has(key) || state.reviewedKeys.includes(key) || d.known.some((k) => k.slug === leadSlug(l) || isDuplicateOf(k, l.headline, undefined, d.now)); };
  // A waiting lead from an earlier discovery is free to pick up: only the editor request is paid.
  if (!state.pending && d.useQueue && state.queue?.length) {
    const queue = state.queue.filter((q) => d.now.getTime() - Date.parse(q.discoveredAt) < QUEUE_TTL_MS && !covered(q.lead));
    const next = queue.shift();
    state.queue = queue;
    if (next) state.pending = { lead: next.lead, beam: next.beam, discoveredAt: next.discoveredAt, retrievedUrls: [next.lead.url], responseId: next.responseId, attempts: 0, queued: true };
    await d.save(state);
  }
  const fromQueue = Boolean(state.pending?.queued);
  const beam = chooseBeam(state, d.pinnedBeam);
  const finish = async (added: number, held: boolean, key?: string) => {
    // A queued lead does not belong to this slot's topic: the rotation and its time windows stay untouched.
    state = fromQueue
      ? { ...state, pending: null, reviewedKeys: [...new Set([...(key ? [key] : []), ...state.reviewedKeys])].slice(0, 100) }
      : { ...finishState(state, beam.id, state.pending?.discoveredAt ?? now, key), queue: state.queue };
    await d.save(state); // authoritative per-beam checkpoint; no success log before durable state
    await d.log({ beam: beam.id, requests, leads, accepted: added, rejected, held, pending: false, ...(fromQueue ? { fromQueue: true } : {}), queued: state.queue?.length ?? 0 }, true, added);
    return { added, requests, held };
  };
  if (state.pending && (keys.has(urlKey(state.pending.lead.url)) || d.known.some((k) => k.slug === leadSlug(state.pending!.lead)))) return finish(0, false);
  if (!state.pending) {
    let r: Research<{ leads: Lead[] }>;
    try {
      requests++;
      r = await d.discover(beam, sinceFor(state, beam.id, d.now), d.known.map((k) => k.title_en));
      if (!r.completedSearches) throw new Error("No completed web-search output; discovery is not successful.");
    } catch (e) {
      if (d.isFatal(e)) throw e; // no state/log writes and no further paid work after fatal error
      await d.log({ beam: beam.id, requests, error: "discovery-failed", windowUnchanged: true }, false, 0);
      return { added: 0, requests, held: true };
    }
    leads = Array.isArray(r.data.leads) ? r.data.leads.length : 0;
    const retrieved = new Set(r.retrievedUrls.map(urlKey)); const fresh: Lead[] = [];
    const waiting = (state.queue ?? []).map((q) => q.lead);
    for (const l of (Array.isArray(r.data.leads) ? r.data.leads : []).slice(0, 8)) {
      if (!l || typeof l.url !== "string" || typeof l.headline !== "string" || typeof l.gist !== "string" || l.headline.length > 240 || l.gist.length > 1200 || l.url.length > 2048 || !checkPublicHttpsUrl(l.url) || !retrieved.has(urlKey(l.url))) { rejected.push("1:unretrieved-lead"); continue; }
      if (!acceptableLead(l)) { rejected.push(`boring:${l.kind ?? "low-interest"}`); continue; }
      const same = (k: Lead) => urlKey(k.url) === urlKey(l.url) || similar(k.headline, l.headline) >= .7 || sameStory(k.headline, l.headline);
      if (covered(l) || fresh.some(same) || waiting.some(same)) { rejected.push("duplicate"); continue; }
      fresh.push(l);
    }
    if (!fresh.length) return finish(0, false);
    // The strongest lead is written now; the others wait in the queue for a later slot.
    fresh.sort((a, b) => (b.interest ?? 3) - (a.interest ?? 3));
    const lead = fresh[0]; const key = urlKey(lead.url);
    const extra: Queued[] = fresh.slice(1).filter((l) => !existingEntity(l, d.catalogNames)).map((l) => ({ lead: l, beam: beam.id, discoveredAt: now, responseId: r.responseId }));
    state.queue = [...(state.queue ?? []), ...extra].slice(-QUEUE_MAX);
    if (existingEntity(lead, d.catalogNames)) {
      await d.review({ key, kind: "catalog-update", reasons: ["existing-catalog-entity"], lead });
      return finish(0, true, key);
    }
    state.pending = { lead, beam: beam.id, discoveredAt: now, retrievedUrls: [lead.url], responseId: r.responseId, attempts: 0 };
    await d.save(state); // selected lead survives a process failure before/during the editor call
  }
  const pending = state.pending!; const key = urlKey(pending.lead.url);
  if (pending.attempts >= 3) {
    await d.review({ key, kind: "article", reasons: ["editor-attempt-cap"], lead: pending.lead });
    return finish(0, true, key);
  }
  pending.attempts++;
  await d.save(state); // count the attempt before paying; never retry it within this run
  let researched: Research<Draft>;
  try { requests++; researched = await d.edit(pending.lead, pending.beam); }
  catch (e) {
    if (d.isFatal(e)) throw e;
    await d.log({ beam: beam.id, requests, error: "editor-failed", pending: true, attempts: pending.attempts, windowUnchanged: true }, false, 0);
    return { added: 0, requests, held: true };
  }
  const draft = researched.data;
  draft.item.sources = [{ title: pending.lead.headline, url: pending.lead.url }, ...(draft.item.sources ?? [])];
  const gated = await verifyDraft(draft, [...pending.retrievedUrls, ...researched.retrievedUrls], d.readSource);
  if (!researched.completedSearches && gated.decision === "publish") {
    // Owner decision: still publish, but honestly as an unverified rumor with an unknown source.
    gated.gates.push("1:editor-search-incomplete");
    gated.item.status = gated.item.status === "leak" ? "leak" : "rumor";
    gated.item.tags = [...new Set([...(gated.item.tags ?? []), "source-unknown"])];
  }
  if (gated.item.sources.some((source) => { const sourceKey = urlKey(source.url); return sourceKey.startsWith("youtube:") && keys.has(sourceKey); }) || d.known.some((known) => isDuplicateOf(known, gated.item.title_en, gated.item.title_ar, d.now))) {
    gated.gates.push("duplicate:published-title-or-video"); gated.decision = "review";
  }
  if (gated.decision === "review") {
    await d.review({ key, kind: "article", reasons: gated.gates, lead: pending.lead, draft: { ...draft, item: gated.item }, evidence: { sourceChecks: gated.sourceChecks, responseId: researched.responseId } });
    rejected.push(...gated.gates); return finish(0, true, key);
  }
  const item = gated.item;
  // Cover: the source article's own preview picture (credited to its site on the page). Without one,
  // the card falls back to the category's official Rockstar image.
  let image: string | null = null;
  if (d.findImage) { try { image = await d.findImage(item.sources[0]?.url ?? pending.lead.url); } catch { image = null; } }
  const row = { slug: leadSlug(pending.lead), category: item.category, status: item.status,
    title_en: item.title_en.trim(), title_ar: item.title_ar.trim(), summary_en: item.summary_en.trim(), summary_ar: item.summary_ar.trim(), body_en: item.body_en.trim(), body_ar: item.body_ar.trim(),
    aliases: item.aliases.slice(0, 15), tags: [...new Set([...item.tags.filter((t) => t === "source-unknown" || t === "story-spoilers"), ...item.tags.slice(0, 8), `via:${beam.id}`])], facts: item.facts.slice(0, 10), location: null, region: item.region,
    related: item.related.filter((s) => d.known.some((k) => k.slug === s)).slice(0, 8), sources: item.sources, image,
    // The event's own time is used only when it is recent; an older event is dated when we publish it
    // (the text says when it happened), so a new article is never buried days down the news list.
    published_at: item.event_date && Number.isFinite(Date.parse(item.event_date)) && Date.parse(item.event_date) <= d.now.getTime() && d.now.getTime() - Date.parse(item.event_date) < 36 * 3600e3 ? new Date(item.event_date).toISOString() : now, origin: "auto" };
  const inserted = await d.insert({ ...row, search_text: searchText(row) });
  return finish(inserted ? 1 : 0, false);
}
