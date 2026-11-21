import { build } from "./helpers";

const SRC_BLOOMBERG: [string, string] = ["BNN Bloomberg — Saudi Arabia once banned GTA; now it has a stake", "https://www.bnnbloomberg.ca/business/international/2026/11/20/saudi-arabia-once-banned-grand-theft-auto-now-its-got-a-stake-in-it/"];
const SRC_MARKET: [string, string] = ["MarketScreener — Saudi approval of GTA VI is 'an amazing thing'", "https://www.marketscreener.com/news/saudi-approval-of-gta-vi-is-an-amazing-thing-says-content-creator-ce785ed2df81f12c"];
const SRC_STREAMS: [string, string] = ["Streams Charts — top GTA creators of 2026", "https://streamscharts.com/news/gta-6-streamers-top-gta-creators-2026"];
const SRC_YT24: [string, string] = ["Streams Charts — YouTube 24-hour launch marathon lineup", "https://streamscharts.com/news/youtube-announces-24-hour-gta-6-launch-marathon-global-creators"];
const SRC_KLIPPAH: [string, string] = ["Klippah — every streamer playing GTA 6 on launch day", "https://klippah.com/gta6live"];

export default build("streamers", [
  {
    slug: "xzit-thamer-al-dairem",
    status: "confirmed",
    featured: true,
    en: "Xzit (Thamer Al Dairem)",
    ar: "إكزت — ثامر الديرم (Xzit)",
    sEn: "Riyadh-based creator who played GTA VI at launch and called the Saudi approval of the game 'an amazing thing'.",
    sAr: "صانع محتوى من الرياض لعب GTA VI يوم الإطلاق، ووصف فسح اللعبة في السعودية بأنه 'شي رهيب'.",
    bEn: `Thamer Al Dairem, known as Xzit, streams from Riyadh and was one of the Saudi creators playing GTA VI on launch day — the first new GTA released since Saudi Arabia lifted its ban on the series in 2025.

He told reporters the approval was personal: doors opened for him once the game was cleared, and brands started approaching him. A profile cited by one outlet puts his following above 15 million across platforms, but that figure is second-hand.`,
    bAr: `ثامر الديرم، المعروف بـ Xzit، يبث من الرياض، وكان من صناع المحتوى السعوديين اللي لعبوا GTA VI يوم الإطلاق — وهي أول لعبة GTA جديدة تنزل بعد ما رفعت السعودية الحظر عن السلسلة في 2025.

قال للصحافة إن فسح اللعبة كان شي شخصي بالنسبة له: انفتحت له أبواب، وصارت العلامات التجارية تتواصل معه. وفيه ملف صحفي يقول إن متابعينه فوق 15 مليون على كل المنصات، لكن الرقم منقول ومو مؤكد.`,
    aliases: ["Xzit", "ثامر الديرم", "اكزت", "إكزت"],
    tags: ["Saudi", "YouTube"],
    facts: [
      ["Country", "الدولة", "Saudi Arabia (Riyadh)", "السعودية (الرياض)"],
      ["Followers", "المتابعين", "15M+ (reported)", "+15 مليون (حسب التقارير)"],
    ],
    related: ["saudi-arabia-gta-ban-lifted"],
    srcUrls: [SRC_BLOOMBERG, SRC_MARKET],
  },
  {
    slug: "3mr-amr-diab",
    status: "confirmed",
    en: "3mr (Amr Diab)",
    ar: "عمر — 3mr (Amr Diab)",
    sEn: "Egyptian streamer ranked among the most-watched GTA creators by Streams Charts.",
    sAr: "ستريمر مصري من أكثر صناع محتوى GTA مشاهدة حسب Streams Charts.",
    bEn: `Egyptian streamer Amr "3mr" Diab ranks among the most-watched GTA creators in Streams Charts' 2026 data. The same report notes that Arabic-language creators are especially prominent in GTA streaming, particularly on Kick.`,
    bAr: `الستريمر المصري عمرو "3mr" دياب من أكثر صناع محتوى GTA مشاهدة في بيانات Streams Charts لسنة 2026. ونفس التقرير يقول إن صناع المحتوى العرب بارزين جداً في بث GTA، خصوصاً على منصة Kick.`,
    aliases: ["3mr", "Amr Diab", "عمرو دياب ستريمر"],
    tags: ["Egypt", "Kick"],
    facts: [["Country", "الدولة", "Egypt", "مصر"]],
    srcUrls: [SRC_STREAMS],
  },
  {
    slug: "sxb-ahmed-alqahtani",
    status: "confirmed",
    en: "sxb (Ahmed Alqahtani)",
    ar: "sxb — أحمد القحطاني",
    sEn: "Saudi creator among the most-watched GTA streamers in Streams Charts' rankings.",
    sAr: "صانع محتوى سعودي من أكثر ستريمرز GTA مشاهدة في ترتيب Streams Charts.",
    bEn: `Saudi streamer Ahmed "sxb" Alqahtani appears among the most-watched GTA creators in Streams Charts' 2026 rankings — part of a wave of Arabic creators leading GTA viewership.`,
    bAr: `الستريمر السعودي أحمد "sxb" القحطاني من ضمن أكثر صناع محتوى GTA مشاهدة في ترتيب Streams Charts لسنة 2026 — جزء من موجة صناع المحتوى العرب اللي يتصدرون مشاهدات GTA.`,
    aliases: ["sxb", "أحمد القحطاني", "sxb ستريمر"],
    tags: ["Saudi"],
    facts: [["Country", "الدولة", "Saudi Arabia", "السعودية"]],
    srcUrls: [SRC_STREAMS],
  },
  {
    slug: "drb7h-mofareh-al-asiri",
    status: "confirmed",
    en: "drb7h (Mofareh Al Asiri)",
    ar: "درب7 — مفرح العسيري (drb7h)",
    sEn: "Saudi GTA streamer ranked among the most-watched creators.",
    sAr: "ستريمر GTA سعودي من أكثر صناع المحتوى مشاهدة.",
    bEn: `Saudi streamer Mofareh "drb7h" Al Asiri is listed among the most-watched GTA creators in Streams Charts' 2026 dataset.`,
    bAr: `الستريمر السعودي مفرح "drb7h" العسيري من ضمن أكثر صناع محتوى GTA مشاهدة في بيانات Streams Charts لسنة 2026.`,
    aliases: ["drb7h", "مفرح العسيري", "درب7"],
    tags: ["Saudi"],
    facts: [["Country", "الدولة", "Saudi Arabia", "السعودية"]],
    srcUrls: [SRC_STREAMS],
  },
  {
    slug: "youtube-24h-launch-arab-creators",
    status: "confirmed",
    en: "Arab creators in YouTube's 24-hour GTA VI launch marathon",
    ar: "صناع محتوى عرب في ماراثون يوتيوب 24 ساعة لإطلاق GTA VI",
    sEn: "YouTube's global launch livestream included Arabic creators Bilal Fadili and Rima.",
    sAr: "بث يوتيوب العالمي لإطلاق اللعبة كان فيه صناع محتوى عرب: Bilal Fadili و Rima.",
    bEn: `For launch, YouTube ran a 24-hour GTA VI livestream marathon with creators from around the world. The lineup went well beyond English-language channels — covering Spanish, Portuguese, French and Arabic audiences — and listed Bilal Fadili and Rima for Arabic, with the UAE among the represented countries.`,
    bAr: `مع الإطلاق، سوّت يوتيوب ماراثون بث 24 ساعة لـ GTA VI مع صناع محتوى من كل العالم. والقائمة ما كانت إنجليزي بس — شملت جمهور إسباني وبرتغالي وفرنسي وعربي — وكان فيها Bilal Fadili و Rima للعربي، والإمارات من الدول المشاركة.`,
    aliases: ["Bilal Fadili", "Rima", "YouTube marathon", "بلال فضيلي", "ريما"],
    tags: ["YouTube", "launch"],
    srcUrls: [SRC_YT24],
  },
  {
    slug: "banderitax-aboflah-launch",
    status: "rumor",
    en: "BanderitaX and AboFlah expected on GTA VI at launch",
    ar: "بندريتا وأبو فلة: متوقع يلعبون GTA VI مع الإطلاق",
    sEn: "A fan guide lists Saudi BanderitaX and Kuwait's AboFlah among creators expected to play at launch — single source.",
    sAr: "دليل للمعجبين يذكر بندريتا من السعودية وأبو فلة من الكويت ضمن اللي متوقع يلعبون مع الإطلاق — مصدر واحد بس.",
    bEn: `A fan-run tracker of launch-day streams lists BanderitaX (Saudi Arabia) and AboFlah (Kuwait) among Arabic creators expected to play GTA VI. We haven't confirmed their streams from a second source yet — we'll update this page when we do.`,
    bAr: `موقع معجبين يتابع بثوث يوم الإطلاق يذكر BanderitaX (السعودية) و AboFlah (الكويت) ضمن صناع المحتوى العرب المتوقع يلعبون GTA VI. لسه ما أكدنا بثوثهم من مصدر ثاني — بنحدّث الصفحة أول ما نتأكد.`,
    aliases: ["BanderitaX", "AboFlah", "بندريتا", "أبو فلة", "ابو فله"],
    tags: ["Saudi", "Kuwait"],
    srcUrls: [SRC_KLIPPAH],
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
    tags: ["YouTube", "record"],
    related: ["livestream-record-7-91-million-viewers"],
    srcUrls: [["Streams Charts — GTA 6 day-one recap", "https://streamscharts.com/news/gta-6-day1-recap"], ["Streams Charts — most-viewed YouTube launch streams", "https://streamscharts.com/news/gta-6s-most-viewed-youtube-streams"]],
    date: "2026-11-20T21:00:00Z",
  },
]);
