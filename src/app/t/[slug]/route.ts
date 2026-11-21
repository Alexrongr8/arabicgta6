import sharp from "sharp";
import { NextResponse, type NextRequest } from "next/server";
import { coverBytes, loadCard } from "@/lib/og-image";
import { categoryThumb, imageOf, THUMB_WIDTHS, type ThumbWidth } from "@/lib/image";
import { isSpoiler } from "@/lib/spoiler";

const SLUG = /^[a-z0-9][a-z0-9-]{0,119}$/;
const SHORT = "public, max-age=60, s-maxage=300";
const LONG = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800";

/**
 * /t/<slug>?w=228 — resized WebP of an article's cover. Only serves images that belong to a real
 * article (looked up by slug), so it is not an open image proxy. Any failure redirects to the
 * category's official fallback image with a short cache, so it recovers on its own.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const width = Number(req.nextUrl.searchParams.get("w") ?? 228);
  if (!SLUG.test(slug) || !(THUMB_WIDTHS as readonly number[]).includes(width)) {
    return new NextResponse("Bad request", { status: 400, headers: { "Cache-Control": SHORT } });
  }

  const { card, ok } = await loadCard(slug);
  const fallback = card ? categoryThumb(card.category, width as ThumbWidth) : `/img/thumb/vice-city-${width}.webp`;
  const redirectFallback = () => {
    const r = NextResponse.redirect(new URL(fallback, req.nextUrl.origin), 302);
    r.headers.set("Cache-Control", SHORT);
    return r;
  };
  if (!card || isSpoiler(card)) return redirectFallback();

  const bytes = await coverBytes(imageOf(card));
  if (!bytes) return redirectFallback();
  try {
    const out = await sharp(bytes, { limitInputPixels: 40_000_000 }) // refuse decompression bombs
      // fixed output rectangle (square card or 16:9), so odd source shapes can't produce huge images
      .resize({ width, height: width === 228 ? 228 : Math.round((width * 9) / 16), fit: "cover", position: "attention" })
      .webp({ quality: 72 })
      .toBuffer();
    return new NextResponse(new Uint8Array(out), {
      // If the database lookup degraded to seed data, cache briefly so a later DB-only change shows up.
      headers: { "Content-Type": "image/webp", "Cache-Control": ok ? LONG : SHORT },
    });
  } catch {
    return redirectFallback();
  }
}
