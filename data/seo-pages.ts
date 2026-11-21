import type { CategorySlug } from "../src/lib/types";

/** Landing pages for what Arab players search for. Each collects the relevant articles. */
export interface SeoPage {
  slug: string;
  titleAr: string;
  titleEn: string;
  introAr: string;
  introEn: string;
  keywordsAr: string[];
  categories?: CategorySlug[];
  slugs?: string[];
  faq?: { qAr: string; aAr: string; qEn: string; aEn: string }[];
}

export const SEO_PAGES: SeoPage[] = [
  {
    slug: "gta-6-money",
    titleAr: "كيف أجيب فلوس في GTA 6؟ أفضل طرق جمع الفلوس",
    titleEn: "How to make money in GTA 6: the best methods",
    introAr: "كل طرق الفلوس المجربة في GTA 6 بالخطوات والأماكن على الخريطة: مخابئ العصابات، غطسات Kenton، بيع السيارات لـ Moses، طرود Donnie، والغش اللي يعطيك 250 ألف.",
    introEn: "Every tested way to make money in GTA 6, with steps and map pins: gang hideouts, Kenton's dives, selling cars to Moses, Donnie's packages and the $250k cheat.",
    keywordsAr: ["فلوس GTA 6", "طريقة جمع الفلوس GTA 6", "قلتش فلوس GTA 6", "فلوس قراند 6"],
    categories: ["money"],
    slugs: ["all-cheat-codes-list", "money-glitch-warehouse-reload", "safe-codes-list"],
    faq: [
      { qAr: "وش أسرع طريقة فلوس بالبداية؟", aAr: "مخابئ العصابات (Illegal Operations) وغطسات Kenton في Key Lento، وبعدها بيع السيارات لـ Moses من الفصل الثاني.", qEn: "What's the fastest early money?", aEn: "Gang hideouts (Illegal Operations) and Kenton's dives in Key Lento, then selling cars to Moses from Chapter 2." },
      { qAr: "فيه غش فلوس في GTA 6؟", aAr: "إيه، غش 250,000$ يفتح بعد ما تخلص القصة: فوق، يمين، تحت، يسار، فوق، يسار، تحت، يمين.", qEn: "Is there a money cheat?", aEn: "Yes, $250,000 after the story: Up, Right, Down, Left, Up, Left, Down, Right." },
    ],
  },
  {
    slug: "gta-6-cheats",
    titleAr: "شفرات GTA 6 كاملة للبلايستيشن والإكس بوكس",
    titleEn: "All GTA 6 cheat codes for PS5 and Xbox",
    introAr: "كل غشّات GTA 6 المؤكدة بترتيب الأزرار، وكيف تدخلها من الجوال، وشروط فتح كل غش.",
    introEn: "Every confirmed GTA 6 cheat with the button sequence, how to enter it on the phone and unlock conditions.",
    keywordsAr: ["شفرات GTA 6", "غشات GTA 6", "كودات قراند 6", "شفرات قراند 6 بلايستيشن"],
    slugs: ["all-cheat-codes-list", "how-to-enter-cheats"],
  },
  {
    slug: "gta-6-map",
    titleAr: "خريطة GTA 6 كاملة — كل مناطق Leonida",
    titleEn: "The full GTA 6 map — every region of Leonida",
    introAr: "خريطة Rockstar الرسمية لـ Leonida مع كل المناطق والمقاطعات: Vice City و Port Gellhorn و Grassrivers و Leonida Keys و Mount Kalaga و Ambrosia.",
    introEn: "Rockstar's official Leonida map with every region and county: Vice City, Port Gellhorn, Grassrivers, the Keys, Mount Kalaga and Ambrosia.",
    keywordsAr: ["خريطة GTA 6", "خريطة قراند 6", "مدن GTA 6", "فايس سيتي"],
    categories: ["places"],
  },
  {
    slug: "gta-6-secrets",
    titleAr: "أسرار GTA 6 وبيض عيد الفصح المخفي",
    titleEn: "GTA 6 secrets and easter eggs",
    introAr: "كل أسرار Leonida: الصحن الطائر، Skunk Ape، شقة Dexter، أرقام الخزن، وإشارات Tommy Vercetti.",
    introEn: "Every Leonida secret: the UFO, the Skunk Ape, Dexter's apartment, safe codes and Tommy Vercetti references.",
    keywordsAr: ["أسرار GTA 6", "أسرار قراند 6", "ايستر ايج GTA 6", "الفضائيين GTA 6"],
    categories: ["secrets", "strange"],
  },
  {
    slug: "gta-6-weapons",
    titleAr: "أسلحة GTA 6: أفضل سلاح وأماكن الأسلحة النادرة",
    titleEn: "GTA 6 weapons: best guns and rare weapon locations",
    introAr: "أفضل سلاح في كل فئة ومن وين تشتريه، وأماكن الأسلحة الفريدة المجانية بالخريطة.",
    introEn: "The best gun in every class and where to buy it, plus free unique weapon locations on the map.",
    keywordsAr: ["أسلحة GTA 6", "أفضل سلاح GTA 6", "أسلحة نادرة قراند 6"],
    categories: ["weapons"],
  },
  {
    slug: "gta-6-cars",
    titleAr: "أسرع سيارات GTA 6 وأماكن السيارات النادرة",
    titleEn: "Fastest GTA 6 cars and rare car locations",
    introAr: "أسرع السيارات حسب الترتيبات، وأماكن السيارات النادرة مثل Infernus و Emerus و Tempesta.",
    introEn: "The fastest cars by ranking and where to find rare rides like the Infernus, Emerus and Tempesta.",
    keywordsAr: ["سيارات GTA 6", "أسرع سيارة GTA 6", "سيارات نادرة قراند 6"],
    categories: ["vehicles"],
  },
  {
    slug: "gta-6-release-price",
    titleAr: "سعر GTA 6 وموعد نزولها والمنصات",
    titleEn: "GTA 6 price, release date and platforms",
    introAr: "GTA 6 نزلت 19 نوفمبر 2026 على PS5 و Xbox Series. السعر 79.99$ للعادية و 99.99$ للألتميت. وهنا كل شي عن نسخة PC والأونلاين.",
    introEn: "GTA 6 launched on 19 November 2026 on PS5 and Xbox Series: $79.99 Standard, $99.99 Ultimate. Plus what we know about PC and Online.",
    keywordsAr: ["سعر GTA 6", "موعد نزول GTA 6", "GTA 6 بي سي", "قراند 6 متى تنزل"],
    slugs: ["gta-6-release-november-19-2026", "price-and-editions", "which-edition-to-buy", "pc-version-report-2027", "gta-6-online-late-2027-report", "rumor-pc-build-from-leaked-xbox-files"],
  },
  {
    slug: "gta-6-tips",
    titleAr: "نصائح GTA 6 للمبتدئين — أزرار البلايستيشن والإكس بوكس",
    titleEn: "GTA 6 beginner tips — PS5 and Xbox controls",
    introAr: "أهم نصائح البداية وأزرار التحكم المفيدة: التركيز L3+R3، Joey يجيب سيارتك، تخبية الفلوس، والهروب من الشرطة.",
    introEn: "Key beginner tips and handy controls: Focus with L3+R3, Joey brings your car, saving your cash and losing the cops.",
    keywordsAr: ["نصائح GTA 6", "أزرار GTA 6", "تحكم قراند 6"],
    categories: ["tips"],
  },
  {
    slug: "gta-6-safe-codes",
    titleAr: "أرقام الخزن في GTA 6 — كل الأكواد",
    titleEn: "GTA 6 safe codes — every combination",
    introAr: "كل أرقام الخزن والأبواب المعروفة في GTA 6 ومكان كل خزنة على الخريطة.",
    introEn: "Every known GTA 6 safe and door code with each safe pinned on the map.",
    keywordsAr: ["أرقام الخزن GTA 6", "رقم خزنة قراند 6", "كود الخزنة GTA 6"],
    slugs: ["safe-codes-list", "explosions-open-safes", "keypad-code-2314"],
  },
  {
    slug: "gta-6-glitches",
    titleAr: "قلتشات GTA 6 ومشاكلها وحلولها",
    titleEn: "GTA 6 glitches, bugs and fixes",
    introAr: "القلتشات اللي واجهت اللاعبين من أول يوم: الطيحة من الخريطة، الكراشات، تعليق المهمات، وقلتش الفلوس.",
    introEn: "Glitches players hit from day one: falling through the map, crashes, mission softlocks and the money glitch.",
    keywordsAr: ["قلتشات GTA 6", "قلتش قراند 6", "مشاكل GTA 6"],
    categories: ["glitches"],
  },
  {
    slug: "gta-6-choices",
    titleAr: "عواقب الاختيارات في GTA 6 — وش يصير لو كذبت أو قتلت؟",
    titleEn: "GTA 6 choices and consequences",
    introAr: "كيف تأثر اختياراتك على علاقة Jason و Lucia وعلى النهاية (مع تنبيه حرق).",
    introEn: "How your choices affect Jason and Lucia's relationship and the ending (spoilers).",
    keywordsAr: ["نهاية GTA 6", "اختيارات GTA 6", "لوسيا GTA 6"],
    categories: ["choices"],
  },
];
