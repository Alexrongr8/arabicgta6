import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp, { type OverlayOptions } from "sharp";
import { safeGet } from "./safe-fetch";
import { createClient as createAnonClient } from "@supabase/supabase-js";
import { CATEGORY_MAP } from "./categories";
import { imageOf } from "./image";
import { isSpoiler } from "./spoiler";
import { SEED } from "./seed";
import { publicRead, publicReadSignal } from "./public-read";
import type { Item } from "./types";

/**
 * Deterministic 1200×630 share card for one article: cover photo + readable Arabic title.
 * Text is laid out by Pango (through sharp) with the bundled Tajawal font, which gives proper
 * Arabic shaping AND bidi (right-to-left word order, mixed English/numbers, punctuation).
 * No AI calls. Works for database-only articles, and degrades to a branded titled card when the
 * cover is missing or can't be decoded.
 */

export const OG_SIZE = { width: 1200, height: 630 };
const W = 1200;
const H = 630;
const PAD = 56;
const MAX_BYTES = 8_000_000;

const FONT_DIR = join(process.cwd(), "assets/fonts");
const FONT_XB = join(FONT_DIR, "Tajawal-ExtraBold.ttf");
const FONT_B = join(FONT_DIR, "Tajawal-Bold.ttf");

type Card = Pick<Item, "slug" | "category" | "title_ar" | "title_en" | "image" | "tags">;

/** ok=false means the database could not be reached, so the result must not be cached long. */
export async function loadCard(slug: string): Promise<{ card: Card | null; ok: boolean }> {
  const seed = SEED.find((i) => i.slug === slug) ?? null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { card: seed, ok: true };
  try {
    // Anonymous read (items are public); no cookies, so crawlers get the same result.
    const db = createAnonClient(url, key, { auth: { persistSession: false } });
    const card = await publicRead<Card>("share image item", (signal) => db.from("items")
      .select("slug,category,title_ar,title_en,image,tags").eq("slug", slug).abortSignal(signal).maybeSingle(), publicReadSignal(3000));
    // A configured backend is authoritative, including a successful absence/deletion.
    return { card, ok: true };
  } catch {
    return { card: null, ok: false };
  }
}

/** Raw cover bytes: local file under /public, or a public HTTPS image through the SSRF-safe fetcher. */
export async function coverBytes(src: string): Promise<Buffer | null> {
  try {
    if (src.startsWith("/")) {
      if (src.includes("..") || src.startsWith("//")) return null;
      return await readFile(join(process.cwd(), "public", src));
    }
    const res = await safeGet(src, { timeoutMs: 4000, maxBytes: MAX_BYTES, accept: "image/*", userAgent: "ArabicGTA6-OG/1.0" });
    if (!res || res.status !== 200 || !/^image\//i.test(res.contentType)) return null;
    return res.body;
  } catch {
    return null;
  }
}

async function coverLayer(src: string): Promise<Buffer | null> {
  const bytes = await coverBytes(src);
  if (!bytes) return null;
  try {
    return await sharp(bytes, { limitInputPixels: 40_000_000 }).resize(W, H, { fit: "cover", position: "attention" }).png().toBuffer();
  } catch {
    return null;
  }
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Pango text block. `align: "left"` means start-aligned, i.e. right-aligned for Arabic paragraphs. */
async function textLayer(text: string, opts: { size: number; color: string; width?: number; bold?: boolean }) {
  const regular = opts.bold === false;
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="${opts.color}">${esc(text)}</span>`,
      font: `${regular ? "Tajawal Bold" : "Tajawal ExtraBold"} ${opts.size}`,
      fontfile: regular ? FONT_B : FONT_XB,
      width: opts.width,
      align: "left",
      wrap: "word",
      rgba: true,
      dpi: 72,
      spacing: Math.round(opts.size * 0.25),
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

function cleanTitle(t: string) {
  const clean = t.replace(/\s+/g, " ").trim();
  return clean.length > 120 ? `${clean.slice(0, 117).trim()}…` : clean;
}

/** Biggest font that keeps the title within ~3 lines (250 px). */
async function titleLayer(title: string) {
  for (const size of [66, 58, 52, 46, 40, 36]) {
    const t = await textLayer(title, { size, color: "#ffffff", width: W - PAD * 2 });
    if (t.height <= 250) return t;
  }
  return textLayer(title, { size: 32, color: "#ffffff", width: W - PAD * 2 });
}

const pill = (w: number, h: number, fill: string, opacity = 1) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" fill-opacity="${opacity}"/></svg>`,
  );

function backdrop(withCover: boolean) {
  const sun = withCover
    ? ""
    : `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd166"/><stop offset=".45" stop-color="#ff9a3d"/><stop offset=".85" stop-color="#ff3d8b"/></linearGradient></defs>
       <circle cx="980" cy="150" r="280" fill="url(#s)" opacity=".55"/>`;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0b0613" stop-opacity=".05"/>
        <stop offset=".45" stop-color="#0b0613" stop-opacity=".55"/>
        <stop offset="1" stop-color="#0b0613" stop-opacity=".95"/>
      </linearGradient></defs>
      ${sun}
      <rect width="${W}" height="${H}" fill="url(#g)"/>
    </svg>`,
  );
}

export async function renderItemOg(slug: string): Promise<Response> {
  const { card, ok } = await loadCard(slug);
  const cat = card ? CATEGORY_MAP[card.category] : null;
  const accent = cat?.color ?? "#ff3d8b";
  // Spoiler articles share with the category's neutral official image, never their own cover.
  const cover = card ? await coverLayer(isSpoiler(card) ? imageOf({ category: card.category }) : imageOf(card)) : null;
  const title = cleanTitle(card ? card.title_ar || card.title_en : "عربي GTA 6 — أسرار وأخبار وخريطة لعبة GTA VI");

  const base = cover ? sharp(cover) : sharp({ create: { width: W, height: H, channels: 4, background: "#1a0b2e" } });
  const layers: OverlayOptions[] = [{ input: backdrop(Boolean(cover)), top: 0, left: 0 }];

  // brand pill (top-left)
  const brandA = await textLayer("ARABIC", { size: 28, color: "#ffffff" });
  const brandB = await textLayer("GTA6", { size: 28, color: "#ff9a3d" });
  const brandH = Math.max(brandA.height, brandB.height) + 18;
  const brandW = brandA.width + brandB.width + 12 + 36;
  layers.push({ input: pill(brandW, brandH, "#0b0613", 0.72), top: 36, left: 44 });
  layers.push({ input: brandA.data, top: 36 + Math.round((brandH - brandA.height) / 2), left: 44 + 18 });
  layers.push({ input: brandB.data, top: 36 + Math.round((brandH - brandB.height) / 2), left: 44 + 18 + brandA.width + 12 });

  // category badge (top-right)
  if (cat) {
    const c = await textLayer(cat.ar, { size: 28, color: "#ffffff", bold: false });
    const bw = c.width + 44;
    const bh = c.height + 14;
    layers.push({ input: pill(bw, bh, accent), top: 36, left: W - 44 - bw });
    layers.push({ input: c.data, top: 36 + Math.round((bh - c.height) / 2), left: W - 44 - bw + 22 });
  }

  // title: right-aligned above the footer
  const t = await titleLayer(title);
  layers.push({ input: t.data, top: H - 96 - t.height, left: W - PAD - t.width });

  // footer: domain + accent bar
  const domain = await textLayer("arabicgta6.com", { size: 30, color: "#ffd166", bold: false });
  layers.push({ input: domain.data, top: H - 34 - domain.height, left: PAD });
  layers.push({ input: pill(160, 8, accent), top: H - 34 - Math.round(domain.height / 2) - 4, left: W - PAD - 160 });

  const png = await base.composite(layers).png({ compressionLevel: 8 }).toBuffer();

  // Full card: cache a day. Degraded card (DB unreachable, unknown slug or missing cover): 5 minutes, so it recovers.
  const full = ok && card && cover;
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": full ? "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" : "public, max-age=60, s-maxage=300",
    },
  });
}
