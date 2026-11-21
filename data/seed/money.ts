import { build } from "./helpers";

const payNote = {
  en: "Payout figures are approximate and vary between guides.",
  ar: "المبالغ تقريبية وتختلف بين الأدلة.",
};

export default build("money", [
  {
    slug: "illegal-operations-gang-hideouts",
    status: "confirmed",
    featured: true,
    en: "Loot gang hideouts (Illegal Operations)",
    ar: "نهب مخابئ العصابات (Illegal Operations)",
    sEn: "Ranked the top early earner by several guides: clear a hideout, loot the narcotics, sell them — about $1,000–2,000+ per site.",
    sAr: "أفضل طريقة فلوس بالبداية حسب أكثر من دليل: نظّف المخبأ، خذ البضاعة، بيعها — حوالي 1,000 إلى 2,000$ وأكثر للموقع.",
    bEn: `Illegal Operations — raiding gang hideouts and selling the narcotics you loot — are ranked the best early-game money by several guides.

- Fully loot each site before leaving.
- Expect roughly $1,000–2,000 or more per site.
- Guides disagree on which dealer buys in Chapter 2, so check the buyer in your game.

${payNote.en}`,
    bAr: `Illegal Operations — يعني تهجم على مخابئ العصابات وتبيع البضاعة اللي تنهبها — حسب أكثر من دليل هي أفضل فلوس بداية اللعبة.

- انهب كل شي في الموقع قبل ما تطلع.
- توقّع حوالي 1,000 إلى 2,000 دولار أو أكثر للموقع.
- الأدلة مختلفة مين يشتري في الفصل الثاني، فتأكد من المشتري في لعبتك.

${payNote.ar}`,
    aliases: ["hideouts", "illegal operations", "مخابئ", "نهب"],
    tags: ["early game", "combat"],
    facts: [
      ["Payout", "الربح", "~$1,000–2,000+ / site", "~1,000–2,000$+ للموقع"],
      ["Risk", "المخاطرة", "Medium (combat)", "متوسطة (قتال)"],
      ["When", "متى", "From Chapter 1", "من الفصل الأول"],
    ],
    related: ["donnie-drug-packages", "protect-your-cash"],
    src: ["vgcMoney", "g2aMoney", "boomMoney"],
  },
  {
    slug: "donnie-drug-packages",
    status: "confirmed",
    en: "Sell Donnie's drug packages (Chapter 1)",
    ar: "بيع طرود دوني (الفصل الأول)",
    sEn: "Four pickups worth about $900 each, sold to Brian or Donnie.",
    sAr: "أربع طرود كل واحد حوالي 900$، تبيعها لـ Brian أو Donnie.",
    bEn: `In Chapter 1, collect Donnie's drug packages and sell them to Brian or Donnie. One guide lists four pickup spots at about $900 each — a quick $3,600.

${payNote.en}`,
    bAr: `في الفصل الأول، اجمع طرود Donnie وبيعها لـ Brian أو Donnie. دليل يذكر أربع أماكن، كل طرد حوالي 900 دولار — يعني 3,600 بسرعة.

${payNote.ar}`,
    aliases: ["Donnie", "packages", "طرود", "دوني"],
    tags: ["Chapter 1"],
    facts: [
      ["Payout", "الربح", "~$900 × 4", "~900$ × 4"],
      ["Buyers", "المشترين", "Brian, Donnie", "Brian و Donnie"],
    ],
    related: ["donnie", "brian-heder"],
    src: ["alcastMoney"],
  },
  {
    slug: "kenton-treasure-dives",
    status: "confirmed",
    featured: true,
    en: "Kenton's treasure dives in the Keys",
    ar: "غطسات الكنوز مع Kenton في الكيز",
    sEn: "Low-risk shipwreck dives paying about $1,400 per wreck early on.",
    sAr: "غطس على سفن غارقة بدون مخاطرة، حوالي 1,400$ للسفينة بالبداية.",
    bEn: `Kenton's treasure dives around the Leonida Keys are called the best low-risk early money by several guides — about $1,400 per wreck early on. While you're down there, grab the Drug Mule KZ-59 near the sunken ship off the Riquezas Keys.

${payNote.en}`,
    bAr: `غطسات الكنوز مع Kenton حول Leonida Keys يعتبرها أكثر من دليل أفضل فلوس بالبداية بدون مخاطرة — حوالي 1,400 دولار للسفينة. وأنت تحت، خذ سلاح Drug Mule KZ-59 جنب السفينة الغارقة عند Riquezas Keys.

${payNote.ar}`,
    aliases: ["diving", "treasure", "غطس", "كنوز", "Kenton"],
    tags: ["low risk", "Keys"],
    facts: [
      ["Payout", "الربح", "~$1,400 / wreck", "~1,400$ للسفينة"],
      ["Risk", "المخاطرة", "Low", "منخفضة"],
    ],
    region: "Leonida Keys",
    related: ["kenton", "drug-mule-kz-59", "leonida-keys"],
    src: ["vgcMoney", "boomMoney"],
  },
  {
    slug: "moses-car-sales",
    status: "confirmed",
    en: "Flip stolen cars to Moses (Chapter 2)",
    ar: "بيع السيارات المسروقة لـ Moses (الفصل الثاني)",
    sEn: "The most-cited Chapter 2 farm — Moses has no daily limit.",
    sAr: "أشهر طريقة فلوس في الفصل الثاني — Moses ما عنده حد يومي.",
    bEn: `From Chapter 2, steal cars and sell them to Moses. Guides highlight that he has no daily limit, so you can farm as long as you like. High-end car deliveries pay more from Chapter 3.

${payNote.en}`,
    bAr: `من الفصل الثاني، اسرق سيارات وبيعها لـ Moses. الأدلة تأكد إنه ما عنده حد يومي، فتقدر تكرر قد ما تبغى. وتوصيل السيارات الفخمة يدفع أكثر من الفصل الثالث.

${payNote.ar}`,
    aliases: ["Moses", "cars", "سيارات", "موزس"],
    tags: ["Chapter 2", "farm"],
    facts: [
      ["Daily limit", "حد يومي", "None", "ما فيه"],
      ["When", "متى", "Chapter 2+", "الفصل الثاني وطالع"],
    ],
    related: ["moses", "high-value-heists-later-chapters"],
    src: ["vgcMoney", "g2aMoney"],
  },
  {
    slug: "protect-your-cash",
    status: "confirmed",
    en: "Don't lose it: stash cash under the floorboard, then bank it",
    ar: "لا تخسرها: خبّ الفلوس تحت أرضية الغرفة وبعدين بالبنك",
    sEn: "Pocket cash is lost if you die or get busted. Use Jason's floorboard stash, then the BuckMe account.",
    sAr: "الفلوس اللي في جيبك تروح لو مت أو انمسكت. استخدم مخبأ الأرضية في غرفة Jason، وبعدين حساب BuckMe.",
    bEn: `Early on Jason carries cash with no ATM access. Guides advise stashing it under the floorboard in his bedroom and moving it to the BuckMe account once it unlocks — cash on hand is lost when you die or get busted.

Guides also report that Chapter 1 cash does not carry over, so spend it on useful gear before moving on.`,
    bAr: `بالبداية Jason يشيل فلوسه كاش وما عنده صراف. الأدلة تنصح تخبيها تحت أرضية غرفة نومه، وبعدين تنقلها لحساب BuckMe أول ما يفتح — لأن الكاش اللي معك يروح لو مت أو انمسكت.

والأدلة تقول بعد إن فلوس الفصل الأول ما تنتقل للي بعده، فاصرفها على أشياء تفيدك قبل ما تكمل.`,
    aliases: ["BuckMe", "bank", "floorboard", "بنك", "تخبية الفلوس"],
    tags: ["tip", "essential"],
    related: ["illegal-operations-gang-hideouts"],
    src: ["vgcMoney", "alcastMoney"],
  },
  {
    slug: "high-value-heists-later-chapters",
    status: "confirmed",
    en: "Later chapters: jewellery, luxury cars and bank vaults",
    ar: "الفصول المتقدمة: مجوهرات وسيارات فخمة وخزائن بنوك",
    sEn: "Jewellery robberies and high-end deliveries open up in Chapter 3; bank vaults are the biggest payouts.",
    sAr: "سرقة المجوهرات وتوصيل السيارات الفخمة تفتح في الفصل الثالث، وخزائن البنوك أكبر ربح.",
    bEn: `Money scales up as the story goes on: jewellery robberies and high-end car deliveries pick up in Chapter 3, and bank vaults are the largest payouts later on. Be wary of guides claiming $35–60k per hour early — that figure couldn't be verified.`,
    bAr: `الفلوس تكبر مع تقدم القصة: سرقة المجوهرات وتوصيل السيارات الفخمة تبدأ في الفصل الثالث، وخزائن البنوك أكبر ربح بعدين. وانتبه من أدلة تقول 35 إلى 60 ألف بالساعة بالبداية — الرقم هذا ما قدرنا نتأكد منه.`,
    aliases: ["heist", "bank", "jewelry", "سرقة بنك", "مجوهرات"],
    tags: ["late game"],
    related: ["moses-car-sales"],
    src: ["g2aMoney", "vgcMoney"],
  },
]);
