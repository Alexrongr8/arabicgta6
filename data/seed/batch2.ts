import type { Item } from "../../src/lib/types";
import { build } from "./helpers";

const approx = { en: "Pins marked (approx.) are placed by the area guides name, not an exact in-game marker.", ar: "الدبابيس المكتوب عليها (تقريبي) محطوطة حسب المنطقة اللي تذكرها الأدلة، مو علامة دقيقة." };

const tips = build("tips", [
  {
    slug: "all-cheat-codes-list",
    status: "confirmed",
    featured: true,
    en: "Every confirmed GTA 6 cheat code (and how to unlock them)",
    ar: "كل غشّات GTA 6 المؤكدة (وكيف تفتحها)",
    sEn: "$250,000 money, unlimited Focus, body armour and more — with the exact D-pad sequences and unlock requirements.",
    sAr: "250 ألف دولار، تركيز لا نهائي، درع، وغيرها — بترتيب الأسهم بالضبط وشروط فتح كل غش.",
    bEn: `## How to enter a cheat
- Press D-pad Up to take out the phone.
- Hold L1 and press R1 (Xbox: hold LB and press RB).
- Enter the D-pad sequence while still holding.
Cheats only work with the phone in your hand.

## Confirmed codes
- $250,000 cash — Up, Right, Down, Left, Up, Left, Down, Right. Unlocks after finishing the story; can be entered again and again.
- Unlimited Focus — Down, Up, Up, Down, Up, Down, Up, Down, Up, Right. Unlocks after the story.
- Body Armour — Down, Up, Left, Up, Up, Up, Up, Up, Down, Down. Unlocks after 100 workouts.
- Exploding Balls (sports balls explode on impact) — Down, Up, Left, Left, Right, Down, Down, Up, Right. Unlocks after hitting 20 enemies with explosive damage.
- Spawn MTL Pumper — Left, Up, Right, Down, Left, Right, Right, Up.

## Not settled yet
- Attack Force: guides list different sequences — check before relying on one.
- Raise Heat Level: unlock is either 25 or 50 escapes from a three-star wanted level depending on the guide.
- Drunk, Raise Wanted Level and others: combinations not confirmed yet. No phone-number cheats are known.

## Important
Using any cheat disables saving for that session. Save first, then have fun.`,
    bAr: `## طريقة إدخال الغش
- اضغط سهم فوق عشان تطلع الجوال.
- اضغط L1 مطوّل واضغط R1 (إكس بوكس: LB مطوّل واضغط RB).
- دخّل ترتيب الأسهم وأنت ماسك الأزرار.
الغش يشتغل بس والجوال بيدك.

## الغشّات المؤكدة
- 250,000 دولار — فوق، يمين، تحت، يسار، فوق، يسار، تحت، يمين. تفتح بعد ما تخلص القصة، وتقدر تكررها كل مرة.
- تركيز لا نهائي (Unlimited Focus) — تحت، فوق، فوق، تحت، فوق، تحت، فوق، تحت، فوق، يمين. تفتح بعد القصة.
- درع (Body Armor) — تحت، فوق، يسار، فوق، فوق، فوق، فوق، فوق، تحت، تحت. تفتح بعد 100 تمرين.
- كور متفجرة (كور الرياضة تنفجر) — تحت، فوق، يسار، يسار، يمين، تحت، تحت، فوق، يمين. تفتح بعد ما تصيب 20 عدو بضرر متفجر.
- إطفائية MTL Pumper — يسار، فوق، يمين، تحت، يسار، يمين، يمين، فوق.

## لسه مو محسومة
- Attack Force: الأدلة تعطي ترتيبات مختلفة — تأكد قبل لا تعتمد.
- رفع مستوى الملاحقة (Raise Heat Level): الشرط إنك تهرب من 3 نجوم إما 25 أو 50 مرة حسب الدليل.
- السُكر ورفع مستوى المطلوبية وغيرها: الترتيب لسه مو مؤكد. وما فيه غش بأرقام جوال لين الحين.

## مهم
استخدام أي غش يوقف الحفظ في الجلسة. احفظ قبل، وبعدين استانس.`,
    aliases: ["cheats", "cheat codes", "غش", "شفرات", "كودات", "250000", "فلوس غش"],
    tags: ["cheats", "PS5", "Xbox"],
    facts: [
      ["How", "الطريقة", "Phone + hold L1/LB, press R1/RB + D-pad", "الجوال + L1/LB مطوّل وR1/RB + الأسهم"],
      ["Money cheat", "غش الفلوس", "$250,000 (after the story)", "250,000$ (بعد القصة)"],
      ["Saving", "الحفظ", "Disabled after using a cheat", "يتوقف بعد استخدام الغش"],
    ],
    related: ["how-to-enter-cheats", "fitness-app-stats"],
    srcUrls: [["VICE — all GTA 6 cheat codes", "https://www.vice.com/en/article/gta-6-cheat-codes-list/"], ["MeowDB — all 61 cheats", "https://meowdb.com/gta6/cheats"], ["Gamer Tweak — cheat codes list", "https://gamertweak.com/cheat-codes-gta-6/"]],
  },
  {
    slug: "beginner-tips-first-hours",
    status: "confirmed",
    featured: true,
    en: "13 things to know before your first hours in GTA 6",
    ar: "13 شي لازم تعرفه قبل أول ساعات في GTA 6",
    sEn: "Bank your cash, save by hand, buy a suppressor in Key Lento, read the wanted icons, train Focus by fishing — and more.",
    sAr: "حط فلوسك بالبنك، احفظ يدوي، اشترِ كاتم صوت من Key Lento، افهم أيقونات المطاردة، درّب التركيز بالصيد — وأكثر.",
    bEn: `## Money and saving
- Pocket cash is lost when you die or get busted. Use the stash under Jason's bedroom floor, then BuckMe once the "Buck Me" mission unlocks it.
- Autosave only happens after missions and there's no mission replay — start a fresh manual save slot each chapter.

## Combat
- Stealth first: early on ammo and money are scarce.
- Buy a suppressor early: there's an Ammu-Nation in Key Lento right after the tutorial and suppressors are cheap.
- Only guns bought at Ammu-Nation come back after you die.

## Focus mode (L3 + R3 / LS + RS)
- Find the source of screams and noises.
- Doors show white if you can enter, red if they're alarmed.
- Train Focus fastest by fishing (about +10 per catch); basketball helps too.

## Police
- Read the icons under the wanted stars: they show what the cops know (your outfit, your face, your car). Change clothes or ditch the car to clear them.

## Settings
- Motion blur defaults to 3 — set it to 0 for a sharper image.
- Don't like L3 to sprint? Switch to the Classic control scheme.`,
    bAr: `## الفلوس والحفظ
- الكاش اللي معك يروح لو مت أو انمسكت. استخدم المخبأ تحت أرضية غرفة Jason، وبعدين BuckMe أول ما تفتحه مهمة "Buck Me".
- الحفظ التلقائي بس بعد المهمات وما فيه إعادة مهمة — سوّ ملف حفظ يدوي جديد كل فصل.

## القتال
- التسلل أول: بالبداية الذخيرة والفلوس قليلة.
- اشترِ كاتم صوت بدري: فيه Ammu-Nation في Key Lento بعد التدريب على طول، والكواتم رخيصة.
- بس الأسلحة اللي اشتريتها من Ammu-Nation ترجع لك بعد الموت.

## وضع التركيز (L3 + R3 / LS + RS)
- يدلك على مصدر الصراخ والأصوات.
- الأبواب تطلع بيضا لو تقدر تدخل، وحمرا لو فيها إنذار.
- أسرع تدريب للتركيز هو الصيد (حوالي +10 لكل صيدة)، وكرة السلة تساعد بعد.

## الشرطة
- انتبه للأيقونات تحت نجوم المطاردة: توضح وش تعرف الشرطة عنك (لبسك، وجهك، سيارتك). غيّر لبسك أو اترك السيارة عشان تمسحها.

## الإعدادات
- ضبابية الحركة على 3 افتراضياً — خلها 0 عشان الصورة تصير أوضح.
- ما يعجبك الركض على L3؟ حوّل لنظام التحكم Classic.`,
    aliases: ["beginner", "tips", "مبتدئ", "نصائح", "بداية"],
    tags: ["beginner"],
    related: ["protect-your-cash", "focus-l3-r3-find-noise", "wanted-level-heat-system", "best-weapons-by-class"],
    srcUrls: [["Red Bull — beginner's guide", "https://www.redbull.com/int-en/gta-6-beginners-guide"], ["AlcastHQ — 69 tips and tricks", "https://alcasthq.com/gta-6-beginner-tips/"], ["Outputlag — 20 beginner tips", "https://outputlag.com/guides/gta-6-beginner-tips/"]],
  },
  {
    slug: "wanted-level-heat-system",
    status: "confirmed",
    en: "Wanted stars and Heat: how to lose the cops in GTA 6",
    ar: "نجوم المطاردة والـ Heat: كيف تهرب من الشرطة في GTA 6",
    sEn: "Six stars plus a Heat layer: icons show what police know about you. Break line of sight, leave the search area, change what they recognise.",
    sAr: "ست نجوم ومعها نظام Heat: الأيقونات توضح وش تعرف الشرطة عنك. اختفِ عن نظرهم، اطلع من منطقة البحث، وغيّر اللي يعرفونك فيه.",
    bEn: `## How it works
GTA 6 has up to six wanted stars. On top of that, Heat is the area around your last known position where police keep searching after you break away. Red icons under the stars show what they know: your outfit, your face, your car.

## How to lose them
- Break line of sight and get out of the search area.
- Don't flee in a straight line.
- Clear each icon: change clothes, swap or torch the car, or split Jason and Lucia up.
- If you're spotted after clearing only part of your Heat, you'll probably have to change everything again.
- Heat fades over time — but committing another crime in that area brings it back.

## Pay 'n' Spray
Guides disagree: one says it clears the wanted level, another says a respray only stops the car being recognised. Treat it as a way to clear the car icon, not a guaranteed escape.`,
    bAr: `## كيف يشتغل؟
في GTA 6 فيه لين ست نجوم مطاردة. وفوقها نظام Heat: المنطقة حول آخر مكان شافوك فيه، والشرطة تظل تدوّر فيها بعد ما تهرب. والأيقونات الحمرا تحت النجوم توضح وش يعرفون عنك: لبسك، وجهك، سيارتك.

## كيف تهرب؟
- اختفِ عن نظرهم واطلع من منطقة البحث.
- لا تهرب بخط مستقيم.
- امسح كل أيقونة: غيّر لبسك، بدّل السيارة أو احرقها، أو فرّق Jason و Lucia.
- لو شافوك وأنت ماسح جزء بس من الـ Heat، غالباً لازم تغيّر كل شي من جديد.
- الـ Heat يخف مع الوقت — بس لو سويت جريمة ثانية بنفس المنطقة يرجع.

## Pay 'n' Spray
الأدلة مختلفة: وحد يقول يمسح المطاردة، والثاني يقول الرش يخلي السيارة ما تنعرف بس. اعتبره طريقة لمسح أيقونة السيارة، مو هروب مضمون.`,
    aliases: ["wanted", "police", "heat", "cops", "شرطة", "مطاردة", "نجوم"],
    tags: ["police", "mechanics"],
    facts: [
      ["Max stars", "أقصى نجوم", "6", "6"],
      ["Icons", "الأيقونات", "Outfit · Face · Car", "اللبس · الوجه · السيارة"],
    ],
    related: ["beginner-tips-first-hours", "what-happens-if-you-kill"],
    srcUrls: [["GamesRadar — wanted levels and Heat explained", "https://www.gamesradar.com/games/grand-theft-auto/gta-6-wanted-levels-heat/"], ["GTABase — wanted level guide", "https://www.gtabase.com/articles/gta-6/gta-6-wanted-level-explained-police-system-guide"]],
  },
  {
    slug: "phone-apps-guide",
    status: "confirmed",
    en: "Every phone app in GTA 6 and what it does",
    ar: "كل تطبيقات الجوال في GTA 6 ووش فايدتها",
    sEn: "WAiNK scans cars, RydeMe fast-travels, Scooter Bros brings your car, BuckMe banks your cash, plus Snapmatic, WhatUp and Fitness.",
    sAr: "WAiNK يفحص السيارات، RydeMe للتنقل السريع، Scooter Bros يجيب سيارتك، BuckMe بنكك، وفيه Snapmatic و WhatUp و Fitness.",
    bEn: `## The essentials
- WAiNK — point it at a car to see its security, the tools you need, tracker tier, registration cost and resale value. Also used to scan Wyman's classic-car wrecks and the weird "curiosities".
- BuckMe — banking. Deposit cash at an ATM so you don't lose it when you die or get busted; also send money and pay for things.
- RydeMe — ride-hailing fast travel. Skip to your destination, or stay in the car and chat with the driver.
- Scooter Bros — delivers your personal vehicle for a fee.

## Social and life
- Snapmatic — the in-game social feed of photos and videos.
- WhatUp — messages with NPCs and between Jason and Lucia.
- Fitness — tracks your physical stats and progress.
- Vice City Real Estate — where you buy garages (from Chapter 2).
- Also listed: On Demand (shows and podcasts), Camera and Gallery.

Rockstar hasn't published an official full list, so a few names may still turn up.`,
    bAr: `## الأساسيات
- WAiNK — وجّهه على أي سيارة ويطلع لك نظام حمايتها، والأدوات اللي تحتاجها، ومستوى التتبع، وتكلفة التسجيل، وسعر بيعها. وتستخدمه بعد تفحص بقايا سيارات Wyman الكلاسيكية والأشياء الغريبة.
- BuckMe — البنك. حط كاشك من الصراف عشان ما تخسره لو مت أو انمسكت، وتقدر ترسل فلوس وتدفع.
- RydeMe — مشاوير مثل أوبر للتنقل السريع. تقدر تتخطى الطريق، أو تقعد بالسيارة وتسولف مع السواق.
- Scooter Bros — يوصل لك سيارتك الشخصية مقابل رسوم.

## الحياة والسوشال
- Snapmatic — السوشال ميديا حق اللعبة بالصور والفيديوهات.
- WhatUp — الرسايل مع الشخصيات وبين Jason و Lucia.
- Fitness — يتابع لياقتك وتقدمك.
- Vice City Real Estate — منه تشتري الكراجات (من الفصل الثاني).
- وبعد: On Demand (برامج وبودكاست)، والكاميرا، والاستوديو.

Rockstar ما نشرت قائمة رسمية كاملة، فممكن تطلع أسماء ثانية.`,
    aliases: ["phone", "apps", "WAiNK", "BuckMe", "RydeMe", "جوال", "تطبيقات"],
    tags: ["phone"],
    related: ["protect-your-cash", "call-joey-free-car-delivery", "garages-and-properties", "wymans-classic-car-collection"],
    srcUrls: [["Beebom — all phone apps", "https://beebom.com/all-gta-6-phone-apps/"], ["GTA BOOM — phone apps and their uses", "https://www.gtaboom.com/gta-6-phone-apps-fb38"]],
  },
  {
    slug: "garages-and-properties",
    status: "confirmed",
    en: "Can you buy houses or businesses? What you can actually own",
    ar: "تقدر تشتري بيوت أو مشاريع؟ وش فعلاً تقدر تملك",
    sEn: "No houses, no businesses — only garages, sold in the Vice City Real Estate app from Chapter 2. Safehouses come with the story.",
    sAr: "لا بيوت ولا مشاريع — بس كراجات، تنباع في تطبيق Vice City Real Estate من الفصل الثاني. البيوت تجيك مع القصة.",
    bEn: `## Safehouses
You can't buy homes. Jason and Lucia's places unlock through the story — guides list the Leonida Keys home, the Starlet Motel, Bayside and Ocean Beach.

## Businesses
No business you can buy, run or earn passive income from has turned up in GTA 6.

## Garages (the only thing you can buy)
- Sold in the Vice City Real Estate phone app after the Chapter 2 mission "Daily Driver".
- Around eight listings, roughly $4,000–50,000 each depending on the guide (examples: Mitchell Auto Center $5,000, Persistence Road Garage $9,500).
- Buying all of them costs about $200,000, or about $160,000 once you unlock the app's permanent 20% discount.
- Each garage holds one car and earns nothing — it's for keeping your favourite rides safe.`,
    bAr: `## البيوت
ما تقدر تشتري بيوت. بيوت Jason و Lucia تفتح مع القصة — الأدلة تذكر بيت Leonida Keys و Starlet Motel و Bayside و Ocean Beach.

## المشاريع
ما طلع في GTA 6 أي مشروع تقدر تشتريه أو تديره أو يجيب لك دخل.

## الكراجات (الشي الوحيد اللي تشتريه)
- تنباع في تطبيق Vice City Real Estate بعد مهمة "Daily Driver" في الفصل الثاني.
- حوالي 8 كراجات، كل واحد تقريباً من 4,000 إلى 50,000$ حسب الدليل (مثلاً Mitchell Auto Center بـ 5,000$، و Persistence Road Garage بـ 9,500$).
- شراها كلها حوالي 200,000$، أو 160,000$ بعد ما تفتح خصم 20% الدائم في التطبيق.
- كل كراج ياخذ سيارة وحدة وما يجيب فلوس — بس تحفظ فيه سياراتك المفضلة.`,
    aliases: ["garage", "property", "house", "business", "كراج", "بيت", "عقار"],
    tags: ["property"],
    related: ["phone-apps-guide"],
    srcUrls: [["MeowDB — garages and prices", "https://meowdb.com/gta6/garages"], ["WikiGTAVI — what you can actually buy", "https://www.wikigtavi.com/guides/gta-6-safehouses-garages"]],
  },
  {
    slug: "story-chapters-and-missions",
    status: "confirmed",
    en: "How long is GTA 6? The 5 chapters and ~91 story missions",
    ar: "كم طول GTA 6؟ الخمس فصول وحوالي 91 مهمة",
    sEn: "Five chapters from 'Just Like Paradise' to 'Top of the World, Ma' — about 91 mandatory missions, without spoilers.",
    sAr: "خمس فصول من 'Just Like Paradise' لين 'Top of the World, Ma' — حوالي 91 مهمة أساسية، بدون حرق.",
    bEn: `## The five chapters
- Chapter 1: Just Like Paradise — about 22 missions (opens with the Prologue and "Gone Fishing").
- Chapter 2: Paradise Lost — about 11.
- Chapter 3: T*ts A** Drug Money — about 26.
- Chapter 4: Vice City, Baby — about 25.
- Chapter 5: Top of the World, Ma — about 7.

## How many missions?
The most common count is 91 mandatory story missions. Other guides count 93, 97 or even 107 depending on what they include as optional.

## Tips
Some content is missable per chapter (Lucia's balcony meditation for a trophy, Donnie's money before "Swamped"), so check the missables before moving on.`,
    bAr: `## الفصول الخمسة
- الفصل 1: Just Like Paradise — حوالي 22 مهمة (يبدأ بالبرولوج و"Gone Fishing").
- الفصل 2: Paradise Lost — حوالي 11.
- الفصل 3: T*ts A** Drug Money — حوالي 26.
- الفصل 4: Vice City, Baby — حوالي 25.
- الفصل 5: Top of the World, Ma — حوالي 7.

## كم مهمة؟
أشهر رقم هو 91 مهمة قصة أساسية. وأدلة ثانية تحسبها 93 أو 97 أو حتى 107 حسب وش تحسب من المهمات الاختيارية.

## نصيحة
فيه أشياء تفوتك في كل فصل (تأمل Lucia بالبلكونة عشان كأس، وفلوس Donnie قبل مهمة "Swamped")، فشيك على الأشياء اللي تفوت قبل ما تكمل.`,
    aliases: ["chapters", "missions", "story length", "فصول", "مهمات", "طول القصة"],
    tags: ["story"],
    facts: [
      ["Chapters", "الفصول", "5", "5"],
      ["Story missions", "مهمات القصة", "~91", "~91"],
    ],
    related: ["trophy-list-platinum", "donnie-drug-packages"],
    srcUrls: [["G2A News — all 91 story missions", "https://www.g2a.com/news/gta-6-news/gta-6-mission-and-chapter-list/"], ["Push Square — chapters and story missions", "https://www.pushsquare.com/guides/gta-6-chapters-and-story-missions"]],
  },
  {
    slug: "trophy-list-platinum",
    status: "confirmed",
    en: "55 trophies, one missable: the road to the GTA 6 Platinum",
    ar: "55 كأس وواحد يفوت: طريقك لبلاتينيوم GTA 6",
    sEn: "Platinum 'Vice Got a Price!', 100% completion for 'A Long Road', and the only missable: Lucia's balcony meditation in Chapter 1.",
    sAr: "البلاتينيوم 'Vice Got a Price!'، و100% عشان 'A Long Road'، والوحيد اللي يفوت: تأمل Lucia بالبلكونة في الفصل الأول.",
    bEn: `## The list
55 trophies on PS5: 1 Platinum, 2 Gold, 6 Silver and 46 Bronze. About 28 are hidden (mostly story). Xbox has the same list for 1,000 Gamerscore.

## Key trophies
- Platinum — "Vice Got a Price!": unlock everything else.
- Gold — "A Long Road": 100% completion.
- "Positive Mental Attitude" — meditate at every spot; the only possibly missable one, so do Lucia's balcony meditation in Chapter 1 before the chapter ends.
- "This Was No Boat Accident" — clear all of Kenton's wrecks and his last mission.
- "Pest Control" — loot every gang hideout.
- A hidden trophy for the UFO abduction outside Port Gellhorn.

## Good to know
All single-player: no online trophies, no difficulty trophies, no mission medals. Guides estimate around 200 hours for the Platinum. The full list with every condition is on our Trophies page (/trophies).`,
    bAr: `## القائمة
55 كأس على PS5: بلاتينيوم واحد، 2 ذهبي، 6 فضي، و46 برونزي. حوالي 28 منها مخفية (أغلبها قصة). وإكس بوكس نفس القائمة بـ 1,000 نقطة.

## أهم الكؤوس
- البلاتينيوم — "Vice Got a Price!": تاخذه لما تجمع الباقي.
- ذهبي — "A Long Road": إتمام 100%.
- "Positive Mental Attitude" — تأمّل في كل الأماكن؛ وهو الوحيد اللي ممكن يفوت، فسوّ تأمل Lucia في البلكونة بالفصل الأول قبل ما يخلص.
- "This Was No Boat Accident" — خلّص كل سفن Kenton وآخر مهمة له.
- "Pest Control" — انهب كل مخابئ العصابات.
- كأس مخفي للاختطاف الفضائي برا Port Gellhorn.

## معلومة
كلها للعب الفردي: لا كؤوس أونلاين، ولا صعوبة، ولا ميداليات مهمات. والأدلة تقدّر البلاتينيوم بحوالي 200 ساعة. والقائمة الكاملة بكل الشروط في صفحة الكؤوس عندنا (/trophies).`,
    aliases: ["trophies", "achievements", "platinum", "كؤوس", "بلاتينيوم", "إنجازات"],
    tags: ["trophies"],
    facts: [
      ["Total", "العدد", "55 (1P · 2G · 6S · 46B)", "55 (1 بلاتينيوم · 2 ذهب · 6 فضة · 46 برونز)"],
      ["Missable", "يفوت", "Positive Mental Attitude", "Positive Mental Attitude"],
      ["Time to Platinum", "وقت البلاتينيوم", "~200 hours", "~200 ساعة"],
    ],
    related: ["kenton-treasure-dives", "illegal-operations-gang-hideouts", "ufo-abduction-port-gellhorn"],
    srcUrls: [["AlcastHQ — all 55 trophies", "https://alcasthq.com/gta-6-trophy-list/"], ["TimeSaver — 55 trophies, 1 missable", "https://timesaver.gg/blog/gta-6-trophy-list"]],
  },
  {
    slug: "side-activities-list",
    status: "confirmed",
    en: "Everything to do besides the story: side activities in Leonida",
    ar: "كل شي تقدر تسويه غير القصة: الأنشطة الجانبية في Leonida",
    sEn: "Gyms, fishing, hunting, street and sea races, basketball, pool, mini golf, scuba diving, kayaking, BASE jumping, shooting ranges and more.",
    sAr: "جيم، صيد سمك، صيد حيوانات، سباقات شوارع وبحر، سلة، بلياردو، ميني غولف، غوص، كاياك، قفز مظلي، ميادين رماية وأكثر.",
    bEn: `## Fitness
Workouts at gyms (Jason bench-presses at a beachside outdoor gym), plus boxing and fight activities. 100 workouts unlock the Body Armour cheat.

## Fishing
Detailed fishing with catch-and-release. It's also the fastest way to train Focus (about +10 per catch).

## Hunting
Centred on Mount Kalaga in the north (deer, panthers). The wildlife journal is huge — guides count up to 255 entries — and there's a Legendary Hunter challenge.

## Racing
Street, off-road, dirt-bike and sea races, with cash and vehicle upgrades as rewards.

## Everything else
Basketball, pool, mini golf, scuba diving (Kenton's wrecks), kayaking, BASE jumping, shooting ranges, and the Ultimate Edition's Wyman's Classic Car Collection.`,
    bAr: `## اللياقة
تمارين في الجيم (Jason يرفع حديد في جيم مفتوح على الشاطئ)، وملاكمة ونزالات. و100 تمرين تفتح غش الدرع.

## صيد السمك
صيد مفصّل وتقدر ترجع السمكة. وهو أسرع طريقة تدرّب فيها التركيز (حوالي +10 لكل صيدة).

## صيد الحيوانات
مركزه Mount Kalaga في الشمال (غزلان، نمور). ودفتر الحيوانات ضخم — الأدلة تحسب لين 255 خانة — وفيه تحدي Legendary Hunter.

## السباقات
سباقات شوارع، وطرق وعرة، ودبابات، وبحر، والجوائز فلوس وتطويرات للسيارة.

## وغيرها
كرة سلة، بلياردو، ميني غولف، غوص (سفن Kenton)، كاياك، قفز مظلي من الأماكن العالية، ميادين رماية، ومجموعة سيارات Wyman الكلاسيكية لنسخة Ultimate.`,
    aliases: ["activities", "fishing", "hunting", "races", "gym", "أنشطة", "صيد", "سباقات", "جيم"],
    tags: ["activities"],
    related: ["hunting-and-wildlife", "kenton-treasure-dives", "wymans-classic-car-collection", "fitness-app-stats"],
    srcUrls: [["GamesRadar — all side activities", "https://www.gamesradar.com/games/grand-theft-auto/gta-6-side-activities/"], ["GTABase — activities and side missions", "https://www.gtabase.com/gta-6/side-missions/"]],
  },
  {
    slug: "radio-stations-guide",
    status: "confirmed",
    en: "GTA 6 radio: 20+ stations, 700+ songs — and Bad Bunny as a DJ",
    ar: "راديو GTA 6: أكثر من 20 محطة و700 أغنية — و Bad Bunny مذيع",
    sEn: "Cocoteo FM with Bad Bunny, Honey FM with Chilli and T-Boz, Gloriana Blues with Keith Richards and Buddy Guy, Leonida Jazz and more.",
    sAr: "Cocoteo FM مع Bad Bunny، و Honey FM مع Chilli و T-Boz، و Gloriana Blues مع Keith Richards و Buddy Guy، و Leonida Jazz وغيرها.",
    bEn: `## How many?
Variety counts more than 700 songs across 20 stations; other guides count 21, 23 or 24 (some include talk stations).

## Hosts worth knowing
- Cocoteo FM — Bad Bunny as "El Martillo" and RaiNao as "La Gata".
- Honey FM — '90s R&B hosted by Chilli and T-Boz.
- Gloriana Blues Radio — Keith Richards and Buddy Guy.
- Leonida Jazz Radio — Randy Brecker and Stanley Clarke.
- Classics like Flash FM and Vice City FM have the biggest playlists (70–80 songs each by some counts).

Credits for a few stations (Emotion 98.3, Stockyard FM, talk radio) differ between lists — check the in-game credits.`,
    bAr: `## كم محطة؟
Variety تحسب أكثر من 700 أغنية على 20 محطة، وأدلة ثانية تقول 21 أو 23 أو 24 (بعضها يحسب المحطات الحوارية).

## مذيعين يستاهلون
- Cocoteo FM — Bad Bunny باسم "El Martillo" و RaiNao باسم "La Gata".
- Honey FM — آر أند بي التسعينات مع Chilli و T-Boz.
- Gloriana Blues Radio — Keith Richards و Buddy Guy.
- Leonida Jazz Radio — Randy Brecker و Stanley Clarke.
- المحطات الكلاسيكية مثل Flash FM و Vice City FM فيها أكبر قوائم (70 إلى 80 أغنية حسب بعض الأدلة).

أسماء المذيعين في بعض المحطات (Emotion 98.3، Stockyard FM، الحوارية) تختلف بين القوائم — شيك على أسماء اللعبة نفسها.`,
    aliases: ["radio", "music", "songs", "Bad Bunny", "راديو", "أغاني", "موسيقى"],
    tags: ["music"],
    srcUrls: [["Variety — 700 tracks and stations", "https://variety.com/2026/gaming/news/gta-6-music-songs-artists-radio-stations-tracks-1236954390/"], ["Consequence — full song list", "https://consequence.net/2026/11/gta-6-radio-stations-songs-soundtrack/"]],
  },
]);

const secrets = build("secrets", [
  {
    slug: "safe-codes-list",
    status: "confirmed",
    featured: true,
    en: "All known safe & door codes in GTA 6",
    ar: "كل أرقام الخزن والأبواب المعروفة في GTA 6",
    sEn: "Kingpin Bowling 0300, Brooks Boatworks 6823, La Cascara Motel 6969, Brian's Lockup 7700, the Cottonmouth trailer 44017 and more — with map pins.",
    sAr: "Kingpin Bowling ‏0300، Brooks Boatworks ‏6823، La Cascara Motel ‏6969، Brian's Lockup ‏7700، كرفان Cottonmouth ‏44017 وغيرها — مع دبابيس على الخريطة.",
    bEn: `## Codes several guides agree on
- Kingpin Bowling (Port Gellhorn): 0300 — back office behind the wooden "Office" door, next to the pins.
- Brooks Boatworks (Port Gellhorn): 6823 — a wall map here also lists other Port Gellhorn codes.
- La Cascara Motel (Port Gellhorn): 6969.
- Delights Cabaret office (Port Gellhorn): 2008 — during the Chapter 2 mission "Afternoon Delight".
- Moonstone Boutique back room (Key Lento): 0420 — opens Brian's acid lab in "Lab Fees" (Chapter 1).
- Brian's Lockup (Key Lento): 7700 — storage room on the water at Trawls Deep; you can pull up by boat.
- Trailer near Cottonmouth Lake: 44017 — the first 4 is half-hidden in a picture inside.
- Pelican Valley outpost: 0072 — inside the abandoned research facility in Gullet Marsh; the safe holds another code, 0212, for a door by the pier.
- Vice City: Casa de Empeño 1680 · Richardson Jewelry 6815 · Donovan Banks & Co. 0104 (keep the leading zero).
- Sundown Airfield hangar (Pilot Pete's mission): 3718.

## Disputed
Saber Shipping (1965 or 1122), Fleeca Bank (1747 or 8140), Sunrise RV Park 6769, Stormy 7869. Check for a note nearby.

## No code? No problem
Codes are usually hidden nearby on notes, wall maps or photos. You can also crack a safe by turning the right stick until the bar fills — or blow it open with any explosion.

${approx.en}`,
    bAr: `## أرقام متفقة عليها أكثر من دليل
- Kingpin Bowling (Port Gellhorn): 0300 — المكتب الخلفي ورا الباب الخشب المكتوب عليه "Office"، جنب القوارير.
- Brooks Boatworks (Port Gellhorn): 6823 — وفيه خريطة على الجدار فيها أرقام ثانية في Port Gellhorn.
- La Cascara Motel (Port Gellhorn): 6969.
- مكتب Delights Cabaret (Port Gellhorn): 2008 — في مهمة "Afternoon Delight" بالفصل الثاني.
- الغرفة الخلفية في Moonstone Boutique (Key Lento): 0420 — تفتح معمل Brian في مهمة "Lab Fees" (الفصل الأول).
- Brian's Lockup (Key Lento): 7700 — مخزن على الماء عند Trawls Deep، وتقدر توقف جنبه بالقارب.
- كرفان قرب بحيرة Cottonmouth: 44017 — أول رقم 4 نصه مخفي في صورة داخل الكرفان.
- مخفر Pelican Valley: 0072 — داخل منشأة الأبحاث المهجورة في Gullet Marsh؛ والخزنة فيها رقم ثاني 0212 لباب جنب الرصيف.
- Vice City: ‏Casa de Empeño ‏1680 · ‏Richardson Jewelry ‏6815 · ‏Donovan Banks & Co. ‏0104 (خل الصفر الأول).
- هنقر Sundown Airfield (مهمة Pilot Pete): 3718.

## مختلف عليها
Saber Shipping (1965 أو 1122)، Fleeca Bank (1747 أو 8140)، Sunrise RV Park ‏6769، Stormy ‏7869. دوّر ورقة قريبة.

## ما عندك الرقم؟ عادي
الأرقام غالباً مخبّاة قريب: أوراق، خرائط على الجدار، صور. وتقدر تكسر الخزنة بلف العصا اليمين لين يمتلي الشريط — أو تفجّرها بأي انفجار.

${approx.ar}`,
    aliases: ["safe codes", "door codes", "combination", "أرقام الخزن", "رقم الخزنة", "خزنة", "باب سري"],
    tags: ["codes", "money"],
    facts: [
      ["Kingpin Bowling", "Kingpin Bowling", "0300", "0300"],
      ["Brian's Lockup", "Brian's Lockup", "7700", "7700"],
      ["Cottonmouth trailer", "كرفان Cottonmouth", "44017", "44017"],
      ["Research facility", "منشأة الأبحاث", "0072 → 0212", "0072 ← 0212"],
    ],
    spots: [
      [880, 1420, "Kingpin Bowling, Port Gellhorn — 0300", "Kingpin Bowling، Port Gellhorn — 0300"],
      [905, 1330, "Brooks Boatworks, north-east Port Gellhorn — 6823 (approx.)", "Brooks Boatworks، شمال شرق Port Gellhorn — 6823 (تقريبي)"],
      [840, 1400, "La Cascara Motel, Port Gellhorn — 6969 (approx.)", "La Cascara Motel، Port Gellhorn — 6969 (تقريبي)"],
      [1612, 3188, "Moonstone Boutique, Key Lento — 0420 (approx.)", "Moonstone Boutique، Key Lento — 0420 (تقريبي)"],
      [1565, 3220, "Brian's Lockup at Trawls Deep, Key Lento — 7700 (approx.)", "Brian's Lockup عند Trawls Deep، Key Lento — 7700 (تقريبي)"],
      [1445, 2925, "Abandoned trailer by Cottonmouth Lake — 44017 (approx.)", "كرفان مهجور جنب بحيرة Cottonmouth — 44017 (تقريبي)"],
      [1355, 2740, "Research facility, Gullet Marsh — 0072, then pier door 0212 (approx.)", "منشأة الأبحاث، Gullet Marsh — 0072 وبعدها باب الرصيف 0212 (تقريبي)"],
    ],
    related: ["illegal-operations-gang-hideouts", "explosions-open-safes", "keypad-code-2314", "kingpin-bowling"],
    srcUrls: [["Space4Games — all safe codes", "https://space4games.com/en/games-en/gta-6-safe-codes-combinations-locations/"], ["GTA6 Info wiki — safe codes", "https://gta6info.com/wiki/Safe_Codes"], ["Cultured Vultures — safe and door codes", "https://culturedvultures.com/gta-6-all-door-codes-and-safe-combinations/"]],
  },
  {
    slug: "tommy-vercetti-references",
    status: "confirmed",
    en: "Tommy Vercetti's legacy: the Vice City references hidden in GTA 6",
    ar: "إرث Tommy Vercetti: إشارات Vice City المخفية في GTA 6",
    sEn: "The Ocean View Hotel is back on Ocean Beach, an Ultimate Edition reward names the Vercetti Estate, and Tommy's shirt pattern is everywhere.",
    sAr: "فندق Ocean View رجع في Ocean Beach، ومكافأة نسخة Ultimate فيها اسم Vercetti Estate، ونقشة قميص Tommy في كل مكان.",
    bEn: `## The strongest clues
- Ocean View Hotel — Tommy's first safehouse in GTA Vice City (2002) is back on Ocean Beach with its pink neon sign.
- Vercetti Estate — an Ultimate Edition reward directly mentions it, the clearest Tommy nod so far.
- Vintage Vice City Pack — a tropical weapon finish inspired by Tommy's palm-tree shirt.

## Fan-spotted (unconfirmed)
- A wooden lizard in a Trailer 2 scene wears a blue floral shirt like Tommy's.
- Jason wears a similar flowery blue shirt in some promo art.
- Some sites mention a Malibu Club or "Vercetti Estate ruins" on Starfish Island — not verified.

Tommy himself is very unlikely to appear.`,
    bAr: `## أقوى الأدلة
- فندق Ocean View — أول بيت لـ Tommy في GTA Vice City (2002) رجع في Ocean Beach بلوحة النيون الوردية.
- Vercetti Estate — مكافأة في نسخة Ultimate تذكره بالاسم، وهذي أوضح إشارة لـ Tommy لين الحين.
- حزمة Vintage Vice City — نقشة استوائية للأسلحة مستوحاة من قميص Tommy أبو النخل.

## اكتشافات معجبين (غير مؤكدة)
- سحلية خشب في مشهد بالتريلر الثاني لابسة قميص أزرق بورود مثل قميص Tommy.
- Jason لابس قميص أزرق بورود مشابه في بعض الصور الدعائية.
- بعض المواقع تذكر Malibu Club أو "أطلال Vercetti Estate" في Starfish Island — غير مؤكد.

و Tommy نفسه احتمال ظهوره ضعيف جداً.`,
    aliases: ["Tommy Vercetti", "Vice City 2002", "Ocean View Hotel", "تومي فيرسيتي", "فايس سيتي القديمة"],
    tags: ["reference", "Vice City"],
    spots: [[2418, 1990, "Ocean View Hotel, Ocean Beach (approx.)", "فندق Ocean View، Ocean Beach (تقريبي)"]],
    related: ["ocean-beach", "price-and-editions", "wind-chimes-ringtone"],
    srcUrls: [["KeenGamer — 11 biggest GTA series easter eggs", "https://www.keengamer.com/articles/guides/11-biggest-gta-series-easter-eggs-in-gta-6-from-michaels-boat-to-vice-city/"], ["Beebom — all easter eggs", "https://beebom.com/gta-6-easter-eggs/"]],
  },
]);

const weapons = build("weapons", [
  {
    slug: "best-weapons-by-class",
    status: "confirmed",
    featured: true,
    en: "The best weapon in every class — and where to buy it",
    ar: "أفضل سلاح في كل فئة — ومن وين تشتريه",
    sEn: "Duke 556 rifle ($1,450), Moreland 850 shotgun, Laird 350 sniper — sold at Ammu-Nation. Only guns you bought come back after death.",
    sAr: "رشاش Duke 556 (1,450$)، شوزن Moreland 850، قناصة Laird 350 — من Ammu-Nation. وبس الأسلحة المشتراة ترجع لك بعد الموت.",
    bEn: `## Top picks
- Assault rifle: Duke 556 — the all-round favourite, 30-round mag, lots of attachments (~$1,450). For a free early option, the Drug Mule KZ-59 underwater in the Riquezas Keys.
- Shotgun: Fortune & Son Moreland 850 — the close-range standard.
- Sniper: Fortune & Son Laird 350 — most accurate; the Fairview FF-50 / FF-SR are pricier upgrades.
- SMG: guides split between the Schlamm DW-9 and the Killtelligence SM-69.
- Machine gun: ADB M350 or Combat MG.
- Heavy: Hillinger Boomer grenade launcher and Hauners H-AT rocket launcher (expensive).

## Where to buy
- Ammu-Nation sells most guns; sniper rifles and launchers only at the bigger "Expanded" Ammu-Nation stores.
- There's an Ammu-Nation in Key Lento right after the tutorial. Big Shots in Hamlet and Phil's Ammu-Nation in Vice City are also named.
- Some purchases (like the Duke 556) need a bank account.

## Tips
- Buy a suppressor early — it's cheap.
- Only Ammu-Nation purchases come back after death; picked-up guns are lost.

${approx.en}`,
    bAr: `## أفضل الخيارات
- رشاش هجومي: Duke 556 — الأفضل بشكل عام، مخزن 30 طلقة، وإضافات كثيرة (~1,450$). ولو تبغى مجاني بدري: Drug Mule KZ-59 تحت الماء في Riquezas Keys.
- شوزن: Fortune & Son Moreland 850 — الأساسي للقريب.
- قناصة: Fortune & Son Laird 350 — الأدق؛ و Fairview FF-50 / FF-SR ترقيات أغلى.
- رشاش خفيف: الأدلة منقسمة بين Schlamm DW-9 و Killtelligence SM-69.
- رشاش ثقيل: ADB M350 أو Combat MG.
- ثقيل: قاذف قنابل Hillinger Boomer وقاذف صواريخ Hauners H-AT (غاليين).

## من وين تشتري؟
- Ammu-Nation يبيع أغلب الأسلحة؛ والقناصات والقواذف بس في فروع Ammu-Nation الكبيرة (Expanded).
- فيه Ammu-Nation في Key Lento بعد التدريب على طول. وبعد Big Shots في Hamlet و Phil's Ammu-Nation في Vice City.
- بعض المشتريات (مثل Duke 556) تحتاج حساب بنكي.

## نصائح
- اشترِ كاتم صوت بدري — رخيص.
- بس اللي اشتريته من Ammu-Nation يرجع بعد الموت؛ اللي التقطته يروح.

${approx.ar}`,
    aliases: ["best guns", "Ammu-Nation", "Duke 556", "assault rifle", "sniper", "أفضل سلاح", "أمونيشن", "رشاش", "قناصة"],
    tags: ["weapons", "guide"],
    facts: [
      ["Best rifle", "أفضل رشاش", "Duke 556 (~$1,450)", "Duke 556 (~1,450$)"],
      ["Best shotgun", "أفضل شوزن", "Moreland 850", "Moreland 850"],
      ["Best sniper", "أفضل قناصة", "Laird 350", "Laird 350"],
      ["Kept after death", "يرجع بعد الموت", "Only Ammu-Nation purchases", "بس المشتراة من Ammu-Nation"],
    ],
    spots: [
      [1600, 3200, "Ammu-Nation, Key Lento — first gun store after the tutorial (approx.)", "Ammu-Nation في Key Lento — أول محل أسلحة بعد التدريب (تقريبي)"],
      [1585, 2645, "Big Shots, Hamlet (approx.)", "Big Shots في Hamlet (تقريبي)"],
    ],
    related: ["drug-mule-kz-59", "gutterball-moreland-850", "early-unique-weapons-route"],
    srcUrls: [["Beebom — best weapons ranked by class", "https://beebom.com/gta-6-best-weapons/"], ["Game8 — best weapons", "https://game8.co/games/GTA-6/archives/638574"], ["The Phrasemaker — how to get weapons", "https://thephrasemaker.com/2026/11/19/how-to-get-weapons-in-gta-6-best-weapons-list/"]],
  },
]);

const vehicles = build("vehicles", [
  {
    slug: "wymans-classic-car-collection",
    status: "confirmed",
    en: "Wyman's Classic Car Collection: rebuild 5 classics (Ultimate Edition)",
    ar: "مجموعة Wyman للسيارات الكلاسيكية: رجّع 5 سيارات (نسخة Ultimate)",
    sEn: "Scan wrecks with WAiNK, pay Wyman to rebuild them, and keep the '67 Transgressor, '70 Riata, '64 Mamba GT, Reynolds Kit Car and '72 Deviant.",
    sAr: "افحص البقايا بـ WAiNK، ادفع لـ Wyman يبنيها، وخذ '67 Transgressor و '70 Riata و '64 Mamba GT و Reynolds Kit Car و '72 Deviant.",
    bEn: `## Unlock
Ultimate Edition only. After you collect the '67 Vapid Dominator Buggy, a purple icon appears about one in-game day after the Chapter 2 Strangers & Freaks mission "Thrillbillies".

## How it works
- Each car needs several wrecks found and scanned with the WAiNK app.
- The Transgressor's three junk wrecks are around Port Gellhorn.
- Pay Wyman about $1,500 to build each car.
- Register it at a Pay 'n' Spray (~$100) or park it in one of your garages to keep it.

## Rewards
'67 Transgressor, '70 Riata, '64 Mamba GT, Reynolds Kit Car and '72 Deviant — none are in the Standard Edition.

${approx.en}`,
    bAr: `## كيف تفتح؟
بس لنسخة Ultimate. بعد ما تاخذ '67 Vapid Dominator Buggy، تطلع علامة بنفسجية تقريباً بعد يوم في اللعبة من مهمة "Thrillbillies" (Strangers & Freaks) بالفصل الثاني.

## الطريقة
- كل سيارة تحتاج تلقى بقايا أكثر من سيارة وتفحصها بتطبيق WAiNK.
- بقايا Transgressor الثلاث حول Port Gellhorn.
- ادفع لـ Wyman تقريباً 1,500$ عشان يبني كل سيارة.
- سجّلها في Pay 'n' Spray (~100$) أو حطها في كراجك عشان تبقى لك.

## الجوائز
'67 Transgressor و '70 Riata و '64 Mamba GT و Reynolds Kit Car و '72 Deviant — ولا وحدة منها في النسخة العادية.

${approx.ar}`,
    aliases: ["Wyman", "classic cars", "Transgressor", "سيارات كلاسيكية", "ويمان"],
    tags: ["Ultimate Edition", "collectible"],
    facts: [
      ["Edition", "النسخة", "Ultimate only", "Ultimate فقط"],
      ["Build cost", "تكلفة البناء", "~$1,500 per car", "~1,500$ للسيارة"],
      ["Cars", "السيارات", "5 classics", "5 كلاسيكيات"],
    ],
    spots: [[855, 1370, "Transgressor wrecks — around Port Gellhorn (approx.)", "بقايا Transgressor — حول Port Gellhorn (تقريبي)"]],
    related: ["phone-apps-guide", "price-and-editions", "grotti-cheetah-95"],
    srcUrls: [["Push Square — Wyman's classic car locations", "https://www.pushsquare.com/guides/gta-6-wymans-classic-car-locations"], ["PC Gamer — Transgressor locations", "https://www.pcgamer.com/games/grand-theft-auto/gta-6-transgressor-locations/"], ["KeenGamer — Ultimate Edition rewards", "https://www.keengamer.com/articles/guides/how-to-claim-gta-6-ultimate-edition-and-pre-order-rewards/"]],
  },
]);

const strange = build("strange", [
  {
    slug: "hunting-and-wildlife",
    status: "confirmed",
    en: "Leonida's wildlife: 255 entries, legendary animals and an albino alligator",
    ar: "حيوانات Leonida: 255 خانة، حيوانات أسطورية، وتمساح ألبينو",
    sEn: "Alligators rule the Grassrivers, a rare albino alligator turns up near a Hamlet fishing spot, and Mount Kalaga is hunting country.",
    sAr: "التماسيح تحكم Grassrivers، وفيه تمساح ألبينو نادر قرب مكان صيد في Hamlet، و Mount Kalaga أرض الصيد.",
    bEn: `## How big is it?
Guides count anywhere from 170+ species to a wildlife journal with 255 entries across eight tabs. Animals come in three tiers: Rare, Discoverable and Legendary.

## Where to look
- Alligators: mostly the Grassrivers swamp in the south. A rare Albino American Alligator appears in the wetlands, sometimes near a fishing spot in Hamlet.
- Hunting: Mount Kalaga in the north (deer, panthers), with some guides pointing to a cabin in Lummox County.
- Keep your distance from alligators, bears and wild boars.

## Legendary Hunter
A challenge asks for eight unique animals — players are still working out which eight.

${approx.en}`,
    bAr: `## قد إيش كبير؟
الأدلة تقول من 170 نوع وأكثر، لين دفتر حيوانات فيه 255 خانة في 8 أقسام. والحيوانات ثلاث درجات: نادر، قابل للاكتشاف، وأسطوري.

## وين تدوّر؟
- التماسيح: أغلبها في مستنقعات Grassrivers بالجنوب. وفيه تمساح أمريكي ألبينو نادر يطلع في الأراضي الرطبة، أحياناً قرب مكان صيد في Hamlet.
- الصيد: Mount Kalaga في الشمال (غزلان، نمور)، وبعض الأدلة تذكر كوخ في Lummox County.
- ابعد عن التماسيح والدببة والخنازير البرية.

## Legendary Hunter
فيه تحدي يطلب 8 حيوانات فريدة — واللاعبين لسه يكتشفون وش هي الثمانية.

${approx.ar}`,
    aliases: ["animals", "alligator", "albino", "hunting", "حيوانات", "تمساح", "صيد"],
    tags: ["wildlife"],
    spots: [
      [1500, 2700, "Albino alligator — near a Hamlet fishing spot (approx.)", "التمساح الألبينو — قرب مكان صيد في Hamlet (تقريبي)"],
      [1265, 2545, "Alligators — Grassrivers swamp", "التماسيح — مستنقعات Grassrivers"],
      [1395, 870, "Hunting — Mount Kalaga National Park", "الصيد — منتزه Mount Kalaga"],
    ],
    related: ["side-activities-list", "grassrivers", "mount-kalaga-national-park"],
    srcUrls: [["Outputlag — all 255 wildlife entries", "https://outputlag.com/guides/gta-6-animals-wildlife/"], ["EGamers — alligators in Grassrivers", "https://egamers.io/gta-6-alligators-grassrivers-locations-the-alligator-kills-challenge-and-swamp-dangers/"]],
  },
]);

const glitches = build("glitches", [
  {
    slug: "money-glitch-warehouse-reload",
    status: "rumor",
    en: "The 'infinite money' warehouse glitch: what we know",
    ar: "قلتش 'الفلوس اللانهائية' في المستودع: وش نعرف",
    sEn: "Videos claim loot at a South Vice-Dale warehouse respawns if you leave or reload, then sells at Brian's Lockup. Unverified — use at your own risk.",
    sAr: "فيديوهات تقول إن البضاعة في مستودع بجنوب Vice-Dale ترجع لو طلعت أو رجّعت الحفظ، وتبيعها في Brian's Lockup. غير مؤكد — على مسؤوليتك.",
    bEn: `## The claim
Several guides and videos describe a loop at a warehouse in South Vice-Dale County: loot it, drive away (or reload your save), come back and the loot is there again — then sell it at Brian's Lockup in Key Lento. One tester said it still worked when they tried it.

## Why we mark it unverified
games.gg found no version with reproducible steps they could recommend, and payout claims (like "$250k per hour") couldn't be checked. Rockstar hasn't said anything about patching it.

## Our advice
Exploits can break your save or get patched at any time. Back up your save first — and remember that honest methods (hideouts, Kenton's dives, Moses) pay well too.

${approx.en}`,
    bAr: `## الادعاء
أكثر من دليل وفيديو يوصفون لفة في مستودع بجنوب مقاطعة Vice-Dale: تنهبه، تبعد (أو ترجّع الحفظ)، ترجع وتلقى البضاعة رجعت — وبعدين تبيعها في Brian's Lockup في Key Lento. ووحد جرّبها قال إنها لسه تشتغل.

## ليش كاتبينه غير مؤكد
موقع games.gg ما لقى نسخة بخطوات واضحة تتكرر، والأرقام (مثل "250 ألف بالساعة") ما قدرنا نتأكد منها. و Rockstar ما قالت شي عن إصلاحه.

## نصيحتنا
القلتشات ممكن تخرب الحفظ أو تنصلح بأي وقت. سوّ نسخة من حفظك قبل — وتذكّر إن الطرق النظيفة (المخابئ، غطسات Kenton، Moses) تجيب فلوس زينة بعد.

${approx.ar}`,
    aliases: ["money glitch", "infinite money", "exploit", "قلتش فلوس", "فلوس لا نهائية"],
    tags: ["money", "exploit"],
    spots: [
      [1730, 2600, "The warehouse — South Vice-Dale (approx.)", "المستودع — جنوب Vice-Dale (تقريبي)"],
      [1565, 3220, "Sell at Brian's Lockup, Key Lento (approx.)", "البيع في Brian's Lockup، Key Lento (تقريبي)"],
    ],
    videos: ["KCyEj1pf15w", "-7Ep4hLM8Eg"],
    related: ["illegal-operations-gang-hideouts", "kenton-treasure-dives", "moses-car-sales"],
    srcUrls: [["Sportskeeda — infinite money glitch (South Vice-Dale)", "https://www.sportskeeda.com/esports/gta-6-infinite-money-glitch-south-vice-dale-county-how-get-unlimited-money-gta-6"], ["Games.gg — money glitch: what works and what to avoid", "https://games.gg/grand-theft-auto-vi/guides/grand-theft-auto-6-money-glitch-what-works-and-what-to-avoid/"]],
  },
]);

const funny = build("funny", [
  {
    slug: "babylon-bee-grand-faith-auto",
    status: "confirmed",
    en: "A satire site joked about 'Grand Faith Auto' — and a news outlet fell for it",
    ar: "موقع ساخر نكّت عن 'Grand Faith Auto' — وموقع أخبار صدّقها",
    sEn: "The Babylon Bee posted a parody about a religious 'Grand Faith Auto', and an outlet reported it as real.",
    sAr: "The Babylon Bee نشر نكتة عن نسخة دينية اسمها 'Grand Faith Auto'، وموقع أخبار نقلها كأنها حقيقية.",
    bEn: `Launch week also had its share of internet comedy: satire site The Babylon Bee published a parody about a wholesome "Grand Faith Auto", and an outlet reportedly took the bait and covered it as real news. A good reminder to check sources — which is exactly why every entry here has a status badge.`,
    bAr: `أسبوع الإطلاق كان فيه نصيبه من كوميديا الإنترنت: الموقع الساخر The Babylon Bee نشر نكتة عن نسخة "محافظة" اسمها "Grand Faith Auto"، وموقع أخبار حسب التقارير صدّقها ونشرها كخبر حقيقي. تذكير حلو إنك تتأكد من المصدر — وعشان كذا كل موضوع عندنا عليه شارة توضح حالته.`,
    aliases: ["Babylon Bee", "Grand Faith Auto", "satire", "ساخر"],
    tags: ["internet"],
    srcUrls: [["PJ Media — the Babylon Bee trolled GTA 6", "https://pjmedia.com/chris-queen/2026/11/20/the-babylon-bee-trolled-gta-6-and-a-left-wing-news-outlet-took-the-bait-n4959542"]],
    date: "2026-11-20T16:00:00Z",
  },
]);

const BATCH2: Item[] = [...tips, ...secrets, ...weapons, ...vehicles, ...strange, ...glitches, ...funny].map((i) => ({
  ...i,
  published_at: i.category === "funny" ? i.published_at : "2026-11-21T15:00:00Z",
}));
export default BATCH2;
