import { build, type SeedInput } from "./helpers";

export const remotePlayDrafts: SeedInput[] = [
{
  slug: "ps5-pc-frame-generation-remote-play-experiment",
  status: "rumor",
  en: "PS5 through PC: trying generated 60/120 fps with Remote Play",
  ar: "بلايستيشن عبر الكمبيوتر: تجربة 60 و120 إطارًا مولّدًا عبر Remote Play",
  sEn: "An untested community workflow. The creator video’s 120 FPS refers to processed output, not 120 native PS5 frames.",
  sAr: "تجربة مجتمعية لم نختبرها على أجهزتنا. رقم 120 FPS في فيديو المطوّر يخص الخرج المعالج، وليس 120 إطارًا أصليًا من PS5.",
  bEn: `Community experiment: we have not tested this workflow on our own hardware. Start with the existing Remote Play guide and establish a stable unprocessed picture before adding effects. The goal here is smoother displayed motion, not a new console performance mode.

The attached video is by Veyra creator Likely7AI. Its title, “Run GTA 6 at 120 FPS with DLSS 5 Enabled,” describes processed PC output. It does not demonstrate that the PS5 engine renders 120 original frames each second.

## Four numbers to keep separate

Keep the game’s original frames, stream cadence, generated output and display refresh separate. For a 30-frame example, a 60-fps stream may contain repeated pictures. Generating intermediate pictures can make motion look smoother, but Veyra’s documentation says it does not change baseline responsiveness. Its displayed processing time is not total button-to-screen latency.

## What Veyra actually provides

Likely7 publishes Veyra as a free open-source Windows 11 / DirectX 12 project. It accepts PS5 streaming and capture-card sources, with separate image-enhancement and frame-generation stages. GPU compatibility depends on the selected backend. Use the release linked from the author’s repository and check its requirements; the community client is not Sony’s official Remote Play app.

The checked release, 2.2.0, documents content-aware duplicate removal and frame-pacing fixes. If 30 unique frames arrive inside a 60-fps stream, verify that cadence handling is active before multiplying frames. Do not force 60→30 on genuinely 60-fps content. The release’s own tests do not establish end-to-end latency for every console, GPU and display combination.

## DLSS 5 and frame generation are separate

NVIDIA describes DLSS 5 neural rendering as appearance enhancement using the rendered frame, motion information and temporal state; its official research specifies RTX 50 GPUs. Community compatibility paths should not be presented as NVIDIA-certified support.

NVIDIA’s developer explanation says this neural-rendering stage takes one frame and outputs one frame. The increase to 60/120 displayed frames comes from a separate generation stage, not from that appearance enhancement alone.

Native DLSS Frame Generation integration uses renderer data including depth, motion vectors and HUD-less color. A post-processing client receiving compressed console video is a different integration; do not describe it as installing DLSS inside the PS5 game.

## Try existing equipment before buying anything

- Keep a short unprocessed baseline: a slow camera pan, fast aiming, driving and readable HUD text.
- Start with frame generation alone at a modest target; add image enhancement separately.
- Repeat the same scene and compare both image quality and controller response. Reduce the target if aiming feels delayed, edges distort or pacing worsens.
- Note the software version, GPU, input cadence and enabled effects. An output FPS counter alone does not prove native performance or low latency.
- A capture card is an optional source, not a prerequisite for the streaming experiment. Test the existing PC and network first.

Check Windows Settings → System → Display → Advanced display. Microsoft shows the active refresh rate and supported choices there. A 120-frame output needs a suitable display refresh to show 120 distinct updates each second; selecting a high number in the processing app does not change the monitor’s capabilities.

Lossless Scaling is a separate, paid option from developer THS, using its own LSFG model. Its store page supports windowed/borderless sources and requires spare GPU capacity. It does not certify this exact Sony-app workflow. Treat Remote Play window capture as a compatibility test, not a reason to purchase new hardware or a guarantee of 120 fps.

The linked TV guides offer another comparison on your existing screen. Keep whichever setup gives you the balance of motion clarity and control response you prefer; no particular GPU benchmark or universal best preset is promised here.`,
  bAr: `تجربة مجتمعية لم نختبرها على أجهزتنا. ابدأ بدليل Remote Play المرتبط، وتأكد من استقرار الصورة الأصلية قبل إضافة المعالجة. الهدف هنا تنعيم الحركة المعروضة؛ لا تفتح هذه الطريقة وضع أداء جديدًا داخل الكونسول.

الفيديو المرفق من Likely7AI، مطوّر Veyra. عنوانه «Run GTA 6 at 120 FPS with DLSS 5 Enabled» يصف خرج المعالجة على الكمبيوتر؛ لا يعني أن محرك اللعبة على PS5 يرسم 120 إطارًا أصليًا في الثانية.

## أربعة أرقام مختلفة

افصل بين إطارات اللعبة الأصلية، ومعدل البث، والخرج بعد التوليد، وتردد الشاشة. في مثال لعبة ترسم 30 إطارًا، قد يحتوي بث 60 إطارًا على صور مكررة. يمكن للصور الوسيطة تنعيم الحركة، لكن دليل Veyra يوضح أنها لا تغيّر استجابة اللعبة الأساسية. زمن المعالجة الظاهر في البرنامج ليس التأخر الكامل بين ضغط الزر وظهور النتيجة.

## ماذا يقدّم Veyra؟

ينشر Likely7 برنامج Veyra مجانًا وبمصدر مفتوح لنظام Windows 11 وDirectX 12. يستقبل بث PS5 أو مدخل بطاقة التقاط، ويوفّر مراحل منفصلة لتحسين الصورة وتوليد الإطارات. يتوقف توافق بطاقة الرسوم على طريقة المعالجة المختارة. استخدم الإصدار المرتبط بمستودع المطوّر وراجع متطلباته؛ هذا عميل مجتمعي وليس تطبيق Sony الرسمي.

يوثق الإصدار الذي راجعناه، 2.2.0، إزالة الصور المكررة وفق المحتوى وإصلاحات لتوقيت العرض. إذا وصلت 30 صورة مختلفة داخل بث 60 إطارًا، فتحقق من معالجة التكرار قبل مضاعفة الإطارات. لا تفرض 60→30 على محتوى يعمل فعلًا عند 60 إطارًا. اختبارات الإصدار لا تثبت زمن استجابة شاملًا لكل تركيبة من الأجهزة والشاشات.

## DLSS 5 وتوليد الإطارات مرحلتان مختلفتان

تصف NVIDIA التصيير العصبي في DLSS 5 بأنه تحسين لمظهر الصورة بالاعتماد على الإطار ومعلومات الحركة والحالة الزمنية، وتحدد وثيقتها الرسمية بطاقات RTX 50. دعم البطاقات عبر حلول مجتمعية لا يساوي اعتمادًا رسميًا من NVIDIA.

يوضح شرح NVIDIA للمطوّرين أن مرحلة التصيير العصبي تستقبل إطارًا وتخرج إطارًا. زيادة الخرج المعروض إلى 60 أو120 تأتي من مرحلة توليد منفصلة، وليست نتيجة تحسين المظهر وحده.

يستخدم الدمج الأصلي لـDLSS Frame Generation بيانات من محرك الرسم، منها العمق ومتجهات الحركة والصورة دون الواجهة. استقبال فيديو الكونسول المضغوط ومعالجته خارج الجهاز مسار مختلف؛ لا تصفه بأنه تثبيت DLSS داخل لعبة PS5.

## جرّب أجهزتك الحالية قبل الشراء

- احتفظ بمقارنة أولية دون معالجة: حركة كاميرا بطيئة، وتصويب سريع، وقيادة، ونص واضح في الواجهة.
- ابدأ بتوليد الإطارات وحده وهدف متواضع، ثم جرّب تحسين الصورة كخطوة منفصلة.
- كرر المشهد نفسه وقارن الصورة واستجابة اليد. خفّض الهدف إذا تأخر التصويب أو تشوهت الحواف أو اختل توقيت الحركة.
- دوّن إصدار البرنامج وبطاقة الرسوم ومعدل البث والمؤثرات النشطة. عدّاد الخرج وحده لا يثبت أداءً أصليًا أعلى أو تأخرًا أقل.
- بطاقة الالتقاط مصدر اختياري؛ جرّب الكمبيوتر والشبكة الموجودين أولًا.

راجع في Windows المسار Settings → System → Display → Advanced display. تعرض Microsoft هناك التردد الفعلي والخيارات المدعومة. يحتاج خرج 120 إطارًا إلى تردد شاشة مناسب لعرض 120 تحديثًا مختلفًا في الثانية؛ اختيار رقم كبير داخل البرنامج لا يغيّر قدرات الشاشة.

Lossless Scaling خيار مدفوع منفصل من المطوّر THS ويستخدم نموذجه الخاص LSFG. تدعم صفحة البرنامج النوافذ ووضع ملء الشاشة بلا حدود، مع الحاجة إلى قدرة متاحة في بطاقة الرسوم. لا تعتمد الصفحة هذا المسار المحدد مع تطبيق Sony؛ تعامل مع التقاط نافذة Remote Play كتجربة توافق، لا كضمان لـ120 إطارًا أو سبب لشراء عتاد جديد.

تمنحك أدلة التلفزيون المرتبطة مقارنة أخرى على شاشتك الحالية. احتفظ بالإعداد الذي يناسبك بين وضوح الحركة واستجابة التحكم؛ لا نقدّم هنا نتيجة مضمونة لبطاقة معينة أو إعدادًا مثاليًا للجميع.`,
  aliases: ["Veyra", "Lossless Scaling", "LSFG", "frame generation", "توليد الإطارات", "ريموت بلاي", "DLSS 5"],
  tags: ["PS5", "Remote Play", "PC", "frame generation", "community experiment"],
  facts: [["Test scope", "نطاق التجربة", "Community workflow; not tested on our hardware", "طريقة مجتمعية لم نختبرها على أجهزتنا"], ["FPS meaning", "معنى الإطارات", "Generated display output", "خرج عرض يتضمن إطارات مولّدة"]],
  related: ["gta-vi-remote-play-from-ps5", "gta-vi-ps5-pro-features-frame-rate", "tv-motion-smoothing-not-native-60fps", "ps5-vrr-allm-tv-smoothing", "samsung-game-motion-plus-comparison", "lg-trumotion-gaming-comparison"],
  videos: ["ZJ42jzNAbik"],
  srcUrls: [["Likely7 — Veyra project, source code and current release", "https://github.com/Likely7/Veyra-NRVideo"], ["Likely7 — Veyra 2.2.0 release and cadence fixes", "https://github.com/Likely7/Veyra-NRVideo/releases/tag/v2.2.0"], ["Veyra — author/community guide; processing latency and capture cadence", "https://github.com/Likely7/Veyra-NRVideo/wiki/Guide-02-Features-and-Settings"], ["NVIDIA Research — DLSS 5 generative neural rendering", "https://research.nvidia.com/labs/adlr/DLSS5/"], ["NVIDIA Developer — DLSS 5 one-frame-in, one-frame-out operation", "https://developer.nvidia.com/blog/whats-new-for-game-developers-dlss-5-with-3d-guided-neural-rendering-nvidia-ace-updates-and-new-rtx-kit-capabilities"], ["NVIDIA Streamline — DLSS Frame Generation integration inputs", "https://github.com/NVIDIA-RTX/Streamline/blob/main/docs/ProgrammingGuideDLSS_G.md"], ["THS — Lossless Scaling on Steam", "https://store.steampowered.com/app/993090/Lossless_Scaling/"], ["Microsoft — display refresh rate in Windows", "https://support.microsoft.com/en-gb/windows/hardware/display-graphics/change-the-refresh-rate-on-your-monitor-in-windows?nochrome=true"], ["Likely7AI — creator tutorial; 120 FPS means processed output", "https://www.youtube.com/watch?v=ZJ42jzNAbik"]],
  date: "2026-11-21T23:05:00Z",
}
];

// Append bodies/sources/related; never replace the existing article with this partial object.
export const officialRemotePlayAddition = {
  slug: "gta-vi-remote-play-from-ps5",
  bEn: `## Windows streaming quality and HDR

Sony says PS5 streaming resolution is selected automatically, up to 1080p depending on connection quality; a manual resolution selector may not appear. For unstable streaming, try Ethernet and pause concurrent downloads before changing in-game controls.

Sony’s Windows HDR instructions require compatible HDR displays/settings, Microsoft’s HEVC Video Extension, Windows HDR and Enable HDR in Remote Play’s video-quality settings. A USB controller is the documented Windows connection. These are app/display requirements, not a promise of higher game frame rate.

Our suggested test: establish a clear SDR picture first, then enable HDR separately and compare brightness, color and response in the same scene. If the problem appears only after that change, return to SDR while checking the HDR chain.`,
  bAr: `## جودة البث وHDR على Windows

توضح Sony أن PS5 يختار دقة البث تلقائيًا حتى 1080p بحسب جودة الاتصال؛ قد لا تظهر قائمة لاختيار الدقة يدويًا. عند عدم استقرار البث، جرّب Ethernet وأوقف التنزيلات المتزامنة قبل تغيير إعدادات التحكم داخل اللعبة.

يتطلب HDR وفق دليل Sony على Windows شاشات وإعدادات متوافقة، وإضافة HEVC Video Extension من Microsoft، وتفعيل HDR في Windows وخيار Enable HDR في جودة فيديو Remote Play. الاتصال الموثق ليد التحكم على Windows هو USB. هذه متطلبات للتطبيق والعرض، وليست وعدًا بزيادة إطارات اللعبة.

نقترح تثبيت صورة SDR واضحة أولًا، ثم تجربة HDR وحده ومقارنة السطوع واللون والاستجابة في المشهد نفسه. إذا ظهرت المشكلة بعد هذه الخطوة فقط، ارجع مؤقتًا إلى SDR وافحص إعدادات HDR.`,
  srcUrls: [["Sony — PS5 automatic streaming quality and Ethernet troubleshooting", "https://www.sony-asia.com/electronics/support/articles/SX365201"], ["PlayStation — Windows Remote Play and HDR requirements", "https://remoteplay.dl.playstation.net/remoteplay/lang/en/1100001.html"]],
  related: ["ps5-pc-frame-generation-remote-play-experiment"],
} satisfies Pick<SeedInput, "slug" | "bEn" | "bAr" | "srcUrls" | "related">;

export default build("tips", remotePlayDrafts);
