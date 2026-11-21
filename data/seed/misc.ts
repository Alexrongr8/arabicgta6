import { build } from "./helpers";

export const glitches = build("glitches", [
  {
    slug: "glitch-falling-through-map",
    status: "confirmed",
    en: "Falling through the map and walking through walls",
    ar: "الطيحة من الخريطة والمشي داخل الجدران",
    sEn: "Players share clips of characters dropping through the world and clipping into walls.",
    sAr: "لاعبين نشروا مقاطع لشخصيات تطيح من تحت الخريطة وتدخل في الجدران.",
    bEn: `Among the most shared launch-week clips: characters dropping through the map and walking through walls. Reports suggest these are intermittent.

Tip: save often, and if you fall through, reload the last checkpoint.`,
    bAr: `من أكثر المقاطع انتشاراً بأسبوع الإطلاق: شخصيات تطيح من تحت الخريطة وتمشي داخل الجدران. التقارير تقول إنها تصير أحياناً مو دايم.

نصيحة: احفظ كثير، ولو طحت، رجّع آخر نقطة حفظ.`,
    aliases: ["fall through map", "clipping", "طيحة", "قلتش"],
    tags: ["physics"],
    related: ["launch-week-bug-reports"],
    src: ["yahooBugs", "lwogBugs"],
  },
  {
    slug: "glitch-sideways-swimming",
    status: "confirmed",
    en: "Sideways swimming",
    ar: "السباحة بالجنب",
    sEn: "A viral clip shows a character swimming sideways through the water.",
    sAr: "مقطع منتشر لشخصية تسبح بالجنب في الماء.",
    bEn: `One of the funniest launch bugs: a character swimming sideways. It appears to be a harmless animation glitch.`,
    bAr: `من أطرف قلتشات الإطلاق: شخصية تسبح على جنبها. يبين إنه قلتش حركة ما يضر.`,
    aliases: ["swimming", "سباحة"],
    tags: ["animation"],
    src: ["yahooBugs"],
  },
  {
    slug: "glitch-boat-under-bridge",
    status: "confirmed",
    en: "The possessed boat under the bridge",
    ar: "القارب المجنون تحت الجسر",
    sEn: "A boat wedged under a bridge moves erratically when you get close.",
    sAr: "قارب عالق تحت جسر يتحرك بشكل جنوني لما تقرب منه.",
    bEn: `One report describes a boat wedged under a bridge that starts moving erratically when approached — a physics glitch.`,
    bAr: `تقرير يوصف قارب عالق تحت جسر يبدأ يتحرك بجنون أول ما تقرب منه — قلتش فيزياء.`,
    aliases: ["boat", "bridge", "قارب"],
    tags: ["physics"],
    src: ["lwogBugs"],
  },
  {
    slug: "glitch-prologue-crashes",
    status: "confirmed",
    en: "Crashes and freezes in the prologue",
    ar: "كراش وتعليق في بداية اللعبة",
    sEn: "Some players hit repeated crashes or freezes in the opening prologue.",
    sAr: "بعض اللاعبين صار لهم كراش متكرر أو تعليق في بداية اللعبة.",
    bEn: `Bug threads describe repeated crashes and freezing in the opening prologue for some players.

What players try: make sure the latest update is installed, fully restart the console (not rest mode), and free up storage space.`,
    bAr: `مواضيع البلاغات توصف كراش متكرر وتعليق في البرولوج عند بعض اللاعبين.

اللي يجربونه اللاعبين: تأكد إن آخر تحديث منزّل، سوّ إعادة تشغيل كاملة للجهاز (مو وضع الراحة)، وفضّي مساحة.`,
    aliases: ["crash", "freeze", "كراش", "تعليق"],
    tags: ["crash"],
    src: ["gwBugs"],
  },
  {
    slug: "glitch-lucia-bank-softlock",
    status: "confirmed",
    en: "Softlock after leaving a bank in an early Lucia mission",
    ar: "تعليق يوقف التقدم بعد الطلعة من البنك في مهمة مبكرة للوسيا",
    sEn: "Some players can't progress after leaving a bank in an early Lucia mission.",
    sAr: "بعض اللاعبين ما يقدرون يكملون بعد ما يطلعون من البنك في مهمة مبكرة للوسيا.",
    bEn: `A progress-blocking softlock was reported in an early Lucia mission after leaving a bank. Reloading an earlier checkpoint is the usual workaround while waiting for a patch.`,
    bAr: `انبلغ عن تعليق يوقف التقدم في مهمة مبكرة للوسيا بعد الخروج من البنك. الحل المعتاد لين ينزل تحديث: رجّع نقطة حفظ أقدم.`,
    aliases: ["softlock", "Lucia mission", "bank", "مهمة لوسيا"],
    tags: ["progress"],
    related: ["lucia-caminos"],
    src: ["gwBugs"],
  },
  {
    slug: "glitch-psn-sign-in",
    status: "confirmed",
    en: "PlayStation Network sign-in failures on launch day",
    ar: "فشل تسجيل الدخول لشبكة PlayStation يوم الإطلاق",
    sEn: "PSN sign-in problems and some audio issues were reported at launch.",
    sAr: "انبلغ عن مشاكل دخول PSN وبعض مشاكل الصوت يوم الإطلاق.",
    bEn: `Reports include PlayStation Network sign-in failures and audio problems on launch day. How widespread they were is unclear.`,
    bAr: `التقارير تشمل فشل دخول شبكة PlayStation ومشاكل صوت يوم الإطلاق، وما هو واضح قد إيش كانت منتشرة.`,
    aliases: ["PSN", "audio", "صوت", "بلايستيشن"],
    tags: ["network"],
    src: ["latinBugs"],
  },
]);

export const strange = build("strange", [
  {
    slug: "waink-curiosities",
    status: "confirmed",
    featured: true,
    en: "WAiNK Curiosities: scan the weirdest objects in Leonida",
    ar: "WAiNK Curiosities: صوّر أغرب الأشياء في Leonida",
    sEn: "Scannable objects that are strange, out of place or downright unnerving — a collectible hunt.",
    sAr: "أشياء تقدر تصوّرها غريبة أو مو في مكانها أو مخيفة — مجموعة تجمعها.",
    bEn: `WAiNK Curiosities are scannable objects across Leonida that look odd, out of place, or genuinely unsettling. Finding them all is one of the game's stranger collectible hunts.`,
    bAr: `WAiNK Curiosities أشياء منتشرة في Leonida تقدر تصوّرها، شكلها غريب أو مو في مكانها أو مخيف فعلاً. جمعها كلها من أغرب تحديات الجمع في اللعبة.`,
    aliases: ["WAiNK", "curiosities", "collectibles", "مقتنيات"],
    tags: ["collectible"],
    src: ["gsWaink"],
  },
  {
    slug: "giant-crab-monster",
    status: "rumor",
    en: "A giant crab monster?",
    ar: "وحش سلطعون عملاق؟",
    sEn: "Among Bigfoot and UFO sightings, players report a giant crab monster.",
    sAr: "مع مشاهدات Bigfoot والصحون الطائرة، لاعبين يقولون شافوا وحش سلطعون عملاق.",
    bEn: `Kotaku's round-up of early discoveries includes a giant crab monster alongside Bigfoot and UFOs. Where and how it appears is still unclear.`,
    bAr: `ملخص Kotaku لأول الاكتشافات فيه وحش سلطعون عملاق مع Bigfoot والصحون الطائرة. وين وكيف يطلع لسه مو واضح.`,
    aliases: ["crab", "monster", "سلطعون", "وحش"],
    tags: ["cryptid"],
    related: ["skunk-ape-mr-mangrove"],
    src: ["kotakuDetails"],
  },
  {
    slug: "bikini-girl-mystery-solved",
    status: "rumor",
    en: "Fans think they've solved the 'Bikini Girl' mystery",
    ar: "المعجبين يعتقدون إنهم حلّوا لغز 'Bikini Girl'",
    sEn: "The NPC from Trailer 1 may appear at a yacht party during the 'Day Release' mission.",
    sAr: "الشخصية اللي ظهرت في التريلر الأول ممكن تطلع في حفلة يخت بمهمة 'Day Release'.",
    bEn: `After three years of searching, fans believe the "Bikini Girl" NPC from the first trailer appears at a yacht party during the mission "Day Release".`,
    bAr: `بعد ثلاث سنين بحث، المعجبين يعتقدون إن شخصية "Bikini Girl" من التريلر الأول تظهر في حفلة يخت بمهمة "Day Release".`,
    aliases: ["Bikini Girl", "yacht", "Day Release", "يخت"],
    tags: ["trailer", "mystery"],
    related: ["trailer-1-december-2023"],
    src: ["unilad"],
  },
  {
    slug: "dynamic-world-events",
    status: "confirmed",
    en: "A living world: car crashes, other heists, planes going down",
    ar: "عالم حي: حوادث، سرقات ثانية، وطيارات تطيح",
    sEn: "Players stumble on random events: crashes, NPCs pulling their own heists, even planes falling from the sky.",
    sAr: "اللاعبين يصادفون أحداث عشوائية: حوادث، ناس يسوون سرقاتهم، وحتى طيارات تطيح من السما.",
    bEn: `Leonida feels alive. Players report walking into car crashes, watching other people pull off heists, and seeing a plane go down overhead.`,
    bAr: `Leonida حيّة. اللاعبين يقولون دخلوا على حوادث سيارات، وشافوا ناس ثانيين يسوون سرقات، وطيارة تطيح فوقهم.`,
    aliases: ["random events", "plane crash", "أحداث عشوائية", "طيارة"],
    tags: ["world"],
    related: ["vice-city-international-airport"],
    src: ["kotakuDetails"],
  },
  {
    slug: "throw-lizards-at-people",
    status: "confirmed",
    en: "You can throw lizards at people",
    ar: "تقدر ترمي سحالي على الناس",
    sEn: "Not just trash — players throw random lizards at NPCs to see how they react.",
    sAr: "مو بس زبالة — اللاعبين يرمون سحالي على الناس عشان يشوفون ردة فعلهم.",
    bEn: `Players can throw objects at people for reactions — not just trash, but lizards found at random. Peak Leonida.`,
    bAr: `تقدر ترمي أشياء على الناس وتشوف ردة فعلهم — مو بس زبالة، حتى السحالي اللي تلقاها بالصدفة. قمة Leonida.`,
    aliases: ["lizard", "سحلية", "رمي"],
    tags: ["funny"],
    src: ["kotakuDetails"],
  },
]);

export const tips = build("tips", [
  {
    slug: "how-to-enter-cheats",
    status: "confirmed",
    featured: true,
    en: "Cheats: how to enter them and when they unlock",
    ar: "الغشّات: كيف تدخلها ومتى تفتح",
    sEn: "Open the phone, hold L1+R1 (PS5) or LB+RB (Xbox) and enter the D-pad sequence. Many unlock after the story.",
    sAr: "افتح الجوال، اضغط مع بعض L1+R1 (بلايستيشن) أو LB+RB (إكس بوكس) ودخّل ترتيب الأسهم. كثير منها تفتح بعد القصة.",
    bEn: `How to enter a cheat:

- Open the in-game phone.
- Hold L1 + R1 (PS5) or LB + RB (Xbox).
- Input the D-pad sequence.

Several cheats — including the $250,000 one — become available only after you finish the story, under a Cheats section in Progress. No phone-number cheats are known yet. Guides disagree on some unlock requirements, so double-check before grinding.`,
    bAr: `طريقة إدخال الغش:

- افتح جوال اللعبة.
- اضغط مع بعض L1 + R1 (PS5) أو LB + RB (Xbox).
- دخّل ترتيب الأسهم.

فيه غشّات — منها غش 250,000 دولار — ما تفتح إلا بعد ما تخلص القصة، في قسم Cheats داخل Progress. وما فيه أرقام جوال للغش معروفة لين الآن. الأدلة مختلفة في بعض شروط الفتح، فتأكد قبل لا تتعب.`,
    aliases: ["cheats", "cheat codes", "غش", "شفرات", "كودات"],
    tags: ["cheats"],
    facts: [
      ["PS5", "بلايستيشن 5", "Phone + L1+R1 + D-pad", "الجوال + L1+R1 + الأسهم"],
      ["Xbox", "إكس بوكس", "Phone + LB+RB + D-pad", "الجوال + LB+RB + الأسهم"],
      ["Phone numbers", "أرقام جوال", "None known yet", "ما فيه لين الآن"],
    ],
    src: ["redbullCheats", "gsCheats"],
  },
  {
    slug: "early-unique-weapons-route",
    status: "confirmed",
    en: "Grab these free unique weapons early",
    ar: "خذ هذي الأسلحة الفريدة المجانية بدري",
    sEn: "A quick route: Donnie's H&L .38 (missable!), the Hamlet Storage shotgun, and the Keys underwater SMG.",
    sAr: "مسار سريع: مسدس Donnie (يفوت!)، شوزن Hamlet Storage، والسلاح اللي تحت الماء في الكيز.",
    bEn: `Free unique weapons worth getting early:

- Donnie's H&L .38 — Chapter 1, 'Don Gone'. Missable.
- Hobo 'Marabunta Grande' — rear of Hamlet Storage.
- Drug Mule KZ-59 — underwater, north of the Riquezas Keys.
- Gutterball Moreland 850 — Kingpin Bowling, Port Gellhorn.

Open the Rare weapons section for each one.`,
    bAr: `أسلحة فريدة مجانية تستاهل تاخذها بدري:

- مسدس Donnie's H&L .38 — الفصل الأول، مهمة Don Gone. يفوت!
- شوزن Hobo 'Marabunta Grande' — ورا Hamlet Storage.
- Drug Mule KZ-59 — تحت الماء شمال Riquezas Keys.
- Gutterball Moreland 850 — Kingpin Bowling في Port Gellhorn.

افتح قسم الأسلحة النادرة لتفاصيل كل واحد.`,
    aliases: ["free weapons", "أسلحة مجانية"],
    tags: ["weapons", "beginner"],
    related: ["donnies-hl-38", "hobo-marabunta-grande", "drug-mule-kz-59", "gutterball-moreland-850"],
    src: ["keenWeapons"],
  },
  {
    slug: "which-edition-to-buy",
    status: "official",
    en: "Standard or Ultimate: which edition should you get?",
    ar: "العادية أو Ultimate: أي نسخة تشتري؟",
    sEn: "Ultimate ($99.99) adds exclusive vehicles, weapons and cosmetics unlocked across chapters. The base game is the same.",
    sAr: "Ultimate (99.99$) تضيف سيارات وأسلحة وأزياء حصرية تفتح مع الفصول. اللعبة الأساسية نفسها.",
    bEn: `Both editions contain the same base game. The $99.99 Ultimate Edition adds extra content — exclusive vehicles like the Grotti Cheetah '95, the Hawk & Little Morgan revolvers, cosmetics and more — unlocked across the story chapters. If you just want the story, Standard ($79.99) is enough.`,
    bAr: `النسختين فيهم نفس اللعبة الأساسية. نسخة Ultimate بـ 99.99$ تضيف محتوى إضافي — سيارات حصرية مثل Grotti Cheetah '95، مسدسات Hawk & Little Morgan، أزياء وغيرها — يفتح مع فصول القصة. لو تبغى القصة بس، العادية (79.99$) تكفي.`,
    aliases: ["Ultimate Edition", "Standard Edition", "نسخة", "ألتميت"],
    tags: ["buying guide"],
    related: ["price-and-editions", "grotti-cheetah-95", "hawk-little-morgan-revolvers"],
    src: ["pcgEditions", "windowsPrice"],
  },
  {
    slug: "save-often-launch-bugs",
    status: "confirmed",
    en: "Save often while launch bugs are being fixed",
    ar: "احفظ كثير لين تنحل قلتشات الإطلاق",
    sEn: "With softlocks and crashes reported, keep manual saves and restart the console fully if things act up.",
    sAr: "مع وجود تعليق وكراشات، خلك تحفظ يدوي وسوّ إعادة تشغيل كاملة لو صار شي غريب.",
    bEn: `Until the first patches land, protect your progress:

- Keep several manual saves.
- If a mission softlocks, reload an earlier checkpoint.
- Restart the console fully (not rest mode) if you get crashes.
- Bank your cash so a crash or death doesn't cost you.`,
    bAr: `لين تنزل أول التحديثات، احمِ تقدمك:

- خلك تحفظ يدوي أكثر من ملف.
- لو تعلّقت مهمة، رجّع نقطة حفظ أقدم.
- سوّ إعادة تشغيل كاملة للجهاز (مو وضع الراحة) لو صار كراش.
- حط فلوسك في البنك عشان ما تخسرها لو مت أو صار كراش.`,
    aliases: ["save", "حفظ"],
    tags: ["beginner"],
    related: ["glitch-lucia-bank-softlock", "glitch-prologue-crashes", "protect-your-cash"],
    src: ["gwBugs"],
  },
]);
