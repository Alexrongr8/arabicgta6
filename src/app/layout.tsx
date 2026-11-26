import type { Metadata, Viewport } from "next";
import { Anton, Lalezar, Tajawal } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { getLocale, getViewer } from "@/lib/session";
import { t } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/Nav";
import { Tracker } from "@/components/Tracker";
import { SnapPixel } from "@/components/SnapPixel";
import { AdSense } from "@/components/AdSense";
import { TipOfVisit } from "@/components/TipOfVisit";
import { PlayerBoot } from "@/components/player/PlayerBoot";
import { Analytics } from "@vercel/analytics/next";

const body = Tajawal({ variable: "--font-body", subsets: ["arabic", "latin"], weight: ["400", "500", "700", "800"] });
const head = Lalezar({ variable: "--font-head-ar", subsets: ["arabic", "latin"], weight: "400" });
const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: { default: `${t(locale, "siteName")} — ${locale === "ar" ? "أسرار وأخبار وخريطة" : "secrets, news & map"}`, template: `%s · ${t(locale, "siteName")}` },
    description: t(locale, "tagline"),
    applicationName: "Arabic GTA 6",
    appleWebApp: { capable: true, title: "Arabic GTA6", statusBarStyle: "default" },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://arabicgta6.com"),
    openGraph: { title: "Arabic GTA 6", description: t(locale, "tagline"), type: "website" },
  };
}

export const viewport: Viewport = {
  themeColor: "#fff5ec",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, viewer, jar] = await Promise.all([getLocale(), getViewer(), cookies()]);
  const theme = jar.get("theme")?.value === "dark" ? "dark" : "light";
  const labels = { home: t(locale, "home"), explore: t(locale, "explore"), map: t(locale, "map"), shorts: t(locale, "shorts"), search: t(locale, "search"), account: t(locale, "account"), play: locale === "ar" ? "العب" : "Play", me: locale === "ar" ? "ملفي" : "Me" };
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} data-theme={theme} className={`${body.variable} ${head.variable} ${anton.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[1000] focus:rounded-xl focus:bg-card focus:px-4 focus:py-3 focus:font-bold focus:text-fg">
          {locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}
        </a>
        <Header locale={locale} viewer={viewer} labels={labels} theme={theme} />
        {viewer.demo && (
          <div className="border-b border-line bg-chip px-4 py-1.5 text-center text-[11px] text-muted">{t(locale, "demoMode")}</div>
        )}
        <div id="main-content" tabIndex={-1} className="flex-1 scroll-mt-20">{children}</div>
        <Footer locale={locale} />
        <BottomNav labels={labels} />
        <Tracker />
        <SnapPixel />
        <AdSense />
        <TipOfVisit locale={locale} />
        <PlayerBoot locale={locale} />
        <Analytics />
      </body>
    </html>
  );
}
