import { NextResponse, type NextRequest } from "next/server";
import { search } from "@/lib/data";
import { getViewer } from "@/lib/session";

export async function GET(req: NextRequest) {
  const viewer = await getViewer();
  if (!viewer.member) return NextResponse.json({ error: "auth" }, { status: 401 });
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 80);
  const results = await search(q, 30);
  return NextResponse.json({ results });
}
