import { NextResponse, type NextRequest } from "next/server";
import { recordView } from "@/lib/tracking";
import { getViewer } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { path?: string; ref?: string };
    const path = typeof body.path === "string" && body.path.startsWith("/") ? body.path : "/";
    if (path.startsWith("/admin")) return new NextResponse(null, { status: 204 });
    const viewer = await getViewer();
    let ref: string | null = null;
    if (body.ref) {
      try {
        const u = new URL(body.ref);
        if (u.host !== req.nextUrl.host) ref = u.host;
      } catch {}
    }
    await recordView(path, viewer.id ?? null, ref, req.headers);
  } catch {}
  return new NextResponse(null, { status: 204 });
}
