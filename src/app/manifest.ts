import type { MetadataRoute } from "next";

/** Lets phones add the site to the home screen and open it full-screen like an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arabic GTA 6 — عربي GTA 6",
    short_name: "Arabic GTA6",
    description: "أخبار وأسرار وخريطة GTA 6 بالعربي",
    start_url: "/?source=app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    dir: "rtl",
    lang: "ar",
    background_color: "#fff5ec",
    theme_color: "#fff5ec",
    categories: ["games", "news", "entertainment"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "تحدي اليوم", url: "/play" },
      { name: "شورتس", url: "/shorts" },
      { name: "آخر الأخبار", url: "/c/news" },
      { name: "الخريطة", url: "/map" },
    ],
  };
}
