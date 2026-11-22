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

const pill = (w: number, h: number, fill: string, opacity = 1) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" fill-opacity="${opacity}"/></svg>`,
  );

/** Light, warm "Vice City sunset" backdrop with soft glows. */
function backdrop() {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <linearGradient id="bg" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff9f1"/><stop offset=".55" stop-color="#fff1ea"/><stop offset="1" stop-color="#ffe3ef"/>
        </linearGradient>
        <radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd166" stop-opacity=".75"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient>
        <radialGradient id="pink" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff3d8b" stop-opacity=".28"/><stop offset="1" stop-color="#ff3d8b" stop-opacity="0"/></radialGradient>
        <radialGradient id="teal" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#19d3c5" stop-opacity=".22"/><stop offset="1" stop-color="#19d3c5" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <circle cx="1120" cy="40" r="260" fill="url(#sun)"/>
      <circle cx="700" cy="660" r="300" fill="url(#pink)"/>
      <circle cx="1180" cy="600" r="220" fill="url(#teal)"/>
    </svg>`,
  );
}

const PHOTO = { left: 40, top: 40, width: 520, height: H - 80, radius: 36 };

/** Cover photo cropped into a rounded frame with a white border and soft shadow. */
async function photoLayers(src: string): Promise<OverlayOptions[] | null> {
  const bytes = await coverBytes(src);
  if (!bytes) return null;
  try {
    const { left, top, width, height, radius } = PHOTO;
    const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${radius}" fill="#fff"/></svg>`);
    const photo = await sharp(bytes, { limitInputPixels: 40_000_000 }).resize(width, height, { fit: "cover", position: "attention" })
      .composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
    const shadow = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width + 80}" height="${height + 80}"><defs><filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter></defs><rect x="40" y="52" width="${width}" height="${height - 10}" rx="${radius}" fill="#7a2c5a" fill-opacity=".28" filter="url(#b)"/></svg>`);
    const frame = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width + 12}" height="${height + 12}"><rect width="${width + 12}" height="${height + 12}" rx="${radius + 6}" fill="#ffffff"/></svg>`);
    return [
      { input: shadow, left: left - 40, top: top - 40 },
      { input: frame, left: left - 6, top: top - 6 },
      { input: photo, left, top },
    ];
  } catch {
    return null;
  }
}

const isLight = (hex: string) => {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
  if (!m) return false;
  const [r, g, b] = m.slice(1).map((x) => parseInt(x, 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 170;
};

const TEXT_RIGHT = W - PAD;
const TEXT_WIDTH = W - PHOTO.left - PHOTO.width - PAD - 44;

/** Biggest font that keeps the title within ~4 lines in the text column. */
async function columnTitle(title: string, maxHeight: number) {
  for (const size of [64, 58, 52, 46, 42, 38, 34]) {
    const t = await textLayer(title, { size, color: "#1c1030", width: TEXT_WIDTH });
    if (t.height <= maxHeight) return t;
  }
  return textLayer(title, { size: 30, color: "#1c1030", width: TEXT_WIDTH });
}

/** The shared light card: photo on the left, Arabic text column on the right. */
async function renderCard(opts: { cover: string; title: string; subtitle?: string; badge?: { text: string; color: string } }): Promise<{ png: Buffer; full: boolean }> {
  const layers: OverlayOptions[] = [{ input: backdrop(), top: 0, left: 0 }];
  const photo = await photoLayers(opts.cover);
  if (photo) layers.push(...photo);

  // badge (top of the text column, right-aligned)
  let y = 64;
  if (opts.badge) {
    const dark = isLight(opts.badge.color);
    const c = await textLayer(opts.badge.text, { size: 28, color: dark ? "#1c1030" : "#ffffff", bold: false });
    const bw = c.width + 44;
    const bh = c.height + 16;
    layers.push({ input: pill(bw, bh, opts.badge.color), top: y, left: TEXT_RIGHT - bw });
    layers.push({ input: c.data, top: y + Math.round((bh - c.height) / 2), left: TEXT_RIGHT - bw + 22 });
    y += bh + 26;
  } else {
    y += 10;
  }

  // title + optional subtitle
  const footerTop = H - 120;
  const sub = opts.subtitle ? await textLayer(opts.subtitle, { size: 28, color: "#6a5480", width: TEXT_WIDTH, bold: false }) : null;
  const t = await columnTitle(opts.title, footerTop - y - 40 - (sub ? sub.height + 18 : 0));
  layers.push({ input: t.data, top: y, left: TEXT_RIGHT - t.width });
  y += t.height + 18;
  if (sub) { layers.push({ input: sub.data, top: y, left: TEXT_RIGHT - sub.width }); y += sub.height + 18; }

  // sunset accent bar
  const bar = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="150" height="10"><defs><linearGradient id="a" x1="0" x2="1"><stop offset="0" stop-color="#ff3d8b"/><stop offset=".5" stop-color="#ff9a3d"/><stop offset="1" stop-color="#ffd166"/></linearGradient></defs><rect width="150" height="10" rx="5" fill="url(#a)"/></svg>`);
  layers.push({ input: bar, top: Math.min(y + 6, footerTop - 10), left: TEXT_RIGHT - 150 });

  // footer: flag + ARABIC GTA6 (right), domain pill (left of the column)
  const brandA = await textLayer("ARABIC", { size: 34, color: "#1c1030" });
  const brandB = await textLayer("GTA6", { size: 34, color: "#ff5c7a" });
  const fy = H - 92;
  const flag = await sharp(join(process.cwd(), "public/img/flag-sa-3x2.svg"), { density: 300 }).resize(42, 28).png().toBuffer();
  let x = TEXT_RIGHT - brandB.width;
  layers.push({ input: brandB.data, top: fy, left: x });
  x -= brandA.width + 10;
  layers.push({ input: brandA.data, top: fy, left: x });
  x -= 42 + 14;
  layers.push({ input: flag, top: fy + Math.round((brandA.height - 28) / 2), left: x });
  const domain = await textLayer("arabicgta6.com", { size: 26, color: "#7a2c5a", bold: false });
  const dw = domain.width + 36;
  const dh = domain.height + 14;
  const dx = TEXT_RIGHT - TEXT_WIDTH;
  layers.push({ input: pill(dw, dh, "#ffffff", 0.85), top: fy - 4, left: dx });
  layers.push({ input: domain.data, top: fy - 4 + Math.round((dh - domain.height) / 2), left: dx + 18 });

  const png = await sharp({ create: { width: W, height: H, channels: 4, background: "#fff6ef" } }).composite(layers).png({ compressionLevel: 8 }).toBuffer();
  return { png, full: Boolean(photo) };
}

function pngResponse(png: Buffer, full: boolean) {
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": full ? "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" : "public, max-age=60, s-maxage=300",
    },
  });
}

export async function renderItemOg(slug: string): Promise<Response> {
  const { card, ok } = await loadCard(slug);
  const cat = card ? CATEGORY_MAP[card.category] : null;
  // Spoiler articles share with the category's neutral official image, never their own cover.
  const cover = card ? (isSpoiler(card) ? imageOf({ category: card.category }) : imageOf(card)) : "/img/thumb/vice-city-1280.webp";
  const title = cleanTitle(card ? card.title_ar || card.title_en : "عربي GTA 6 — أسرار وأخبار وخريطة لعبة GTA VI");
  const { png, full } = await renderCard({ cover, title, badge: cat ? { text: cat.ar, color: cat.color } : undefined });
  // Full card: cache a day. Degraded card (DB unreachable, unknown slug or missing cover): 5 minutes, so it recovers.
  return pngResponse(png, Boolean(ok && card && full));
}

/** Site-wide share card (homepage and pages without their own image). */
export async function renderSiteOg(): Promise<Response> {
  const { png, full } = await renderCard({
    cover: "/img/thumb/vice-city-1280.webp",
    title: "كل أسرار GTA 6 بالعربي",
    subtitle: "أخبار وأسرار وفلوس وخريطة وشورتس، تتحدّث كل ساعة",
    badge: { text: "موسوعة GTA 6 الأولى بالعربي", color: "#ff3d8b" },
  });
  return pngResponse(png, full);
}
