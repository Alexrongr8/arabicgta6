import { NextResponse, type NextRequest } from "next/server";
import { search } from "@/lib/data";
import { searchCatalog } from "@/lib/catalog-search";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 80);
  const results = await search(q, 30);
  return NextResponse.json({ results, catalog: searchCatalog(q) });
}
