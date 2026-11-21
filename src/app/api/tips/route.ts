import { NextResponse, type NextRequest } from "next/server";
import { getTipCards } from "@/lib/data";

/** Public tip text only; preference/history stays in the visitor's browser. */
export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") ?? "ar";
  if (locale !== "ar" && locale !== "en") {
    return NextResponse.json({ tips: [] }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const rows = await getTipCards();
    const tips = rows.slice(0, 200).flatMap((row) => {
      const title = locale === "ar" ? row.title_ar : row.title_en;
      const summary = locale === "ar" ? row.summary_ar : row.summary_en;
      if (typeof row.slug !== "string" || !/^[a-z0-9][a-z0-9-]{0,119}$/.test(row.slug)
        || typeof title !== "string" || typeof summary !== "string"
        || !["official", "confirmed", "leak", "rumor"].includes(row.status)) return [];
      return [{ slug: row.slug, status: row.status, title: title.slice(0, 240), summary: summary.slice(0, 800) }];
    });
    // The data helper uses a cookie-aware client: keep this out of shared CDN caches.
    return NextResponse.json({ tips }, { headers: { "Cache-Control": tips.length ? "private, max-age=300" : "no-store" } });
  } catch {
    return NextResponse.json({ tips: [] }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
