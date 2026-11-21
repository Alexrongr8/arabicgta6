import { build } from "./helpers";

const payNote = {
  en: "Payout figures are approximate and vary between guides. Map pins marked (approx.) are placed by the area named in guides, not an exact in-game marker.",
  ar: "المبالغ تقريبية وتختلف بين الأدلة. والدبابيس المكتوب عليها (تقريبي) محطوطة حسب المنطقة اللي تذكرها الأدلة، مو علامة دقيقة من اللعبة.",
};

export default build("money", [
  {
    slug: "illegal-operations-gang-hideouts",
    status: "confirmed",
    featured: true,
    en: "Loot gang hideouts (Illegal Operations)",
    ar: "نهب مخابئ العصابات (Illegal Operations)",
    sEn: "About 39–40 gang hideouts across Leonida. Clear one, crack the safe, loot the drugs and sell them — roughly $1,000–2,000+ per site, and they're repeatable.",
    sAr: "فيه حوالي 39 إلى 40 مخبأ عصابة في Leonida. تنظّفه، تفتح الخزنة، تاخذ البضاعة وتبيعها — تقريباً 1,000 إلى 2,000$ وأكثر للمخبأ، وتقدر تعيدها.",
    bEn: `## What it is
Illegal Operations are gang hideouts spread all over Leonida — guides count 39 or 40 of them. Raiding them is the money method most guides rank first in the early game.

## How to find them
Open the map → Robberies → Illegal Operations. They cluster most in Little Cuba, Port Gellhorn and Peacock Bay, so those are the best areas for a quick loop.

## How to do it, step by step
- Arrive and clear the guards (or sneak in).
- Find the safe. Any explosion opens it without the code; or use the code if you know it — guides list Kingpin Bowling (Port Gellhorn) as 0300 and Brooks Boatworks as 6823.
- Grab the cash and every bag of drugs before you leave.
- Sell the drugs to a fence (Donnie's trailer in Key Lento works as a fence after "Clean Up After Donnie").

## Which gangs
PowerPyx groups them by gang: Kingfishers (3), Kolts & Associates (5), M7 (2), La Polilla Negra (2), Final Chapter (4), San4San (5), PTT Youngin$ (2), Guardia Brothers (3) and Other Criminals (13). Spots include fishing shacks, Kingpin Bowling, the M7 Compound and a biker hideout.

## Tips
- They are repeatable, so missing something isn't permanent.
- Looting all of them counts toward 100% completion and the Pest Control trophy.
- Bank your cash after each run — you lose pocket cash if you die or get busted.

${payNote.en}`,
    bAr: `## وش هي؟
Illegal Operations هي مخابئ عصابات منتشرة في كل Leonida — الأدلة تحسبها 39 أو 40 مخبأ. ومداهمتها هي طريقة الفلوس اللي أغلب الأدلة تحطها رقم 1 بداية اللعبة.

## كيف تلقاها؟
افتح الخريطة ← Robberies ← Illegal Operations. أكثر مكان تتجمع فيه: Little Cuba و Port Gellhorn و Peacock Bay، فهذي أحسن مناطق تسوي فيها لفة سريعة.

## الطريقة خطوة بخطوة
- روح للمخبأ ونظّف الحراس (أو ادخل بهدوء).
- دوّر الخزنة. أي انفجار يفتحها بدون رقم، أو استخدم الرقم لو تعرفه — الأدلة تذكر إن رقم خزنة Kingpin Bowling في Port Gellhorn هو 0300، و Brooks Boatworks هو 6823.
- خذ الكاش وكل أكياس البضاعة قبل ما تطلع.
- بيع البضاعة عند مشتري (Fence) — كرفان Donnie في Key Lento يصير مشتري بعد مهمة "Clean Up After Donnie".

## العصابات
PowerPyx يقسمها حسب العصابة: Kingfishers (3)، Kolts & Associates (5)، M7 (2)، La Polilla Negra (2)، Final Chapter (4)، San4San (5)، PTT Youngin$ (2)، Guardia Brothers (3)، ومجرمين ثانيين (13). ومن الأماكن: أكواخ صيد، Kingpin Bowling، مجمع M7، ومخبأ عصابة دراجات.

## نصائح
- تقدر تعيدها، فلو فاتك شي مو نهاية العالم.
- نهبها كلها يحسب في الـ 100% وكأس Pest Control.
- حط فلوسك بالبنك بعد كل لفة — الكاش اللي معك يروح لو مت أو انمسكت.

${payNote.ar}`,
    aliases: ["hideouts", "illegal operations", "gang", "مخابئ", "نهب", "عصابات"],
    tags: ["early game", "combat", "repeatable"],
    facts: [
      ["Locations", "عدد المواقع", "39–40", "39 إلى 40"],
      ["Payout", "الربح", "~$1,000–2,000+ / site", "~1,000–2,000$+ للمخبأ"],
      ["Best areas", "أفضل مناطق", "Little Cuba, Port Gellhorn, Peacock Bay", "Little Cuba، Port Gellhorn، Peacock Bay"],
      ["Safe codes", "أرقام خزن", "Kingpin Bowling 0300 · Brooks Boatworks 6823", "Kingpin Bowling ‏0300 · Brooks Boatworks ‏6823"],
      ["Repeatable", "تتكرر؟", "Yes", "نعم"],
    ],
    spots: [
      [1853, 2047, "Little Cuba — the biggest cluster of hideouts (approx.)", "Little Cuba — أكثر منطقة فيها مخابئ (تقريبي)"],
      [855, 1370, "Port Gellhorn — second biggest cluster (approx.)", "Port Gellhorn — ثاني أكثر منطقة (تقريبي)"],
      [880, 1420, "Kingpin Bowling, Port Gellhorn — safe code 0300", "Kingpin Bowling في Port Gellhorn — رقم الخزنة 0300"],
      [1865, 2455, "Peacock Bay — another cluster (approx.)", "Peacock Bay — تجمّع ثالث (تقريبي)"],
      [1600, 3180, "Donnie's trailer, Key Lento — sell drugs here (fence)", "كرفان Donnie في Key Lento — تبيع البضاعة هنا"],
    ],
    videos: ["m8Qmgw5nqwk", "UImiFa8ZpJg"],
    related: ["donnie-drug-packages", "protect-your-cash", "explosions-open-safes", "kingpin-bowling"],
    src: ["gtabaseOps", "powerpyxOps", "gtasixmapOps", "space4Safes", "vgcMoney"],
  },
  {
    slug: "donnie-drug-packages",
    status: "confirmed",
    en: "Sell Donnie's drug packages (Chapter 1)",
    ar: "بيع طرود دوني (الفصل الأول)",
    sEn: "Find Donnie's lost packages (about nine, worth ~$3,400 in total) and drop them in the bin behind his trailer in Key Lento — before 'Swamped'.",
    sAr: "دوّر طرود Donnie الضايعة (حوالي 9 طرود بقيمة ~3,400$) وحطها في الصندوق ورا كرفانه في Key Lento — قبل مهمة 'Swamped'.",
    bEn: `## Part 1: "Clean Up After Donnie"
After "Coming Home", Donnie calls Jason about a lost package. GamesRadar puts it near a fishing spot in south-west Hamlet: Cal sends a beacon, and you collect the packages into Jason's stash bag with Triangle (Xbox: Y). Take it to Donnie's trailer in Key Lento and leave it in the container at the back. Reward: about $600, sent later — and his trailer becomes a fence for drugs.

Guides disagree on the exact pickup spot (some say the swamps near Key Lento or Grassrivers), so follow the mission beacon.

## Part 2: the other lost packages
There's a wider set of lost packages across four Chapter 1 areas, including the Recreation Area, a river spot a little past it, and the Thorpe Adventures area. Outputlag counts about nine packages worth around $3,400 in total. Put all of them in the bin behind Donnie's trailer to get paid.

## ⚠️ Missable (spoiler)
Donnie is killed in the mission "Swamped". Any money he still owes you then never arrives — so finish this before that mission.

${payNote.en}`,
    bAr: `## الجزء الأول: مهمة "Clean Up After Donnie"
بعد مهمة "Coming Home"، يتصل Donnie على Jason عن طرد ضايع. حسب GamesRadar الطرد قرب مكان صيد في جنوب غرب Hamlet: Cal يرسل لك إشارة، وتجمع الطرود في شنطة Jason بزر المثلث (إكس بوكس: Y). وديه لكرفان Donnie في Key Lento وحطه في الصندوق اللي ورا. المكافأة حوالي 600$ توصلك بعدين — وكرفانه يصير مكان تبيع فيه البضاعة.

الأدلة مختلفة في مكان الاستلام بالضبط (بعضها يقول مستنقعات قرب Key Lento أو Grassrivers)، فامشِ ورا إشارة المهمة.

## الجزء الثاني: باقي الطرود الضايعة
فيه مجموعة طرود أكبر في أربع مناطق بالفصل الأول، منها Recreation Area، ونقطة على النهر بعدها بشوي، ومنطقة Thorpe Adventures. Outputlag يحسبها حوالي 9 طرود بقيمة تقارب 3,400$. حطها كلها في الصندوق ورا كرفان Donnie وتنصرف لك.

## ⚠️ تفوت (حرق)
Donnie ينقتل في مهمة "Swamped". وأي فلوس باقية لك عنده ما توصلك أبداً — فخلّص هذي قبل المهمة.

${payNote.ar}`,
    aliases: ["Donnie", "packages", "Clean Up After Donnie", "طرود", "دوني"],
    tags: ["Chapter 1", "missable"],
    facts: [
      ["Total", "المجموع", "~9 packages ≈ $3,400", "~9 طرود ≈ 3,400$"],
      ["Mission reward", "مكافأة المهمة", "~$600", "~600$"],
      ["Drop-off", "التسليم", "Bin behind Donnie's trailer, Key Lento", "الصندوق ورا كرفان Donnie، Key Lento"],
      ["Deadline", "آخر موعد", "Before 'Swamped'", "قبل مهمة Swamped"],
    ],
    spots: [
      [1600, 3180, "Donnie's trailer, Key Lento — drop packages in the bin at the back", "كرفان Donnie في Key Lento — حط الطرود في الصندوق اللي ورا"],
      [1500, 2700, "Fishing spot, south-west Hamlet — first lost package (approx.)", "مكان الصيد جنوب غرب Hamlet — أول طرد ضايع (تقريبي)"],
    ],
    videos: ["ifSZ2hvkUZQ"],
    related: ["donnie", "brian-heder", "illegal-operations-gang-hideouts"],
    src: ["grDonnie", "outputDonnie", "thumbDonnie", "alcastMoney"],
  },
  {
    slug: "kenton-treasure-dives",
    status: "confirmed",
    featured: true,
    en: "Kenton's treasure dives in the Keys",
    ar: "غطسات الكنوز مع Kenton في الكيز",
    sEn: "Zero-risk money: seven Spanish shipwrecks around Key Lento, about $1,400 per wreck early on — plus a trophy.",
    sAr: "فلوس بدون مخاطرة: سبع سفن إسبانية غارقة حول Key Lento، حوالي 1,400$ للسفينة بالبداية — ومعها كأس.",
    bEn: `## How it unlocks
Treasure hunting opens after the mission "Island Dreams" at Kenton's dive shop in Key Lento. Kenton Rees uses a bachelor party's scuba tour as cover for the first dive.

## What you need
Scuba gear (from Island Dreams), a boat (Kenton's or Jason's) and the metal detector. Swim faster by clicking L3 (Xbox: LS) and keep an eye on your oxygen.

## The wrecks (all in Mariana County)
- Nuestra Señora del Ocio — the Island Dreams wreck, 10 gold doubloons, east of Key Lento past the small island.
- Nuestra Señora de la Noche — 7 treasures (antique candlestick, pewter gauntlet…), south of Key Lento.
- Nuestra Señora de la Ética Laxa — 5 treasures, south of Key Lento and Abismo Key.
- Nuestra Señora Lujuriosa — 6 treasures, by the islets south-east of Key Lento (second round of dives).
- Urca de Santa Sierra — 6 treasures, east of Key Lento (can turn up later).
Guides disagree on some positions, so check the ship name on the purple marker before you dive.

## Money and trophy
About $1,400 per wreck early on. Clear all seven wrecks and finish Kenton's last mission for the bronze trophy "This Was No Boat Accident". While you're out there, grab the Drug Mule KZ-59 near the sunken ship off the Riquezas Keys.

${payNote.en}`,
    bAr: `## كيف تفتح؟
البحث عن الكنوز يفتح بعد مهمة "Island Dreams" عند محل الغوص حق Kenton في Key Lento. أول غطسة يستخدم فيها Kenton Rees رحلة غوص لحفلة عزوبية كغطاء.

## وش تحتاج؟
عدة غوص (من Island Dreams)، قارب (حق Kenton أو Jason)، وجهاز كشف المعادن. اسبح أسرع بضغط L3 (إكس بوكس: LS) وانتبه للأكسجين.

## السفن (كلها في Mariana County)
- Nuestra Señora del Ocio — سفينة Island Dreams، فيها 10 دبلونات ذهب، شرق Key Lento بعد الجزيرة الصغيرة.
- Nuestra Señora de la Noche — 7 كنوز (شمعدان أثري، قفاز معدني…)، جنوب Key Lento.
- Nuestra Señora de la Ética Laxa — 5 كنوز، جنوب Key Lento و Abismo Key.
- Nuestra Señora Lujuriosa — 6 كنوز، عند الجزر الصغيرة جنوب شرق Key Lento (الجولة الثانية).
- Urca de Santa Sierra — 6 كنوز، شرق Key Lento (ممكن تطلع بعدين).
الأدلة مختلفة شوي في بعض الأماكن، فتأكد من اسم السفينة على العلامة البنفسجية قبل ما تغوص.

## الفلوس والكأس
حوالي 1,400$ للسفينة بالبداية. ولو خلّصت السبع سفن وآخر مهمة لـ Kenton تاخذ كأس "This Was No Boat Accident" البرونزي. وأنت هناك، خذ سلاح Drug Mule KZ-59 جنب السفينة الغارقة عند Riquezas Keys.

${payNote.ar}`,
    aliases: ["diving", "treasure", "shipwreck", "Kenton", "غطس", "كنوز", "سفن غارقة"],
    tags: ["low risk", "Keys", "trophy"],
    facts: [
      ["Unlock", "يفتح بعد", "Mission 'Island Dreams'", "مهمة Island Dreams"],
      ["Start", "البداية", "Kenton's dive shop, Key Lento", "محل Kenton، Key Lento"],
      ["Payout", "الربح", "~$1,400 / wreck early", "~1,400$ للسفينة بالبداية"],
      ["Trophy", "الكأس", "This Was No Boat Accident", "This Was No Boat Accident"],
    ],
    spots: [
      [1580, 3210, "Kenton's dive shop, Key Lento — start here", "محل Kenton للغوص في Key Lento — ابدأ من هنا"],
      [1770, 3110, "Nuestra Señora del Ocio — east of Key Lento (approx.)", "Nuestra Señora del Ocio — شرق Key Lento (تقريبي)"],
      [1580, 3340, "Nuestra Señora de la Noche — south of Key Lento (approx.)", "Nuestra Señora de la Noche — جنوب Key Lento (تقريبي)"],
      [1350, 3480, "Nuestra Señora de la Ética Laxa — south of Abismo Key (approx.)", "Nuestra Señora de la Ética Laxa — جنوب Abismo Key (تقريبي)"],
      [1730, 3320, "Nuestra Señora Lujuriosa — islets south-east of Key Lento (approx.)", "Nuestra Señora Lujuriosa — جزر جنوب شرق Key Lento (تقريبي)"],
      [1830, 3200, "Urca de Santa Sierra — east of Key Lento (approx.)", "Urca de Santa Sierra — شرق Key Lento (تقريبي)"],
      [612, 3150, "Bonus: Drug Mule KZ-59 by the sunken ship, Riquezas Keys", "إضافي: سلاح Drug Mule KZ-59 جنب السفينة الغارقة، Riquezas Keys"],
    ],
    videos: ["U9w2E9_ljgg", "6voe8JTtUhs", "JqplivDtGSg", "bfmPC43apjk"],
    related: ["kenton", "drug-mule-kz-59", "key-lento", "swim-faster-l3"],
    src: ["boomKenton", "keenKenton", "vgcMoney"],
  },
  {
    slug: "moses-car-sales",
    status: "confirmed",
    en: "Flip stolen cars to Moses (Chapter 2)",
    ar: "بيع السيارات المسروقة لـ Moses (الفصل الثاني)",
    sEn: "Moses runs Watkins Auto Parts on the outskirts of Port Gellhorn. Bring him cars without trackers — about $1,000–3,000 each.",
    sAr: "Moses عنده محل Watkins Auto Parts على أطراف Port Gellhorn. جب له سيارات بدون جهاز تتبع — حوالي 1,000 إلى 3,000$ للسيارة.",
    bEn: `## How it unlocks
After the Chapter 2 mission "Girls' Trip", Vicki tells Lucia to see Moses Watkins, a mechanic who can get her a reliable car. Finish his introductory mission and he starts buying.

## Where
Watkins Auto Parts, a garage on the outskirts of Port Gellhorn in Kelly County. Look for the Watkins and Auto Parts signs above the entrance and drive into the open garage.

## How to do it
- Steal a car that has no tracker (Moses won't take tracked cars).
- Drive it into the garage at Watkins Auto Parts.
- Collect the cash, then check his map marker — there's a cooldown between sales.
Guides say heavier pickup trucks tend to pay more. One guide says there's no daily limit, but others mention a cooldown, so follow the marker.

${payNote.en}`,
    bAr: `## كيف يفتح؟
بعد مهمة "Girls' Trip" في الفصل الثاني، Vicki تقول للوسيا تروح لـ Moses Watkins، ميكانيكي يقدر يجيب لها سيارة تعتمد عليها. خلّص مهمته الأولى ويبدأ يشتري منك.

## وين؟
Watkins Auto Parts، كراج على أطراف Port Gellhorn في Kelly County. دوّر لوحات Watkins و Auto Parts فوق المدخل وادخل بالسيارة للكراج المفتوح.

## الطريقة
- اسرق سيارة ما فيها جهاز تتبع (Moses ما ياخذ السيارات المتتبعة).
- دخّلها كراج Watkins Auto Parts.
- استلم الفلوس، وبعدين شيك علامته على الخريطة — فيه وقت انتظار بين كل بيعة.
الأدلة تقول البيك أبات الثقيلة تجيب فلوس أكثر. ودليل يقول ما فيه حد يومي، بس أدلة ثانية تذكر وقت انتظار، فامشِ على العلامة.

${payNote.ar}`,
    aliases: ["Moses", "Watkins Auto Parts", "cars", "سيارات", "موزس", "بيع سيارات"],
    tags: ["Chapter 2", "farm"],
    facts: [
      ["Where", "وين", "Watkins Auto Parts, Port Gellhorn", "Watkins Auto Parts، Port Gellhorn"],
      ["Unlock", "يفتح بعد", "Mission 'Girls' Trip' (Chapter 2)", "مهمة Girls' Trip (الفصل الثاني)"],
      ["Payout", "الربح", "~$1,000–3,000 / car", "~1,000–3,000$ للسيارة"],
      ["Rule", "الشرط", "No tracker on the car", "السيارة بدون جهاز تتبع"],
    ],
    spots: [[905, 1455, "Watkins Auto Parts (Moses) — outskirts of Port Gellhorn (approx.)", "Watkins Auto Parts (محل Moses) — أطراف Port Gellhorn (تقريبي)"]],
    videos: ["t1pw5cnFMEo"],
    related: ["moses", "high-value-heists-later-chapters", "port-gellhorn"],
    src: ["pyxMoses", "game8Moses", "vgcMoney"],
  },
  {
    slug: "protect-your-cash",
    status: "confirmed",
    en: "Don't lose it: stash cash under the floorboard, then bank it",
    ar: "لا تخسرها: خبّ الفلوس تحت أرضية الغرفة وبعدين بالبنك",
    sEn: "Pocket cash is lost if you die or get busted. Use Jason's floorboard stash, then the BuckMe account.",
    sAr: "الفلوس اللي في جيبك تروح لو مت أو انمسكت. استخدم مخبأ الأرضية في غرفة Jason، وبعدين حساب BuckMe.",
    bEn: `## Why it matters
Cash you carry is lost when you die or get busted — and early on Jason has no ATM access.

## What to do
- Early game: stash cash under the floorboard in Jason's bedroom.
- Once it unlocks: move it into the BuckMe account.
- After every big job (hideouts, heists), bank it before doing anything risky.

## Heads-up
Guides report that Chapter 1 cash does not carry over, so spend it on useful gear (weapons, armour, upgrades) before you move on.`,
    bAr: `## ليش مهم؟
الكاش اللي معك يروح لو مت أو انمسكت — وبالبداية Jason ما عنده صراف.

## وش تسوي؟
- بداية اللعبة: خبّ الكاش تحت أرضية غرفة نوم Jason.
- أول ما يفتح: انقله لحساب BuckMe.
- بعد كل شغلة كبيرة (مخابئ، سرقات) حطه بالبنك قبل أي مخاطرة.

## انتبه
الأدلة تقول إن فلوس الفصل الأول ما تنتقل للي بعده، فاصرفها على أشياء تفيدك (أسلحة، دروع، تطويرات) قبل ما تكمل.`,
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
    bEn: `## How money scales
- Chapter 1: hideouts, Donnie's packages, Kenton's dives.
- Chapter 2: car flipping to Moses.
- Chapter 3: jewellery robberies and high-end car deliveries pick up.
- Later: bank vaults are the largest payouts in the game.

## Tips
Any explosion opens a safe, so carry explosives on robberies. And bank the money straight after.

## Be careful with big claims
Some videos promise $35–60k per hour or "$1,000,000 fast" early on. We couldn't verify those figures, and some rely on exploits that may get patched.`,
    bAr: `## كيف تكبر الفلوس؟
- الفصل الأول: المخابئ، طرود Donnie، غطسات Kenton.
- الفصل الثاني: بيع السيارات لـ Moses.
- الفصل الثالث: سرقات المجوهرات وتوصيل السيارات الفخمة.
- بعدين: خزائن البنوك أكبر ربح في اللعبة.

## نصائح
أي انفجار يفتح الخزنة، فخلك شايل متفجرات في السرقات. وحط الفلوس بالبنك على طول.

## انتبه من الأرقام الكبيرة
بعض الفيديوهات توعد بـ 35 إلى 60 ألف بالساعة أو "مليون بسرعة" بالبداية. ما قدرنا نتأكد من هالأرقام، وبعضها يعتمد على قلتشات ممكن تنصلح.`,
    aliases: ["heist", "bank", "jewelry", "سرقة بنك", "مجوهرات"],
    tags: ["late game"],
    related: ["moses-car-sales", "explosions-open-safes"],
    src: ["g2aMoney", "vgcMoney"],
  },
]);
