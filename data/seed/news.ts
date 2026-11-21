import { build } from "./helpers";

export default build("news", [
  {
    slug: "gta-6-launch-day-patch-rumor-nov-25",
    status: "rumor",
    en: "Rumoured first post-launch patch around 25 November",
    ar: "إشاعة عن أول تحديث بعد الإطلاق حوالي 25 نوفمبر",
    sEn: "Some trackers mention a fix patch around 25 November. Rockstar has not confirmed it.",
    sAr: "بعض المتابعين يتكلمون عن تحديث إصلاحات حوالي 25 نوفمبر، و Rockstar ما أكدت شي.",
    bEn: `Patch trackers mention a possible corrective update around 25 November to address the launch-week bugs players have been sharing.

Rockstar has not announced it and has not published patch notes for any update so far. Treat the date as unverified until Rockstar posts it.`,
    bAr: `مواقع تتبع التحديثات تذكر احتمال نزول تحديث إصلاحي حوالي 25 نوفمبر لمعالجة القلتشات اللي انتشرت في أسبوع الإطلاق.

Rockstar ما أعلنت عنه رسمياً، وما نشرت ملاحظات أي تحديث لين الآن. اعتبر التاريخ غير مؤكد لين يطلع إعلان رسمي.`,
    related: ["pre-launch-silent-patches", "launch-week-bug-reports"],
    src: ["patchTracker"],
    date: "2026-11-21T09:00:00Z",
  },
  {
    slug: "day-one-sales-record-3-79-billion",
    status: "official",
    featured: true,
    en: "GTA VI breaks records: $3.79 billion on day one",
    ar: "GTA VI تحطم الأرقام: 3.79 مليار دولار في اليوم الأول",
    sEn: "Take-Two says day-one retail sales hit $3.79B, the biggest entertainment launch ever, with 32.5M units sold before release.",
    sAr: "Take-Two أعلنت إن مبيعات اليوم الأول وصلت 3.79 مليار دولار، أكبر إطلاق ترفيهي بالتاريخ، و32.5 مليون نسخة انباعت قبل النزول.",
    bEn: `Take-Two Interactive announced on 20 November that Grand Theft Auto VI generated an estimated $3.79 billion in worldwide retail sales on its first day, calling it a record for any entertainment launch in any medium.

- 32.5 million units were sold before release, also a record.
- For comparison, GTA V made about $800 million in its first 24 hours in 2013, so GTA VI is roughly 4.7× bigger.
- The figure is retail value of copies sold to players, not Take-Two's own revenue.`,
    bAr: `أعلنت Take-Two يوم 20 نوفمبر إن Grand Theft Auto VI حققت مبيعات تجزئة عالمية تقدّر بـ 3.79 مليار دولار في أول يوم، وقالت إنه رقم قياسي لأي إطلاق ترفيهي بأي مجال.

- 32.5 مليون نسخة انباعت قبل الإطلاق، وهذا رقم قياسي بعد.
- للمقارنة: GTA V جابت حوالي 800 مليون دولار في أول 24 ساعة سنة 2013، يعني GTA VI أكبر بحوالي 4.7 مرات.
- الرقم هو قيمة النسخ المباعة للاعبين، مو إيرادات Take-Two نفسها.`,
    tags: ["sales", "record", "Take-Two"],
    facts: [
      ["Day-one sales", "مبيعات اليوم الأول", "$3.79 billion", "3.79 مليار دولار"],
      ["Pre-release units", "نسخ قبل الإطلاق", "32.5 million", "32.5 مليون"],
      ["vs GTA V", "مقارنة بـ GTA V", "≈ 4.7×", "≈ 4.7 أضعاف"],
    ],
    related: ["gta-6-release-november-19-2026", "metacritic-99-score"],
    src: ["takeTwoSales", "cnnSales", "forbesSales"],
    date: "2026-11-20T18:00:00Z",
  },
  {
    slug: "launch-week-bug-reports",
    status: "confirmed",
    en: "Launch week: players share wild glitch clips",
    ar: "أسبوع الإطلاق: اللاعبين ينشرون مقاطع قلتشات غريبة",
    sEn: "Falling through the map, sideways swimming, a possessed boat and some crashes and softlocks — Rockstar hasn't commented yet.",
    sAr: "طيحة من الخريطة، سباحة بالجنب، قارب مجنون، وبعض الكراشات والتعليق — و Rockstar ما علّقت لين الآن.",
    bEn: `Despite near-perfect reviews, launch week brought a wave of glitch clips on social media. Most are visual or physics bugs, but some players report crashes in the prologue and a progress-blocking softlock in an early Lucia mission.

PlayStation Network sign-in failures were also reported on launch day. Outlets note that the bugs seem intermittent rather than universal, and Rockstar had not publicly addressed them at the time of writing. See the Glitches section for each bug.`,
    bAr: `رغم التقييمات شبه الكاملة، أسبوع الإطلاق جاب موجة مقاطع قلتشات في السوشال ميديا. أغلبها قلتشات شكلية أو فيزيائية، لكن بعض اللاعبين اشتكوا من كراش في البداية (البرولوج) وتعليق يوقف التقدم في مهمة مبكرة للوسيا.

صار بعد مشاكل في تسجيل الدخول لشبكة PlayStation يوم الإطلاق. المواقع تقول إن القلتشات متقطعة ومو عند الكل، و Rockstar ما ردّت رسمياً لين وقت الكتابة. شوف قسم القلتشات لتفاصيل كل واحد.`,
    tags: ["bugs", "launch"],
    related: ["glitch-falling-through-map", "glitch-lucia-bank-softlock", "glitch-psn-sign-in"],
    src: ["yahooBugs", "lwogBugs", "gwBugs", "latinBugs"],
    date: "2026-11-20T10:00:00Z",
  },
  {
    slug: "metacritic-99-score",
    status: "official",
    en: "Critics call it a masterpiece — 99 on Metacritic",
    ar: "النقاد: تحفة فنية — 99 على Metacritic",
    sEn: "Reviews call GTA VI 'a masterpiece' and 'an astonishing American epic'; Take-Two cites a 99 Metacritic score.",
    sAr: "المراجعات وصفت GTA VI بأنها 'تحفة' و'ملحمة أمريكية مذهلة'، و Take-Two ذكرت تقييم 99 على Metacritic.",
    bEn: `Reviews landed on launch day and were overwhelmingly positive, with critics using words like "masterpiece" and "spectacular".

Take-Two's own press release describes a "near perfect" 99 on Metacritic. Some outlets have debated whether the scores fully account for the launch bugs.`,
    bAr: `المراجعات نزلت يوم الإطلاق وكانت إيجابية بشكل كبير جداً، والنقاد استخدموا كلمات مثل "تحفة" و"مذهلة".

بيان Take-Two الرسمي يذكر تقييم 99 "شبه كامل" على Metacritic. بعض المواقع ناقشت هل التقييمات أخذت قلتشات الإطلاق بعين الاعتبار أو لا.`,
    tags: ["reviews", "metacritic"],
    related: ["day-one-sales-record-3-79-billion", "launch-week-bug-reports"],
    src: ["takeTwoSales", "aljazeeraLaunch", "latinBugs"],
    date: "2026-11-19T20:00:00Z",
  },
  {
    slug: "gta-6-release-november-19-2026",
    status: "official",
    featured: true,
    en: "GTA VI is out now on PS5 and Xbox Series X|S",
    ar: "GTA VI نزلت رسمياً على PS5 و Xbox Series X|S",
    sEn: "After 13 years and two delays, Grand Theft Auto VI launched worldwide on 19 November 2026, rolling out at midnight local time.",
    sAr: "بعد 13 سنة وتأجيلين، نزلت Grand Theft Auto VI عالمياً يوم 19 نوفمبر 2026، وفتحت الساعة 12 بالليل حسب توقيت كل دولة.",
    bEn: `Grand Theft Auto VI launched on Thursday 19 November 2026 on PlayStation 5 and Xbox Series X|S. Rather than one global unlock time, it rolled out at midnight local time in each region.

The game is set in the state of Leonida, a Florida-inspired setting centred on Vice City, and follows Jason Duval and Lucia Caminos.

There is no PC version at launch and no official PC date. GTA 6 Online has no release date either.`,
    bAr: `نزلت Grand Theft Auto VI يوم الخميس 19 نوفمبر 2026 على PlayStation 5 و Xbox Series X|S. وبدل وقت فتح واحد للعالم، فتحت الساعة 12 بالليل بالتوقيت المحلي لكل منطقة.

اللعبة تدور في ولاية Leonida المستوحاة من فلوريدا، ومركزها Vice City، والقصة عن Jason Duval و Lucia Caminos.

ما فيه نسخة PC مع الإطلاق ولا موعد رسمي لها، وكذلك GTA 6 Online ما لها موعد.`,
    tags: ["release", "PS5", "Xbox"],
    facts: [
      ["Release", "تاريخ الإصدار", "19 Nov 2026", "19 نوفمبر 2026"],
      ["Platforms", "المنصات", "PS5, Xbox Series X|S", "PS5، Xbox Series X|S"],
      ["Developer", "المطوّر", "Rockstar Games", "Rockstar Games"],
      ["Setting", "مكان الأحداث", "Leonida (Vice City)", "Leonida (Vice City)"],
    ],
    related: ["jason-duval", "lucia-caminos", "leonida", "pc-version-report-2027"],
    src: ["cbsLaunch", "aljazeeraLaunch", "wikiGame"],
    date: "2026-11-19T00:00:00Z",
  },
  {
    slug: "pre-launch-silent-patches",
    status: "confirmed",
    en: "Two silent updates landed before launch — no patch notes",
    ar: "تحديثين صامتين نزلوا قبل الإطلاق — بدون ملاحظات",
    sEn: "Version 1.002.000 (13 Nov) and 1.002.001 (16 Nov) arrived before release; Rockstar didn't say what changed.",
    sAr: "الإصدار 1.002.000 (13 نوفمبر) و 1.002.001 (16 نوفمبر) نزلوا قبل اللعبة، و Rockstar ما قالت وش تغيّر.",
    bEn: `Two updates were pushed to pre-loaded copies before launch: 1.002.000 on 13 November and 1.002.001 on 16 November. The PS5 download for the second was about 602.5 MB.

Rockstar published no patch notes for either, so claims about what changed come from community datamining only.`,
    bAr: `نزل تحديثين على النسخ المحمّلة مسبقاً قبل الإطلاق: 1.002.000 يوم 13 نوفمبر و 1.002.001 يوم 16 نوفمبر. حجم الثاني على PS5 حوالي 602.5 ميجا.

Rockstar ما نشرت أي ملاحظات للتحديثين، فأي كلام عن التغييرات جاي من تنقيب المجتمع في الملفات فقط.`,
    tags: ["patch", "update"],
    src: ["forbesPatch", "patchTracker"],
    date: "2026-11-17T12:00:00Z",
  },
  {
    slug: "pc-version-report-2027",
    status: "rumor",
    en: "Report: PC version targeted for Q1 2027",
    ar: "تقرير: نسخة PC مستهدفة في الربع الأول 2027",
    sEn: "A GamesBeat report says Rockstar aims for a PC release in early 2027. Rockstar has not confirmed any PC window.",
    sAr: "تقرير من GamesBeat يقول إن Rockstar تستهدف نسخة PC بداية 2027، لكن Rockstar ما أكدت أي موعد.",
    bEn: `GTA VI launched on consoles only. A GamesBeat report claims Rockstar is aiming for a PC version in the first quarter of 2027.

Rockstar's history supports a later PC release (GTA V and Red Dead Redemption 2 both came to PC after consoles), but until Rockstar announces a date this remains a report, not a fact.`,
    bAr: `GTA VI نزلت على الكونسول فقط. تقرير من GamesBeat يقول إن Rockstar تستهدف نسخة PC في الربع الأول من 2027.

تاريخ Rockstar يدعم نزول PC متأخر (GTA V و Red Dead Redemption 2 نزلوا على PC بعد الكونسول)، لكن لين تعلن Rockstar موعد، يبقى مجرد تقرير.`,
    tags: ["PC"],
    related: ["gta-6-release-november-19-2026"],
    src: ["vicePc"],
    date: "2026-11-20T08:00:00Z",
  },
  {
    slug: "gta-6-online-late-2027-report",
    status: "rumor",
    en: "Report: GTA 6 Online could arrive in late 2027",
    ar: "تقرير: GTA 6 Online ممكن تنزل نهاية 2027",
    sEn: "Bloomberg reporting points to a possible late-2027 launch for the online mode. No official date.",
    sAr: "تقارير Bloomberg تشير لاحتمال نزول الأونلاين نهاية 2027. ما فيه موعد رسمي.",
    bEn: `The online component is not part of the November launch. Bloomberg reporting points to a possible late-2027 launch for GTA 6 Online. Rockstar has not given a date.`,
    bAr: `الأونلاين مو موجود مع إطلاق نوفمبر. تقارير Bloomberg تشير إلى احتمال نزول GTA 6 Online نهاية 2027، و Rockstar ما أعطت أي موعد.`,
    tags: ["online"],
    src: ["vicePc"],
    date: "2026-11-20T07:00:00Z",
  },
  {
    slug: "price-and-editions",
    status: "official",
    en: "Price: $79.99 Standard, $99.99 Ultimate — and no disc",
    ar: "السعر: 79.99$ للعادية و 99.99$ للألتميت — وبدون ديسك",
    sEn: "Rockstar confirmed two editions; the physical version is a download code in a box. Everyone gets the Vintage Vice City Pack pre-order bonus.",
    sAr: "Rockstar أكدت نسختين، والنسخة الفيزيائية عبارة عن كود تحميل في علبة. وكل من حجز أخذ حزمة Vintage Vice City.",
    bEn: `Rockstar confirmed pricing when pre-orders opened on 25 June 2026:

- Standard Edition: $79.99
- Ultimate Edition: $99.99, with extra content that unlocks across the story chapters (exclusive vehicles such as the Grotti Cheetah '95, the Hawk & Little Morgan revolvers, cosmetics and more).

The boxed version contains a download code rather than a disc. All pre-orders included the Vintage Vice City Pack.`,
    bAr: `Rockstar أكدت الأسعار لما فتحت الحجوزات يوم 25 يونيو 2026:

- النسخة العادية: 79.99 دولار
- نسخة Ultimate: 99.99 دولار، فيها محتوى إضافي يفتح على مراحل مع فصول القصة (سيارات حصرية مثل Grotti Cheetah '95، مسدسات Hawk & Little Morgan، أزياء وغيرها).

النسخة اللي في علبة فيها كود تحميل بدل الديسك. وكل الحجوزات المسبقة أخذت حزمة Vintage Vice City.`,
    tags: ["price", "editions", "Ultimate Edition"],
    facts: [
      ["Standard", "العادية", "$79.99", "79.99$"],
      ["Ultimate", "الألتميت", "$99.99", "99.99$"],
      ["Pre-orders opened", "فتح الحجز", "25 Jun 2026", "25 يونيو 2026"],
    ],
    related: ["grotti-cheetah-95", "hawk-little-morgan-revolvers"],
    src: ["windowsPrice", "shackPrice", "pcgEditions"],
    date: "2026-06-25T15:00:00Z",
  },
  {
    slug: "second-delay-november-2026",
    status: "official",
    en: "Delayed again: GTA VI moves to 19 November 2026",
    ar: "تأجيل ثاني: GTA VI تنتقل إلى 19 نوفمبر 2026",
    sEn: "In November 2025 Rockstar pushed the game from 26 May 2026 to 19 November 2026 for extra polish.",
    sAr: "في نوفمبر 2025 أجّلت Rockstar اللعبة من 26 مايو 2026 إلى 19 نوفمبر 2026 عشان التلميع.",
    bEn: `Rockstar announced a second delay in November 2025, moving the release from 26 May 2026 to 19 November 2026, saying it needed more time to deliver the level of polish players expect. That date held, and the game launched as planned.`,
    bAr: `أعلنت Rockstar تأجيل ثاني في نوفمبر 2025، ونقلت الإصدار من 26 مايو 2026 إلى 19 نوفمبر 2026، وقالت إنها تحتاج وقت إضافي للتلميع بالمستوى اللي يستاهله اللاعبين. والموعد هذا ثبت ونزلت اللعبة فيه.`,
    tags: ["delay", "release date"],
    related: ["first-delay-may-2026", "gta-6-release-november-19-2026"],
    src: ["wikiGame", "tomsguide"],
    date: "2025-11-06T17:00:00Z",
  },
  {
    slug: "first-delay-may-2026",
    status: "official",
    en: "First delay: from Fall 2025 to 26 May 2026",
    ar: "أول تأجيل: من خريف 2025 إلى 26 مايو 2026",
    sEn: "In May 2025 Rockstar moved GTA VI out of 2025, setting 26 May 2026 — a date later delayed again.",
    sAr: "في مايو 2025 أجّلت Rockstar اللعبة من 2025 وحددت 26 مايو 2026 — وبعدها تأجلت مرة ثانية.",
    bEn: `GTA VI was originally announced for 2025. On 2 May 2025 Rockstar delayed it to 26 May 2026. A second delay in November 2025 then moved it to 19 November 2026.`,
    bAr: `GTA VI كانت معلنة أصلاً لسنة 2025. يوم 2 مايو 2025 أجّلتها Rockstar إلى 26 مايو 2026. وبعدين تأجيل ثاني في نوفمبر 2025 نقلها إلى 19 نوفمبر 2026.`,
    tags: ["delay"],
    related: ["second-delay-november-2026"],
    src: ["wikiGame"],
    date: "2025-05-02T17:00:00Z",
  },
  {
    slug: "trailer-2-may-2025",
    status: "official",
    en: "Trailer 2 drops — 475 million views in 24 hours",
    ar: "نزول التريلر الثاني — 475 مليون مشاهدة في 24 ساعة",
    sEn: "Released 6 May 2025, Trailer 2 introduced Cal, Boobie Ike, Dre'Quan, the Real Dimez, Raul and Brian.",
    sAr: "نزل يوم 6 مايو 2025، وعرّفنا على Cal و Boobie Ike و Dre'Quan و Real Dimez و Raul و Brian.",
    bEn: `Rockstar released the second trailer on 6 May 2025, alongside a large update to its website with character and location profiles. Rockstar said it reached about 475 million views across platforms in its first 24 hours.

It introduced the wider cast and confirmed the six regions of Leonida.`,
    bAr: `نشرت Rockstar التريلر الثاني يوم 6 مايو 2025، ومعه تحديث كبير لموقعها فيه ملفات الشخصيات والمناطق. وقالت Rockstar إنه وصل حوالي 475 مليون مشاهدة على كل المنصات في أول 24 ساعة.

عرّف بباقي الشخصيات وأكد مناطق Leonida الست.`,
    tags: ["trailer"],
    related: ["cal-hampton", "boobie-ike", "drequan-priest", "real-dimez", "raul-bautista", "brian-heder"],
    src: ["wikiGame", "rockstarSite"],
    date: "2025-05-06T14:00:00Z",
  },
  {
    slug: "trailer-1-december-2023",
    status: "official",
    en: "Trailer 1 reveals Lucia, Jason and Vice City",
    ar: "التريلر الأول يكشف Lucia و Jason و Vice City",
    sEn: "Released early on 4 December 2023 after leaking online, the first trailer broke YouTube's 24-hour view record for a non-music video.",
    sAr: "نزل بدري يوم 4 ديسمبر 2023 بعد ما تسرّب، وكسر رقم يوتيوب لأكثر فيديو (غير موسيقي) مشاهدة في 24 ساعة.",
    bEn: `Rockstar planned the reveal for 5 December 2023, but released the trailer hours early on 4 December after it leaked on social media. It drew about 90 million YouTube views in 24 hours, a record for a non-music video.

The trailer confirmed the return to Vice City, the state of Leonida, a 2025 release window (later delayed) and the protagonist Lucia, the series' first female lead in the 3D era.`,
    bAr: `Rockstar كانت مخططة الكشف يوم 5 ديسمبر 2023، لكن نشرت التريلر قبل الموعد بساعات يوم 4 ديسمبر بعد ما تسرّب في السوشال ميديا. جاب حوالي 90 مليون مشاهدة على يوتيوب في 24 ساعة، رقم قياسي لفيديو غير موسيقي.

أكد التريلر الرجوع لـ Vice City وولاية Leonida وموعد 2025 (اللي تأجل لاحقاً)، وعرّف بـ Lucia أول بطلة أنثى في السلسلة بعصر الـ 3D.`,
    tags: ["trailer"],
    related: ["lucia-caminos", "jason-duval", "vice-city"],
    src: ["wikiGame"],
    date: "2023-12-04T23:00:00Z",
  },
  {
    slug: "2022-gta-6-leak",
    status: "leak",
    en: "The 2022 leak: 90 development clips hit the internet",
    ar: "تسريب 2022: 90 مقطع من التطوير انتشرت على الإنترنت",
    sEn: "In September 2022 a hacker leaked early test footage; Rockstar confirmed the breach. It revealed the Vice City setting and two leads early.",
    sAr: "في سبتمبر 2022 هكر سرّب لقطات تجريبية مبكرة، و Rockstar أكدت الاختراق. كشف مبكراً Vice City والبطلين.",
    bEn: `On 18 September 2022, about 90 clips of early in-development footage were posted online after Rockstar's internal systems were breached. Rockstar confirmed the hack and said development would continue unaffected.

The footage showed a Vice City setting and two playable leads, a man and a woman, which the official reveal later confirmed. A UK court later found the teenage hacker responsible; he was ordered to be held in a secure hospital.`,
    bAr: `يوم 18 سبتمبر 2022، انتشر حوالي 90 مقطع من لقطات تطوير مبكرة بعد اختراق أنظمة Rockstar الداخلية. Rockstar أكدت الاختراق وقالت إن التطوير بيستمر بدون تأثير.

اللقطات بيّنت Vice City وبطلين قابلين للعب، رجل وامرأة، وهذا اللي أكده الكشف الرسمي بعدين. ومحكمة بريطانية حكمت لاحقاً على الهكر المراهق المسؤول وأمرت بحجزه في مستشفى آمن.`,
    tags: ["leak", "hack"],
    related: ["trailer-1-december-2023"],
    src: ["wikiLeak"],
    date: "2022-09-18T12:00:00Z",
  },
]);
