import Script from "next/script";

/** Google AdSense publisher id ("ca-pub-1234567890123456"). Unset = no ad code loads at all. */
export const ADSENSE_CLIENT = /^ca-pub-\d{10,20}$/.test(process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "") ? process.env.NEXT_PUBLIC_ADSENSE_CLIENT!.trim() : "";

/** AdSense Auto ads: Google chooses placements. Loaded after the page is idle so it never slows the first paint. */
export function AdSense() {
  if (!ADSENSE_CLIENT) return null;
  return (
    <Script
      id="adsense"
      async
      strategy="lazyOnload"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}
