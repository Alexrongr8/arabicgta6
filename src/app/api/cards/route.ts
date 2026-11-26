import { NextResponse, type NextRequest } from "next/server";
import { getBySlugs } from "@/lib/data";

/** Card data for the visitor's saved and recently read articles (their slugs live in the browser). */
export async function GET(req: NextRequest) {
  const slugs = [...new Set((req.nextUrl.searchParams.get("slugs") ?? "").split(",").map((s) => s.trim()).filter((s) => /^[a-z0-9-]{1,140}$/.test(s)))].slice(0, 40);
  if (!slugs.length) return NextResponse.json({ results: [] }, { headers: { "Cache-Control": "no-store" } });
  try {
    return NextResponse.json({ results: await getBySlugs(slugs) }, { headers: { "Cache-Control": "private, max-age=60" } });
  } catch {
    return NextResponse.json({ error: "cards_unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
