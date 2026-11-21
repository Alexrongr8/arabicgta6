/**
 * GTA VI trophies (PS5) / achievements (Xbox Series X|S): 55 entries, same names on both.
 * Compiled from games.gg, Insider Gaming, AlcastHQ and TimeSaver (Nov 2026).
 * "story" = hidden story trophies, blurred on the page until tapped.
 */
export type Grade = "platinum" | "gold" | "silver" | "bronze";

export interface Trophy {
  name: string;
  grade: Grade;
  ar: string; // how to unlock (Arabic)
  en: string; // how to unlock (English)
  hidden?: boolean;
  story?: boolean;
  missable?: boolean;
  note?: { ar: string; en: string };
  link?: string; // related encyclopedia slug
}

export const TROPHY_VIDEOS = ["ZIzdpJHbH1I", "x6oNq3jGa_U", "QXGlbiF3zEs"];

export const TROPHY_SOURCES = [
  { title: "games.gg — complete trophy list", url: "https://games.gg/grand-theft-auto-vi/guides/complete-grand-theft-auto-6-trophy-list/" },
  { title: "Insider Gaming — complete trophy list", url: "https://insider-gaming.com/complete-gta-6-trophy-list-how-to-get-all-trophies-achievements/" },
  { title: "AlcastHQ — all 55 trophies", url: "https://alcasthq.com/gta-6-trophy-list/" },
  { title: "TimeSaver — trophy list and missable", url: "https://timesaver.gg/blog/gta-6-trophy-list" },
];

export const TROPHIES: Trophy[] = [
  { name: "Vice Got a Price!", grade: "platinum", ar: "اجمع كل الكؤوس الثانية.", en: "Earn every other trophy." },
  { name: "A Long Road", grade: "gold", ar: "وصّل إتمام اللعبة 100% (قائمة الإتمام بعد القصة).", en: "Reach 100% completion (post-story checklist)." },
  { name: "Cunning Stunts", grade: "silver", ar: "سوّ 250 حركة استعراضية (Stunt) مختلفة في Leonida.", en: "Complete 250 unique stunts." },
  { name: "The Shootist", grade: "silver", ar: "خذ ميدالية ذهبية في كل تحديات ميدان الرماية.", en: "Gold in every Shooting Range challenge." },
  { name: "Strangers & Freaks", grade: "silver", ar: "خلّص 8 قصص من مهمات الغرباء (قصص Andy و Billy و Tyrone الاختيارية ما تنحسب).", en: "Complete 8 Strangers & Freaks strands (Andy, Billy and Tyrone's optional strands don't count)." },
  { name: "Don't Touch My Deck", grade: "silver", ar: "كمّل 3 مجموعات من البطاقات القابلة للجمع.", en: "Complete 3 collectible card sets." },
  { name: "You WAiNKer!", grade: "silver", ar: "استخدم تطبيق WAiNK في 100 مكان.", en: "Use WAiNK at 100 locations.", link: "phone-apps-guide" },
  { name: "Maximum Withdrawal", grade: "silver", ar: "اسرق 5 خزائن بنوك واهرب (الخزائن تفتح بمهمة اختيارية في الفصل الرابع).", en: "Rob 5 bank vaults and escape (vaults open via an optional Chapter 4 mission).", link: "high-value-heists-later-chapters" },
  { name: "Master of None", grade: "bronze", ar: "جرّب كل نوع من الأنشطة الجانبية مرة وحدة على الأقل.", en: "Try every activity type at least once.", link: "side-activities-list" },
  { name: "Top Fun", grade: "bronze", ar: "افز بسباق درونز Top Fun في كل المواقع (14 موقع).", en: "Win a Top Fun drone race at every location (14)." },
  { name: "Earn Cash, Not Kudos", grade: "bronze", ar: "افز في 20 سباق مختلف.", en: "Win 20 different races." },
  { name: "Baited My Tackle", grade: "bronze", ar: "اغلب Cal في تحدي صيد السمك.", en: "Beat Cal in a fishing challenge.", link: "cal-hampton" },
  { name: "Stick Fiddler", grade: "bronze", ar: "خلّص لعبة أركيد.", en: "Complete an arcade game." },
  {
    name: "Positive Mental Attitude",
    grade: "bronze",
    missable: true,
    ar: "تأمّل في كل أماكن التأمل في Leonida.",
    en: "Meditate at every meditation spot in Leonida.",
    note: {
      ar: "انتبه: أغلب الأدلة تعتبره الكأس الوحيد اللي ممكن يفوت — سوّ تأمل Lucia في البلكونة بالفصل الأول قبل ما يخلص الفصل.",
      en: "Careful: most guides call this the only possibly missable trophy — do Lucia's balcony meditation in Chapter 1 before the chapter ends.",
    },
  },
  { name: "One Last Thing", grade: "bronze", ar: "خلّص 50 تحدي (Challenge).", en: "Complete 50 challenges." },
  { name: "Hot Together", grade: "bronze", ar: "اهرب من 4 نجوم مطاردة مع شريكك واطلع من منطقة البحث الحمرا.", en: "Lose a 4-star wanted level with your partner and escape the red Heat zone.", link: "wanted-level-heat-system" },
  { name: "Retail Therapy", grade: "bronze", ar: "اسرق 3 محلات ورا بعض مع شريكك والمطاردة شغالة بينها.", en: "Rob 3 shops back-to-back with your partner while the pursuit stays active." },
  { name: "Whip It Good", grade: "bronze", ar: "اكتشف 100 مركبة.", en: "Discover 100 vehicles." },
  { name: "Gunslinger", grade: "bronze", ar: "اقتل 5 أعداء بتركيز قتالي واحد (L3 + R3 / LS + RS وأنت تصوّب).", en: "Take down 5 enemies in one Combat Focus (L3 + R3 / LS + RS while aiming).", link: "focus-l3-r3-find-noise" },
  { name: "Sneakthief", grade: "bronze", ar: "اسرق محل مجوهرات بدون ما ينتبهون لك (Snap Gun من مهمات Yasmani بالفصل الثالث يفتح الباب الخلفي).", en: "Rob a jewellery store undetected (the Snap Gun from Yasmani's Chapter 3 jobs opens the back door)." },
  { name: "A Classic Blitz Play", grade: "bronze", ar: "اسرق شاحنة أموال مصفحة واهرب من منطقة البحث.", en: "Rob an armoured truck and escape the Heat zone." },
  { name: "The Goodtime State", grade: "bronze", ar: "استكشف كل Leonida.", en: "Explore all of Leonida.", link: "leonida" },
  { name: "Pest Control", grade: "bronze", ar: "اسرق مخبأ (Illegal Operation) من كل عصابة.", en: "Rob an Illegal Operation belonging to each gang.", link: "illegal-operations-gang-hideouts" },
  { name: "Dime on the Dollar", grade: "bronze", ar: "اغسل 250,000$ من الفلوس المعلّمة عند المعارف.", en: "Launder $250,000 of marked bills through contacts." },
  { name: "Treat Yo Self", grade: "bronze", ar: "اصرف 100,000$ في المحلات.", en: "Spend $100,000 across all shops." },
  { name: "Little Boxes", grade: "bronze", ar: "اشترِ الـ 8 كراجات كلها (~160,000$ بعد الخصم، التطبيق يفتح بعد مهمة Daily Driver).", en: "Buy all 8 garages (~$160,000 with the discount; app unlocks after 'Daily Driver').", link: "garages-and-properties" },
  { name: "On the Spot", grade: "bronze", ar: "سجّل 10 سيارات مع Scooter Bros (يفتح بعد مهمة Moses بالفصل الثاني).", en: "Register 10 vehicles with Scooter Bros (unlocks via Moses in Chapter 2).", link: "moses-car-sales" },
  { name: "Personal Best", grade: "bronze", hidden: true, ar: "وصّل القوة للحد الأقصى مع Jason و Lucia.", en: "Max out Strength with both Jason and Lucia.", link: "fitness-app-stats" },
  { name: "Actions Speak Louder", grade: "bronze", hidden: true, ar: "سوّ 500 تصرف يأثر على ملفك الإجرامي (Criminal Profile).", en: "Perform 500 actions that affect your Criminal Profile." },
  { name: "Catch Me If You Can", grade: "bronze", hidden: true, ar: "اسرق طيارة ركاب كبيرة واقفة على جسر صعود في مطار VCIA (مثل E3/E4)، أقلع، وابعد حوالي كيلو — الكأس يجي متأخر شوي.", en: "Steal a large passenger jet docked at a VCIA boarding bridge (e.g. E3/E4), take off and get ~1 km away — it unlocks with a delay.", link: "vice-city-international-airport" },
  { name: "In The Beginning…", grade: "bronze", hidden: true, ar: "اشرب كوكتيل مع إطلالة في Ocean Beach.", en: "Enjoy a cocktail with a view on Ocean Beach.", link: "ocean-beach" },
  { name: "Capital Offense", grade: "bronze", hidden: true, ar: "اكسر زجاج معرض سيارات واطلع منه بسيارة.", en: "Smash out of a vehicle showroom." },
  { name: "Let's Go Bowling", grade: "bronze", hidden: true, ar: "سرقة Kingpin Bowling في Port Gellhorn: خذ الساعة والشوزن ومحتوى الخزنة (0300) واهرب من الشرطة.", en: "Kingpin Bowling robbery (Port Gellhorn): take the watch, the shotgun and the safe (0300), then escape.", link: "kingpin-bowling" },
  { name: "Ten Pin", grade: "bronze", hidden: true, ar: "اطيّح قوارير بولينغ بضربة من شباك السيارة (Melee drive-by). الطريقة بالضبط لسه مو مؤكدة.", en: "Knock over bowling pins with a melee drive-by. Exact method not confirmed yet." },
  { name: "Fair Game", grade: "bronze", hidden: true, ar: "اصطد حيوان فريد لـ Bret.", en: "Hunt a unique animal for Bret.", link: "hunting-and-wildlife" },
  { name: "The Truth Is Out There", grade: "bronze", hidden: true, ar: "مرتبط بالأسرار الغريبة — أغلب اللاعبين ربطوه بالاختطاف الفضائي برا Port Gellhorn بعد 2 الفجر (غير مؤكد).", en: "Tied to the weird secrets — players link it to the UFO abduction outside Port Gellhorn after 2 a.m. (unconfirmed).", link: "ufo-abduction-port-gellhorn" },
  { name: "Bad Luck, I Guess", grade: "bronze", hidden: true, ar: "طريقة فتحه لسه مو مؤكدة.", en: "Unlock method not confirmed yet." },
  { name: "Challenging Tank", grade: "bronze", hidden: true, ar: "طريقة فتحه لسه مو مؤكدة.", en: "Unlock method not confirmed yet." },
  { name: "Just Like Paradise", grade: "bronze", hidden: true, story: true, ar: "خلّص مهمة Gone Fishing.", en: "Complete 'Gone Fishing'." },
  { name: "Paradise Lost", grade: "bronze", hidden: true, story: true, ar: "خلّص الفصل الأول.", en: "Complete Chapter 1." },
  { name: "T**s Ass Drug Money", grade: "bronze", hidden: true, story: true, ar: "خلّص الفصل الثاني.", en: "Complete Chapter 2." },
  { name: "Vice City, Baby!", grade: "bronze", hidden: true, story: true, ar: "خلّص الفصل الثالث.", en: "Complete Chapter 3." },
  { name: "Top of the World, Ma", grade: "bronze", hidden: true, story: true, ar: "خلّص الفصل الرابع.", en: "Complete Chapter 4." },
  { name: "You Gotta Know When to Get Off", grade: "gold", hidden: true, story: true, ar: "خلّص آخر مهمة في القصة.", en: "Complete the final story mission.", link: "bridge-ending-choices" },
  { name: "Trust", grade: "bronze", hidden: true, story: true, ar: "خلّص مهمة Breakfast Run.", en: "Complete 'Breakfast Run'." },
  { name: "Break the Bank", grade: "bronze", hidden: true, story: true, ar: "خلّص مهمة The Cartel Heist.", en: "Complete 'The Cartel Heist'." },
  { name: "Family Matters", grade: "bronze", hidden: true, story: true, ar: "خلّص مهمة Child's Play.", en: "Complete 'Child's Play'." },
  { name: "DWNFALL", grade: "bronze", hidden: true, story: true, ar: "خلّص مهمة Headliners.", en: "Complete 'Headliners'." },
  { name: "Hi-Jacked", grade: "bronze", hidden: true, story: true, ar: "خلّص مهمة VCIA Takedown.", en: "Complete 'VCIA Takedown'." },
  { name: "Snow Storm", grade: "bronze", hidden: true, story: true, ar: "خلّص مهمة Operation Savage Glory.", en: "Complete 'Operation Savage Glory'." },
  { name: "Road to Rehabilitation", grade: "bronze", hidden: true, story: true, ar: "خلّص آخر مهمة لـ Andy.", en: "Complete Andy's final mission." },
  { name: "This Was No Boat Accident", grade: "bronze", hidden: true, story: true, ar: "خلّص كل سفن Kenton وآخر مهمة له.", en: "Clear all of Kenton's wrecks and his final mission.", link: "kenton-treasure-dives" },
  { name: "The Lone Rider", grade: "bronze", hidden: true, story: true, ar: "خلّص آخر مهمة لـ Billy.", en: "Complete Billy's final mission." },
  { name: "Supply & Demand", grade: "bronze", hidden: true, story: true, ar: "خلّص آخر مهمة لـ Randy.", en: "Complete Randy's final mission." },
  { name: "Spin On This!", grade: "bronze", hidden: true, story: true, ar: "خلّص آخر مهمة لـ Tyrone.", en: "Complete Tyrone's final mission." },
];
