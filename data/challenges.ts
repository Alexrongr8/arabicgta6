/** Weekly challenges — one is picked per week (Riyadh time). Each links to the guide that helps. */
export interface Challenge {
  ar: string;
  en: string;
  hintAr: string;
  hintEn: string;
  link?: string;
}

export const CHALLENGES: Challenge[] = [
  { ar: "لاقِ الـ Skunk Ape وصوّره", en: "Find the Skunk Ape and photograph it", hintAr: "ابدأ مهمة Kirk قرب بحيرة Cottonmouth جنوب Hamlet.", hintEn: "Start Kirk's quest near Cottonmouth Lake, south of Hamlet.", link: "skunk-ape-mr-mangrove" },
  { ar: "اجمع 10,000$ من مخابئ العصابات بدون ما تموت", en: "Earn $10,000 from gang hideouts without dying", hintAr: "ابدأ بـ Little Cuba و Port Gellhorn، وحط فلوسك بالبنك بعد كل مخبأ.", hintEn: "Start in Little Cuba and Port Gellhorn and bank your cash after each one.", link: "illegal-operations-gang-hideouts" },
  { ar: "خلّص سفينة Nuestra Señora de la Noche كاملة", en: "Clear the Nuestra Señora de la Noche wreck", hintAr: "7 كنوز جنوب Key Lento — اسبح أسرع بـ L3 / LS.", hintEn: "7 treasures south of Key Lento — swim faster with L3 / LS.", link: "kenton-treasure-dives" },
  { ar: "انتظر الصحن الطائر برا Port Gellhorn", en: "Wait for the UFO outside Port Gellhorn", hintAr: "بعد الساعة 2 الفجر في اللعبة، دوّر السيارة المهجورة والضوء الأزرق.", hintEn: "After 2 a.m. in-game, look for the abandoned car and the blue light.", link: "ufo-abduction-port-gellhorn" },
  { ar: "اهرب من 4 نجوم مع شريكك", en: "Escape a 4-star wanted level with your partner", hintAr: "اختفِ عن نظرهم، غيّر لبسك، واطلع من المنطقة الحمرا — وتاخذ كأس Hot Together.", hintEn: "Break line of sight, change clothes, leave the red zone — and earn Hot Together.", link: "wanted-level-heat-system" },
  { ar: "افتح 3 خزن بأرقامها بدون تفجير", en: "Open 3 safes with their codes, no explosives", hintAr: "جرّب Kingpin Bowling ‏0300 و Brian's Lockup ‏7700.", hintEn: "Try Kingpin Bowling 0300 and Brian's Lockup 7700.", link: "safe-codes-list" },
  { ar: "بيع 5 سيارات لـ Moses بيوم واحد", en: "Sell 5 cars to Moses in one in-game day", hintAr: "البيك أبات الثقيلة تجيب أكثر، وتأكد ما فيها تتبع (افحصها بـ WAiNK).", hintEn: "Heavy pickups pay more; scan with WAiNK to avoid trackers.", link: "moses-car-sales" },
  { ar: "اطلع فوق أطول برج راديو وارمِ البيضة", en: "Climb the tallest radio tower and throw the egg", hintAr: "الطلعة 7 دقايق تقريباً — ولا تطيح!", hintEn: "About a 7-minute climb — don't fall!", link: "radio-tower-easter-egg" },
  { ar: "اجمع الأسلحة الفريدة المجانية الأربعة", en: "Collect the four free unique weapons", hintAr: "مسدس Donnie (يفوت!)، شوزن Hamlet Storage، Drug Mule تحت الماء، و Gutterball في البولينغ.", hintEn: "Donnie's .38 (missable!), the Hamlet Storage shotgun, the underwater Drug Mule and the Gutterball.", link: "early-unique-weapons-route" },
  { ar: "اكسب 20 سباق مختلف", en: "Win 20 different races", hintAr: "يعطيك كأس Earn Cash, Not Kudos ويطوّر سيارتك.", hintEn: "Unlocks Earn Cash, Not Kudos and upgrades your car.", link: "side-activities-list" },
  { ar: "اغلب Cal في الصيد", en: "Beat Cal at fishing", hintAr: "الصيد بعد يدرّب التركيز (+10 لكل صيدة).", hintEn: "Fishing also trains Focus (+10 per catch).", link: "cal-hampton" },
  { ar: "لاقِ التمساح الألبينو", en: "Find the albino alligator", hintAr: "دوّر في المستنقعات قرب مكان الصيد في Hamlet.", hintEn: "Search the wetlands near the Hamlet fishing spot.", link: "hunting-and-wildlife" },
];
