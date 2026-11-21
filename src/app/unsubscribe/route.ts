import { NextResponse, type NextRequest } from "next/server";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  let ok = false;
  if (supabaseConfigured() && /^[0-9a-f-]{36}$/i.test(token)) {
    const supabase = await createClient();
    const { data } = await supabase.rpc("unsubscribe_digest", { p_token: token });
    ok = data === true;
  }
  const html = `<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe</title>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0613;color:#fbf6ff;font-family:system-ui,sans-serif;text-align:center;padding:24px">
<div><h1 style="font-size:22px">${ok ? "تم إلغاء اشتراكك في النشرة الأسبوعية ✅" : "الرابط غير صالح أو مستخدم من قبل"}</h1>
<p style="color:#b9a9cf">${ok ? "You have been unsubscribed from the weekly digest." : "This link is invalid or already used."}</p>
<a href="/" style="color:#ff3d8b">arabicgta6.com</a></div></body></html>`;
  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
