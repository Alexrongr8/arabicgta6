import { build, type SeedInput } from "./helpers";

// Short reference profiles, independently summarized from the linked gameplay records.
// Keep these distinct from the longer mission walkthroughs already in the encyclopedia.
const profiles: SeedInput[] = [
  {
    slug: "npc-mia", status: "confirmed", en: "Mia — Lucia's mother", ar: "Mia — والدة Lucia وعملها بالعقارات",
    sEn: "Lucia's mother runs a real-estate business and appears in Mami Knows Best.",
    sAr: "والدة Lucia تدير مشروعًا عقاريًا وتظهر في مهمة Mami Knows Best.",
    bEn: `Mia is Lucia's mother. Her Chapter 3 appearance connects Lucia's family to a real-estate job: in Mami Knows Best, Lucia helps with one of her properties.

The gameplay record identifies her blue car as a Declasse Akane. This profile covers her role and the associated mission without revealing the later story. NiaDB documents the scenes and links the original gameplay recordings.`,
    bAr: `Mia هي والدة Lucia، ويظهر دورها في الفصل الثالث من خلال مشروعها في العقارات. في مهمة Mami Knows Best تساعدها Lucia في أحد العقارات، فتلتقي القصة العائلية مع العمل الذي تقوم به الشخصيتان.

يسجّل دليل اللقطات أن سيارتها الزرقاء من نوع Declasse Akane. هذه بطاقة تعريف بدورها والمهمة المرتبطة بها دون كشف أحداث القصة اللاحقة؛ المصدر يربط المشاهد بتسجيلات اللعب الأصلية.`,
    aliases: ["ميا", "والدة لوسيا"], tags: ["NPC", "Chapter 3", "Mami Knows Best"],
    related: ["lucia-caminos", "story-chapters-and-missions"],
    srcUrls: [["NiaDB — Mia: gameplay scenes and missions", "https://meowdb.com/gta6/npcs/mia"]],
  },
  {
    slug: "npc-bret", status: "confirmed", en: "Bret — the hunting buyer", ar: "Bret — مشتري طرائد الصيد",
    sEn: "Jason's old army friend buys animal carcasses at Killtelligence Provisions.",
    sAr: "صديق Jason من الجيش يشتري طرائد الصيد في Killtelligence Provisions.",
    bEn: `Bret runs a meat-processing business at Killtelligence Provisions. He knows Jason from their army days, and the documented trading interaction lets Jason sell animal carcasses to him.

The character restriction matters: the source identifies this sale as Jason-only. Treat Bret as a named hunting contact, rather than assuming every shop buys wildlife. The linked gameplay record does not provide a complete price table, so check the offer shown in your own game before selling.`,
    bAr: `Bret يدير نشاطًا لتجهيز اللحوم في Killtelligence Provisions، ويعرف Jason منذ أيام الجيش. التفاعل الموثّق معه يسمح ببيع طرائد الصيد، لذلك يفيدك اسمه عندما تبحث عن جهة مرتبطة بهذا النشاط.

انتبه إلى الشخصية التي تلعب بها: البيع المذكور في المصدر خاص بـJason. لا يفترض ذلك أن جميع المحلات تشتري الحيوانات. ولا يعرض المصدر قائمة أسعار كاملة؛ راجع المبلغ الذي تظهره اللعبة قبل تأكيد البيع.`,
    aliases: ["بريت", "Killtelligence Provisions"], tags: ["NPC", "hunting"],
    related: ["jason-duval", "hunting-and-wildlife"],
    srcUrls: [["NiaDB — Bret: location and carcass trading", "https://meowdb.com/gta6/npcs/bret"]],
  },
  {
    slug: "npc-randy-kozlov", status: "confirmed", en: "Randy Kozlov — vehicle contact in Balsero", ar: "Randy Kozlov — جهة بيع المركبات في Balsero",
    sEn: "A Chapter 3 vehicle dealer associated with Car Service and a Zorrusso job.",
    sAr: "تاجر مركبات في الفصل الثالث يرتبط بمهمة Car Service وطلب سيارة Zorrusso.",
    bEn: `Randy Kozlov is a vehicle dealer and fence in Balsero. Lucia meets this line of work in Chapter 3; Car Service involves bringing him a vehicle from a Salton chop shop.

A separate request concerns a Granforma Zorrusso. Its documented lead points to Hathaway Apartments in Ocean Beach, with a key cloner provided as part of the job. Follow the active objective rather than assuming any parked Zorrusso satisfies the request.`,
    bAr: `Randy Kozlov تاجر يستقبل المركبات في Balsero، وترتبط أعماله بـLucia في الفصل الثالث. في Car Service تُنقل إليه سيارة من ورشة تفكيك في Salton.

وله طلب آخر يخص Granforma Zorrusso؛ الدليل يوثّق خيطًا يقود إلى Hathaway Apartments في Ocean Beach، مع إتاحة جهاز نسخ المفاتيح ضمن المهمة. اتبع الهدف النشط بدل افتراض أن أي سيارة من النوع نفسه تكفي لإنهاء الطلب.`,
    aliases: ["راندي كوزلوف"], tags: ["NPC", "Car Service", "Chapter 3"],
    region: "Vice City", related: ["balsero", "salton", "granforma-zorrusso"],
    srcUrls: [["NiaDB — Randy Kozlov: location and vehicle jobs", "https://meowdb.com/gta6/npcs/randy-kozlov"]],
  },
  {
    slug: "npc-yasmani", status: "confirmed", en: "Yasmani — stolen-goods buyer", ar: "Yasmani — مشتري البضائع في Little Cuba",
    sEn: "Boobie introduces Jason to this Little Cuba businessman during Boobie Time.",
    sAr: "يعرّف Boobie شخصية Jason بهذا التاجر في Little Cuba خلال Boobie Time.",
    bEn: `Yasmani buys stolen goods in Little Cuba. The documented introduction happens in Chapter 3 during Boobie Time, when Jason accompanies Boobie on payment collections.

This makes him a useful name to remember when the story opens more trading contacts. His role is goods trading, distinct from the vehicle contacts elsewhere in the encyclopedia. The source does not establish a universal sale price or an exact map coordinate; use the location and interaction shown in your game.`,
    bAr: `Yasmani تاجر يشتري البضائع المسروقة في Little Cuba. يتعرّف عليه Jason عبر Boobie في الفصل الثالث، أثناء جولة تحصيل المدفوعات في مهمة Boobie Time.

يفيدك تذكّر اسمه مع توسّع جهات التعامل في القصة. نشاطه المذكور هو شراء البضائع، وهو مختلف عن جهات بيع المركبات. المصدر لا يحدّد سعرًا ثابتًا لكل الأغراض ولا إحداثية دقيقة؛ اعتمد على موقعه والتفاعل الظاهرين في لعبتك.`,
    aliases: ["ياسماني"], tags: ["NPC", "Boobie Time", "trade"],
    region: "Vice City", related: ["little-cuba", "boobie-ike", "protect-your-cash"],
    srcUrls: [["NiaDB — Yasmani: Little Cuba trading contact", "https://meowdb.com/gta6/npcs/yasmani"]],
  },
  {
    slug: "npc-tyrone", status: "confirmed", en: "Tyrone — a work contact in Vice City", ar: "Tyrone — جهة أعمال في Vice City",
    sEn: "Boobie's contact is connected to Dealer's Choice and Destroy Synthetics Lab.",
    sAr: "أحد معارف Boobie ويرتبط بمهمتَي Dealer's Choice وDestroy Synthetics Lab.",
    bEn: `Tyrone is a local dealer and one of Boobie's contacts. Jason approaches him for work in Chapter 3, and Tyrone also contacts Jason by phone.

Dealer's Choice sends Jason to Crosstown with Dre'Quan as backup. Destroy Synthetics Lab concerns the fictional drug Kitty Litter and a lead supplied by Dook. These are in-game story objectives; this profile identifies the contact and mission names without revealing their outcomes.`,
    bAr: `Tyrone تاجر محلي ومن معارف Boobie. يبحث Jason عنده عن عمل في الفصل الثالث، كما يتلقى منه اتصالات على الهاتف.

ترتبط به Dealer's Choice التي تقود إلى Crosstown مع Dre'Quan، ومهمة Destroy Synthetics Lab المتعلقة بمادة Kitty Litter الخيالية وخيط يقدّمه Dook. هذه أهداف ضمن أحداث اللعبة؛ البطاقة تعرّفك بالشخصية وأسماء مهامها دون كشف نتائجها.`,
    aliases: ["تايرون"], tags: ["NPC", "Dealer's Choice", "Chapter 3"],
    region: "Vice City", related: ["boobie-ike", "drequan-priest", "crosstown"],
    srcUrls: [["NiaDB — Tyrone: phone contact and missions", "https://meowdb.com/gta6/npcs/tyrone"]],
  },
  {
    slug: "npc-dunk", status: "confirmed", en: "Dunk — robbery leads and trading", ar: "Dunk — معلومات عن السطو وشراء البضائع",
    sEn: "Dunk supplies in-game robbery tips and buys goods delivered to his trailer.",
    sAr: "يقدّم Dunk معلومات عن فرص داخل اللعبة ويشتري البضائع عند مقطورته.",
    bEn: `Dunk combines two roles: he supplies robbery leads and pays for goods delivered to his trailer. Documented leads mention Scattered Pines and Lost Vista.

His trading card rates narcotics and jewelry as Low, and marked bills as Very low. Those are relative in-game buying ratings, not dollar amounts. Compare the offer before selling a valuable haul; this profile does not promise that Dunk is the best-paying buyer.`,
    bAr: `يجمع Dunk بين إعطاء معلومات عن فرص السطو داخل اللعبة وشراء البضائع التي توصلها إلى مقطورته. من الأسماء الواردة في المعلومات الموثّقة Scattered Pines وLost Vista.

تُظهر بطاقة التعامل معه تقييم Low للمخدرات والمجوهرات، وVery low للأموال المعلّمة. هذه درجات شراء نسبية وليست مبالغ بالدولار. قارن العرض قبل بيع حمولة مهمة؛ لا تعني هذه البطاقة أنه المشتري الأعلى سعرًا.`,
    aliases: ["دانك"], tags: ["NPC", "trade", "robbery leads"],
    related: ["illegal-operations-gang-hideouts", "protect-your-cash"],
    srcUrls: [["NiaDB — Dunk: trading ratings and robbery leads", "https://meowdb.com/gta6/npcs/dunk"]],
  },
  {
    slug: "npc-andy", status: "confirmed", en: "Andy — Lucia's friend in the Keys", ar: "Andy — صديقة Lucia في Keys",
    sEn: "Andy works at Manatee's Rest and helps arrange clothes for Lucia's release.",
    sAr: "تعمل Andy في Manatee's Rest وتساعد في تجهيز ملابس خروج Lucia.",
    bEn: `Andy is Lucia's friend in the Keys and works at Manatee's Rest. She lends Lucia clothes for her release, coordinating the pickup with Jason by phone and text.

The gameplay record also documents Deliver Cellerica Products in Chapter 3, a Lucia-only job helping Andy's business. That character requirement is worth checking if you are looking for the task while controlling Jason. Her early introduction and later work are separate appearances.`,
    bAr: `Andy صديقة Lucia في Keys وتعمل في Manatee's Rest. تعيرها ملابس لخروجها، وتتواصل مع Jason بالاتصال والرسائل لترتيب استلامها.

يوثّق المصدر أيضًا عمل Deliver Cellerica Products في الفصل الثالث لمساعدة مشروع Andy، وهو خاص بـLucia. انتبه لهذا الشرط إذا كنت تبحث عنه وأنت تتحكم بـJason. ظهورها المبكر لتجهيز الملابس والعمل اللاحق حدثان مختلفان.`,
    aliases: ["آندي", "Manatee's Rest"], tags: ["NPC", "Deliver Cellerica Products"],
    region: "Leonida Keys", related: ["lucia-caminos", "leonida-keys", "coming-home-preparations"],
    srcUrls: [["NiaDB — Andy: location and Lucia-only work", "https://meowdb.com/gta6/npcs/andy"]],
  },
  {
    slug: "npc-shirley", status: "confirmed", en: "Shirley — Jason's neighbor", ar: "Shirley — جارة Jason وطلب Three Sheets",
    sEn: "The neighbor behind Get Shirley's Rum sends Jason to Three Sheets Liquor.",
    sAr: "جارة Jason التي تطلب منه المرور على Three Sheets Liquor في Get Shirley's Rum.",
    bEn: `Shirley asks Jason to collect her rum from Three Sheets Liquor and return it to her house. The clerk keeps her bottle of The Salty Squid behind the counter and mentions her unpaid tab.

If Jason delays, Shirley can call to follow up. Her dog is Arugula, and Peggy is the friend heard on her phone. These names help distinguish this neighborhood favor from other shop errands; no fixed cash reward is claimed here.`,
    bAr: `تطلب Shirley من Jason إحضار مشروبها من Three Sheets Liquor وإعادته إلى منزلها. يحتفظ الموظف بزجاجة The Salty Squid خلف المنضدة ويذكر حسابها غير المدفوع.

إذا تأخر Jason فقد تتصل لتسأل عن الطلب. اسم كلبها Arugula، وPeggy صديقتها التي تُسمع عبر الهاتف. تساعدك هذه التفاصيل في تمييز طلب الجارة عن المهمات الأخرى، دون افتراض مكافأة مالية ثابتة لم يذكرها المصدر.`,
    aliases: ["شيرلي", "Get Shirley's Rum"], tags: ["NPC", "favor", "Three Sheets Liquor"],
    region: "Leonida Keys", related: ["jason-duval", "key-lento"],
    srcUrls: [["NiaDB — Shirley: the Three Sheets favor", "https://meowdb.com/gta6/npcs/shirley"]],
  },
  {
    slug: "npc-mandy", status: "confirmed", en: "Mandy — the tenant in Pipework", ar: "Mandy — المستأجرة في مهمة Pipework",
    sEn: "Brian's tenant asks Jason to repair her sink before sending the rent.",
    sAr: "مستأجرة لدى Brian تطلب إصلاح المغسلة قبل إرسال الإيجار.",
    bEn: `Mandy rents a property from Brian. In Pipework, Jason has to repair her sink before she sends the rent, making a maintenance complaint part of his collection work.

Her dialogue includes complaints about paying rent by hand and about her neighbor Bert. The useful distinction is the task itself: this encounter is tied to Brian's rental property, rather than a general repair service Jason offers throughout the map.`,
    bAr: `Mandy مستأجرة لدى Brian. في مهمة Pipework يطلب منها Jason الإيجار، لكنها تريد إصلاح المغسلة أولًا؛ وبعد إنجاز الإصلاح ترسل المبلغ.

يتضمن حوارها تذمّرًا من دفع الإيجار يدويًا ومن جارها Bert. المهم لتعرّف المشهد هو ارتباطه بعقار Brian وعمل تحصيل الإيجار؛ وليس دليلًا على وجود خدمة إصلاح عامة ينفذها Jason في جميع أنحاء الخريطة.`,
    aliases: ["ماندي"], tags: ["NPC", "Pipework"],
    related: ["brian-heder", "jason-duval"],
    srcUrls: [["NiaDB — Mandy: the Pipework encounter", "https://meowdb.com/gta6/npcs/mandy"]],
  },
  {
    slug: "npc-joey", status: "confirmed", en: "Joey — Coastal Auto Care mechanic", ar: "Joey — ميكانيكي Coastal Auto Care",
    sEn: "The mechanic connected to Jason's Ganado, repairs, delivery and vehicle upgrades.",
    sAr: "الميكانيكي المرتبط بسيارة Ganado لدى Jason وإصلاحها وتوصيلها وتعديلها.",
    bEn: `Joey runs Coastal Auto Care. His introduction connects Cal's recommendation, Jason's Ganado and work charged to Brian's account.

The recorded interactions include calling Joey for repair or delivery, plus engine, intake, transmission and boost upgrades at the garage. He also mentions towing. For the practical phone steps, open the linked car-delivery guide; this profile identifies who Joey is and where his services come from, without promising every future repair is free.`,
    bAr: `Joey يدير Coastal Auto Care. التعارف معه يربط توصية Cal بسيارة Ganado الخاصة بـJason، وبأعمال تُسجّل على حساب Brian.

تتضمن التفاعلات الموثّقة الاتصال للإصلاح أو التوصيل، وتعديلات المحرك وسحب الهواء وناقل الحركة والتعزيز في الورشة، مع ذكر خدمة السحب. لخطوات استخدام الهاتف افتح دليل توصيل السيارة المرتبط؛ هذه البطاقة تعرّف بالشخصية دون ضمان مجانية جميع الإصلاحات لاحقًا.`,
    aliases: ["جوي", "Coastal Auto Care"], tags: ["NPC", "mechanic", "Ganado"],
    related: ["call-joey-free-car-delivery", "cal-hampton", "brian-heder"],
    srcUrls: [["NiaDB — Joey: garage, repairs and contact", "https://meowdb.com/gta6/npcs/joey"]],
  },
  {
    slug: "npc-stefanie-gates", status: "confirmed", en: "Stefanie Gates — Lucia's counselor", ar: "Stefanie Gates — المرشدة التي تقابل Lucia",
    sEn: "The counselor at Hamlet Correctional discusses a supervised-release program.",
    sAr: "مرشدة Hamlet Correctional التي تناقش برنامج الإفراج الخاضع للمراقبة.",
    bEn: `Stefanie Gates meets Lucia during the Prologue at Hamlet Correctional. Their conversation concerns Lucia's arrest and a possible early-release trial.

The program described in the scene involves home detention with electronic monitoring. It is a story detail, not a player-facing guide to unlocking release through a menu. Gates is a counselor, distinct from the corrections officers and other inmates Lucia meets in the opening section.`,
    bAr: `تقابل Stefanie Gates شخصية Lucia في المقدمة داخل Hamlet Correctional. يدور الحديث حول اعتقال Lucia واحتمال إدخالها في برنامج للإفراج المبكر.

البرنامج الذي يصفه المشهد يتضمن الإقامة المنزلية مع مراقبة إلكترونية. هذه معلومة عن سياق القصة، وليست خطوات لفتح الإفراج من قائمة في اللعبة. Gates مرشدة، وهي شخصية مختلفة عن الضباط والسجينات الذين يظهرون في البداية.`,
    aliases: ["ستيفاني غيتس", "Stefanie"], tags: ["NPC", "Prologue", "Hamlet Correctional"],
    related: ["lucia-caminos", "hamlet", "story-chapters-and-missions"],
    srcUrls: [["NiaDB — Stefanie Gates: Prologue counselor", "https://meowdb.com/gta6/npcs/stefanie-gates"]],
  },
  {
    slug: "npc-yago", status: "confirmed", en: "Yago — the Little Cuba street racer", ar: "Yago — متسابق الشوارع في Little Cuba",
    sEn: "A street racer who asks Jason for mentoring at his restaurant.",
    sAr: "متسابق شوارع يطلب إرشاد Jason عند مطعمه في Little Cuba.",
    bEn: `Yago is a street racer associated with the Mentor Yago objective. Jason can meet him at his restaurant in Little Cuba, where the interaction leads into showing him how to drive.

Use the name and neighborhood to distinguish this contact from vehicle buyers or modification shops. The documented profile does not specify a car reward or a fixed payout, so those should not be assumed from the mentoring objective alone.`,
    bAr: `Yago متسابق شوارع يرتبط بهدف Mentor Yago. يمكن لـJason مقابلته عند مطعمه في Little Cuba، ويتجه الحوار إلى طلب أن يريه Jason طريقة القيادة.

استخدم الاسم والحي للتمييز بين هذا الشخص وتجار المركبات أو ورش التعديل. البطاقة الموثّقة لا تحدد سيارة تُمنح كمكافأة ولا مبلغًا ثابتًا، لذلك لا تفترض وجود هذه الجوائز لمجرد ظهور هدف الإرشاد.`,
    aliases: ["ياغو", "Mentor Yago"], tags: ["NPC", "street racing"],
    region: "Vice City", related: ["little-cuba", "jason-duval", "side-activities-list"],
    srcUrls: [["NiaDB — Yago: Little Cuba mentoring contact", "https://meowdb.com/gta6/npcs/yago"]],
  },
];

export default build("characters", profiles.map((profile) => ({ ...profile, date: "2026-11-21T20:25:00Z" })));
