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
  latestNews: { ar: "وش الجديد؟ 📰", en: "What's new 📰" },
  latest: { ar: "آخر اللي أضفناه", en: "Fresh additions" },
  categories: { ar: "تصفّح على كيفك", en: "Browse your way" },
  viewAll: { ar: "عرض الكل", en: "View all" },
  signIn: { ar: "تسجيل الدخول", en: "Sign in" },
  signInGoogle: { ar: "الدخول بحساب Google", en: "Continue with Google" },
  signOut: { ar: "تسجيل الخروج", en: "Sign out" },
  gateTitle: { ar: "خلك أول من يعرف 📬", en: "Be the first to know 📬" },
  gateBody: {
    ar: "سجّل بحساب Google بضغطة وحدة، ويوصلك كل أسبوع ملخص بأهم أخبار وأسرار GTA 6 على إيميلك — مجاناً.",
    en: "Sign in with Google in one tap and get a free weekly email with the best GTA 6 news and secrets.",
  },
  gatePerks: {
    ar: ["ملخص أسبوعي كل جمعة بأهم الأخبار", "أول من يعرف بالأسرار والقلتشات الجديدة", "بدون إزعاج — تقدر تلغي بضغطة", "بدون كلمة سر، بس حساب Google"],
    en: ["A Friday summary of the biggest news", "Be first to hear about new secrets and glitches", "No spam — unsubscribe in one tap", "No password, just your Google account"],
  },
  gatePausedTitle: { ar: "حسابك في الموسوعة", en: "Your encyclopedia account" },
  gatePausedBody: { ar: "سجّل بحساب Google للمشاركة وضبط إعداداتك. إرسال النشرة البريدية متوقف حالياً.", en: "Sign in with Google to participate and manage your preferences. Newsletter sending is currently paused." },
  gatePausedPerks: {
    ar: ["شارك اكتشافاتك باسمك", "علّق وصوّت على مشاركات المجتمع", "تحكّم باللغة والنصائح", "بدون كلمة مرور — بحساب Google"],
    en: ["Share discoveries under your name", "Comment and vote in the community", "Control language and tips", "No password — use your Google account"],
  },
  digestPaused: { ar: "إرسال النشرة متوقف حالياً. لن تصلك رسائل حتى يُفعّل الإرسال.", en: "Newsletter sending is currently paused. No newsletters are being sent until delivery is enabled." },
  digestSavedPaused: { ar: "تفضيل الاشتراك محفوظ، لكن الإرسال متوقف.", en: "Your subscription preference is saved, but delivery is paused." },
  digestUnavailable: { ar: "تعذر تحميل تفضيل الاشتراك. حاول لاحقاً.", en: "Your subscription preference could not be loaded. Please try again." },
  digestSaveFailed: { ar: "تعذر حفظ التفضيل. حاول مرة ثانية.", en: "Your preference could not be saved. Please try again." },
  digestSubscribePaused: { ar: "الاشتراك متاح عند تفعيل النشرة", en: "Subscription opens when the newsletter is enabled" },
  guestNewsNote: {
    ar: "هذي آخر 10 أخبار للزوار 👀 سجّل دخولك وشوف كل شي.",
    en: "Guests see the latest 10 news items only. Sign in to see everything.",
  },
  searchPlaceholder: { ar: "وش تدوّر؟ سلاح، مكان، شخصية…", en: "What are you looking for?" },
  searchEmpty: { ar: "ما لقينا شي 😅 جرّب كلمة ثانية، بالعربي أو الإنجليزي.", en: "Nothing yet 😅 Try another word, in English or Arabic." },
  searchHint: {
    ar: "اكتب اسم سلاح أو منطقة أو شخصية — مثلاً Vice City أو Lucia أو مسدس",
    en: "Type a weapon, area or character — e.g. Vice City, Lucia or revolver",
  },
  popular: { ar: "الناس تدوّر على", en: "People are searching" },
  results: { ar: "نتيجة", en: "results" },
  sources: { ar: "المصادر", en: "Sources" },
  related: { ar: "يمكن يعجبك بعد", en: "You might also like" },
  quickFacts: { ar: "على السريع", en: "Quick facts" },
  showOnMap: { ar: "اعرض على الخريطة", en: "Show on map" },
  region: { ar: "المنطقة", en: "Region" },
  category: { ar: "القسم", en: "Category" },
  status: { ar: "الحالة", en: "Status" },
  updated: { ar: "التاريخ", en: "Date" },
  open: { ar: "افتح", en: "Open" },
  all: { ar: "الكل", en: "All" },
  items: { ar: "موضوع", en: "entries" },
  autoUpdate: { ar: "نضيف محتوى جديد باستمرار", en: "New content added regularly" },
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
    ar: "نسخة تجريبية: نعرض المعلومات الأولية لين نربط قاعدة البيانات.",
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
  featured: { ar: "لا يفوتك 🔥", en: "Don't miss 🔥" },
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
