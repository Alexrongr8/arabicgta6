// Intended destination: data/seed/tv-experience.ts. Reviewed 22 November 2026.
// Television/console features, not GTA VI rendering modes. Vendor menu paths vary by model.
import { build, type SeedInput } from "./helpers";

const entries: SeedInput[] = [
  {
    slug: "tv-motion-smoothing-not-native-60fps", status: "official",
    en: "Smoother TV motion is not the same as native 60 fps",
    ar: "تنعيم الحركة في التلفزيون: إحساس أنعم، لكن ليس 60 فريم حقيقية",
    sEn: "Understand interpolation before changing your GTA VI display setup.",
    sAr: "افهم الفرق بين الإطارات الوسيطة وأداء اللعبة قبل تعديل الشاشة.",
    bEn: `A television can generate intermediate pictures between incoming frames. LG describes this as motion interpolation. It changes the displayed sequence, not the frames rendered by your console; calling it an unlocked GTA VI performance mode would be misleading.

Our suggested comparison: repeat a slow camera pan, then a short aiming or driving sequence, with smoothing off and on. Judge both appearance and response. Watch thin objects and moving edges for distortions. LG notes that difficult motion can produce artifacts.

Choose the setting that feels comfortable on your own screen. A smoother-looking recording alone cannot tell you how responsive the controller felt.`,
    bAr: `يستطيع التلفزيون توليد صور وسيطة بين الإطارات التي يستقبلها؛ تشرح LG هذه العملية باسم تنعيم الحركة بالإطارات الوسيطة. تتغير طريقة العرض، وليس عدد الإطارات التي يرسمها جهاز الألعاب. لذلك لا يصح تسميتها وضع أداء يفتح 60 فريم داخل GTA VI.

جرّب المقارنة التالية: حرّك الكاميرا ببطء، ثم كرر مقطعًا قصيرًا من التصويب أو القيادة مع إيقاف التنعيم وتشغيله. قيّم شكل الصورة واستجابة التحكم معًا، وراقب حواف الأجسام الرفيعة والمتحركة؛ توضح LG أن المعالجة قد تنتج تشوهات في الحركة المعقدة.

اختر ما يريحك على شاشتك. المقطع الذي يبدو أنعم لا يبيّن وحده إحساس اليد أثناء اللعب.`,
    tags: ["TV", "motion interpolation", "display setup"], aliases: ["60 فريم", "slow motion", "تنعيم الحركة", "frame interpolation"],
    related: ["samsung-game-motion-plus-comparison", "lg-trumotion-gaming-comparison", "sony-motionflow-game-mode", "ps5-vrr-allm-tv-smoothing"],
    srcUrls: [["LG — TruMotion overview", "https://www.lg.com/ca_en/support/product-support/troubleshoot/help-library/cs-CT32004644-1411521672907/"]],
  },
  {
    slug: "samsung-game-motion-plus-comparison", status: "official",
    en: "Samsung Game Motion Plus: compare smoothness with controller response",
    ar: "Game Motion Plus في Samsung: جرّب النعومة وقارن استجابة اليد",
    sEn: "A model-dependent TV feature with a VRR tradeoff; not a GTA VI graphics setting.",
    sAr: "ميزة في بعض الشاشات تتعارض مع VRR، وليست خيار رسوم داخل GTA VI.",
    bEn: `Samsung documents Game Motion Plus under Settings > General > External Device Manager > Game Mode Settings on the models covered by its guide. The menu includes Blur Reduction and Judder Reduction; newer sets may use a different route.

Samsung's Game Bar documentation says interpolation improves apparent smoothness, while turning it off minimizes input lag. It also describes Game Motion Plus and VRR/FreeSync as mutually exclusive on those supported models.

For your own comparison, photograph the starting settings and adjust one control at a time. Use the same corner and car, then try aiming. Keep the lower-latency setup if steering or targeting feels delayed. There is no single best slider value for every television. The linked Samsung video demonstrates its general picture-clarity menu; it does not promise the same menus on every model.`,
    bAr: `تضع Samsung خيار Game Motion Plus في المسار Settings > General > External Device Manager > Game Mode Settings على الموديلات التي يغطيها دليلها. ستجد خيارات مثل Blur Reduction وJudder Reduction؛ قد يختلف المسار في الأجهزة الأحدث.

يوضح دليل Game Bar أن الإطارات الوسيطة تجعل الحركة تبدو أنعم، بينما يحقق إيقافها أقل تأخر للتحكم. ويذكر أن Game Motion Plus وVRR أوFreeSync لا يعملان معًا في الموديلات المشمولة.

للمقارنة، صوّر الإعدادات الأصلية وغيّر خيارًا واحدًا في كل مرة. استخدم السيارة والمنعطف نفسيهما، ثم جرّب التصويب. احتفظ بالإعداد الأسرع استجابة إذا أصبحت القيادة أو الملاحقة بالمنظار ثقيلة. لا توجد قيمة مثالية واحدة لكل الشاشات. فيديو Samsung المرفق يشرح قائمة وضوح الصورة العامة؛ قد يختلف جهازك عنه.`,
    tags: ["Samsung", "Game Motion Plus", "TV"], aliases: ["سامسونج", "Judder Reduction", "Blur Reduction"],
    related: ["tv-motion-smoothing-not-native-60fps", "ps5-vrr-allm-tv-smoothing", "ps5-hdr-setup-for-gta-vi"],
    videos: ["g9DWzgExAPQ"],
    srcUrls: [["Samsung — UHD gaming settings", "https://www.samsung.com/sg/support/tv-audio-video/how-to-get-the-best-settings-for-uhd-gaming-on-samsung-tv/"], ["Samsung — Game Bar, interpolation and VRR", "https://www.samsung.com/za/support/tv-audio-video/how-to-launch-the-new-game-bar-features/"], ["Samsung Care — motion smoothing video", "https://www.youtube.com/watch?v=g9DWzgExAPQ"]],
  },
  {
    slug: "lg-trumotion-gaming-comparison", status: "official",
    en: "LG TruMotion: a reversible test for low-frame-rate judder",
    ar: "TruMotion في LG: تجربة لتخفيف تقطع الحركة مع الانتباه لاستجابة التحكم",
    sEn: "Compare a calmer picture against the extra delay outside Game Mode.",
    sAr: "قارن نعومة الصورة بالتأخر الإضافي عند الخروج من وضع الألعاب.",
    bEn: `LG's gaming support guide places TruMotion at All Settings > Picture > Advanced Settings > Clarity > TruMotion on its example model. On many sets it is unavailable in Game Mode. LG explicitly warns that motion processing can increase input lag.

Save your original picture mode first. If you try a different mode to access TruMotion, compare a camera pan and an aiming sequence before committing. The guide lists Cinematic Motion, Natural Motion and Smooth Motion as examples, not universal presets for GTA VI.

If automatic low-latency switching prevents the experiment, check the linked PS5 ALLM/VRR guide. Return to the original gaming setup if the extra delay outweighs the smoother picture. Menu availability depends on your model and software.`,
    bAr: `يضع دليل LG للألعاب TruMotion في المسار All Settings > Picture > Advanced Settings > Clarity > TruMotion على الموديل الموضح. لا يتاح الخيار أثناء Game Mode في كثير من الأجهزة، وتحذر الشركة من أن معالجة الحركة قد تزيد تأخر التحكم.

احفظ وضع الصورة الأصلي أولًا. وإذا جرّبت وضعًا آخر لإتاحة TruMotion، قارن حركة الكاميرا والتصويب قبل اعتماده. يذكر الدليل Cinematic Motion وNatural Motion وSmooth Motion كأمثلة، وليست إعدادات مثالية عامة لـGTA VI.

إذا منع الانتقال التلقائي لوضع التأخير المنخفض التجربة، راجع دليل ALLM وVRR المرتبط. ارجع إلى إعداد اللعب الأصلي إذا كان تأخر اليد أهم من نعومة الصورة. تختلف القوائم والخيارات حسب الموديل والبرنامج.`,
    tags: ["LG", "TruMotion", "TV"], aliases: ["إل جي", "Game Optimizer", "تقطيع الحركة"],
    related: ["tv-motion-smoothing-not-native-60fps", "ps5-vrr-allm-tv-smoothing", "ps5-hdr-setup-for-gta-vi"],
    srcUrls: [["LG — screen stutter during games", "https://www.lg.com/uk/support/product-support/troubleshoot/help-library/cs-CT00008333-20155146898351/"]],
  },
  {
    slug: "sony-motionflow-game-mode", status: "official",
    en: "Sony Motionflow and Game Mode: why the option may be unavailable",
    ar: "Motionflow في Sony: لماذا يختفي الخيار داخل وضع الألعاب؟",
    sEn: "Separate interpolation from black-frame motion-blur reduction and prioritize the response you want.",
    sAr: "فرّق بين الإطارات الوسيطة وتقليل ضبابية الحركة قبل تعديل الشاشة.",
    bEn: `Sony's picture guide says Motionflow adds video frames for smoother motion and is disabled in Game Mode on 2023-and-later models covered by the guide. Its separate Motion blur reduction feature uses black-frame insertion. These are different processing methods, not two names for native 60 fps.

For supported recent BRAVIA models, Sony's latency guide recommends Quick Settings > Content type > Game. Other Google TV models use Picture mode > Game; follow the instructions for your exact set.

Start with that responsive baseline. If you explore other picture modes, repeat the same steering and aiming movements before deciding. Do not apply an older Android TV menu recipe blindly to a newer BRAVIA.`,
    bAr: `يذكر دليل الصورة من Sony أن Motionflow يضيف إطارات فيديو لتنعيم الحركة، وأنه يُعطَّل في Game Mode على موديلات 2023 وما بعدها المشمولة بالدليل. أما Motion blur reduction المنفصل فيستخدم إدخال إطارات سوداء. الطريقتان مختلفتان، ولا تعني أي منهما فتح 60 فريم حقيقية في اللعبة.

يوصي دليل تقليل التأخر لبعض أجهزة BRAVIA الحديثة بالمسار Quick Settings > Content type > Game. وتستخدم موديلات Google TV أخرى Picture mode > Game؛ اتبع القسم المطابق لجهازك.

ابدأ بهذا الإعداد للمقارنة، وإذا جرّبت أوضاع صورة أخرى فكرر حركة التصويب والتوجيه نفسها قبل الاختيار. لا تنقل خطوات Android TV قديم إلى BRAVIA حديث دون مراجعة الموديل.`,
    tags: ["Sony", "BRAVIA", "Motionflow"], aliases: ["سوني", "موشن فلو", "input lag"],
    related: ["tv-motion-smoothing-not-native-60fps", "ps5-vrr-allm-tv-smoothing"],
    srcUrls: [["Sony — picture settings and motion processing", "https://www.sony.com/electronics/support/accessories-audio-video-accessories/articles/00190409"], ["Sony — reduce input lag by model", "https://www.sony.ca/en/electronics/support/accessories/articles/00160270"]],
  },
  {
    slug: "ps5-vrr-allm-tv-smoothing", status: "official",
    en: "PS5 VRR, ALLM and 120 Hz: three different display controls",
    ar: "VRR وALLM و120Hz في PS5: ثلاثة خيارات مختلفة للصورة",
    sEn: "Understand the connection before disabling features to unlock TV smoothing.",
    sAr: "افهم العلاقة بينها قبل تعطيل الخيارات للوصول إلى تنعيم التلفزيون.",
    bEn: `Open Settings > Screen and Video > Video Output. VRR adapts display refresh, ALLM selects low-latency mode, and 120 Hz Output requires compatible games and screens.

Sony says ALLM remains active with VRR even when ALLM is set to Off. Both must be off to fully stop automatic low-latency switching.

Record the original settings before testing. Enabling 120 Hz output does not itself establish that GTA VI renders 120 frames. Restore your preferred VRR and low-latency setup after comparing; disable features only for a specific experiment, not as a universal performance fix.`,
    bAr: `افتح Settings > Screen and Video > Video Output. يضبط VRR معدل التحديث، وALLM يختار التأخير المنخفض، بينما يتطلب إخراج 120Hz لعبة وشاشة متوافقتين.

توضح Sony أن ALLM يظل نشطًا مع VRR حتى عند اختيار Off له. لتعطيل الانتقال التلقائي بالكامل، يلزم إيقاف الاثنين.

سجّل الإعدادات الأصلية قبل التجربة. تفعيل إخراج 120Hz لا يثبت أن GTA VI ترسم 120 إطارًا. أعد خيارات VRR والتأخير المنخفض إلى ما يناسبك بعد المقارنة، ولا تعتبر تعطيلها تحسينًا عامًا لكل الألعاب.`,
    tags: ["PS5", "VRR", "ALLM", "120Hz"], aliases: ["120 هرتز", "التأخير المنخفض", "معدل التحديث المتغير"],
    related: ["tv-motion-smoothing-not-native-60fps", "lg-trumotion-gaming-comparison", "samsung-game-motion-plus-comparison", "sony-motionflow-game-mode"],
    srcUrls: [["PlayStation — video output, VRR, ALLM and 120 Hz", "https://www.playstation.com/en-us/support/hardware/ps5-4k-resolution-guide/"]],
  },
];

export default build("tips", entries.map(entry => ({ ...entry, date: "2026-11-21T22:20:00Z" })));
