import { build } from "./helpers";

const SRC_BLOOMBERG: [string, string] = ["BNN Bloomberg — Saudi Arabia once banned GTA; now it has a stake", "https://www.bnnbloomberg.ca/business/international/2026/11/20/saudi-arabia-once-banned-grand-theft-auto-now-its-got-a-stake-in-it/"];
const SRC_MARKET: [string, string] = ["Reuters via MarketScreener — Xzit interview", "https://ca.marketscreener.com/news/saudi-approval-of-gta-vi-is-an-amazing-thing-says-content-creator-ce785ed2df81f12c"];
const SRC_STREAMS: [string, string] = ["Streams Charts — GTA/RP ranking, 16 Nov 2026", "https://streamscharts.com/news/gta-6-streamers-top-gta-creators-2026"];
const SRC_YT24: [string, string] = ["Streams Charts — announced marathon lineup, 13 Nov 2026", "https://streamscharts.com/news/youtube-announces-24-hour-gta-6-launch-marathon-global-creators"];
const SRC_KLIPPAH: [string, string] = ["Klippah — earlier launch-stream expectations", "https://klippah.com/gta6live"];

export default build("streamers", [
  {
    slug: "xzit-thamer-al-dairem",
    status: "confirmed",
    featured: true,
    en: "Xzit (Thamer Al Dairem)",
    ar: "إكزت — ثامر الديرم (Xzit)",
    sEn: "Xzit Thamer's own YouTube profile and press reporting on his GTA VI launch activity in Saudi Arabia.",
    sAr: "قناة Xzit Thamer نفسها، وتغطية صحفية لنشاطه مع إطلاق GTA VI في السعودية.",
    bEn: `Thamer Al Dairem, known as Xzit, is a Riyadh-based creator. Press coverage reports him playing GTA VI at launch and welcoming Saudi approval of the game.

Follow @xzit_thamer on YouTube for his videos, including the linked GTA VI trailer reaction. For the regional background, see the related Saudi Arabia article.`,
    bAr: `ثامر الديرم، المعروف بـ Xzit، صانع محتوى من الرياض. التغطية الصحفية تذكر لعبه GTA VI مع الإطلاق وترحيبه بفسح اللعبة في السعودية.

تابع قناته @xzit_thamer على يوتيوب لمقاطعه، ومنها ردة فعله على إعلان GTA VI في الرابط أدناه. ولخلفية الخبر المحلي، راجع موضوع السعودية المرتبط.`,
    aliases: ["Xzit", "ثامر الديرم", "اكزت", "إكزت", "Xzit Thamer", "xzit_thamer"],
    tags: ["Saudi", "YouTube"],
    facts: [
      ["Country", "الدولة", "Saudi Arabia (Riyadh)", "السعودية (الرياض)"],
      ["YouTube", "يوتيوب", "@xzit_thamer", "@xzit_thamer"],
    ],
    related: ["saudi-arabia-gta-ban-lifted"],
    srcUrls: [
      SRC_MARKET,
      ["Xzit Thamer — YouTube channel", "https://www.youtube.com/channel/UCUwf9tuytTCVP6SzMaGwDVA"],
      ["Xzit Thamer — trailer-reaction video listing", "https://www.youtube.com/watch?v=a_sk1rqwcmg"],
    ],
  },
  {
    slug: "3mr-amr-diab",
    status: "confirmed",
    en: "3mr (Amr Diab)",
    ar: "عمرو — 3mr (Amr Diab)",
    sEn: "3mr's Kick and YouTube profiles.",
    sAr: "حسابات 3mr على Kick ويوتيوب.",
    bEn: `Streams Charts listed 3mr in its 16 November 2026 GTA/RP ranking, before GTA VI launched.

Find his broadcasts at /3mr on Kick and his videos at @3mrdiab on YouTube. The linked Kick archive includes a GTA VI-titled broadcast. These exact profiles help distinguish the streamer from other people sharing his name.`,
    bAr: `تقرير Streams Charts بتاريخ 16 نوفمبر 2026 أدرج 3mr في ترتيب GTA/RP قبل إطلاق GTA VI.

بثوثه على /3mr في Kick، ومقاطعه على @3mrdiab في يوتيوب. رابط الأرشيف أدناه لبث يحمل عنوان GTA VI. هذه الحسابات تساعدك توصل للستريمر المقصود بعيدًا عن تشابه الأسماء.`,
    aliases: ["3mr", "Amr Diab", "عمرو دياب ستريمر", "عمرو 3mr", "عمر 3mr", "3mrdiab"],
    tags: ["Egypt", "Kick"],
    facts: [["Country", "الدولة", "Egypt", "مصر"]],
    srcUrls: [
      SRC_STREAMS,
      ["3mr — Kick profile", "https://kick.com/3mr"],
      ["3mr Diab — YouTube channel", "https://www.youtube.com/channel/UC6gTOqPVfx6g6Cmi8Ah80pA"],
      ["3mr — GTA VI VOD listing", "https://kick.com/3mr/videos/01a1f6f7-1b80-7ca3-ae57-74ae9f39c231"],
    ],
  },
  {
    slug: "sxb-ahmed-alqahtani",
    status: "confirmed",
    en: "sxb (Ahmed Alqahtani)",
    ar: "شونق — أحمد القحطاني (SXB)",
    sEn: "SXB's Kick profile and linked SHoNgxBoNg channel.",
    sAr: "حساب شونق على Kick وقناة SHoNgxBoNg المرتبطة.",
    bEn: `Streams Charts listed SXB in its 16 November 2026 GTA/RP ranking, before GTA VI launched.

Watch SHoNgxBoNg through /SXB on Kick or @SHoNgxxBoNg on YouTube. Check the game and publication date on each broadcast; a GTA/RP ranking is separate from GTA VI coverage.`,
    bAr: `تقرير Streams Charts بتاريخ 16 نوفمبر 2026 أدرج SXB في ترتيب GTA/RP قبل إطلاق GTA VI.

تابع شونق على /SXB في Kick أو @SHoNgxxBoNg في يوتيوب. راجع اسم اللعبة وتاريخ البث؛ ترتيب GTA/RP منفصل عن تغطية GTA VI.`,
    aliases: ["sxb", "أحمد القحطاني", "sxb ستريمر", "شونق", "شونق بونق", "SHoNgxBoNg", "SHoNgxxBoNg"],
    tags: ["Saudi", "Kick", "YouTube"],
    facts: [["Country", "الدولة", "Saudi Arabia", "السعودية"]],
    srcUrls: [
      SRC_STREAMS,
      ["SXB — Kick profile", "https://kick.com/SXB"],
      ["SHoNgxBoNg — YouTube channel linked by SXB", "https://www.youtube.com/channel/UC5hnxbraFmMPxv63U4hCwTQ"],
    ],
  },
  {
    slug: "drb7h-mofareh-al-asiri",
    status: "confirmed",
    en: "drb7h (Mofareh Al Asiri)",
    ar: "دربحة — مفرح العسيري (drb7h)",
    sEn: "Drb7h's Kick profile and pre-launch ranking.",
    sAr: "حساب دربحة على Kick وترتيبه قبل الإطلاق.",
    bEn: `Streams Charts listed Drb7h in its 16 November 2026 GTA/RP ranking, before GTA VI launched.

Find his broadcasts at /drb7h on Kick. Check each broadcast's game and date, since the earlier GTA/RP ranking covers the wider franchise.`,
    bAr: `تقرير Streams Charts بتاريخ 16 نوفمبر 2026 أدرج دربحة في ترتيب GTA/RP قبل إطلاق GTA VI.

بثوث دربحة على /drb7h في Kick. راجع اسم اللعبة وتاريخ كل بث، لأن ترتيب GTA/RP السابق يخص السلسلة بشكل أوسع.`,
    aliases: ["drb7h", "مفرح العسيري", "درب7", "دربحه", "دربحة", "دربح"],
    tags: ["Saudi", "Kick"],
    facts: [["Country", "الدولة", "Saudi Arabia", "السعودية"]],
    srcUrls: [
      SRC_STREAMS,
      ["Drb7h — Kick profile", "https://kick.com/drb7h"],
    ],
  },
  {
    slug: "youtube-24h-launch-arab-creators",
    status: "confirmed",
    en: "Bilal Fadili and Rima in YouTube's announced GTA VI marathon lineup",
    ar: "بلال فضيلي وريما في القائمة المعلنة لماراثون يوتيوب GTA VI",
    sEn: "The 13 November announcement listed Bilal Fadili and Rima for Arabic coverage; completed participation is not verified here.",
    sAr: "إعلان 13 نوفمبر أدرج بلال فضيلي وريما للتغطية العربية؛ المشاركة الفعلية ليست موثقة هنا.",
    bEn: `Streams Charts reported on 13 November 2026 that YouTube planned a 24-hour GTA VI launch marathon. Its announced Arabic lineup included Bilal Fadili and Rima. This is evidence of the advertised lineup, not a record of their completed appearances.

Their identified YouTube channels are @BilalFadili and @RimaOsta. RimaOsta is the profile intended here. Each channel's own GTA VI uploads are separate from participation in YouTube's official event.`,
    bAr: `نقل تقرير Streams Charts بتاريخ 13 نوفمبر 2026 خطة يوتيوب لماراثون إطلاق GTA VI مدته 24 ساعة. القائمة العربية المعلنة ضمت بلال فضيلي وريما. هذا توثيق لقائمة الإعلان، وليس سجلًا لظهورهما الفعلي في البث.

قناتاهما المحددتان هما @BilalFadili و@RimaOsta. المقصود بريما هنا حساب RimaOsta. نشر فيديو GTA VI في قناة أي منهما أمر منفصل عن المشاركة في حدث يوتيوب الرسمي.`,
    aliases: ["Bilal Fadili", "Rima", "YouTube marathon", "بلال فضيلي", "ريما", "RimaOsta", "ريما أوستا", "ماراثون يوتيوب"],
    tags: ["YouTube", "launch"],
    srcUrls: [
      SRC_YT24,
      ["Bilal Fadili — YouTube channel", "https://www.youtube.com/channel/UCw81FIQlzaVxgiQKiqTuCBQ"],
      ["Rima — YouTube channel @RimaOsta", "https://www.youtube.com/channel/UCFlp8ti7kvEMbiqAE8Zazag"],
    ],
  },
  {
    slug: "banderitax-aboflah-launch",
    status: "rumor",
    en: "BanderitaX and AboFlah: channel links and GTA VI launch evidence",
    ar: "بندريتا وأبو فلة: القنوات وما نعرفه عن نشاط GTA VI",
    sEn: "BanderitaX has a GTA VI-titled upload on his own channel. AboFlah's launch-day gameplay remains unverified here.",
    sAr: "قناة بندريتا تعرض فيديو بعنوان GTA VI؛ لعب أبو فلة يوم الإطلاق ما زال غير موثق هنا.",
    bEn: `BanderitaX: his own channel lists a GTA VI video about exploring the world, and YouTube attributes the linked upload to BanderitaX. The upload title is a useful way to find his coverage; individual gameplay tips still need their own evidence.

AboFlah: the main and gaming channel links are identified below. A GTA VI-related upload alone does not verify launch-day gameplay. The earlier fan tracker expected him to participate; this part remains unconfirmed.`,
    bAr: `بندريتا: قناته نفسها تعرض فيديو عن التمشية في عالم GTA VI، ويوتيوب ينسب الفيديو المرتبط إلى BanderitaX. عنوان الفيديو يساعدك تلقى تغطيته؛ أما نصائح اللعب داخل المقطع فتحتاج تحققًا مستقلًا.

أبو فلة: روابط القناة الرئيسية وقناة الألعاب محددة أدناه. وجود فيديو متعلق بـ GTA VI وحده ما يثبت لعبه يوم الإطلاق. دليل المعجبين السابق كان يتوقع مشاركته، وهذا الجزء ما زال غير مؤكد.`,
    aliases: ["BanderitaX", "AboFlah", "بندريتا", "أبو فلة", "ابو فله", "ابوفله", "أبوفلة", "Aboflah_Gaming"],
    tags: ["Saudi", "Kuwait", "YouTube"],
    srcUrls: [
      ["BanderitaX — YouTube channel", "https://www.youtube.com/channel/UCxEGVXh6fi-XYo58NZrbIHQ"],
      ["BanderitaX — GTA VI upload listing", "https://www.youtube.com/watch?v=jPp-kYppK6M"],
      ["AboFlah — main YouTube channel", "https://www.youtube.com/channel/UCqq5n-Oe-r1EEHI3yvhVJcA"],
      ["AboFlah Gaming — YouTube channel", "https://www.youtube.com/channel/UCRu9mro2nPafhMxVy2CRfXA"],
      SRC_KLIPPAH,
    ],
  },
  {
    slug: "saudi-arabia-gta-ban-lifted",
    status: "confirmed",
    en: "From banned to bestseller: GTA VI in Saudi Arabia",
    ar: "من الحظر للانتشار: GTA VI في السعودية",
    sEn: "Saudi Arabia lifted its ban on the GTA series in 2025; GTA VI is the first new entry released since, rated 21+.",
    sAr: "السعودية رفعت الحظر عن سلسلة GTA في 2025، و GTA VI أول جزء جديد ينزل بعدها، بتصنيف +21.",
    bEn: `The Grand Theft Auto series was long banned in Saudi Arabia. That changed in 2025, and GTA VI is the first new entry released since. Reports say it carries a 21+ rating in the Kingdom. Bloomberg notes the twist that Saudi Arabia, through its investments in gaming, now has a financial stake in the industry around it.

A claim that Saudi pre-orders reached 10 million is attributed to a creator and hasn't been independently verified.`,
    bAr: `سلسلة Grand Theft Auto كانت محظورة في السعودية لسنين. وهذا تغيّر في 2025، و GTA VI أول جزء جديد ينزل بعدها. والتقارير تقول إن تصنيفها في المملكة +21. وتشير Bloomberg للمفارقة إن السعودية، عن طريق استثماراتها في الألعاب، صار لها حصة مالية في الصناعة نفسها.

وفيه ادعاء إن الحجوزات المسبقة في السعودية وصلت 10 مليون، منسوب لصانع محتوى وما تأكد بشكل مستقل.`,
    aliases: ["Saudi", "ban", "السعودية", "حظر", "تصنيف 21"],
    tags: ["Saudi", "news"],
    related: ["xzit-thamer-al-dairem"],
    srcUrls: [SRC_BLOOMBERG, ["Shattered — Saudi Arabia rates GTA VI 21+", "https://shattered.io/saudi-gta-vi-approval-21-plus-xzit-thamer-al-dairem-amazing-thing/"]],
    date: "2026-11-20T10:00:00Z",
  },
  {
    slug: "ishowspeed-gta-6",
    status: "confirmed",
    en: "IShowSpeed: the most-watched GTA VI streamer on launch day",
    ar: "IShowSpeed (سبيد): أكثر ستريمر انشاف في GTA VI يوم الإطلاق",
    sEn: "Speed led day one with 4.47M hours watched; his first broadcast passed ~65M views.",
    sAr: "سبيد تصدّر أول يوم بـ 4.47 مليون ساعة مشاهدة، وأول بث له عدّى ~65 مليون مشاهدة.",
    bEn: `IShowSpeed was the most-watched creator of GTA VI's first 24 hours, with 4.47 million hours watched across YouTube and Twitch. His first broadcast passed about 65.1 million views by 20 November — nearly four times the next most-viewed launch stream. Reports of his peak concurrent viewers disagree (285K vs 392.5K).`,
    bAr: `IShowSpeed كان أكثر صانع محتوى انشاف في أول 24 ساعة من GTA VI، بـ 4.47 مليون ساعة مشاهدة على YouTube و Twitch. وأول بث له عدّى تقريباً 65.1 مليون مشاهدة بحلول 20 نوفمبر — تقريباً أربع أضعاف ثاني أكثر بث. وأرقام ذروة المشاهدين المتزامنين عنده مختلفة بين المصادر (285 ألف مقابل 392.5 ألف).`,
    aliases: ["IShowSpeed", "Speed", "سبيد", "آي شو سبيد"],
    tags: ["YouTube", "record", "global"],
    related: ["livestream-record-7-91-million-viewers"],
    facts: [
      ["Coverage", "نطاق التغطية", "Global creator", "صانع محتوى عالمي"],
    ],
    srcUrls: [
      ["Streams Charts — GTA 6 day-one recap", "https://streamscharts.com/news/gta-6-day1-recap"],
      ["Streams Charts — most-viewed YouTube launch streams", "https://streamscharts.com/news/gta-6s-most-viewed-youtube-streams"],
      ["IShowSpeed — YouTube channel", "https://www.youtube.com/channel/UCWsDFcIhY2DBi3GB5uykGXA"],
    ],
    date: "2026-11-20T21:00:00Z",
  },
]);
