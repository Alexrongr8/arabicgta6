import { checkPublicHttpsUrl, safeGet } from "../../src/lib/safe-fetch";

/**
 * Fetches a page and returns its og:image / twitter:image URL (absolute, public HTTPS), or null.
 * Uses the SSRF-safe fetcher: one 9 s deadline for the whole exchange, 1.5 MB body cap,
 * manual redirect validation and no private/loopback destinations.
 */
export async function findImage(url: string): Promise<string | null> {
  try {
    const res = await safeGet(url, {
      timeoutMs: 9000,
      maxBytes: 1_500_000,
      accept: "text/html",
      userAgent: "Mozilla/5.0 (compatible; ArabicGTA6Bot/1.0; +https://arabicgta6.com)",
    });
    if (!res || res.status !== 200 || !res.contentType.includes("html")) return null;
    const html = res.body.toString("utf8").slice(0, 400_000);
    const m =
      html.match(/<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image(?::src)?)["'][^>]*content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["'](?:og:image|twitter:image)["']/i);
    if (!m) return null;
    const img = new URL(m[1].replace(/&amp;/g, "&"), res.finalUrl).toString();
    if (!checkPublicHttpsUrl(img) || /logo|favicon|default|placeholder/i.test(img)) return null;
    return img;
  } catch {
    return null;
  }
}
