import { NextResponse, type NextRequest } from "next/server";
import { recordView } from "@/lib/tracking";
import { getLocale, getViewer } from "@/lib/session";
import { RequestBodyError, smallJson } from "@/lib/small-json";

const clean = (v: unknown, max = 80) => (typeof v === "string" && v ? v.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, max) : null);
const publicPath = /^\/(?:|explore|map|search|privacy|trophies|community|catalog\/(?:weapons|vehicles|animals)|c\/(?:news|secrets|money|weapons|places|characters|vehicles|glitches|strange|choices|streamers|funny|tips)|(?:item|guides)\/[a-z0-9][a-z0-9-]{0,119}|community\/[0-9a-f-]{36})$/;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const recent = new Map<string, number>();

// Best-effort duplicate suppression per warm instance; the edge WAF supplies abuse limits.
function duplicate(visitor: string | null, path: string) {
  if (!visitor) return false;
  const now = Date.now();
  const key = `${visitor}:${path}`;
  if ((recent.get(key) ?? 0) > now - 15000) return true;
  recent.delete(key);
  recent.set(key, now);
  while (recent.size > 5000) recent.delete(recent.keys().next().value!);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");
    if ((origin && origin !== req.nextUrl.origin) || req.headers.get("sec-fetch-site") === "cross-site") {
      return new NextResponse(null, { status: 403 });
    }
    const value = await smallJson(req);
    if (!value || typeof value !== "object" || Array.isArray(value)) return new NextResponse(null, { status: 400 });
    const body = value as Record<string, unknown>;
    const path = typeof body.path === "string" ? body.path : "";
    if (!publicPath.test(path)) return new NextResponse(null, { status: 204 });
    const visitor = typeof body.vid === "string" && uuid.test(body.vid) ? body.vid : null;
    if (duplicate(visitor, path)) return new NextResponse(null, { status: 204 });
    const [viewer, lang] = await Promise.all([getViewer(), getLocale()]);
    let referrer: string | null = null;
    if (typeof body.ref === "string" && body.ref) {
      try {
        const u = new URL(body.ref);
        if (["http:", "https:"].includes(u.protocol) && u.host !== req.nextUrl.host) referrer = u.host;
      } catch {}
    }
    await recordView(
      {
        path,
        userId: viewer.id ?? null,
        referrer,
        visitorId: visitor,
        utmSource: clean(body.utm_source),
        utmCampaign: clean(body.utm_campaign),
        lang,
      },
      req.headers,
    );
  } catch (error) {
    if (error instanceof RequestBodyError) return new NextResponse(null, { status: error.status });
    // Optional analytics must not interrupt page reading when its backend is unavailable.
  }
  return new NextResponse(null, { status: 204 });
}
