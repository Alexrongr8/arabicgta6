import OpenAI from "openai";
import { need } from "./env";
import { CATEGORIES } from "../../src/lib/categories";
import { evidenceOf } from "./ai-evidence";
import type { Research, Usage } from "./radar-policy";

// No silent expensive default: the model must be chosen explicitly (repo variable OPENAI_MODEL).
export const MODEL = process.env.OPENAI_MODEL || "";
export const RADAR_MODEL = process.env.OPENAI_RADAR_MODEL || MODEL;

/** Errors that must stop the whole run immediately: no further paid calls, no success log. */
export class FatalAiError extends Error {}

const FATAL_CODES = [
  "organization_spend_limit_exceeded",
  "project_spend_limit_exceeded",
  "credit_balance_exhausted",
  "insufficient_quota",
  "billing_hard_limit_reached",
  "invalid_api_key",
  "model_not_found",
];

export function isFatal(e: unknown): boolean {
  if (e instanceof FatalAiError) return true;
  const err = e as { status?: number; code?: string; type?: string; error?: { code?: string; type?: string }; message?: string };
  const code = err?.code ?? err?.error?.code ?? err?.type ?? err?.error?.type ?? "";
  if (FATAL_CODES.includes(code)) return true;
  if (err?.status === 401 || err?.status === 403 || err?.status === 404) return true;
  return FATAL_CODES.some((c) => (err?.message ?? "").includes(c));
}

/** Call before any paid request: fails fast (and costs nothing) when the setup is incomplete. */
export function preflight() {
  if (!process.env.OPENAI_API_KEY) throw new FatalAiError("OPENAI_API_KEY is not set.");
  if (!MODEL) throw new FatalAiError("OPENAI_MODEL is not set — refusing to run paid requests with an implicit model.");
}

let client: OpenAI | null = null;
export function ai() {
  preflight();
  // Finite timeout, no hidden retries: every paid request is counted once.
  client ??= new OpenAI({ apiKey: need("OPENAI_API_KEY"), timeout: 120_000, maxRetries: 0 });
  return client;
}

export const CATEGORY_GUIDE = CATEGORIES.map((c) => `- ${c.slug}: ${c.descEn}`).join("\n");

export const MAP_HINT = `Map coordinates are pixels on Rockstar's official Leonida map poster (2805 wide x 3840 tall, y grows downward). Reference points: Vice City (1880,1995), Downtown (1968,2053), Little Cuba (1853,2047), Vice Beach (2390,1880), Ocean Beach (2418,2006), Belville (1845,1520), Tequesta (1890,2285), VCIA airport (1590,2190), Hamlet (1575,2632), Grassrivers (1265,2545), Pelican Valley (1462,2812), Port Gellhorn (855,1370), Capri (805,2025), Ambrosia (1560,1368), Lake Leonida (1697,1205), Mount Kalaga National Park (1395,870), Millport (1848,883), Key Lento (1595,3197), Southwind (918,3282), Riquezas Keys (612,3187). Only give a location when the place is clearly known; otherwise null.`;

/** Writing rules shared by the radar and the enricher, so every page reads the same. */
export const STYLE_GUIDE = `Writing style:
- Arabic first: clear, warm Gulf-gamer tone (like a knowledgeable friend), easy to read on a phone. Keep in-game proper names (places, weapons, vehicles, characters, missions) in English Latin script inside the Arabic text.
- English version: same content, natural tone.
- body must be DEEP and satisfying: 5-9 short paragraphs (roughly 250-450 words per language). Cover: what it is, where/when/how (step by step when relevant), exact locations/requirements/prices/buttons if known, tips and common mistakes, why it matters, and what is still unconfirmed.
- You may use "## " subheadings (2-4 per article) and lines starting with "- " for lists. No links, no markdown bold, no tables in the body.
- Controller instructions always give PlayStation AND Xbox buttons (e.g. L3 + R3 / LS + RS).
- Never invent facts. If sources disagree, say so. Mark speculation clearly.`;

export const itemSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "category", "status", "title_en", "title_ar", "summary_en", "summary_ar", "body_en", "body_ar",
    "aliases", "tags", "facts", "region", "location", "related", "sources", "event_date",
  ],
  properties: {
    category: { type: "string", enum: CATEGORIES.map((c) => c.slug) },
    status: { type: "string", enum: ["official", "confirmed", "leak", "rumor"] },
    title_en: { type: "string" },
    title_ar: { type: "string" },
    summary_en: { type: "string" },
    summary_ar: { type: "string" },
    body_en: { type: "string" },
    body_ar: { type: "string" },
    aliases: { type: "array", items: { type: "string" } },
    tags: { type: "array", items: { type: "string" } },
    facts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["k_en", "k_ar", "v_en", "v_ar"],
        properties: { k_en: { type: "string" }, k_ar: { type: "string" }, v_en: { type: "string" }, v_ar: { type: "string" } },
      },
    },
    region: { type: ["string", "null"], enum: ["Vice City", "Leonida Keys", "Grassrivers", "Port Gellhorn", "Ambrosia", "Mount Kalaga", "Leonida", null] },
    location: {
      type: ["object", "null"],
      additionalProperties: false,
      required: ["x", "y"],
      properties: { x: { type: "number" }, y: { type: "number" } },
    },
    related: { type: "array", items: { type: "string" } },
    sources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "url"],
        properties: { title: { type: "string" }, url: { type: "string" } },
      },
    },
    event_date: { type: ["string", "null"] },
  },
} as const;

export type AiItem = {
  category: string;
  status: "official" | "confirmed" | "leak" | "rumor";
  title_en: string;
  title_ar: string;
  summary_en: string;
  summary_ar: string;
  body_en: string;
  body_ar: string;
  aliases: string[];
  tags: string[];
  facts: { k_en: string; k_ar: string; v_en: string; v_ar: string }[];
  region: string | null;
  location: { x: number; y: number } | null;
  related: string[];
  sources: { title: string; url: string }[];
  event_date: string | null;
};

/** No command may silently exceed the initial policy budget. No automatic API retries. */
const totals: Usage = { requests: 0, inputTokens: 0, outputTokens: 0, searchCalls: 0 };
let ceiling = 2;
/** Raise the per-process paid request ceiling (bounded to 12). Default stays 2. */
export function allowRequests(n: number) { ceiling = Math.min(12, Math.max(1, Math.floor(n))); }
export const usageTotals = (): Usage => ({ ...totals });

export type AskOptions = {
  model?: string;
  prompt: string;
  schema: Record<string, unknown>;
  name: string;
  domains?: string[];
  search?: boolean;
  /** cap on generated tokens (default 1500 for leads; pass ~6000 for bilingual articles) */
  maxOutputTokens?: number;
};

export async function askJsonWithEvidence<T>(opts: AskOptions): Promise<Research<T>> {
  if (totals.requests >= ceiling) throw new FatalAiError(`Per-command paid request ceiling reached (${ceiling}). No further calls allowed.`);
  preflight();
  const tools =
    opts.search === false
      ? []
      : [{ type: "web_search" as const, search_context_size: "low" as const, ...(opts.domains?.length ? { filters: { allowed_domains: opts.domains } } : {}) }];
  let res;
  try {
    totals.requests++;
    res = await ai().responses.create({
      model: opts.model ?? MODEL,
      tools,
      include: opts.search === false ? [] : ["web_search_call.action.sources"],
      tool_choice: opts.search === false ? undefined : "required",
      max_tool_calls: opts.search === false ? undefined : 1,
      max_output_tokens: opts.maxOutputTokens ?? 1500,
      reasoning: { effort: "low" },
      input: opts.prompt,
      text: { format: { type: "json_schema", name: opts.name, schema: opts.schema, strict: true } },
    });
  } catch (e) {
    if (isFatal(e)) throw new FatalAiError(`${opts.name}: ${(e as Error).message}`);
    throw e;
  }
  const u = res.usage;
  const evidence = evidenceOf(res);
  totals.inputTokens += u?.input_tokens ?? 0;
  totals.outputTokens += u?.output_tokens ?? 0;
  totals.searchCalls += evidence.searchCalls;
  console.log(`  [usage] ${opts.name}: status=${res.status} in=${u?.input_tokens ?? "?"} out=${u?.output_tokens ?? "?"} searches=${evidence.searchCalls}`);
  if (res.status !== "completed" || !res.output_text) throw new Error(`${opts.name}: incomplete response (${res.status})`);
  return { data: JSON.parse(res.output_text) as T, retrievedUrls: evidence.retrievedUrls, completedSearches: evidence.completedSearches, responseId: res.id,
    usage: { requests: 1, inputTokens: u?.input_tokens ?? 0, outputTokens: u?.output_tokens ?? 0, searchCalls: evidence.searchCalls } };
}

/** Compatibility wrapper for callers that do not publish researched content. */
export async function askJson<T>(opts: AskOptions): Promise<T> {
  return (await askJsonWithEvidence<T>(opts)).data;
}

export function youtubeThumb(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return m ? `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` : null;
}
