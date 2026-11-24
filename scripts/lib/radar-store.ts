import type { db } from "./db";
import { BEAMS, emptyState, type State } from "./radar-policy";

type Database = ReturnType<typeof db>;
/** Existing private update_runs table; no public reads or new database schema. */
export async function readState(database: Database): Promise<State> {
  const { data, error } = await database.from("update_runs").select("note").eq("kind", "radar_state").order("id", { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  if (!data) return emptyState();
  const s = JSON.parse(data.note ?? "") as State;
  if (s.version !== 1 || !Number.isInteger(s.nextBeam) || s.nextBeam < 0 || s.nextBeam >= BEAMS.length || !s.windows || !Array.isArray(s.reviewedKeys) || s.reviewedKeys.length > 100
    || Object.entries(s.windows).some(([beam, at]) => !BEAMS.some((b) => b.id === beam) || !Number.isFinite(Date.parse(at)))
    || (s.pending && (!BEAMS.some((b) => b.id === s.pending!.beam) || typeof s.pending.lead?.url !== "string" || typeof s.pending.lead.headline !== "string" || typeof s.pending.lead.gist !== "string" || !Array.isArray(s.pending.retrievedUrls) || s.pending.retrievedUrls.length > 100 || s.pending.retrievedUrls.some((u) => typeof u !== "string") || !Number.isFinite(Date.parse(s.pending.discoveredAt)) || !Number.isInteger(s.pending.attempts) || s.pending.attempts < 0 || s.pending.attempts > 3))) {
    throw new Error("Invalid durable radar state; refusing to reset windows or lose pending work.");
  }
  return s;
}
export async function writeRecord(database: Database, kind: "radar_state" | "radar_review" | "update" | "update_partial", value: unknown, added = 0) {
  const note = JSON.stringify(value);
  if (note.length > 64_000) throw new Error(`Bounded ${kind} record exceeds64KB; not writing a truncated checkpoint.`);
  const { error } = await database.from("update_runs").insert({ kind, added, note });
  if (error) throw error;
}

/** Refuse incomplete dedupe state rather than silently trusting a first-row server cap. */
export async function readKnown(database: Database) {
  const rows: import("./radar-policy").Known[] = [];
  const pageSize = 500;
  for (let offset = 0; offset <= 20000; offset += pageSize) {
    const { data, error } = await database.from("items").select("slug,title_en,title_ar,published_at,sources,videos").order("slug").range(offset, offset + pageSize - 1);
    if (error) throw error;
    if (offset === 20000 && data?.length) throw new Error("Dedupe snapshot exceeds20000 items; increase the reviewed bound before running.");
    rows.push(...(data ?? []));
    if ((data?.length ?? 0) < pageSize) return rows;
  }
  throw new Error("Dedupe pagination did not finish.");
}
