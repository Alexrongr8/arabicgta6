import { build, type SeedInput } from "./helpers";

export const phoneTranslationDrafts: SeedInput[] = [
  {
    slug: "translate-game-text-google-camera",
    status: "official",
    en: "Read game instructions with Google Translate's phone camera",
    ar: "اقرأ تعليمات اللعبة بكاميرا Google Translate على الجوال",
    sEn: "Translate a clear photo of the text while keeping names and button prompts available in the original.",
    sAr: "ترجم صورة واضحة للنص، واحتفظ بالأسماء وتعليمات الأزرار الأصلية للمراجعة.",
    bEn: `Google Translate can translate camera text and saved images; its language list includes Arabic. On Android, choose English and Arabic, open Camera, and capture the words or select a saved image. On iPhone, the same app also offers Camera and image translation. Small or stylized lettering can produce mistakes.

For a game screen, try a stationary menu first. Frame the relevant sentence, freeze the picture and compare names, amounts and controller symbols with the original. This is a suggested use of Google's documented feature, not a completed GTA VI device test. The translation appears on your phone; it does not install an Arabic game patch or alter the television output.

For offline use, download the available language packs beforehand. If a language has no download button, that option is unavailable there. Try the same image in airplane mode before relying on it. Fast subtitles may require a captured frame instead of continuous reading.

The attached Google video demonstrates the camera-translation concept in Google Lens. It is an older Lens demonstration, not a current Google Translate menu walkthrough or footage of translated GTA VI.`,
    bAr: `يترجم Google Translate النص عبر الكاميرا ومن الصور المحفوظة، وتضم قائمة لغاته العربية. على أندرويد اختر الإنجليزية والعربية، وافتح Camera، ثم التقط النص أو اختر صورة محفوظة. يتوفر إدخال الكاميرا والصور في تطبيقه على الآيفون أيضًا. قد يخطئ مع الكتابة الصغيرة أو المزخرفة.

جرّب على قائمة ثابتة أولًا: حدّد الجملة المطلوبة، وثبّت الصورة، ثم قارن الأسماء والمبالغ ورموز الأزرار بالأصل. هذه طريقة مقترحة للاستفادة من ميزة Google الموثقة، ولم نختبرها على جهاز أثناء تشغيل GTA VI. تظهر الترجمة على الجوال؛ لا تثبّت تعريبًا للعبة ولا تغيّر صورة التلفزيون.

للاستخدام دون اتصال، نزّل حزم اللغات المتاحة مسبقًا. غياب زر التنزيل يعني أن هذا الخيار غير متاح لتلك اللغة في الواجهة. اختبر الصورة نفسها في وضع الطيران قبل الاعتماد عليها. الحوار السريع قد يحتاج لقطة محفوظة بدل محاولة قراءته أثناء تحركه.

فيديو Google المرفق يوضح فكرة ترجمة الكاميرا داخل Google Lens. عرضه قديم، ولا يشرح قوائم Google Translate الحالية أو يعرض تجربة ترجمة GTA VI.`,
    aliases: ["ترجمة قراند بالجوال", "ترجمة شاشة اللعبة", "Google Translate Camera", "ترجمة الصور", "ترجمة إنجليزي عربي"],
    tags: ["translation", "phone", "accessibility", "google"],
    related: ["subtitles-speakers-background-readability", "ps5-send-captures-to-phone", "xbox-captures-backup-onedrive", "android-circle-search-game-screenshot-translation"],
    videos: ["Zks_TwNd3Vs"],
    srcUrls: [
      ["Google — translate images on Android", "https://support.google.com/translate/answer/6142483?co=GENIE.Platform%3DAndroid&hl=en"],
      ["Google — translate images on iPhone and iPad", "https://support.google.com/translate/answer/6142483?co=GENIE.Platform%3DiOS&hl=en"],
      ["Google — download languages for offline use", "https://support.google.com/translate/answer/6142473?co=GENIE.Platform%3DAndroid&hl=en"],
      ["Google Translate — official Saudi App Store listing and languages", "https://apps.apple.com/sa/app/google-translate/id414706506"],
      ["Google — Translate with Google Lens (official video)", "https://www.youtube.com/watch?v=Zks_TwNd3Vs"],
    ],
  },
  {
    slug: "iphone-translate-game-camera-live-text",
    status: "official",
    en: "Translate a game photo or paused frame with iPhone",
    ar: "ترجم صورة اللعبة أو لقطة موقوفة بالآيفون",
    sEn: "Use Apple's Translate camera or Live Text, then compare uncertain words with the original image.",
    sAr: "استخدم كاميرا تطبيق الترجمة أو Live Text، وراجع الكلمات الملتبسة في الصورة الأصلية.",
    bEn: `In Apple's Translate app, open Camera, frame the words and freeze the image. Choose Arabic and enlarge the result if needed; a photo from your library can also be used. Arabic is among Apple's listed Translate languages.

For a saved image or video, open Photos and use Live Text, then Translate. Pause a video on the sentence first. Apple requires iPhone XS/XR or later with iOS 15 or later for Live Text; video text requires iOS 16 or later.

To prepare for offline use, open the Translate settings and download the input and output languages when offered. Check Apple's guide for your iOS version because the on-device option's name changes between versions. Test one image offline before your play session.

Applying this to a game capture is a suggested workflow, not a hands-on GTA VI test. It translates the picture on the phone, without changing the game's language. Keep the original nearby when reading names or choices. The attached Apple Support video teaches Live Text on a paused video; it is not a demonstration of continuous Arabic game subtitles.`,
    bAr: `افتح Camera في تطبيق الترجمة من Apple، ووجّه الكاميرا للنص ثم ثبّت الصورة. اختر العربية وكبّر الناتج عند الحاجة؛ يمكنك أيضًا استخدام صورة من المكتبة. العربية موجودة ضمن لغات تطبيق الترجمة التي تسردها Apple.

للصورة أو الفيديو المحفوظ، افتح Photos واستخدم Live Text ثم Translate. أوقف الفيديو على الجملة المطلوبة أولًا. تتطلب Live Text آيفون XS أو XR فأحدث مع iOS 15 فأحدث؛ قراءة النص داخل الفيديو تحتاج iOS 16 فأحدث.

للاستعداد دون اتصال، افتح إعدادات تطبيق الترجمة ونزّل لغة الإدخال والإخراج عند توفرهما. طابق دليل Apple مع إصدار iOS لديك، لأن اسم خيار المعالجة على الجهاز يختلف بين الإصدارات. اختبر صورة دون اتصال قبل جلسة اللعب.

استخدام هذه الخطوات مع لقطة لعبة اقتراح عملي، وليس اختبارًا أجريناه على GTA VI. الترجمة تخص الصورة على الهاتف ولا تغيّر لغة اللعبة. احتفظ بالأصل قربك عند قراءة الأسماء أو الاختيارات. فيديو Apple Support المرفق يشرح Live Text على فيديو موقوف؛ لا يعرض ترجمة عربية متواصلة أثناء اللعب.`,
    aliases: ["ترجمة قراند ايفون", "Apple Translate", "Live Text", "ترجمة فيديو موقوف", "ترجمة صورة اللعبة"],
    tags: ["translation", "phone", "accessibility", "iphone"],
    related: ["translate-game-text-google-camera", "subtitles-speakers-background-readability", "ps5-send-captures-to-phone"],
    videos: ["1esEVI_vtpI"],
    srcUrls: [
      ["Apple — use the Translate camera on iPhone", "https://support.apple.com/en-sa/guide/iphone/iphea8b95631/27/ios/27"],
      ["Apple — Live Text requirements, photos and paused videos", "https://support.apple.com/en-us/120004"],
      ["Apple — Translate language downloads and on-device settings", "https://support.apple.com/en-sa/guide/iphone/iphddb6e7264/27/ios/27"],
      ["Apple — iOS and iPadOS feature language availability", "https://www.apple.com/ios/feature-availability/"],
      ["Apple Support — Live Text in video (official demonstration)", "https://www.youtube.com/watch?v=1esEVI_vtpI"],
    ],
  },
  {
    slug: "android-circle-search-game-screenshot-translation",
    status: "official",
    en: "Translate a game screenshot with Circle to Search",
    ar: "ترجم لقطة اللعبة باستخدام Circle to Search",
    sEn: "A phone-screen tool with limits for moving video.",
    sAr: "أداة لشاشة الجوال، لها حدود مع الفيديو المتحرك.",
    bEn: `On a supported Android phone, display the screenshot, hold Home or the navigation handle, then select Translate and Arabic. If unavailable, check device support and update Google, or import the image into Translate.

This suggested game-capture workflow has not been tested here with GTA VI. It changes neither the game nor the TV output. Google excludes videos and GIFs from continuous scroll translation: do not treat it as a verified live Remote Play overlay.`,
    bAr: `على هاتف أندرويد مدعوم، اعرض اللقطة واضغط مطولًا زر الرئيسية أو شريط التنقل، ثم اختر Translate والعربية. إذا غاب الخيار، تحقق من دعم الجهاز وحدّث Google، أو استورد الصورة في تطبيق الترجمة.

لم نختبر هذا الاستخدام المقترح للقطات GTA VI. لا يغيّر اللعبة أو صورة التلفزيون. تستثني Google الفيديو وGIF من ترجمة التمرير المستمرة؛ فلا تعتبرها طبقة ترجمة حية موثقة لـRemote Play.`,
    aliases: ["دائرة البحث", "ترجمة لقطة شاشة", "Circle to Search"],
    tags: ["translation", "android", "screenshots"],
    related: ["translate-game-text-google-camera", "ps5-send-captures-to-phone", "xbox-captures-backup-onedrive"],
    videos: [],
    srcUrls: [["Google — Circle to Search, translation and video limitations", "https://support.google.com/websearch/answer/14508957?hl=en"]],
  },
  {
    slug: "phone-game-dialogue-translation-limits",
    status: "official",
    en: "Can your phone translate game dialogue live?",
    ar: "هل يترجم الجوال حوار اللعبة مباشرة؟",
    sEn: "Try a short passage; game performance remains untested.",
    sAr: "جرّب مقطعًا قصيرًا؛ الأداء مع اللعبة لم نختبره.",
    bEn: `Google lists Arabic for Live translate. Choose the languages and Text only for reading, or Listening for audio. Try a short, clear passage first; we have not measured GTA VI accuracy or delay.

Google's documented offline live-language pairs omit Arabic and require selected Pixel generations. Downloading Arabic for images does not establish offline live-audio support. Treat this as an optional experiment, not an Arabic patch or guaranteed synchronized subtitles.`,
    bAr: `تدرج Google العربية ضمن Live translate. اختر اللغتين ووضع Text only للقراءة، أو Listening للصوت. جرّب مقطعًا قصيرًا وواضحًا أولًا؛ لم نقس الدقة أو التأخير مع GTA VI.

أزواج اللغات التي توثقها Google للصوت الحي دون اتصال لا تشمل العربية، وتتطلب أجيال Pixel محددة. تنزيل العربية للصور لا يثبت دعم الصوت الحي دون اتصال. اعتبرها تجربة اختيارية، وليست تعريبًا للعبة أو ترجمة متزامنة مضمونة.`,
    aliases: ["ترجمة صوت اللعبة", "ترجمة حوار قراند", "Google live translate"],
    tags: ["translation", "audio", "phone"],
    related: ["translate-game-text-google-camera", "iphone-translate-game-camera-live-text", "subtitles-speakers-background-readability"],
    videos: [],
    srcUrls: [["Google — live speech translation and offline language pairs", "https://support.google.com/translate/answer/6142474/?co=GENIE.Platform%3DAndroid&hl=en&lang=en"]],
  },
];

export default build("tips", phoneTranslationDrafts.map((entry) => ({
  ...entry,
  date: "2026-11-21T23:00:00Z",
})));
