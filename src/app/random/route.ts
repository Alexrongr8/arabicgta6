import { NextResponse, type NextRequest } from "next/server";
import { getDailyPool } from "@/lib/data";

/** "Surprise me": jumps to a random secret, strange thing, tip or funny moment (never a story spoiler). */
export async function GET(req: NextRequest) {
  try {
    const pool = await getDailyPool();
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return NextResponse.redirect(new URL(pick ? `/item/${pick.slug}` : "/explore", req.url), { status: 307, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
  } catch {
    return NextResponse.redirect(new URL("/explore", req.url), { status: 307 });
  }
}
