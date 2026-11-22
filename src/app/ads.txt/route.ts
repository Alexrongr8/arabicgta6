import { ADSENSE_CLIENT } from "@/components/AdSense";

/** ads.txt authorises Google to sell ads on this domain (required for full AdSense revenue). */
export function GET() {
  const body = ADSENSE_CLIENT ? `google.com, ${ADSENSE_CLIENT.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n` : "# No advertising partners yet.\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
