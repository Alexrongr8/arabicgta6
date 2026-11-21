import type { Locale } from "./types";

export const LOCALE_COOKIE = "lang";

const dict = {
  siteName: { ar: "عربي GTA 6", en: "Arabic GTA 6" },
  tagline: {
    ar: "كل أسرار GTA 6 في مكان واحد — أخبار، أسرار، قلتشات، فلوس، وخريطة تفاعلية",
    en: "Every GTA 6 secret in one place — news, secrets, glitches, money and an interactive map",
  },
  home: { ar: "الرئيسية", en: "Home" },
  explore: { ar: "استكشف", en: "Explore" },
  map: { ar: "الخريطة", en: "Map" },
  search: { ar: "بحث", en: "Search" },
  account: { ar: "حسابي", en: "Account" },
  latestNews: { ar: "آخر الأخبار", en: "Latest news" },
  latest: { ar: "أحدث الإضافات", en: "Latest additions" },
  categories: { ar: "الأقسام", en: "Categories" },
  viewAll: { ar: "عرض الكل", en: "View all" },
  signIn: { ar: "تسجيل الدخول", en: "Sign in" },
  signInGoogle: { ar: "الدخول بحساب Google", en: "Continue with Google" },
  signOut: { ar: "تسجيل الخروج", en: "Sign out" },
  gateTitle: { ar: "هذا المحتوى للأعضاء", en: "Members only" },
  gateBody: {
    ar: "سجّل دخولك بحساب Google مجاناً عشان تفتح كل الأقسام، الخريطة التفاعلية، والبحث الكامل.",
    en: "Sign in free with Google to unlock every category, the interactive map and full search.",
  },
  gatePerks: {
    ar: ["كل الأسرار والقلتشات وطرق الفلوس", "خريطة ليونيدا التفاعلية", "بحث كامل مثل الويكيبيديا", "نشرة أسبوعية على إيميلك"],
    en: ["Every secret, glitch and money method", "The interactive Leonida map", "Wikipedia-style full search", "A weekly digest in your inbox"],
  },
  guestNewsNote: {
    ar: "تشوف كزائر آخر 10 أخبار فقط. سجّل دخولك لتشوف كل شي.",
    en: "Guests see the latest 10 news items only. Sign in to see everything.",
  },
  searchPlaceholder: { ar: "ابحث عن سلاح، منطقة، شخصية…", en: "Search a weapon, place, character…" },
  searchEmpty: { ar: "ما لقينا نتائج. جرّب كلمة ثانية بالعربي أو الإنجليزي.", en: "No results. Try another word in English or Arabic." },
  searchHint: {
    ar: "اكتب اسم سلاح أو منطقة أو شخصية — مثلاً Vice City أو Lucia أو مسدس",
    en: "Type a weapon, area or character — e.g. Vice City, Lucia or revolver",
  },
  popular: { ar: "عمليات بحث شائعة", en: "Popular searches" },
  results: { ar: "نتيجة", en: "results" },
  sources: { ar: "المصادر", en: "Sources" },
  related: { ar: "مواضيع مرتبطة", en: "Related" },
  quickFacts: { ar: "معلومات سريعة", en: "Quick facts" },
  showOnMap: { ar: "اعرض على الخريطة", en: "Show on map" },
  region: { ar: "المنطقة", en: "Region" },
  category: { ar: "القسم", en: "Category" },
  status: { ar: "الحالة", en: "Status" },
  updated: { ar: "أُضيف", en: "Added" },
  open: { ar: "افتح", en: "Open" },
  all: { ar: "الكل", en: "All" },
  items: { ar: "موضوع", en: "entries" },
  autoUpdate: { ar: "يتحدّث تلقائياً كل 6 ساعات", en: "Auto-updated every 6 hours" },
  mapNote: {
    ar: "خريطة فنية تقريبية لليونيدا — المواقع تقريبية وليست خريطة اللعبة الرسمية.",
    en: "Stylised approximate map of Leonida — positions are approximate, not the official in-game map.",
  },
  digest: { ar: "النشرة الأسبوعية", en: "Weekly digest" },
  digestDesc: {
    ar: "ملخص كل جمعة بأهم الأسرار والأخبار الجديدة على إيميلك.",
    en: "A Friday summary of the best new secrets and news in your inbox.",
  },
  subscribed: { ar: "مشترك", en: "Subscribed" },
  notSubscribed: { ar: "غير مشترك", en: "Not subscribed" },
  subscribe: { ar: "اشترك", en: "Subscribe" },
  unsubscribe: { ar: "إلغاء الاشتراك", en: "Unsubscribe" },
  demoMode: {
    ar: "وضع المعاينة: قاعدة البيانات غير متصلة بعد، المعروض هو البيانات الأولية.",
    en: "Preview mode: database not connected yet, showing seed data.",
  },
  back: { ar: "رجوع", en: "Back" },
  disclaimer: {
    ar: "موقع معجبين غير رسمي وغير تابع لـ Rockstar Games أو Take-Two.",
    en: "Unofficial fan site, not affiliated with Rockstar Games or Take-Two.",
  },
  legend: { ar: "التصنيفات", en: "Legend" },
  locations: { ar: "موقع على الخريطة", en: "map pins" },
  heroCta: { ar: "افتح الخريطة", en: "Open the map" },
  heroCta2: { ar: "ابدأ البحث", en: "Start searching" },
  welcome: { ar: "أهلاً", en: "Welcome" },
  stats: { ar: "في الموسوعة", en: "in the encyclopedia" },
  featured: { ar: "مختارات", en: "Featured" },
  notFound: { ar: "الصفحة غير موجودة", en: "Page not found" },
  loginError: { ar: "صار خطأ في تسجيل الدخول، جرّب مرة ثانية.", en: "Sign-in failed, please try again." },
  authNotReady: {
    ar: "تسجيل الدخول غير مفعّل بعد (لم يتم ربط Supabase).",
    en: "Sign-in is not enabled yet (Supabase not connected).",
  },
} as const;

type Dict = typeof dict;
export type DictKey = keyof Dict;

export function t<K extends DictKey>(locale: Locale, key: K): Dict[K]["ar"] | Dict[K]["en"] {
  return dict[key][locale];
}

export function pick(obj: object, field: string, locale: Locale): string {
  const o = obj as Record<string, unknown>;
  const v = o[`${field}_${locale}`] ?? o[`${field}_en`];
  return typeof v === "string" ? v : "";
}

export function formatDate(iso: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}
