import { NextResponse, type NextRequest } from "next/server";
import { recordView } from "@/lib/tracking";
import { getLocale, getViewer } from "@/lib/session";

const clean = (v: unknown, max = 80) => (typeof v === "string" && v ? v.slice(0, max) : null);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const path = typeof body.path === "string" && body.path.startsWith("/") ? body.path : "/";
    if (path.startsWith("/admin")) return new NextResponse(null, { status: 204 });
    const [viewer, lang] = await Promise.all([getViewer(), getLocale()]);
    let referrer: string | null = null;
    if (typeof body.ref === "string" && body.ref) {
      try {
        const u = new URL(body.ref);
        if (u.host !== req.nextUrl.host) referrer = u.host;
      } catch {}
    }
    await recordView(
      {
        path,
        userId: viewer.id ?? null,
        referrer,
        visitorId: clean(body.vid, 40),
        utmSource: clean(body.utm_source),
        utmCampaign: clean(body.utm_campaign),
        lang,
      },
      req.headers,
    );
  } catch {}
  return new NextResponse(null, { status: 204 });
}
