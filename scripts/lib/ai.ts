import OpenAI from "openai";
import { need } from "./env";
import { CATEGORIES } from "../../src/lib/categories";

export const MODEL = process.env.OPENAI_MODEL || "gpt-5.5";
export const RADAR_MODEL = process.env.OPENAI_RADAR_MODEL || MODEL;

let client: OpenAI | null = null;
export function ai() {
  client ??= new OpenAI({ apiKey: need("OPENAI_API_KEY") });
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

/** One web-search-enabled call returning JSON that matches `schema`. */
export async function askJson<T>(opts: {
  model?: string;
  prompt: string;
  schema: Record<string, unknown>;
  name: string;
  domains?: string[];
  search?: boolean;
}): Promise<T> {
  const tools =
    opts.search === false
      ? []
      : [{ type: "web_search" as const, ...(opts.domains?.length ? { filters: { allowed_domains: opts.domains } } : {}) }];
  const res = await ai().responses.create({
    model: opts.model ?? MODEL,
    tools,
    input: opts.prompt,
    text: { format: { type: "json_schema", name: opts.name, schema: opts.schema, strict: true } },
  });
  return JSON.parse(res.output_text || "{}") as T;
}

export function youtubeThumb(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return m ? `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` : null;
}
