// Research expansion reviewed against primary sources on 2026-11-21.
// Intended destination: data/seed/content-expansion.ts. No database writes here.
// Platform guides explicitly describe console features, not unverified GTA VI menus.
import { build, type SeedInput } from "./helpers";
import { officialRemotePlayAddition } from "./remote-play-experiment";
import type { CategorySlug } from "../../src/lib/types";

type ResearchEntry = SeedInput & { category: CategorySlug };

const entries: ResearchEntry[] = [
  {
    category: "news", slug: "gta-vi-the-album-34-original-songs", status: "official",
    en: "GTA VI: The Album — the official collection of 34 original songs",
    ar: "ألبوم GTA VI الرسمي: 34 أغنية أصلية خارج اللعبة",
    sEn: "Rockstar announced the album's availability on November 20. Here is how it differs from the score and the in-game radio library.",
    sAr: "أعلنت Rockstar توفر الألبوم يوم 20 نوفمبر. هذا الفرق بينه وبين الموسيقى التصويرية ومحطات الراديو داخل اللعبة.",
    bEn: `Rockstar's November 20 announcement confirms that Grand Theft Auto VI: The Album is available with 34 original songs. It can be streamed through major music services, with vinyl and CD editions linked from the official release page.

Treat The Album, the original score, and the complete in-game radio selection as different collections. Finding a track on one release does not establish that every radio song is included there.

For listening, start with the official announcement and follow its music-service link. For identifying something heard while playing, note the station, artist display, and scene before searching. This makes it easier to distinguish a commercial song from instrumental background music.

This entry concerns the external music release. It does not grant streaming or re-upload rights to the songs, and no purchase is needed to read the game's music information.`,
    bAr: `أكدت Rockstar في إعلان 20 نوفمبر توفر Grand Theft Auto VI: The Album، الذي يجمع 34 أغنية أصلية. يمكن الاستماع إليه عبر خدمات الموسيقى الرئيسية، وتوجد نسخ على الفينيل والأقراص المدمجة من الروابط الموجودة في الإعلان الرسمي.

عند البحث عن أغنية سمعتها أثناء اللعب، فرّق بين ألبوم الأغاني والموسيقى التصويرية الأصلية وقائمة محطات الراديو الكاملة. هذه مجموعات مختلفة؛ وجود أغنية في أحدها لا يعني أن الألبوم يحتوي كل ما يمكن سماعه داخل اللعبة.

للوصول إلى النسخة الصحيحة، افتح إعلان Rockstar واتبع رابط خدمة الاستماع التي تستخدمها. وإذا كنت تحاول تحديد مقطع بعينه، دوّن اسم المحطة واسم الفنان إن ظهر، والوقت أو المشهد الذي سمعته فيه. هذه الملاحظات تساعدك في التمييز بين الأغنية التجارية والمقطوعة الخلفية.

هذه الصفحة عن إصدار الموسيقى خارج اللعبة. وجود الأغنية في الألبوم لا يمنح تلقائيًا حق إعادة رفعها كاملة أو استخدامها في بث، ولا تحتاج إلى شراء الألبوم حتى تطّلع على معلومات موسيقى اللعبة.`,
    aliases: ["GTA VI The Album", "ألبوم جي تي اي", "ساوندتراك"], tags: ["music", "official", "soundtrack"],
    related: ["gta-vi-original-score-justice", "radio-stations-guide"],
    facts: [["Tracks", "عدد الأغاني", "34 original songs", "34 أغنية أصلية"], ["Announcement", "الإعلان", "20 November 2026", "20 نوفمبر 2026"]],
    srcUrls: [["Rockstar — The Album Now Available", "https://www.rockstargames.com/newswire/article/k4a8955a93o747/grand-theft-auto-vi-the-album-now-available"]],
    date: "2026-11-20T15:00:00Z",
  },
  {
    category: "news", slug: "gta-vi-original-score-justice", status: "official",
    en: "Justice's GTA VI original score: a separate album scheduled for December 11",
    ar: "موسيقى GTA VI التصويرية من Justice: ألبوم مستقل مقرر في 11 ديسمبر",
    sEn: "The dynamic instrumental score has its own release, separate from the 34-song soundtrack album.",
    sAr: "للموسيقى التي ترافق الأحداث إصدار مستقل، يختلف عن ألبوم الأغاني ذي 34 مقطعًا.",
    bEn: `Rockstar identifies the French duo Justice as the composers of GTA VI's adaptive original score. Its separate album is scheduled for December 11, 2026, with 30 tracks and digital bonus material. That date is still in the future as of this entry's November 21 review.

An adaptive score responds to how a scene is playing out. A soundtrack album is a fixed listening sequence, so the album arrangement should not be treated as a timing guide for a mission or encounter.

Use the official Music page to distinguish released singles from the full upcoming album. If a fan upload claims to contain the complete score, compare the release date and publisher before treating it as the official edition.

For a spoiler-light listen, stay with the officially released singles and avoid videos that combine music with late-story footage. No mission outcomes are needed to enjoy the music.`,
    bAr: `تذكر Rockstar أن الثنائي الفرنسي Justice ألّف الموسيقى التصويرية المتكيفة مع الأحداث في GTA VI. ولها ألبوم مستقل مقرر يوم 11 ديسمبر 2026، يضم 30 مقطوعة ومحتوى رقميًا إضافيًا. موعد الألبوم لم يأتِ بعد عند مراجعة هذه الصفحة في 21 نوفمبر.

الموسيقى المتكيفة تتغيّر تبعًا لسير المشهد، بينما يمنحك الألبوم ترتيبًا ثابتًا للاستماع. لذلك لا تستخدم ترتيب المقاطع في الألبوم كدليل على ترتيب المهمات، أو كإشارة مؤكدة إلى توقيت حدث داخل القصة.

افتح قسم Music في موقع اللعبة للتمييز بين المقاطع المنفردة المتاحة حاليًا والألبوم الكامل المنتظر. وإذا وجدت رفعًا من أحد المعجبين بعنوان «الموسيقى الكاملة»، راجع تاريخ الإصدار والناشر قبل اعتباره النسخة الرسمية.

وللاستماع بدون حرق كبير، اكتفِ بالمقاطع التي نُشرت رسميًا، وتجنب الفيديوهات التي تضع الموسيقى فوق مشاهد من مراحل متقدمة. معرفة نتائج المهمات ليست شرطًا للاستمتاع بالموسيقى، كما أن ألبوم Justice يختلف عن ألبوم الأغاني وعن مكتبة الراديو الكاملة داخل اللعبة.`,
    tags: ["music", "Justice", "official"], aliases: ["Justice", "جستس", "Original Score"],
    related: ["gta-vi-the-album-34-original-songs", "gta-vi-launch-trailer-october-2026"],
    facts: [["Composer", "الملحّن", "Justice", "Justice"], ["Scheduled release", "الإصدار المقرر", "11 December 2026", "11 ديسمبر 2026"]],
    srcUrls: [["Rockstar — Original Score by Justice", "https://www.rockstargames.com/newswire/article/39ak8a12395591/grand-theft-auto-vi-original-score-by-justice"], ["Rockstar — GTA VI Music", "https://www.rockstargames.com/VI/music"]],
    date: "2026-10-29T15:00:00Z",
  },
  {
    category: "news", slug: "gta-vi-festival-miami-november-2026", status: "official",
    en: "GTA VI: The Festival — Rockstar's Miami launch music event",
    ar: "مهرجان GTA VI في ميامي: احتفال موسيقي بإطلاق اللعبة",
    sEn: "The official event is scheduled for November 21 at Mana Wynwood, with Rockstar and PlayStation presenting.",
    sAr: "الحدث الرسمي مقرر في Mana Wynwood يوم 21 نوفمبر، بتقديم Rockstar وPlayStation.",
    bEn: `Rockstar announced GTA VI: The Festival for November 21, 2026, at Mana Wynwood in Miami. Presented with PlayStation, the event brings performers connected to the game's music and official soundtrack to two stages.

This is a real-world launch celebration, not an event marker or activity that automatically appears in your GTA VI save. The announcement lists acts including Justice, Cardi B, Metro Boomin, and performers from the Cactus Jack lineup.

Use the official event page for current timing and access information. The original ticket lottery dates have already passed; an old announcement is not evidence that tickets are still available. This article does not claim that a livestream or replay is available unless one is linked by the organizers.

If you are documenting the event for the community, separate an artist's confirmed appearance from audience-shot clips or rumors about surprise guests.`,
    bAr: `أعلنت Rockstar عن GTA VI: The Festival في Mana Wynwood بمدينة ميامي، بتاريخ 21 نوفمبر 2026. يُقدَّم الحدث بالشراكة مع PlayStation، ويجمع فنانين مرتبطين بموسيقى اللعبة وألبومها الرسمي على مسرحين.

هذا احتفال حقيقي خارج اللعبة، وليس علامة على الخريطة أو نشاطًا يظهر تلقائيًا داخل ملف الحفظ. يتضمن الإعلان أسماء مثل Justice وCardi B وMetro Boomin، إضافة إلى فنانين من مجموعة Cactus Jack.

للتفاصيل الحالية، اعتمد صفحة المهرجان الرسمية. مواعيد قرعة التذاكر الواردة في الإعلان الأول انتهت بالفعل، فلا تعتبر وجود الإعلان دليلًا على توفر التذاكر الآن. وكذلك لا تفترض وجود بث مباشر أو تسجيل كامل إلا إذا نشر المنظمون رابطًا واضحًا له.

إذا كنت تتابع الحدث وتشارك أخباره مع المجتمع، اذكر تاريخ المقطع ومصدره، وافصل بين الأسماء المؤكدة والمقاطع المصورة من الجمهور والشائعات عن ضيوف مفاجئين. بهذه الطريقة تبقى أخبار الاحتفال منفصلة عن الإعلانات التي تخص تحديثات اللعبة أو محتواها.`,
    tags: ["music", "event", "Miami"], aliases: ["The Festival", "مهرجان GTA", "Mana Wynwood"],
    related: ["gta-vi-the-album-34-original-songs", "gta-vi-original-score-justice"],
    srcUrls: [["Rockstar — GTA VI: The Festival", "https://www.rockstargames.com/newswire/article/o39o87a435a25a/grand-theft-auto-vi-the-festival"], ["Official festival page", "https://www.rockstargames.com/VI/gtavi-thefestival"]],
    date: "2026-11-09T15:00:00Z",
  },
  {
    category: "news", slug: "gta-vi-extended-look-august-2026", status: "official",
    en: "An Extended Look: where to watch Rockstar's longer GTA VI presentation",
    ar: "العرض المطوّل لـGTA VI: أين تشاهده من المصدر الرسمي؟",
    sEn: "Rockstar's August 27 presentation was captured from the PS5 version and is available through its official channels.",
    sAr: "عرض Rockstar المنشور في 27 أغسطس التُقط من نسخة PS5، ويمكن الوصول إليه عبر قنوات الشركة الرسمية.",
    bEn: `Grand Theft Auto VI: An Extended Look was released on August 27, 2026. Rockstar states that the presentation was captured entirely from in-game footage on PlayStation 5. Its announcement links viewers to the official GTA VI site and YouTube channel after the initial Netflix showing.

This longer presentation is a separate release from Trailer 1, Trailer 2, and the launch trailer. When discussing a detail, name the video and include a timestamp so other readers can examine the same shot.

Visible footage can support an observation about that scene. It cannot by itself prove a hidden mechanic, an exact map coordinate, or the performance of every console model. Mark those extra interpretations as analysis.

For a spoiler-light first visit, use the official presentation rather than compilations that mix trailers with post-launch story scenes.`,
    bAr: `نُشر Grand Theft Auto VI: An Extended Look يوم 27 أغسطس 2026. وتقول Rockstar إن العرض التُقط بالكامل من داخل اللعبة على PlayStation 5. يوجّه الإعلان إلى موقع GTA VI وقناة الشركة الرسمية على YouTube، بعد العرض الأول عبر Netflix.

هذا إصدار مستقل عن التريلر الأول والثاني وعن تريلر الإطلاق. لذلك، إذا كنت تناقش تفصيلًا رأيته، اذكر اسم الفيديو مع توقيت المشهد. بهذه الطريقة يستطيع القارئ الرجوع إلى اللقطة نفسها بدل مقارنة مقطعين مختلفين أو نسخة معدلة من أحد المعجبين.

اللقطة المرئية تصلح لإثبات ما يظهر في ذلك المشهد، لكنها لا تثبت وحدها آلية مخفية أو إحداثيات دقيقة أو أداء جميع أجهزة الكونسول. أي استنتاج إضافي من هذه الأنواع يحتاج توضيحًا بأنه تحليل ومصدرًا مستقلًا عند توفره.

وللمشاهدة مع حرق أقل، استخدم العرض الرسمي مباشرة. بعض فيديوهات التجميع تخلط التريلرات بمشاهد من القصة بعد الإطلاق، حتى عندما يحمل عنوانها اسم العرض الرسمي نفسه.`,
    aliases: ["An Extended Look", "العرض المطول", "Netflix"], tags: ["official", "video", "PS5"],
    related: ["trailer-1-december-2023", "trailer-2-may-2025", "gta-vi-launch-trailer-october-2026"],
    srcUrls: [["Rockstar — An Extended Look, Now Playing", "https://www.rockstargames.com/newswire/article/4k138k8okkk483/grand-theft-auto-vi-an-extended-look-now-playing"]],
    date: "2026-08-27T21:00:00Z",
  },
  {
    category: "news", slug: "gta-vi-launch-trailer-october-2026", status: "official",
    en: "GTA VI's launch trailer: the October 15 official video",
    ar: "تريلر إطلاق GTA VI: الفيديو الرسمي المنشور في 15 أكتوبر",
    sEn: "A separate trailer in the official video timeline, useful when checking whether a shared scene came from Rockstar.",
    sAr: "إصدار مستقل ضمن تسلسل الفيديوهات الرسمية، يفيد عند التحقق من أصل لقطة متداولة.",
    bEn: `Rockstar published the GTA VI launch trailer announcement on October 15, 2026. It belongs to the final pre-release marketing period and is separate from the 2023 first trailer, the May 2025 second trailer, and August 2026's Extended Look.

Use the announcement's official video link when comparing a shared clip. Keep the timestamp and compare several seconds before and after the claimed detail: a single cropped frame can lose important context.

The video is a promotional edit, not a complete mission walkthrough. Editing choices do not establish the order in which every scene happens during play. Likewise, the soundtrack used over a montage is not proof that the same music plays at that moment in the game.

If you want to avoid story hints entirely, use the technical setup guides instead and save the trailer for after your first sessions.`,
    bAr: `نشرت Rockstar إعلان تريلر إطلاق GTA VI يوم 15 أكتوبر 2026. وهو فيديو مستقل من المرحلة الأخيرة للترويج قبل الإصدار، ويختلف عن التريلر الأول المنشور في 2023 والثاني في مايو 2025 والعرض المطوّل في أغسطس 2026.

عندما تريد مقارنة لقطة متداولة، افتح الفيديو من إعلان الشركة نفسه. احتفظ بتوقيت المشهد، وشاهد الثواني التي تسبقه وتليه. الاقتصاص قد يزيل جزءًا من السياق، كما أن اختلاف العنوان في فيديو أعاد أحدهم رفعه لا يجعل اللقطة إعلانًا جديدًا.

الفيديو مونتاج ترويجي، وليس شرحًا كاملًا لمهمة. ترتيب مشاهده لا يثبت ترتيب حدوثها أثناء اللعب، والموسيقى الموضوعة فوق المونتاج لا تثبت أن الأغنية نفسها تعمل في تلك اللحظة داخل اللعبة.

يمكن استخدام هذا المدخل كمرجع زمني للفيديو الرسمي عند مشاركة الاكتشافات. وإذا كنت تتجنب تلميحات القصة بالكامل، ابدأ بأدلة تجهيز الجهاز واحتفظ بمشاهدة التريلر إلى ما بعد جلساتك الأولى.`,
    aliases: ["Launch Trailer", "تريلر الإطلاق", "Trailer 3"], tags: ["video", "official"],
    related: ["gta-vi-extended-look-august-2026", "trailer-2-may-2025"],
    srcUrls: [["Rockstar — Watch the GTA VI Launch Trailer", "https://www.rockstargames.com/newswire/article/517572321a549a/watch-the-grand-theft-auto-vi-launch-trailer"]],
    date: "2026-10-15T15:00:00Z",
  },
  {
    category: "news", slug: "gta-vi-official-launch-screenshot-gallery", status: "official",
    en: "The official GTA VI launch gallery: a reference for authentic screenshots",
    ar: "معرض صور إطلاق GTA VI الرسمي: مرجع للقطات الأصلية",
    sEn: "Rockstar released a new screenshot collection on November 5, covering Vice City and locations beyond it.",
    sAr: "نشرت Rockstar مجموعة صور جديدة في 5 نوفمبر، تعرض Vice City ومناطق أخرى من عالم اللعبة.",
    bEn: `Rockstar opened its GTA VI launch gallery on November 5, 2026. The collection presents official screenshots of Vice City and the surrounding world and is linked directly from the game's site.

It is a useful starting point when checking whether a screenshot is official, especially if a social post has removed the source or added a misleading caption. Compare the actual image with the gallery, rather than relying only on a Rockstar logo pasted over it.

For community discoveries, retain the source-page link and explain what you observed. A vehicle appearing in a screenshot can establish its appearance in that image; it does not establish its price, top speed, or purchase location.

If you use a screenshot as a reference for a catalog entry, identify that purpose and keep any uncertain identification explicit. Avoid treating a nearby vehicle or a generic city image as a specific item's photograph.`,
    bAr: `افتتحت Rockstar معرض صور إطلاق GTA VI يوم 5 نوفمبر 2026. يعرض صورًا رسمية لمدينة Vice City ومناطق أخرى من العالم، ويمكن الوصول إليه من موقع اللعبة وإعلان الشركة.

هذا مرجع مناسب عندما تريد معرفة هل الصورة المتداولة رسمية فعلًا، خصوصًا إذا حُذف مصدرها أو أضيف إليها عنوان مضلل. قارن الصورة نفسها بما في المعرض؛ وضع شعار Rockstar فوق صورة لا يكفي لإثبات أصلها.

عند إرسال اكتشاف للمجتمع، احتفظ برابط صفحة المصدر واكتب ما الذي لاحظته بالضبط. ظهور سيارة في لقطة يثبت وجودها في تلك الصورة، لكنه لا يحدد وحده سعرها أو سرعتها القصوى أو مكان شرائها داخل اللعبة.

وإذا استُخدمت الصورة في الكتالوج، ينبغي أن يكون العنصر المقصود ظاهرًا ويمكن التعرف عليه. صورة عامة للمدينة، أو مركبة أخرى تقف بجوار العنصر، لا تصبح صورة دقيقة له. استخدم المعرض للرجوع إلى اللقطات الأصلية، مع إبقاء أي تسمية غير محسومة واضحة للقارئ.`,
    aliases: ["Launch Gallery", "صور رسمية", "سكرين شوت"], tags: ["official", "screenshots"],
    related: ["vice-city", "gta-vi-extended-look-august-2026"],
    srcUrls: [["Rockstar — Explore the Launch Gallery", "https://www.rockstargames.com/newswire/article/39ak81277255o9/explore-the-grand-theft-auto-vi-launch-gallery"], ["Rockstar — Launch Gallery", "https://www.rockstargames.com/VI/launch-gallery"]],
    date: "2026-11-05T15:00:00Z",
  },
  {
    category: "money", slug: "buckme-account-full-story-upgrades", status: "official",
    en: "BuckMe account full? The limit increases with story progress",
    ar: "حساب BuckMe امتلأ؟ حد الإيداع يرتفع مع تقدم القصة",
    sEn: "Rockstar explains why Checking and Family Savings can stop accepting money, and what happens to pending payments.",
    sAr: "توضح Rockstar سبب توقف الحساب الجاري والادخار العائلي عن استقبال المال، وما يحدث للدفعات المعلقة.",
    bEn: `Rockstar says BuckMe Checking and Family Savings limits increase with story progress. Payments blocked by a full Checking account are processed after its upgrade. The support article does not name a mission or give stage-by-stage limits.

Before treating this as a missing-money bug, record the account name, displayed balance, and any pending-payment message. Continue the main story, then check the account again when an upgrade becomes available. Keep the before-and-after information if the expected payment still does not arrive.

There is no need to guess an exploit or overwrite a save to follow the documented fix. A report to support is clearer when it states whether the issue is a full account, a transfer refusal, or a payment that remains missing after an upgrade.`,
    bAr: `توضح Rockstar أن حدود الحساب الجاري Checking والادخار العائلي Family Savings في BuckMe ترتفع مع تقدم القصة، وأن الدفعات المعلقة بسبب امتلاء الحساب الجاري تُعالج بعد ترقيته. لا تسمي صفحة الدعم مهمة محددة ولا تعطي سقفًا رقميًا لكل مرحلة.

قبل اعتبار المشكلة اختفاءً للمال، دوّن اسم الحساب والرصيد الظاهر ونص رسالة الدفعة المعلقة. أكمل القصة الرئيسية، ثم راجع الحساب عندما تصبح الترقية متاحة. إذا لم تصل الدفعة بعد ذلك، احتفظ بالمعلومات التي سجلتها للمقارنة.

- حدّد هل المشكلة في الحساب الجاري أم الادخار العائلي.
- صوّر الرسالة التي تمنع التحويل، بدون تغيير ملفات الحفظ.
- راجع الحساب بعد الترقية بدل تكرار العملية بلا معلومات جديدة.
- إذا استمر الخلل، اشرح للدعم الفرق بين امتلاء الحساب ورفض التحويل وتأخر دفعة بعد الترقية.

اتباع هذا المسار لا يحتاج تجربة قلتش أو استبدال ملف الحفظ. كما أنه يفصل المشكلة الموثقة عن شائعات طرق رفع السقف فورًا.`,
    aliases: ["BuckMe", "بك مي", "الحساب ممتلئ", "Checking", "Family Savings"], tags: ["money", "bank", "official-support"],
    related: ["protect-your-cash", "story-chapters-and-missions"],
    srcUrls: [["Rockstar Support — BuckMe account limits", "https://support.rockstargames.com/articles/5hSbxodEFeNbU1wARy1p4X/cannot-put-any-more-money-in-my-buckme-account-in-grand-theft-auto-vi"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "gta-vi-settings-menu-navigation-guide", status: "official",
    en: "Find the right GTA VI setting: controls, readability, camera, and audio",
    ar: "وين تلقى الإعداد المطلوب في GTA VI؟ التحكم والوضوح والكاميرا والصوت",
    sEn: "Find controls, readability, camera, and audio settings from the pause menu.",
    sAr: "دليل أقسام الإعدادات للوصول إلى خيارات التحكم والواجهة والكاميرا والصوت.",
    bEn: `Rockstar's settings guide directs players to Pause Menu > Settings. Controller contains sensitivity and inverted controls; UI contains readability and subtitle options; Camera covers camera behavior; Audio contains sound setup and volume controls.

A practical setup sequence is to address one problem at a time. If reading is difficult, begin with UI. If movement feels uncomfortable, inspect Camera. If turning or aiming is awkward, inspect Controller rather than changing unrelated display settings.

Before editing, capture the current values. Make one adjustment, test in a familiar low-pressure area, then decide whether it helped. Keep separate notes for on-foot movement, driving, and aiming instead of assuming a single value will suit every activity.

Rockstar also documents reset options at the bottom of the settings screen. Read which settings a reset affects before using it. This guide is a navigation aid, not a claim that a particular sensitivity, language, or graphics mode exists on every platform or is best for every player.`,
    bAr: `توضح صفحة دعم Rockstar أن الوصول يبدأ من قائمة الإيقاف Pause Menu ثم Settings. قسم Controller يضم الحساسية وعكس الاتجاهات، وUI يضم خيارات وضوح الواجهة والترجمة، وCamera يخص سلوك الكاميرا، وAudio يخص إعداد الصوت ومستوياته.

الطريقة العملية المقترحة هي معالجة المشكلة التي تشعر بها أولًا. إذا كانت الكتابة صغيرة، ابدأ بالواجهة. إذا كانت حركة المشهد مزعجة لك، راجع الكاميرا. وإذا كانت الاستدارة أو متابعة الهدف صعبة، افتح إعدادات التحكم بدل تغيير خيارات العرض التي لا تتعلق بالمشكلة.

- صوّر القيم الحالية حتى تعرف كيف ترجع إليها.
- غيّر خيارًا واحدًا، ثم جرّبه في مكان مألوف وهادئ.
- اختبر المشي والتصويب والقيادة كلًّا على حدة.
- اكتب ما تحسن وما أصبح أصعب، بدل تغيير عدة قيم عشوائيًا.
- ارجع للقيمة السابقة إذا لم يكن الفرق مناسبًا لك.

تذكر Rockstar أيضًا وجود خيارات لإعادة الإعدادات في أسفل الشاشة. اقرأ نطاق الخيار قبل استخدامه، خصوصًا إذا سبق أن خصصت أزرارًا أو أحجامًا تناسبك. هذا الدليل يساعدك على الوصول إلى القسم الصحيح؛ ولا يفترض أن لغة معينة أو وضع رسوم محدد أو قيمة حساسية واحدة موجودة ومناسبة على كل جهاز.`,
    aliases: ["Settings", "الإعدادات", "حساسية", "حجم الواجهة", "الترجمة"], tags: ["settings", "official-support", "accessibility"],
    related: ["accessibility-easy-mode", "ps5-dualsense-button-remapping", "gta-vi-ps5-pro-features-frame-rate"],
    srcUrls: [["Rockstar Support — Change GTA VI settings", "https://support.rockstargames.com/articles/4jUHNdP22SmaKSF8DWqhXC/how-to-change-grand-theft-auto-vi-settings"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "gta-vi-installation-space-212-gb", status: "official",
    en: "GTA VI installation space: plan for up to 212 GB",
    ar: "مساحة تثبيت GTA VI: جهّز حتى 212 جيجابايت حسب الجهاز",
    sEn: "Rockstar's published storage requirement is up to 212 GB. Separate game files, saves, and captured videos when making room.",
    sAr: "متطلب المساحة المنشور من Rockstar يصل إلى 212 جيجابايت. فرّق بين ملفات اللعبة والحفظ ومقاطعك قبل تفريغ المساحة.",
    bEn: `Rockstar lists up to 212 GB of available storage for installing and playing GTA VI, depending on the device. This is the published installation requirement, not a promise that every download or later update will have exactly that size.

First inspect free space on the storage device where the game will actually run. Compare it with the console's current installation prompt. Keep your saved progress separate from the much larger game installation when deciding what to remove.

On PS5, Sony distinguishes console or compatible M.2 storage, which can run PS5 games, from USB extended storage used to hold those game files until copied back. PS5 saved data is a separate category; moving a game installation is not the same as backing up its save.

Our practical suggestion is to move an unused game or export old recordings before touching saved data. Recheck available space after the operation. Do not format a drive just to free a small amount of room: formatting erases its existing contents, so confirm what is on it first.`,
    bAr: `تحدد Rockstar متطلبًا يصل إلى 212 جيجابايت من المساحة المتاحة لتثبيت GTA VI وتشغيلها، بحسب الجهاز. هذا رقم لمتطلب التثبيت المنشور، وليس وعدًا بأن حجم التنزيل على كل جهاز أو حجم أي تحديث لاحق سيطابقه بالضبط.

ابدأ بفحص المساحة الحرة في وحدة التخزين التي ستشغّل اللعبة منها فعلًا، ثم قارنها بالرسالة الحالية التي يعرضها الكونسول. ولا تخلط ملفات تثبيت اللعبة الكبيرة مع ملفات تقدمك داخلها؛ حذف أحد النوعين أو نقله ليس بديلًا تلقائيًا عن حفظ الآخر.

على PS5، تفرّق Sony بين التخزين الداخلي أو M.2 المتوافق الذي يشغّل ألعاب PS5، وبين USB Extended Storage الذي يمكن الاحتفاظ عليه بملفاتها ثم نسخها إلى تخزين التشغيل. وبيانات الحفظ الخاصة بألعاب PS5 تبقى فئة منفصلة عن ملفات التثبيت.

- راجع الألعاب غير المستخدمة قبل إزالة أي بيانات حفظ.
- صدّر تسجيلاتك القديمة إذا كانت تستحوذ على مساحة كبيرة.
- أعد فحص المساحة بعد النقل بدل الاعتماد على حجم الملف المكتوب وحده.
- اقرأ اسم وحدة التخزين قبل بدء أي عملية طويلة.

اقتراحنا أن تبدأ بنقل لعبة لا تستخدمها أو أرشفة التسجيلات. لا تهيّئ قرصًا كاملًا لمجرد الحصول على مساحة صغيرة قبل التأكد مما عليه؛ التهيئة تمسح محتوياته.`,
    aliases: ["212GB", "حجم GTA 6", "مساحة التثبيت", "SSD"], tags: ["storage", "installation", "PS5", "Xbox"],
    facts: [["Published requirement", "المتطلب المنشور", "Up to 212 GB, depending on device", "حتى 212 جيجابايت حسب الجهاز"]],
    related: ["xbox-series-storage-for-gta-vi", "ps5-cloud-save-sync-check"],
    srcUrls: [["Rockstar Support — Installation requirements", "https://support.rockstargames.com/articles/M6h7B5fJZMwG1dnzQkt4Z/grand-theft-auto-vi-installation-requirements"], ["PlayStation — Manage storage", "https://www.playstation.com/en-us/support/hardware/ps5-manage-storage-space/"], ["PlayStation — USB extended storage", "https://www.playstation.com/en-us/support/hardware/ps5-extended-storage/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "gta-vi-redeem-code-account-region", status: "official",
    en: "Redeeming a GTA VI code: check the account and region first",
    ar: "تفعيل كود GTA VI: تأكد من الحساب والمنطقة قبل الاسترداد",
    sEn: "A store code belongs on the intended platform account. Saudi and UAE PlayStation codes have a specific regional grouping in Rockstar's guide.",
    sAr: "فعّل الكود على حساب المنصة المقصود. توثّق Rockstar مجموعة إقليمية خاصة بأكواد PlayStation للسعودية والإمارات.",
    bEn: `Rockstar's editions guide lists region rules for GTA VI PlayStation codes, including a Saudi Arabia/UAE grouping. Sony also states that a PlayStation Store voucher must match the account's region, can be redeemed once, and cannot have its content transferred to a different account afterward.

On PS5, open PlayStation Store, access its menu, then choose More > Redeem Code. Check the displayed account and product before confirming. Keep the receipt and retailer's product description until the game appears in the correct library.

If a code fails, record the exact error and whether the code is for the base game or an add-on. Do not publish the code in a screenshot or community comment. A support request should include the error and proof of purchase through the retailer's official private support channel.

This guide concerns legitimate activation, not bypassing region checks. For an Xbox purchase, use Microsoft's redemption flow and Rockstar's platform-specific guidance rather than applying PlayStation's menu steps.`,
    bAr: `توضح Rockstar في دليل الإصدارات قواعد مناطق أكواد GTA VI على PlayStation، ومنها مجموعة تضم السعودية والإمارات. وتؤكد Sony أن كود المتجر يجب أن يتوافق مع منطقة الحساب، وأنه يُستخدم مرة واحدة، ولا يمكن نقل محتواه إلى حساب مختلف بعد الاسترداد.

على PS5، افتح PlayStation Store ثم القائمة، واختر More ثم Redeem Code. قبل التأكيد، راجع الحساب الذي تستخدمه واسم المنتج الظاهر. احتفظ بفاتورة الشراء ووصف المنتج من البائع حتى تظهر اللعبة في المكتبة الصحيحة.

- تأكد هل الكود للعبة الأساسية أم لإضافة أو ترقية.
- راجع منطقة الحساب بدل الاعتماد على مكان وجودك حاليًا.
- اقرأ رسالة التأكيد كاملة قبل تنفيذ الاسترداد.
- إذا فشل الكود، سجّل نص الخطأ كما يظهر.
- لا تنشر الكود كاملًا في صورة أو تعليق يراه الآخرون.

عند التواصل مع الدعم، استخدم قناة البائع الرسمية والخاصة لتقديم إثبات الشراء. هذه الخطوات لتفعيل نسخة مشروعة على الحساب المقصود، وليست طريقة لتجاوز قيود المناطق. أما مشتريات Xbox فلها مسار استرداد لدى Microsoft؛ اتبع إرشادات منصتك ولا تطبق عليها أسماء قوائم PlayStation.`,
    aliases: ["Redeem Code", "تفعيل الكود", "كود سعودي", "منطقة الحساب"], tags: ["activation", "PS5", "Xbox", "Saudi Arabia"],
    related: ["price-and-editions", "ps5-restore-license-padlock", "gta-vi-preorder-bonus-claim-menu"],
    srcUrls: [["Rockstar Support — Platforms, Editions, and Versions", "https://support.rockstargames.com/articles/4QfG4FmZCf5W1gS8jy4UVT/grand-theft-auto-vi-platform-editions-and-versions"], ["PlayStation — Redeem a voucher code", "https://www.playstation.com/en-us/support/store/redeem-ps-store-voucher-code/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "gta-vi-remote-play-from-ps5", status: "official",
    en: "Play GTA VI on another screen with PS5 Remote Play",
    ar: "العب GTA VI على شاشة ثانية عبر Remote Play من PS5",
    sEn: "Rockstar confirms Remote Play support. The PS5 still runs the game; your computer or phone receives the stream.",
    sAr: "تؤكد Rockstar دعم Remote Play. جهاز PS5 يشغّل اللعبة، والكمبيوتر أو الجوال يستقبل البث.",
    bEn: `Rockstar confirms Remote Play support for GTA VI. With PlayStation's Remote Play system, the game runs on your console while another supported device displays the stream. This is different from installing a native PC version.

Sony's setup uses Settings > System > Remote Play on PS5. Install the official PS Remote Play app on a supported computer, sign in with the same PlayStation account, and connect to the console. Rest-mode access also requires the corresponding network settings on the PS5.

Test near the console first. Our suggested comparison is a short familiar route played on the TV and then through Remote Play, using the same controller settings. If input feels delayed only in the stream, investigate the connection before changing your GTA VI aiming preferences.

A stable link matters as well as advertised connection speed. Keep large household downloads out of your initial test. Use the official application's current compatibility guide for your device; a streamed PS5 session should not be described as a downloadable GTA VI PC port.`,
    bAr: `تؤكد Rockstar دعم Remote Play في GTA VI. عند استخدام نظام PlayStation، تبقى اللعبة تعمل على الكونسول، بينما تعرض شاشة أخرى متوافقة الصورة وتُرسل أوامر التحكم إليه. هذا يختلف عن تثبيت نسخة أصلية للعبة على الكمبيوتر.

يبدأ إعداد PS5 من Settings ثم System ثم Remote Play. وعلى الكمبيوتر المتوافق، ثبّت تطبيق PS Remote Play الرسمي، وسجّل بالحساب نفسه المستخدم على الكونسول، ثم اتصل بالجهاز. التشغيل عن بُعد أثناء وضع الراحة يحتاج أيضًا إعدادات الشبكة المخصصة لذلك على PS5.

نقترح اختبار الاتصال وأنت قريب من الجهاز أولًا. اختر مسارًا قصيرًا تعرفه، والعبه على التلفزيون ثم عبر البث مع إبقاء إعدادات التحكم نفسها. إذا ظهر تأخر الأزرار أثناء البث فقط، فافحص الاتصال قبل تغيير حساسية التصويب داخل اللعبة.

- ابدأ بتجربة محلية قصيرة قبل الاعتماد عليه خارج المنزل.
- أوقف التنزيلات الكبيرة أثناء المقارنة الأولى.
- راجع توافق جهازك في دليل التطبيق الرسمي.
- تذكّر أن قوة اتصال الإنترنت المعلنة لا تضمن وحدها سلاسة البث.

قد يساعد هذا الحل عند انشغال التلفزيون، لكنه لا يحوّل GTA VI إلى برنامج مثبت محليًا على الكمبيوتر، ولا يجعل أي ملف يدّعي أنه «منفذ PC» جزءًا من Remote Play.`,
    aliases: ["Remote Play", "ريموت بلاي", "اللعب عن بعد", "PS Portal"], tags: ["PS5", "remote-play", "setup"],
    related: ["pc-version-report-2027", "gta-vi-ps5-pro-features-frame-rate"],
    srcUrls: [["Rockstar Support — Platforms and Remote Play", "https://support.rockstargames.com/articles/4QfG4FmZCf5W1gS8jy4UVT/grand-theft-auto-vi-platform-editions-and-versions"], ["PlayStation — Remote Play on PC and Mac", "https://www.playstation.com/en-us/support/games/playstation-remote-play-on-pc-and-mac/"], ["PlayStation — Remote Play overview", "https://www.playstation.com/en-us/remote-play/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "gta-vi-preorder-bonus-claim-menu", status: "official",
    en: "Where to find the claim instructions for GTA VI pre-order bonuses",
    ar: "وين تلقى طريقة استلام مكافآت الطلب المسبق في GTA VI؟",
    sEn: "Rockstar points players to the Store section of the pause menu for each eligible bonus's claim instructions.",
    sAr: "توجّه Rockstar اللاعب إلى قسم Store في قائمة الإيقاف لمعرفة طريقة استلام كل مكافأة مؤهلة.",
    bEn: `Rockstar's November 19 FAQ provides a specific route for pre-order bonus information: open Pause Menu, choose Store, then select the relevant pre-order bonus. The selected entry explains how to claim available content.

Check the exact bonus rather than assuming every item is delivered to the same place. Keep the product edition, purchase account, receipt date, and installed add-ons together when investigating missing content. Those details make it easier to distinguish an entitlement problem from an in-game instruction you have not followed yet.

The FAQ links a separate GTA+ redemption guide; use that page for membership eligibility and instructions.

This is a troubleshooting path for an existing eligible purchase. It does not say that buying the game today grants an expired pre-order offer, and it does not invent a chapter or garage location for every bonus.`,
    bAr: `تحدد صفحة دعم Rockstar المحدثة في 19 نوفمبر مسارًا واضحًا لمعلومات مكافآت الطلب المسبق: افتح Pause Menu، ثم Store، ثم اختر المكافأة المقصودة. بعد اختيارها تظهر التعليمات الخاصة بكيفية استلام المحتوى المتاح لك.

راجع كل مكافأة باسمها بدل افتراض أن جميع العناصر تُرسل إلى المكان نفسه. وعندما يبدو محتوى ما مفقودًا، اجمع اسم النسخة التي اشتريتها والحساب الذي نفذ الشراء وتاريخ الفاتورة والإضافات المثبتة. هذه البيانات تساعدك على الفصل بين مشكلة أهلية أو ترخيص وبين تعليمات داخل اللعبة لم تُنفذ بعد.

- افتح صفحة المكافأة داخل Store واقرأ التعليمات كاملة.
- قارن اسمها بالمحتوى المبيّن في فاتورتك أو وصف نسختك.
- احتفظ بصورة رسالة الخطأ إذا ظهرت، دون إظهار أي كود تفعيل.
- استخدم رابط الدعم الرسمي إذا لم تتضح الخطوة التالية.

تربط الصفحة بدليل منفصل لاسترداد GTA+؛ ارجع إليه لأهلية العضوية وتعليماتها. هذا الدليل لا يقول إن شراء اللعبة الآن يمنح عرض طلب مسبق انتهى، ولا يحدد فصلًا أو كراجًا لكل عنصر دون توثيق.`,
    aliases: ["Pre-order bonus", "مكافآت الطلب المسبق", "Vintage Vice City Pack"], tags: ["bonuses", "official-support", "setup"],
    related: ["price-and-editions", "which-edition-to-buy", "gta-vi-redeem-code-account-region"],
    srcUrls: [["Rockstar Support — Pre-order bonus FAQ", "https://support.rockstargames.com/articles/11zWw5XQuGh1h9UDRE9nQs/grand-theft-auto-vi-pre-order-bonus-faq"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "gta-vi-ps5-pro-features-frame-rate", status: "official",
    en: "GTA VI console graphics: the 30 fps target and PS5 Pro features",
    ar: "رسوم GTA VI على الكونسول: هدف 30 إطارًا ومزايا PS5 Pro",
    sEn: "Rockstar states a 30 fps target. Sony details PSSR, ray-traced shadows, DualSense support, and positional audio.",
    sAr: "تذكر Rockstar هدف 30 إطارًا في الثانية، وتوضح Sony مزايا PSSR والظلال والدوال سنس والصوت المحيطي.",
    bEn: `Rockstar's November 10 announcement states that GTA VI targets 30 frames per second on the current consoles. Sony describes PS5 Pro improvements including PSSR image reconstruction and ray-traced shadows. Its PS5 overview also documents DualSense haptics and adaptive triggers, plus Tempest 3D Audio support.

A frame-rate target is not a guarantee that every moment runs at an identical rate. Likewise, a television accepting a 120 Hz signal does not prove that a game is rendering at 120 fps. Keep output settings and the game's actual frame rate separate when comparing footage.

For a useful visual comparison, match the location, time of day, camera angle, and display settings. Compression and different brightness levels can easily overshadow a real image-quality difference in short social clips.

Before buying hardware or changing settings, identify the improvement you actually want: sharper detail, a preferred display setup, or controller feedback. This entry reports the announced features; it does not promise an undocumented performance mode or a fixed resolution on every scene.`,
    bAr: `تذكر Rockstar في إعلان 10 نوفمبر أن GTA VI تستهدف 30 إطارًا في الثانية على أجهزة الكونسول الحالية. وتوضح Sony أن نسخة PS5 Pro تستفيد من PSSR لتحسين وضوح الصورة ومن الظلال بتتبع الأشعة. كما توثق مزايا اهتزازات DualSense والمقاومة في الأزرار، ودعم Tempest 3D Audio على PS5.

هدف معدل الإطارات لا يعني ضمان ثبات الرقم في كل لحظة، وقبول التلفزيون إشارة 120 هرتز لا يثبت أن اللعبة ترسم 120 إطارًا في الثانية. عند مقارنة فيديوهين، افصل بين إعداد خرج الجهاز وأداء اللعبة نفسها.

ولمقارنة بصرية مفيدة، حاول توحيد المكان والوقت داخل اللعبة وزاوية التصوير وإعدادات الشاشة. ضغط الفيديو واختلاف السطوع قد يخفيان فرقًا حقيقيًا أو يوحيان بفرق غير موجود، خصوصًا في المقاطع القصيرة المعاد رفعها.

- حدّد هل تقارن وضوح الصورة أم الظلال أم سلاسة الحركة.
- لا تعتمد على عنوان المقطع وحده لتحديد الجهاز المستخدم.
- دوّن إعدادات الشاشة قبل تعديلها.
- قارن المشهد نفسه بدل صورتين من ظروف مختلفة.

قبل شراء جهاز أو تغيير إعدادات كثيرة، حدّد التحسن الذي تريده فعلًا. هذا المدخل يعرض المزايا المعلنة، ولا يعد بوضع أداء غير موثق أو بدقة ثابتة في جميع المشاهد.`,
    aliases: ["30fps", "60fps", "PSSR", "PS5 Pro", "الجرافيكس"], tags: ["graphics", "PS5", "PS5 Pro", "Xbox"],
    facts: [["Announced target", "الهدف المعلن", "30 frames per second", "30 إطارًا في الثانية"]],
    related: ["ps5-hdr-setup-for-gta-vi", "gta-vi-settings-menu-navigation-guide"],
    srcUrls: [["Rockstar — Pre-load GTA VI Now", "https://www.rockstargames.com/newswire/article/89834o94713o21/pre-load-grand-theft-auto-vi-now"], ["PlayStation Blog — GTA VI PS5 and PS5 Pro features", "https://blog.playstation.com/2026/11/10/pre-load-grand-theft-auto-vi-on-ps5-starting-today/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "ps5-record-gta-vi-discoveries", status: "official",
    en: "Record a GTA VI discovery on PS5 with the evidence intact",
    ar: "كيف توثق اكتشافك في GTA VI من جهاز PS5؟",
    sEn: "Use the console's capture and editing tools to show the location, the action, and the result in one understandable clip.",
    sAr: "استخدم أدوات التصوير والتحرير في الجهاز لتعرض المكان والخطوات والنتيجة في مقطع واضح يسهل التحقق منه.",
    bEn: `PS5's Create menu can take a screenshot, start a recording, or save recent gameplay. These are console tools. Sony also documents trimming a video, choosing its cover image, and extracting a screenshot through Media Gallery's Edit option. Some scenes can be blocked from recording.

For a useful discovery report, capture the lead-in as well as the surprising result. A five-second clip of an outcome rarely explains how another player can reproduce it. Before leaving the area, make a separate map screenshot and note the mission, character, and conditions that mattered.

Suggested publishing workflow:
- Keep the original recording before editing a shorter copy.
- Remove loading screens and unrelated travel, while retaining the action that triggers the result.
- Choose a cover frame that shows the actual subject clearly.
- Describe what happened once, and what you successfully repeated.
- Check the final audio and crop before sharing.

If the recording omits a necessary step, say so in the description. This makes a community submission useful even when the discovery still needs independent confirmation.`,
    bAr: `تتيح قائمة Create في PS5 التقاط صورة، وبدء تسجيل جديد، وحفظ جزء من اللعب الذي حدث للتو. هذه أدوات في نظام الجهاز. وتوضح Sony أن خيار Edit داخل Media Gallery يسمح بقص الفيديو واختيار صورة الغلاف واستخراج لقطة ثابتة منه. وقد تمنع بعض المشاهد التسجيل.

لتوثيق اكتشاف مفيد، صوّر الخطوات التي سبقت النتيجة، وليس اللحظة الغريبة وحدها. مقطع قصير يظهر سيارة في وضع غير مألوف قد يجذب الانتباه، لكنه لا يشرح كيف وصل اللاعب إليه. قبل مغادرة المنطقة، التقط صورة للخريطة واكتب الشخصية والمهمة والظروف التي تبدو مرتبطة بما حدث.

هذا مسار عملي مقترح للنشر:
- احتفظ بالتسجيل الأصلي قبل تحرير نسخة مختصرة.
- احذف الانتظار والتنقل غير الضروري، مع إبقاء الفعل الذي أدى إلى النتيجة.
- اختر غلافًا يظهر موضوع الاكتشاف بوضوح.
- اذكر ما شاهدته مرة واحدة وما استطعت تكراره.
- راجع الصوت وحواف الصورة قبل المشاركة.

إذا فاتك تصوير خطوة مهمة، اذكرها في الوصف بدل إخفاء النقص. وإذا كانت النتيجة تعتمد على توقيت دقيق، أضف ترتيب المحاولات والمدة التقريبية من ملاحظاتك. بهذه الطريقة يصبح إرسال المجتمع قابلًا للفهم والمراجعة، حتى عندما يحتاج الاكتشاف إلى تجربة لاعب آخر لتأكيده.`,
    aliases: ["تصوير اللعبة", "زر Create", "توثيق اكتشاف"], tags: ["PS5", "captures", "community"],
    related: ["ps5-send-captures-to-phone", "xbox-captures-backup-onedrive"],
    srcUrls: [["PlayStation — Capture gameplay", "https://www.playstation.com/en-us/support/games/capture-ps5-gameplay-screenshots/"], ["PlayStation — Edit and share captures", "https://www.playstation.com/en-us/support/games/ps5-edit-share-screenshots-clips/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "ps5-send-captures-to-phone", status: "official",
    en: "Move PS5 discovery clips to your phone with PlayStation App",
    ar: "نقل صور ومقاطع PS5 إلى الجوال عبر تطبيق PlayStation",
    sEn: "Enable capture uploads, download your selected clip, and prepare it for a discovery submission or social post.",
    sAr: "فعّل رفع اللقطات، ثم نزّل المقطع على جوالك وجهزه لإرسال اكتشافك أو مشاركته في المنصات.",
    bEn: `Sony's capture feature links PS5 with PlayStation App. Enable it in the app under Library > Captures, and on the console under Settings > Captures and Broadcasts > Captures > Auto-Upload. Supported clips are non-4K and shorter than three minutes; captures remain available in the app for 14 days. This feature does not require PlayStation Plus.

Use the app as a delivery step in your workflow. Download the clip you intend to keep, then check that the saved phone file opens independently of the app. Give it a recognizable name so it does not disappear among unrelated camera videos.

For an Arabic discovery submission, prepare a short description beside the file: where the event occurred, how to repeat it, and whether the clip reveals a mission outcome. A clear opening frame also helps readers recognize the subject in a chat preview.

If a clip does not appear, compare its length and resolution with the supported limits before repeatedly recording the same scene. A local copy is a better long-term record than relying on the temporary app view.`,
    bAr: `تربط ميزة اللقطات في PlayStation App بين PS5 والجوال. فعّلها في التطبيق من Library ثم Captures، وفي الجهاز من Settings ثم Captures and Broadcasts ثم Captures ثم Auto-Upload. المقاطع المدعومة أقل من ثلاث دقائق وليست بدقة 4K، وتبقى اللقطات متاحة في التطبيق لمدة 14 يومًا. لا تتطلب هذه الميزة اشتراك PlayStation Plus.

تعامل مع التطبيق بوصفه مرحلة لنقل الملف. نزّل المقطع الذي تريد الاحتفاظ به، ثم افتح النسخة المحفوظة في الجوال للتأكد من عملها. أعطه اسمًا واضحًا يتضمن موضوعه أو مكانه، حتى لا يضيع وسط مقاطع الكاميرا والملفات المرسلة في المحادثات.

قبل إرسال اكتشاف للموقع، جهّز وصفًا قصيرًا بجانب الملف: أين وقع الحدث، وما الخطوات اللازمة لتكراره، وهل يكشف المقطع نتيجة مهمة. اختر بداية مفهومة للمقطع؛ ظهور ثانيتين من شاشة تحميل يجعل المشاركة أقل وضوحًا حتى لو كانت بقية اللقطة ممتازة.

إذا لم يظهر الفيديو في التطبيق، قارن مدته ودقته بالشروط المدعومة قبل إعادة تصوير المشهد مرارًا. وبعد تنزيله، شاهد النسخة كاملة وتحقق من الصوت والمكان الظاهر. احتفاظك بملف محلي منظم يجعل الرجوع إلى الدليل وتصحيحه لاحقًا أسهل من الاعتماد على نافذة عرض مؤقتة داخل التطبيق.`,
    aliases: ["PS App", "نقل الصور للجوال", "مشاركة واتساب"], tags: ["PS5", "captures", "sharing"],
    related: ["ps5-record-gta-vi-discoveries"],
    srcUrls: [["PlayStation — Access game captures on PS App", "https://www.playstation.com/en-us/support/games/ps5-game-captures-ps-app/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "ps5-cloud-save-sync-check", status: "official",
    en: "Check your PS5 cloud save before changing consoles",
    ar: "التحقق من مزامنة تخزينة PS5 قبل الانتقال إلى جهاز آخر",
    sEn: "Check the saved progress you expect before moving between consoles.",
    sAr: "راجع التقدم الذي تتوقع رؤيته قبل الانتقال بين جهازين.",
    bEn: `PS5 cloud save storage requires PlayStation Plus. Sony places automatic save synchronization under Settings > Saved Data and Game/App Settings > Saved Data (PS5) > Sync Saved Data. You can also highlight a game on the home screen, press Options, and check its saved-data sync status. Internet connectivity in rest mode is needed for syncing while resting.

Before switching consoles, finish at a recognizable point, close the game normally, and inspect the sync result. Write down the mission or location you expect to see next time. A useful check compares the expected progress with the save information, instead of assuming that a subscription alone proves the latest session uploaded.

On the second console, inspect any conflict prompt before choosing a copy. A later timestamp deserves attention, but your known progress is also relevant. Do not repeatedly launch and close the game while guessing which copy is correct.

If synchronization reports an error, record that message and resolve it before treating the second device as your main save. This is a console backup workflow, separate from manual saving inside GTA VI.`,
    bAr: `يتطلب تخزين ملفات حفظ PS5 سحابيًا اشتراك PlayStation Plus. تضع Sony إعداد المزامنة التلقائية ضمن Settings ثم Saved Data and Game/App Settings ثم Saved Data (PS5) ثم Sync Saved Data. ويمكن تحديد اللعبة في الشاشة الرئيسية والضغط على Options لفحص حالة مزامنة بيانات الحفظ. وتحتاج المزامنة أثناء وضع الراحة إلى اتصال الجهاز بالإنترنت في ذلك الوضع.

قبل الانتقال إلى جهاز آخر، أنهِ جلستك عند نقطة تستطيع تذكرها، وأغلق اللعبة بصورة طبيعية، ثم راجع نتيجة المزامنة. دوّن المهمة أو المكان الذي تتوقع العودة إليه. المراجعة المفيدة تجمع بين معلومات ملف الحفظ وتقدمك المعروف؛ وجود الاشتراك وحده لا يثبت أن آخر جلسة وصلت إلى السحابة.

على الجهاز الثاني، اقرأ أي رسالة تعرض تعارضًا بين نسختين قبل اختيار إحداهما. انتبه إلى التاريخ والوقت، وقارنهما بما تتذكره من آخر جلسة. إذا بدت المعلومات متناقضة، توقف عن التجربة العشوائية وخذ صورة للرسالة لتراجعها بهدوء.

عندما تظهر مشكلة مزامنة، سجّل نص الخطأ وعالجها قبل اعتماد الجهاز الثاني للعب المعتاد. لا تجعل أول اختبار لك جلسة طويلة؛ افتح اللعبة وتحقق من التقدم المتوقع أولًا. هذا إجراء على مستوى نظام PS5، ويكمل عادتك في الحفظ داخل GTA VI بدل أن يحل محلها.`,
    aliases: ["التخزين السحابي", "مزامنة التخزينة", "PS Plus saves"], tags: ["PS5", "save", "cloud"],
    related: ["ps5-transfer-gta-vi-progress-new-console", "save-often-launch-bugs"],
    srcUrls: [["PlayStation — PS5 cloud storage", "https://www.playstation.com/en-us/support/subscriptions/ps5-ps-plus-cloud-storage/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "ps5-restore-license-padlock", status: "official",
    en: "A padlock on a PS5 game: check ownership and restore licenses",
    ar: "ظهور قفل على اللعبة في PS5: مراجعة الحساب واستعادة التراخيص",
    sEn: "Work through a license problem in a sensible order before downloading a large game again.",
    sAr: "راجع مشكلة الترخيص بترتيب واضح قبل أن تعيد تنزيل لعبة كبيرة دون معرفة السبب.",
    bEn: `Sony recommends checking the purchasing account and transaction history when a downloaded game cannot start. For license restoration, open Settings > Users and Accounts > Other > Restore Licenses and select the relevant licenses. Sony states that restoring licenses does not affect your data. This is a PS5 account function, not an unlock inside GTA VI.

Start by writing down the exact symptom: a padlock, a purchase prompt, or an error code. These are not interchangeable. Next, identify which account bought or redeemed the game and check whether it appears in that account's library.

After restoration, test the same title once and record whether the message changed. If it still fails, check PlayStation service status and use the official launch troubleshooting page with your error details. Keeping the receipt and an accurate timeline makes a support request more useful.

Do not assume that purchasing another edition will resolve an account mismatch. Diagnose access first, then decide whether installation troubleshooting is actually needed. Restoring a license verifies existing access; it does not create ownership of a game that the account has never obtained.`,
    bAr: `توصي Sony بمراجعة الحساب الذي اشترى اللعبة وسجل معاملاته عند تعذر تشغيل لعبة رقمية. لاستعادة التراخيص، افتح Settings ثم Users and Accounts ثم Other ثم Restore Licenses، وحدد التراخيص المطلوبة. وتوضح الشركة أن هذه العملية لا تؤثر في بياناتك. هذه وظيفة لحساب PS5 وليست خيار فتح محتوى داخل GTA VI.

ابدأ بكتابة العرض الذي تراه بدقة: هل توجد علامة قفل، أم طلب شراء، أم رمز خطأ؟ هذه حالات مختلفة، وتسجيلها يمنع خلط مشكلة ملكية اللعبة بمشكلة تنزيلها. بعد ذلك حدد الحساب الذي اشترى النسخة أو استرد الرمز، وابحث عن اللعبة في مكتبته.

بعد استعادة الترخيص، جرّب العنوان نفسه مرة واحدة وسجّل هل تغيرت الرسالة. إذا استمرت المشكلة، راجع حالة خدمات PlayStation واستخدم دليل مشكلات التشغيل الرسمي مع تفاصيل الخطأ. احتفظ بإيصال الشراء وتسلسل مختصر لما جربته؛ طلب الدعم الذي يحتوي هذه المعلومات أوضح من عبارة «اللعبة لا تعمل» وحدها.

لا تفترض أن شراء إصدار آخر سيحل اختلاف الحساب. افحص حق الوصول أولًا، ثم قرر هل تحتاج فعلًا إلى تشخيص ملفات التثبيت. واستعادة الترخيص لا تمنح ملكية لعبة لم يحصل عليها الحساب سابقًا، لكنها خطوة مناسبة عندما يكون لديك وصول مشروع لم يعد الجهاز يتعرف إليه بصورة صحيحة.`,
    aliases: ["Restore Licenses", "قفل اللعبة", "استعادة الترخيص"], tags: ["PS5", "support", "license"],
    related: ["gta-vi-redeem-code-account-region", "gta-vi-installation-space-212-gb"],
    srcUrls: [["PlayStation — Restore licenses", "https://www.playstation.com/en-us/support/games/restore-licences-playstation/"], ["PlayStation — Game launch issues", "https://www.playstation.com/en-us/support/games/game-launch-issues/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "ps5-game-updates-rest-mode", status: "official",
    en: "Prepare PS5 to download game updates while you are away",
    ar: "تجهيز PS5 لتنزيل تحديثات الألعاب أثناء غيابك",
    sEn: "Choose automatic download or installation deliberately, and check the version before comparing a gameplay discovery.",
    sAr: "اختر التنزيل أو التثبيت التلقائي بوضوح، وتحقق من تحديث اللعبة قبل مقارنة اكتشاف أو مشكلة مع لاعب آخر.",
    bEn: `On PS5, game update options are under Settings > Saved Data and Game/App Settings > Automatic Updates. Sony distinguishes automatic downloading from installation in rest mode: installation can close a suspended game. Rest-mode internet access must be enabled. For an immediate check, highlight the game, press Options, and select Check for Update.

Choose the behavior that fits your sessions. If you often leave a game suspended before reaching a good stopping point, decide when to install instead of assuming every background action leaves that session intact. Finish and save a session before scheduling an unattended update.

For a reported bug or discovery, note the version you tested before updating. Afterwards, repeat the same steps at the same location. That comparison can show whether the observed behavior changed; it cannot establish which undocumented code change caused it.

Keep your report simple: console, game version, reproduction steps, and the result before and after. Download time also depends on your connection and available storage, so an enabled setting is not proof that a particular patch has already completed. Check the installed state before starting a planned recording session.`,
    bAr: `توجد خيارات تحديث الألعاب في PS5 ضمن Settings ثم Saved Data and Game/App Settings ثم Automatic Updates. وتفرّق Sony بين التنزيل التلقائي والتثبيت أثناء وضع الراحة؛ قد يؤدي التثبيت إلى إغلاق لعبة معلقة. ويجب تفعيل اتصال الإنترنت في وضع الراحة. وللفحص الفوري، حدد اللعبة واضغط Options ثم Check for Update.

اختر السلوك المناسب لطريقة لعبك. إذا كنت تترك اللعبة معلقة كثيرًا قبل الوصول إلى نقطة توقف مناسبة، فحدد متى تريد تثبيت التحديث بدل افتراض أن كل عملية في الخلفية ستحافظ على الجلسة المفتوحة. أنهِ جلستك واحفظ تقدمك قبل ترك الجهاز لعملية تحديث دون متابعة.

عند توثيق مشكلة أو اكتشاف، سجّل إصدار اللعبة الذي جربته أولًا. وبعد التحديث، أعد الخطوات نفسها في المكان نفسه قدر الإمكان. هذه المقارنة قد تظهر أن السلوك تغير، لكنها لا تثبت وحدها أي تعديل برمجي تسبب في ذلك، خصوصًا إذا لم تذكر ملاحظات التحديث التفاصيل.

اجعل تقريرك واضحًا: الجهاز، وإصدار اللعبة، وخطوات التجربة، والنتيجة قبل التحديث وبعده. ولا تعتبر تفعيل الخيار دليلًا على انتهاء تنزيل تحديث بعينه؛ وقت التنزيل يتأثر باتصالك والمساحة المتاحة. قبل جلسة تصوير أو تحدٍ تخطط له، افحص الحالة الفعلية حتى تبدأ من نسخة معروفة وتستطيع مقارنة النتائج مع اللاعبين الآخرين.`,
    aliases: ["تحديث تلقائي", "وضع الراحة", "Check for Update"], tags: ["PS5", "updates", "support"],
    related: ["ps5-cloud-save-sync-check", "ps5-record-gta-vi-discoveries"],
    srcUrls: [["PlayStation — Automatic updates", "https://www.playstation.com/en-us/support/hardware/automatic-updates-playstation/"], ["PlayStation — System software and application versions", "https://www.playstation.com/en-us/support/hardware/playstation-system-software-application-version/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "ps5-hdr-setup-for-gta-vi", status: "official",
    en: "Adjust PS5 HDR before judging bright skies and dark streets",
    ar: "ضبط HDR في PS5 قبل الحكم على السطوع والمشاهد الليلية",
    sEn: "Use the console's supported HDR output and calibration, then compare one scene without changing everything at once.",
    sAr: "راجع خرج HDR ومعايرته في الجهاز، ثم قارن مشهدًا واحدًا دون تغيير جميع إعدادات الشاشة معًا.",
    bEn: `Sony places HDR under Settings > Screen and Video > Video Output. On When Supported preserves SDR output for content without HDR support, whereas Always On converts that content. The same menu provides Adjust HDR. These are PS5 output controls, not a claim about a particular GTA VI graphics menu.

Before changing anything, photograph your current television and console settings. Then follow the console's calibration screens using the display you actually play on. A brightness value copied from another player's television may be a poor match for yours.

For a practical comparison, choose one bright scene and one dark scene, keeping the location and viewing conditions as consistent as possible. Look for visible detail in clouds, signs, and shadows, rather than judging only whether the whole image became brighter.

Change one setting per comparison and record the result. If the picture improves on the television but looks different in a phone recording, check the recording method before changing the setup again. Camera exposure and display playback add another layer to the comparison. Keep the setting that produces a readable, comfortable picture on your own screen.`,
    bAr: `تضع Sony إعداد HDR في PS5 ضمن Settings ثم Screen and Video ثم Video Output. يحافظ خيار On When Supported على خرج SDR للمحتوى الذي لا يدعم HDR، بينما يحوّل خيار Always On ذلك المحتوى. وفي القائمة نفسها يوجد Adjust HDR للمعايرة. هذه إعدادات خرج الجهاز، وليست وصفًا لقائمة رسومية محددة داخل GTA VI.

قبل التغيير، صوّر إعدادات التلفزيون والجهاز الحالية حتى تستطيع الرجوع إليها. بعد ذلك اتبع شاشات المعايرة على الشاشة التي تستخدمها فعلًا. نسخ رقم سطوع من لاعب يملك تلفزيونًا مختلفًا قد لا يعطيك النتيجة نفسها، لأن المقارنة تبدأ من جهاز عرض مختلف.

لاختبار عملي، اختر مشهدًا مضيئًا وآخر مظلمًا، وحاول تثبيت المكان وظروف المشاهدة. راقب تفاصيل السحب واللافتات والمناطق المعتمة، بدل الاكتفاء بملاحظة أن الصورة أصبحت أكثر سطوعًا. الهدف أن ترى التفاصيل براحة، لا أن تصل إلى أعلى رقم في كل منزلق.

غيّر إعدادًا واحدًا في كل تجربة وسجّل النتيجة. وإذا بدت الصورة جيدة على التلفزيون ومختلفة في تصوير الجوال، راجع طريقة التصوير قبل إعادة ضبط كل شيء؛ تعريض الكاميرا وطريقة عرض المقطع يدخلان في المقارنة. احتفظ بالإعداد الذي يناسب شاشتك وظروف جلوسك، ولا تعتمد على لقطة منشورة وحدها للحكم على جودة إعدادك.`,
    aliases: ["HDR", "السطوع", "صورة غامقة", "معايرة الشاشة"], tags: ["PS5", "display", "HDR"],
    related: ["gta-vi-ps5-pro-features-frame-rate", "gta-vi-settings-menu-navigation-guide"],
    srcUrls: [["PlayStation — Enable and adjust HDR", "https://www.playstation.com/en-us/support/hardware/ps5-enable-adjust-hdr/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "ps5-dualsense-button-remapping", status: "official",
    en: "Remap DualSense buttons for a more comfortable control layout",
    ar: "تغيير توزيع أزرار DualSense لراحة أكبر أثناء اللعب",
    sEn: "Separate console button assignments from the game's own control scheme, then test a small change before a long session.",
    sAr: "فرّق بين تعيين الأزرار في نظام الجهاز ومخطط التحكم داخل اللعبة، واختبر تغييرًا محدودًا قبل جلسة طويلة.",
    bEn: `PS5 supports custom DualSense button assignments through Settings > Accessibility > Controllers > Custom Button Assignments for DualSense Wireless Controller. Choose the button and its new function, then apply the change. DualSense Edge also has its own custom profiles under the console's accessory settings; that is a separate hardware-specific option.

Start with the action that causes discomfort or confusion, rather than moving every button at once. Write down the original assignment and the replacement. Then test movement, camera control, interaction, and menu navigation in a low-pressure situation.

Keep two layers clear in your notes: which physical button you press, and which action the game receives. If a tutorial or a friend's instructions use the original layout, this distinction helps you translate the instruction without guessing.

For a shared console, tell the next player that a custom layout is active. Save a photograph of the configuration so you can reproduce it after experimenting. A useful layout is one you can operate consistently; copying a competitive player's arrangement is less important than reducing unnecessary strain and mistakes in your own sessions.`,
    bAr: `يدعم PS5 تغيير وظائف أزرار DualSense من Settings ثم Accessibility ثم Controllers ثم Custom Button Assignments for DualSense Wireless Controller. اختر الزر ووظيفته الجديدة ثم طبّق التعديل. وتملك يد DualSense Edge ملفات تحكم مخصصة ضمن إعدادات الملحقات؛ هذا خيار منفصل يرتبط بذلك الطراز.

ابدأ بالفعل الذي يسبب لك إزعاجًا أو ارتباكًا، بدل نقل جميع الأزرار دفعة واحدة. اكتب التعيين الأصلي والتعيين البديل، ثم اختبر الحركة والكاميرا والتفاعل والتنقل في القوائم ضمن موقف لا يتطلب رد فعل سريعًا. التغيير الصغير أسهل في التقييم والرجوع عنه إذا لم يناسبك.

احرص على التمييز بين مستويين في ملاحظاتك: الزر الفعلي الذي تضغطه، والأمر الذي تستقبله اللعبة. عندما يشرح لك صديق خطوة وفق التوزيع الأصلي، يساعدك هذا التفريق على ترجمة التعليمات إلى توزيعك الحالي دون تخمين أو ارتباك أثناء المهمة.

إذا كان الجهاز مشتركًا، أخبر اللاعب التالي بأن توزيعًا مخصصًا مفعل. واحتفظ بصورة للإعداد حتى تعيده بعد التجارب. جرب التوزيع في أكثر من نوع من المواقف قبل اعتماده نهائيًا؛ ما يناسب الحركة قد يحتاج مراجعة عند قيادة مركبة. التوزيع الجيد هو الذي تستخدمه بثبات وراحة، وليس بالضرورة ما يفضله لاعب آخر أو يظهر في مقطع مشهور.`,
    aliases: ["تغيير الأزرار", "تخصيص اليد", "DualSense", "button mapping"], tags: ["PS5", "accessibility", "controller"],
    related: ["gta-vi-settings-menu-navigation-guide", "ps5-assist-controller-single-player"],
    srcUrls: [["PlayStation — PS5 accessibility settings", "https://www.playstation.com/en-us/support/hardware/ps5-accessibility-settings/"], ["PlayStation — DualSense Edge setup", "https://www.playstation.com/en-us/support/hardware/set-up-edge-controller/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "xbox-captures-backup-onedrive", status: "official",
    en: "Back up Xbox discovery videos before the network copy expires",
    ar: "نسخ مقاطع اكتشافات Xbox قبل انتهاء مدة الاحتفاظ الشبكي",
    sEn: "Organize a durable copy of the clips you want to keep, using the console's capture backup options.",
    sAr: "احتفظ بنسخة منظمة من المقاطع المهمة باستخدام خيارات النسخ الاحتياطي للقطات في الجهاز.",
    bEn: `Xbox announced a 90-day retention policy for captures on the Xbox network in September 2023, alongside backup options for OneDrive or external storage. Its documented route is My games & apps > See all > Apps > Captures. The capture interface also supports configuring automatic backup of future captures to OneDrive.

For a community archive, decide which recordings deserve a permanent copy: a discovery's original evidence, an unusual event you cannot easily repeat, or footage supporting a correction. Check that the destination file actually plays before removing the only console copy.

Use descriptive filenames and keep a small text note with each important clip. Include the location, game version, and the steps leading up to the event. If you edit a short version for social media, retain the original separately so later questions can be answered from the full recording.

Check the backup destination's available space when a transfer fails. A selected automatic option does not by itself prove that every file uploaded successfully. Review a sample after setup, and inspect the Captures app for notices about recordings approaching deletion.`,
    bAr: `أعلنت Xbox في سبتمبر 2023 سياسة احتفاظ مدتها 90 يومًا للقطات المحفوظة على شبكة Xbox، مع خيارات لنسخها إلى OneDrive أو وحدة تخزين خارجية. المسار الموثق هو My games & apps ثم See all ثم Apps ثم Captures. وتسمح واجهة اللقطات كذلك بإعداد نسخ تلقائي للمقاطع المستقبلية إلى OneDrive.

إذا كنت تجمع اكتشافات للمجتمع، حدد التسجيلات التي تستحق نسخة دائمة: الدليل الأصلي لاكتشاف، أو حدث غير معتاد يصعب تكراره، أو مقطع يدعم تصحيح معلومة. افتح الملف في مكان النسخ وتأكد من تشغيله قبل حذف النسخة الوحيدة الموجودة على الجهاز.

اختر أسماء ملفات واضحة، واحتفظ بملاحظة قصيرة مع كل مقطع مهم. اكتب المكان وإصدار اللعبة والخطوات التي سبقت الحدث. وإذا حررت نسخة قصيرة للنشر في المنصات، اترك التسجيل الأصلي منفصلًا حتى تستطيع الرجوع إلى السياق الكامل عند وصول سؤال أو ملاحظة من لاعب آخر.

عندما يفشل النقل، راجع المساحة المتاحة في وجهة النسخ. تفعيل خيار تلقائي لا يثبت وحده أن جميع الملفات وصلت بنجاح. افحص عينة بعد الإعداد، وراجع إشعارات المقاطع القريبة من الحذف داخل Captures. تنظيم النسخة الأصلية والمقطع المنشور والوصف في مجموعة واحدة يوفر عليك إعادة البحث، ويحافظ على دليل قابل للمراجعة بدل الاعتماد على رابط مشاركة مؤقت.`,
    aliases: ["Xbox Captures", "OneDrive", "حفظ مقاطع إكس بوكس"], tags: ["Xbox", "captures", "backup"],
    related: ["ps5-record-gta-vi-discoveries", "xbox-series-storage-for-gta-vi"],
    srcUrls: [["Xbox Wire — Capture retention and backup", "https://news.xbox.com/en-us/2023/09/27/bonus-xbox-update-for-september/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "xbox-series-storage-for-gta-vi", status: "official",
    en: "Xbox Series storage: a USB archive and a playable installation differ",
    ar: "تخزين Xbox Series: الفرق بين أرشفة اللعبة وتشغيلها",
    sEn: "Check the drive's role before moving a large installation or buying extra storage for your console.",
    sAr: "افهم دور وحدة التخزين قبل نقل تثبيت كبير أو شراء مساحة إضافية لجهازك.",
    bEn: `Xbox distinguishes ordinary USB storage from the internal SSD and supported Storage Expansion Cards. Its Series X|S storage guidance explains that USB can hold games, while titles built for the system's full storage architecture use internal storage or a compatible expansion card to run. A USB drive is therefore not automatically equivalent to a playable expansion slot.

Before rearranging your library, list the games you actively play and the ones you only want to keep downloaded. Moving an inactive installation to an archive can preserve bandwidth, while leaving the fast storage available for current sessions.

Check the individual game's storage requirements and the console's move or copy prompt before starting. Keep installation files, saved progress, and captured videos distinct in your plan: freeing space in one category is not a reason to delete another.

For GTA VI, start with its official installation requirement and the free-space reading on your own device. Do not use a capacity printed on a drive's packaging as the available-space figure. Compare compatible options only if moving unused games does not solve the shortage, and verify the exact product's current compatibility before purchasing.`,
    bAr: `تفرّق Xbox بين وحدات USB العادية وبين القرص الداخلي وبطاقات Storage Expansion المتوافقة. وتوضح إرشادات تخزين Series X|S أن USB يمكنه الاحتفاظ بملفات الألعاب، بينما تستخدم الألعاب المبنية للاستفادة من بنية التخزين الكاملة القرص الداخلي أو بطاقة توسعة مناسبة للتشغيل. لذلك لا تعني إضافة وحدة USB تلقائيًا الحصول على مساحة تشغيل مماثلة لبطاقة التوسعة.

قبل إعادة ترتيب المكتبة، اكتب الألعاب التي تلعبها حاليًا وتلك التي تريد الاحتفاظ بتنزيلها فقط. نقل تثبيت لا تستخدمه إلى مساحة للأرشفة قد يوفر عليك تنزيله لاحقًا، ويترك المساحة المناسبة للألعاب النشطة.

راجع متطلبات اللعبة ورسالة النقل أو النسخ التي يعرضها الجهاز قبل بدء العملية. وافصل في خطتك بين ملفات التثبيت وتقدمك المحفوظ ومقاطع التصوير؛ الحاجة إلى مساحة في فئة لا تعني أن عليك حذف البيانات من فئة أخرى. ابدأ بأكبر الملفات غير المستخدمة، وتحقق من النتيجة بعد كل خطوة.

بالنسبة إلى GTA VI، ارجع إلى متطلب التثبيت الرسمي وإلى قراءة المساحة الحرة في جهازك نفسه. لا تعتمد على السعة المكتوبة على علبة القرص بوصفها المساحة المتاحة الآن. وإذا لم يكف نقل الألعاب غير المستخدمة، قارن الخيارات المتوافقة مع طراز جهازك وتأكد من مواصفات المنتج المحدد قبل الشراء، بدل الاعتماد على اسم عام مثل «قرص سريع».`,
    aliases: ["مساحة إكس بوكس", "USB Xbox", "Storage Expansion", "SSD"], tags: ["Xbox", "storage", "installation"],
    related: ["gta-vi-installation-space-212-gb", "xbox-captures-backup-onedrive"],
    srcUrls: [["Xbox Wire — Series X and S storage architecture", "https://news.xbox.com/en-us/2020/09/24/xbox-series-x-and-xbox-series-s-custom-storage-solution-primer/"], ["Xbox Wire — Series X technology glossary", "https://news.xbox.com/en-us/2020/03/16/xbox-series-x-glossary/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "xbox-disable-quick-resume-per-game", status: "official",
    en: "Turn off Xbox Quick Resume for one game when testing a fresh launch",
    ar: "إيقاف Quick Resume للعبة واحدة عند اختبار تشغيل جديد",
    sEn: "The April 2026 Xbox update added a per-game control. Use it to isolate a resume-related symptom without assuming a GTA VI bug.",
    sAr: "أضاف تحديث Xbox في أبريل 2026 تحكمًا لكل لعبة. استخدمه لمقارنة الاستئناف بالتشغيل الجديد عند تشخيص مشكلة.",
    bEn: `Xbox's April 2026 update allows Quick Resume to be disabled for an individual game. Open the game's tile and choose Manage game and add-ons > Quick Resume settings. The Quick Resume group's More options menu also provides Manage Quick Resume. Microsoft describes the option as a way to make the selected game launch fresh.

This is useful for a controlled troubleshooting comparison. First, record the symptom, the time since the previous session, and whether it appears only after resuming. Save progress, then compare the same action after a fresh launch.

Change only the resume setting for this test. If you simultaneously change the network, delete data, and reinstall the game, it becomes difficult to tell which action affected the result. Keep the comparison small enough that you can repeat it.

If the symptom disappears, report the observed difference without declaring a confirmed GTA VI defect or a universal fix. If nothing changes, restore your preferred setting and investigate the actual error message.`,
    bAr: `يتيح تحديث Xbox الصادر في أبريل 2026 تعطيل Quick Resume لكل لعبة على حدة. من مربع اللعبة اختر Manage game and add-ons ثم Quick Resume settings. ويمكن الوصول أيضًا من More options داخل مجموعة Quick Resume إلى Manage Quick Resume. وتوضح Microsoft أن هذا الخيار يجعل اللعبة المحددة تبدأ تشغيلًا جديدًا.

يمكن استخدامه لإجراء مقارنة منظمة عند تشخيص مشكلة. سجّل العرض أولًا، والمدة منذ الجلسة السابقة، وهل يظهر بعد الاستئناف فقط. احفظ تقدمك، ثم جرّب الفعل نفسه بعد تشغيل جديد وقارن النتيجتين. الفكرة هي اختبار عامل واحد تستطيع وصفه بوضوح.

لا تغيّر الشبكة وتحذف البيانات وتعيد تثبيت اللعبة في التجربة نفسها؛ عندها يصعب تحديد ما الذي أحدث فرقًا. اجعل المقارنة صغيرة وقابلة للتكرار، واكتب متى ظهر الخطأ وما الرسالة التي رافقته. وإذا كانت المشكلة عشوائية، لا تعتمد على نجاح محاولة واحدة وحدها للحكم النهائي.

عندما تختفي المشكلة بعد التشغيل الجديد، انقل الفرق الذي شاهدته دون اعتباره عيبًا مؤكدًا في GTA VI أو حلًا مضمونًا لكل اللاعبين. وإذا لم يتغير شيء، أعد الخيار إلى ما يناسبك وراجع رسالة الخطأ الفعلية.`,
    aliases: ["Quick Resume", "تعليق بعد الاستئناف", "تشغيل جديد Xbox"], tags: ["Xbox", "support", "Quick Resume"],
    related: ["save-often-launch-bugs", "launch-week-bug-reports"],
    srcUrls: [["Xbox Wire — April 2026 update", "https://news.xbox.com/en-us/2026/04/30/april-xbox-update-2026/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "ps5-transfer-gta-vi-progress-new-console", status: "official",
    en: "Move to another PS5 without confusing the game download with your save",
    ar: "الانتقال إلى PS5 آخر مع التحقق من تقدمك وملفاتك",
    sEn: "Prepare the source and destination consoles, transfer the required data, then verify your progress before retiring the old device.",
    sAr: "جهّز الجهازين وانقل البيانات المطلوبة، ثم تحقق من تقدمك قبل الاستغناء عن الجهاز القديم.",
    bEn: `Sony's console transfer procedure uses the same account and network, with updated system software. On the destination PS5, open Settings > System > System Software > Data Transfer. PS5-to-PS5 transfer supports saved data, games, screenshots, and video clips. Sony also advises backing up and checking data before resetting a console that will be sold or given away.

Create a small checklist before starting: the account that owns the game, the latest progress you expect, and any captures you want to retain. A downloaded game and a saved session answer different questions; the game tile appearing is not proof that your latest progress is present.

After transfer finishes, open the game on the new device and verify a recognizable mission or location. Check at least one important capture too. Keep the old console intact until these checks succeed, rather than discovering a missing file after disposal.

If you already played on both devices, compare the available save information before choosing which copy to continue. Keep a note of the result so the next session starts from a known state. Follow the official transfer prompts throughout the process.`,
    bAr: `توضح Sony أن نقل البيانات بين الجهازين يستخدم الحساب نفسه والشبكة نفسها مع تحديث برنامج النظام. على PS5 الجديد افتح Settings ثم System ثم System Software ثم Data Transfer. يشمل النقل من PS5 إلى PS5 بيانات الحفظ والألعاب والصور والمقاطع. كما توصي الشركة بنسخ البيانات والتحقق منها قبل إعادة ضبط جهاز ستبيعه أو تمنحه لشخص آخر.

جهّز قائمة قصيرة قبل البدء: الحساب الذي يملك اللعبة، وآخر تقدم تتوقع رؤيته، واللقطات التي تريد الاحتفاظ بها. وجود ملف اللعبة ووجود جلسة الحفظ أمران مختلفان؛ ظهور مربع اللعبة في المكتبة لا يثبت وحده أن آخر تقدم لك انتقل بنجاح.

بعد اكتمال النقل، افتح اللعبة في الجهاز الجديد وتحقق من مهمة أو مكان تعرف أنك وصلت إليه. وافتح مقطعًا مهمًا واحدًا على الأقل للتأكد من وصول ملفاتك التي تريدها. احتفظ بالجهاز القديم كما هو حتى تنجح هذه المراجعات، بدل اكتشاف ملف مفقود بعد تسليمه لشخص آخر.

إذا لعبت على الجهازين مسبقًا، قارن معلومات الحفظ المتاحة قبل اختيار النسخة التي ستتابع منها. دوّن النتيجة حتى تبدأ الجلسة المقبلة من حالة معروفة. واتبع رسائل النقل الرسمية أثناء التنفيذ؛ المراجعة المنظمة قبل النقل وبعده تقلل الالتباس أكثر من الاعتماد على تذكر أسماء الملفات أو افتراض أن كل البيانات انتقلت لمجرد أن اللعبة أصبحت قابلة للتشغيل.`,
    aliases: ["نقل التخزينة", "PS5 جديد", "نقل بيانات الجهاز"], tags: ["PS5", "save", "transfer"],
    related: ["ps5-cloud-save-sync-check", "ps5-send-captures-to-phone"],
    srcUrls: [["PlayStation — Transfer to a PS5", "https://www.playstation.com/en-us/support/hardware/transfer-games-saved-data-ps4-ps5/"], ["PlayStation — Prepare a console for transfer or disposal", "https://www.playstation.com/en-us/support/hardware/transfer-dispose-console/"]],
    date: "2026-11-21T20:00:00Z",
  },
  {
    category: "tips", slug: "ps5-assist-controller-single-player", status: "official",
    en: "Use a second PS5 controller to assist one player",
    ar: "مساعدة لاعب واحد بيد تحكم ثانية على PS5",
    sEn: "PS5 can combine two controllers through an accessibility setting.",
    sAr: "ميزة وصول في PS5 تسمح بمشاركة التحكم في لاعب واحد.",
    bEn: `PS5's assist-controller feature treats two paired controllers as one input. Enable Settings > Accessibility > Controllers > Use Second Controller for Assistance > Use Assist Controller, then assign both controllers to the same user. Sony specifies that DualSense Edge can be the main controller but not the assist controller; the assist device also has feature limitations.

Agree on a simple division of actions before trying it. For example, one person can handle a difficult input temporarily while the main player retains the rest. Start somewhere calm and test what happens when both people press controls at the same time.

Keep the main player's preference central: agree when help is wanted and when the second person should stop. A short verbal signal is often clearer than both players attempting the same action unexpectedly.

This console feature combines inputs for one player. It does not establish a second character, split-screen play, or an undocumented GTA VI multiplayer mode. Check the controller compatibility list if setup fails, and distinguish an unsupported controller from a problem in the game. Use the arrangement only where it improves comfort and control for the person playing.`,
    bAr: `تتعامل ميزة يد المساعدة في PS5 مع يدَي تحكم مقترنتين بوصفهما مدخلًا للاعب واحد. فعّل Settings ثم Accessibility ثم Controllers ثم Use Second Controller for Assistance ثم Use Assist Controller، وأسند اليدين إلى المستخدم نفسه. وتوضح Sony أن DualSense Edge تصلح يدًا رئيسية ولا تصلح يد مساعدة، وأن بعض الوظائف غير متاحة في يد المساعدة.

اتفقا على توزيع بسيط للأفعال قبل التجربة. يمكن لشخص أن يساعد مؤقتًا في إدخال يصعب تنفيذه، بينما يحتفظ اللاعب الأساسي ببقية التحكم. ابدآ في موقف هادئ، واختبرا ما يحدث إذا ضغط كل منكما أزرارًا في الوقت نفسه، حتى لا تتحول المساعدة إلى ارتباك أثناء موقف سريع.

اجعلا رغبة اللاعب الأساسي هي المرجع: متى يحتاج إلى المساعدة، ومتى ينبغي للشخص الآخر التوقف؟ إشارة لفظية قصيرة أو اتفاق مسبق أوضح من محاولة الطرفين تنفيذ الفعل نفسه دون تنسيق. وبعد التجربة، راجعا ما الذي أصبح أسهل وما الذي يحتاج توزيعًا مختلفًا.

هذه ميزة في نظام الجهاز تجمع المدخلات للاعب واحد. لا تنشئ شخصية ثانية أو شاشة منقسمة، ولا تثبت وجود طور جماعي إضافي في GTA VI. إذا تعذر إعدادها، راجع توافق اليد المستخدمة قبل نسبة المشكلة إلى اللعبة. الهدف أن يصبح التحكم أريح وأكثر وضوحًا للشخص الذي يلعب، وفق احتياجه الفعلي.`,
    aliases: ["يد مساعدة", "يدين للاعب واحد", "Assist Controller"], tags: ["PS5", "accessibility", "controller"],
    related: ["ps5-dualsense-button-remapping", "accessibility-easy-mode"],
    srcUrls: [["PlayStation — Second controller for assistance", "https://www.playstation.com/en-us/support/hardware/second-controller-assistance/"]],
    date: "2026-11-21T20:00:00Z",
  },
];

export default entries.flatMap(({ category, ...entry }) => {
  if (entry.slug === officialRemotePlayAddition.slug) {
    const addition = officialRemotePlayAddition;
    entry = {
      ...entry,
      bEn: `${entry.bEn}\n\n${addition.bEn}`,
      bAr: `${entry.bAr}\n\n${addition.bAr}`,
      srcUrls: [...(entry.srcUrls ?? []), ...addition.srcUrls].filter(([_, url], index, all) => all.findIndex((source) => source[1] === url) === index),
      related: [...new Set([...(entry.related ?? []), ...addition.related])],
    };
  }
  return build(category, [entry]);
});
