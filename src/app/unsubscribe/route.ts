import { NextResponse, type NextRequest } from "next/server";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const headers = {
  "content-type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
};
function page(title: string, message: string, status: number, token?: string) {
  const form = token ? `<form method="post" action="/unsubscribe?token=${encodeURIComponent(token)}"><input type="hidden" name="List-Unsubscribe" value="One-Click"><button style="padding:12px 20px;border:0;border-radius:10px;background:#ff8ab8;color:#241338;font-weight:bold" type="submit">تأكيد إلغاء الاشتراك · Confirm unsubscribe</button></form>` : "";
  return new NextResponse(`<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>إلغاء الاشتراك · Unsubscribe</title><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0613;color:#fbf6ff;font-family:system-ui,sans-serif;text-align:center;padding:24px"><div><h1 style="font-size:22px">${title}</h1><p style="color:#c8b8dd">${message}</p>${form}<p><a href="/" style="color:#ff8ab8">arabicgta6.com</a></p></div></body></html>`, { status, headers });
}
const invalid = () => page("الرابط غير صالح", "افتح رابط إلغاء الاشتراك من الرسالة الأصلية مرة ثانية. · Open the unsubscribe link from your original email again.", 400);
const unavailable = () => page("تعذر إلغاء الاشتراك الآن", "حاول مرة ثانية بعد شوي؛ ما قدرنا نؤكد حفظ التغيير. · Unsubscribe is temporarily unavailable. Please retry; your preference change has not been confirmed.", 503);

/** GET is confirmation only: mail scanners must not change a subscription. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (!UUID.test(token)) return invalid();
  if (!supabaseConfigured()) return unavailable();
  return page("هل تريد إلغاء اشتراك النشرة؟", "اضغط التأكيد لإيقاف النشرة. فتح هالصفحة ما يغيّر اشتراكك. · Confirm below to stop the newsletter. Opening this page does not change your preference.", 200, token);
}

/** Read a small form, including RFC8058 multipart requests, without buffering an arbitrary body. */
async function oneClickForm(request: NextRequest) {
  const type = request.headers.get("content-type") ?? "";
  if (!/^(application\/x-www-form-urlencoded|multipart\/form-data)(?:;|$)/i.test(type)) return false;
  if (Number(request.headers.get("content-length") ?? 0) > 4096 || !request.body) return false;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0, timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const body = await Promise.race([
      (async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > 4096) { void reader.cancel().catch(() => {}); return null; }
          chunks.push(value);
        }
        const bytes = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
        return bytes;
      })(),
      new Promise<null>((resolve) => {
        timeout = setTimeout(() => { void reader.cancel().catch(() => {}); resolve(null); }, 3000);
      }),
    ]);
    if (!body) return false;
    const form = await new Request(request.url, { method: "POST", headers: { "content-type": type }, body: new TextDecoder().decode(body) }).formData();
    return form.get("List-Unsubscribe") === "One-Click";
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

/** Token-bearing POST requires no login/cookies; repeat valid requests remain successful. */
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (!UUID.test(token) || !(await oneClickForm(request))) return invalid();
  if (!supabaseConfigured()) return unavailable();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("unsubscribe_digest", { p_token: token }).abortSignal(AbortSignal.timeout(4000));
    if (error) return unavailable();
    if (data !== true) return invalid();
    return page("تم إلغاء اشتراكك في النشرة ✅", "لن تصلك النشرة. تأكيد الإلغاء مرة ثانية ما يعيد الاشتراك. · You are unsubscribed. Repeating this request keeps you unsubscribed.", 200);
  } catch {
    return unavailable();
  }
}
