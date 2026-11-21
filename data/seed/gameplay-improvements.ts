// Research handoff, 22 November 2026 Saudi time. Intended destination: data/seed/.
// Independently documented launch-menu screenshots / firsthand play: confirmed, not official.
// Each article's factual core is short; exercises and comparison workflows are original.
// Do not derive further text from a cited page without reviewing its shared word budget.
// The previous expansion's Rockstar settings source is intentionally not reused here.
import { build, type SeedInput } from "./helpers";

const guides: Omit<SeedInput, "status">[] = [
  {
    slug: "aim-look-sensitivity-practice",
    en: "Tune looking and aiming separately before choosing a response curve",
    ar: "اضبط الالتفات والتصويب كلًا على حدة قبل تغيير منحنى الاستجابة",
    sEn: "A short calibration exercise for fast turns and smaller aiming corrections.",
    sAr: "تجربة قصيرة تجمع سرعة الالتفات مع سهولة تصحيح التصويب.",
    bEn: `The photographed Controller menu separates horizontal and vertical Look sensitivity from Aim sensitivity. It also includes acceleration and Aim Response Curve; the displayed Linear option follows the amount of stick input directly.

Try this practice sequence in a quiet place. Pick two visible landmarks and turn between them without aiming. Change one Look slider until you can stop near the intended landmark without repeated corrections. Next, aim at a small stationary detail and move between two nearby points; adjust the corresponding Aim slider independently.

Only then compare the response curve with the same exercise. Keep your other values unchanged so you can describe the difference. For vertical tuning, choose two points at different heights rather than repeating a horizontal test.

Write down the values that worked and try them again during ordinary play. A fast full turn and a precise short correction are different tasks; a single copied number is a poor substitute for testing both.`,
    bAr: `تُظهر صور قائمة Controller فصل حساسية الالتفات Look أفقيًا وعموديًا عن حساسية التصويب Aim. وتوجد أيضًا إعدادات التسارع ومنحنى Aim Response Curve؛ خيار Linear الظاهر في القائمة يربط الاستجابة بمقدار حركة العصا مباشرة.

جرّب هذا التمرين في مكان هادئ: اختر علامتين واضحتين، وانتقل بنظرك بينهما دون تصويب. غيّر منزلق Look واحدًا حتى تستطيع التوقف قرب العلامة المقصودة دون تصحيحات كثيرة. بعد ذلك صوّب إلى تفصيل ثابت صغير، وتنقل بين نقطتين متقاربتين، واضبط منزلق Aim المناسب بصورة مستقلة.

بعد هذه الخطوة فقط، قارن منحنى الاستجابة باستخدام التمرين نفسه. اترك بقية القيم ثابتة حتى تعرف ما الذي اختلف. ولضبط الاتجاه العمودي، اختر نقطتين على ارتفاعين مختلفين بدل الاكتفاء بتجربة أفقية.

دوّن القيم التي ارتحت لها وأعد اختبارها في اللعب المعتاد. الدوران بسرعة والتصحيح الدقيق لمسافة صغيرة مهمتان مختلفتان؛ لذلك قيّم الاثنين قبل اعتماد الإعداد، واحتفظ بقيمك السابقة للرجوع إليها إذا وجدت أن التحسن في أحدهما جاء على حساب الآخر.`,
    aliases: ["حساسية التصويب", "Look Sensitivity", "Aim Response Curve", "Linear"], tags: ["settings", "aiming", "controller"],
    related: ["controller-deadzone-drift-check", "targeting-lock-on-partial-free-aim", "gta-vi-settings-menu-navigation-guide"],
    videos: ["QHtBvEUgCp4"],
    srcUrls: [["NerdsChalk — photographed Controller menu", "https://nerdschalk.com/best-controller-settings-gta-6/"], ["GhillieMaster — in-depth settings video", "https://www.youtube.com/watch?v=QHtBvEUgCp4"]],
  },
  {
    slug: "controller-deadzone-drift-check",
    en: "Find a stick deadzone that responds without drifting",
    ar: "اضبط المنطقة الميتة للعصا دون ظهور حركة تلقائية",
    sEn: "Test the left and right sticks independently instead of setting both to zero automatically.",
    sAr: "اختبر العصا اليمنى واليسرى بصورة مستقلة بدل وضع الاثنين على صفر مباشرة.",
    bEn: `Beebom's own PS5 screenshots document separate Deadzone (Left Stick) and Deadzone (Right Stick) sliders in GTA VI's Controller settings. The guide cautions that a very low setting can expose unwanted stick movement.

Begin by recording both current values. Stand somewhere still, release the controller, and observe whether the character or camera moves. Compare that with a deliberate small input. Your aim is to distinguish an unwanted resting movement from a response that feels too slow to begin.

If drift already exists, raise the affected stick’s deadzone gradually until it stops. Adjust one stick at a time. Test a small change, release it again, then repeat the same deliberate movement. Stop lowering the value when unattended movement appears, and return to the last stable setting. Try the result in walking, aiming, and driving before declaring it finished.

This adjustment changes how the game interprets input; it does not repair a worn mechanism. If movement persists across games or controllers, describe those comparisons when seeking device support rather than treating every symptom as a GTA VI bug.`,
    bAr: `توثّق صور Beebom الملتقطة على PS5 منزلقين مستقلين باسم Deadzone (Left Stick) وDeadzone (Right Stick) داخل إعدادات Controller في GTA VI. وينبه الدليل إلى أن القيمة المنخفضة جدًا قد تُظهر حركة غير مرغوبة من العصا.

ابدأ بتسجيل القيمتين الحاليتين. قف في مكان ساكن واترك اليد دون لمس، ثم راقب هل تتحرك الشخصية أو الكاميرا. قارن ذلك بحركة صغيرة مقصودة منك. الهدف أن تفرّق بين حركة تحدث وحدها وبين استجابة تحتاج إزاحة كبيرة حتى تبدأ.

إذا ظهرت حركة تلقائية من البداية، ارفع المنطقة الميتة للعصا المتأثرة تدريجيًا حتى تتوقف. عدّل عصا واحدة في كل مرة. جرّب تغييرًا بسيطًا، واتركها مجددًا، ثم كرر الحركة المقصودة نفسها. عندما تظهر حركة تلقائية، توقف عن خفض القيمة وارجع إلى آخر إعداد مستقر. اختبر النتيجة في المشي والتصويب والقيادة قبل اعتمادها.

هذا الضبط يغيّر تفسير اللعبة للمدخلات ولا يصلح آلية متهالكة في اليد. وإذا تكرر العرض في ألعاب أخرى أو مع يد ثانية، سجّل نتائج المقارنة؛ فهي تساعدك في وصف المشكلة بدقة بدل افتراض أن سببها إعداد واحد داخل GTA VI.`,
    aliases: ["Deadzone", "ستيك درفت", "انحراف العصا", "حركة تلقائية"], tags: ["settings", "controller", "support"],
    related: ["aim-look-sensitivity-practice", "driving-camera-follow-height"],
    srcUrls: [["Beebom — firsthand controller guide and screenshots", "https://beebom.com/gta-6-best-controller-settings/"]],
  },
  {
    slug: "driving-camera-follow-height",
    en: "Stop fighting the driving camera: height, return speed, and delay",
    ar: "خلّ كاميرا القيادة تناسبك: الارتفاع وسرعة الرجوع والتأخير",
    sEn: "Adjust the view behind the vehicle before blaming every difficult corner on steering.",
    sAr: "اضبط الرؤية خلف المركبة قبل نسبة كل صعوبة في المنعطفات إلى التوجيه.",
    bEn: `The recorded Camera menu includes Height (All Vehicles), driver Horizontal/Vertical Follow Speed, and Follow Delay (Driver). These control the viewpoint and its return behind the vehicle. Passenger follow settings are separate.

Use the same car on a familiar short route. First check whether you can judge the road immediately ahead; compare one height change without altering anything else. Then look sideways and release the camera stick. Decide whether the return starts too quickly, moves too quickly, or both.

Change the relevant delay or speed by a small amount and repeat that exact sequence. Avoid evaluating a camera change while also switching to a different vehicle or a different road. Keep steering corrections and camera corrections separate in your notes.

Finally, test an ordinary intersection and a slower parking manoeuvre. The useful setup is the one that lets you place the vehicle accurately and recover your view predictably. It need not match the preference you use while riding as a passenger.`,
    bAr: `تضم قائمة Camera الموثقة خيارات Height (All Vehicles)، وسرعة المتابعة الأفقية والعمودية للسائق، وFollow Delay (Driver). تتحكم هذه الخيارات في زاوية الرؤية وعودتها خلف المركبة، بينما توجد إعدادات مستقلة للراكب.

استخدم السيارة نفسها على مسار قصير تعرفه. ابدأ بفحص قدرتك على رؤية الطريق أمامها، وقارن تغييرًا واحدًا في الارتفاع دون لمس بقية الإعدادات. بعدها انظر إلى الجانب واترك عصا الكاميرا؛ هل تبدأ العودة سريعًا أكثر مما تريد، أم تتحرك بسرعة كبيرة بعد أن تبدأ، أم كلاهما؟

غيّر التأخير أو السرعة المناسبة مقدارًا بسيطًا وكرر التجربة نفسها. لا تحكم على كاميرا جديدة وأنت تغيّر المركبة والطريق في الوقت نفسه. اكتب ملاحظتين منفصلتين: تصحيح اتجاه السيارة، وتصحيح زاوية الرؤية.

أخيرًا جرّب تقاطعًا عاديًا ومناورة توقف بطيئة. الإعداد المناسب يساعدك على تقدير موضع المركبة واستعادة الرؤية بصورة متوقعة. وقد تفضل زاوية مختلفة عندما تكون راكبًا؛ لذلك لا تنسخ قيمة السائق إلى كل الحالات تلقائيًا.`,
    aliases: ["كاميرا السيارة", "Follow Delay", "Height All Vehicles"], tags: ["settings", "driving", "camera"],
    related: ["hold-r3-look-behind", "controller-deadzone-drift-check", "dualsense-adaptive-driving-feedback"],
    srcUrls: [["GTA6Map — documented Camera menu", "https://www.gta6map.net/wiki/gta-6/guides/gta-6-camera-settings"]],
  },
  {
    slug: "camera-shake-bob-sway-comfort",
    en: "Reduce camera shake, bob, and weapon sway separately",
    ar: "تقليل اهتزاز الكاميرا وتمايل الحركة والسلاح كلًا على حدة",
    sEn: "Find which screen movement bothers you before changing your aiming sensitivity.",
    sAr: "حدد نوع حركة الصورة الذي يزعجك قبل تعديل حساسية التصويب.",
    bEn: `PS5 menu screenshots place Camera Shake and Weapon Sway as switches in Settings > Camera > Comfort. Camera Bob is a separate slider. Turning one off does not mean all three have changed.

Try three short comparisons: stand still and aim, walk in a straight line, then repeat a familiar movement that produces a camera jolt. Match each visible effect to the setting you are testing instead of adjusting aim sensitivity to compensate for every motion on screen.

Change one option, repeat the same movement, and keep the result only if it feels clearer to you. Preserve the starting values so you can restore an effect you enjoy. A dramatic camera is a stylistic preference; a steadier image can be preferable for another player.

Finish with a brief normal session rather than a long test. Record which movement became easier to follow. These are visual comfort options, and this guide does not claim that disabling them increases the frame rate or changes weapon damage.`,
    bAr: `تضع صور قائمة PS5 خياري Camera Shake وWeapon Sway كمفتاحين ضمن Settings ثم Camera ثم Comfort، بينما يأتي Camera Bob كمنزلق مستقل. إيقاف أحدها لا يعني أن الخيارات الثلاثة تغيرت معًا.

جرّب ثلاث مقارنات قصيرة: قف وصوّب دون حركة، ثم امشِ في خط مستقيم، ثم كرر حركة مألوفة تُحدث هزة في الصورة. اربط التأثير الذي تراه بالخيار الذي تختبره، بدل استخدام حساسية التصويب لتعويض كل حركة تحدث على الشاشة.

غيّر خيارًا واحدًا وأعد الحركة نفسها، واحتفظ بالتعديل إذا أصبح تتبع المشهد أوضح لك. احفظ القيم الأصلية حتى تستعيد تأثيرًا تفضله لاحقًا. الكاميرا الدرامية اختيار بصري، وقد يرتاح لاعب آخر إلى صورة أكثر ثباتًا.

اختم بجلسة عادية قصيرة وسجّل أي نوع من الحركة أصبح أسهل في المتابعة. هذه خيارات لراحة المشاهدة؛ لا يعني تعطيلها تلقائيًا زيادة معدل الإطارات أو تغيير ضرر السلاح. افصل تقييم وضوح الصورة عن تقييم أداء الجهاز حتى تعرف النتيجة التي حصلت عليها فعلًا.`,
    aliases: ["Camera Shake", "Camera Bob", "Weapon Sway", "اهتزاز الصورة"], tags: ["settings", "camera", "comfort"],
    related: ["in-game-motion-blur-comparison", "reticle-visibility-center-dot"],
    srcUrls: [["AllThingsHow — Camera screenshots and Comfort controls", "https://allthings.how/gta-6-camera-settings-camera-shake/"]],
  },
  {
    slug: "movement-speed-walk-jog-run",
    en: "Choose your normal movement pace",
    ar: "اختيار وتيرة الحركة العادية",
    sEn: "Compare travelling and precise positioning before choosing a pace.",
    sAr: "قارن التنقل وضبط الموضع قبل اختيار الوتيرة المناسبة.",
    bEn: `Gameplay's Movement Speed offers Walk, Fast Walk, Jog, and Run. It adjusts full-stick pace, not maximum sprint speed.

Compare two short tasks: moving along an open pavement and positioning beside a doorway. Choose a faster pace, repeat both, and check whether the extra travel speed also makes close positioning harder for you.

Use small stick movements during the second test instead of judging everything at full tilt. Keep the same camera and control scheme while comparing. If you frequently overshoot interactions, try an intermediate pace before changing several unrelated settings.

The result can depend on what you are doing. Exploring a busy interior and crossing an open stretch reward different habits. Give your chosen pace a few normal interactions before adopting it.`,
    bAr: `يوفر Movement Speed في Gameplay أوضاع Walk وFast Walk وJog وRun؛ يحدد الوتيرة عند دفع العصا بالكامل، ولا يرفع أقصى سرعة للركض السريع.

قارن مهمتين قصيرتين: السير على رصيف مفتوح، وضبط مكانك بجوار باب. اختر وتيرة أسرع وأعد التجربتين، ثم لاحظ هل سرعة التنقل الإضافية تجعل الوقوف عند نقطة صغيرة أصعب بالنسبة إليك.

في الاختبار الثاني استخدم إزاحات خفيفة للعصا بدل الحكم على كل شيء وأنت تدفعها إلى النهاية. ثبّت الكاميرا ومخطط التحكم أثناء المقارنة. وإذا كنت تتجاوز مواضع التفاعل كثيرًا، جرّب وتيرة وسطية قبل تغيير عدة إعدادات لا ترتبط بالمشكلة.

اختبر الاختيار خلال تفاعلات عادية قبل اعتماده. التجول داخل مكان مزدحم والعبور في مساحة مفتوحة يتطلبان عادات مختلفة، وقد تجد التوازن بعد دقائق من التجربة.`,
    aliases: ["Movement Speed", "المشي بطيء", "Fast Walk", "Jog"], tags: ["settings", "movement"],
    related: ["l3-is-sprint-classic-controls", "input-assists-taps-holds-minigames"],
    srcUrls: [["PC Gamer — firsthand Movement Speed test", "https://www.pcgamer.com/games/grand-theft-auto/gta-6-movement-speed-setting-walk-faster/"]],
  },
  {
    slug: "targeting-lock-on-partial-free-aim",
    en: "Choose targeting assistance before tuning a gunfight",
    ar: "اختر مساعدة التصويب قبل ضبط إحساس الاشتباك",
    sEn: "Lock-on behavior and reticle slowdown are separate settings.",
    sAr: "تثبيت الهدف وإبطاء حركة علامة التصويب إعدادان مختلفان.",
    bEn: `The documented Gameplay > Combat menu offers Targeting choices Lock-On, Partial, and Free Aim. Partial pulls toward a nearby target without locking; Free Aim avoids that lock. Aim Assist Strength controls reticle slowdown over a target, while Shooting Assist is separately listed for close targets.

Begin by deciding what you want help with: finding a target quickly or making small corrections yourself. Compare targeting modes in the same repeatable encounter, keeping your controller sensitivity unchanged.

Notice the moment assistance begins. Does the view select the person you intended, and can you move toward a nearby detail predictably? Evaluate that separately from how quickly you can turn around.

After choosing the targeting style, adjust assistance strength if needed and repeat the comparison. Record both values when sharing a setup. Otherwise two players can use identical sensitivity numbers and still describe a different aiming feel because their targeting choices differ.`,
    bAr: `تُظهر قائمة Gameplay ثم Combat خيارات Targeting: ‏Lock-On وPartial وFree Aim. يقترب Partial من هدف قريب دون تثبيت، بينما يتجنب Free Aim ذلك التثبيت. ويتحكم Aim Assist Strength في إبطاء العلامة فوق الهدف، مع خيار Shooting Assist منفصل للأهداف القريبة.

ابدأ بتحديد نوع المساعدة الذي تريده: العثور على الهدف سريعًا، أم إجراء التصحيحات الصغيرة بنفسك؟ قارن الأوضاع في موقف تستطيع تكراره، واترك حساسية اليد ثابتة أثناء الاختبار.

راقب اللحظة التي تبدأ فيها المساعدة: هل اختير الشخص الذي قصدته؟ وهل تستطيع نقل العلامة إلى تفصيل قريب بطريقة متوقعة؟ قيّم ذلك منفصلًا عن سرعة الالتفات إلى الخلف أو تحريك الكاميرا لمسافة كبيرة.

بعد اختيار أسلوب الاستهداف، عدّل قوة المساعدة عند الحاجة وأعد المقارنة. عند مشاركة إعداداتك، اكتب الاختيارين مع قيم الحساسية؛ فقد يستخدم لاعبان الأرقام نفسها ويشعران بتصويب مختلف لأن كل واحد اختار سلوك استهداف مختلفًا. المهم أن تعرف أي جزء من التجربة تغيّر، لا أن تجمع أكبر عدد من التعديلات في مرة واحدة.`,
    aliases: ["Lock-On", "Partial", "Free Aim", "مساعدة التصويب"], tags: ["settings", "aiming", "combat"],
    related: ["aim-look-sensitivity-practice", "non-lethal-takedowns", "reticle-visibility-center-dot"],
    srcUrls: [["GTA6Map — photographed Gameplay combat settings", "https://www.gta6map.net/wiki/gta-6/guides/gta-6-gameplay-settings"]],
  },
  {
    slug: "subtitles-speakers-background-readability",
    en: "Make dialogue easier to follow with subtitle size and speaker names",
    ar: "وضّح الحوارات بحجم الترجمة وأسماء المتحدثين والخلفية",
    sEn: "Build a readable subtitle setup for your actual viewing distance.",
    sAr: "اضبط الترجمة بحسب مسافة جلوسك الفعلية عن الشاشة.",
    bEn: `ViceManual's PS5 captures show Settings > UI > Subtitles & Captions, with controls for subtitle display, Size, Speaker Names, Background, and Closed Captions. The general UI Text Size is a separate control.

Sit where you normally play, then compare a subtitle against a bright scene and a dark one. Increase size only as far as needed to read without leaning forward. Add a background if the letters blend into the picture, and enable speaker names if you often lose track of a conversation.

Check more than a single short line. A longer exchange reveals whether your chosen size leaves enough room and whether you can follow both the text and the scene comfortably.

Keep dialogue text and menu readability as separate checks. If mission text looks clear but button prompts remain difficult to read, inspect the general interface setting instead of repeatedly increasing subtitle size. Save your selection and review it during the next ordinary conversation.`,
    bAr: `تُظهر لقطات ViceManual على PS5 قسم Settings ثم UI ثم Subtitles & Captions، بخيارات عرض الترجمة وSize وSpeaker Names وBackground وClosed Captions. أما UI Text Size العام فهو إعداد مستقل.

اجلس في مكانك المعتاد وقارن النص فوق مشهد مضيء وآخر داكن. كبّر الحجم بالقدر الذي يسمح بالقراءة دون الاقتراب من الشاشة. جرّب خلفية عندما تندمج الحروف مع الصورة، وأظهر أسماء المتحدثين إذا كنت تفقد متابعة من يتكلم أثناء الحوار.

اختبر أكثر من جملة قصيرة؛ تبادل أطول يكشف هل المساحة كافية وهل تستطيع متابعة النص والمشهد معًا براحة. لا تحكم على الإعداد من معاينة ساكنة وحدها إذا كانت مشكلتك تظهر أثناء الحوارات المتتابعة.

افصل بين قراءة الحوار وقراءة القوائم. إذا أصبح النص الحواري واضحًا وبقيت تعليمات الأزرار صغيرة، راجع إعداد الواجهة العام بدل الاستمرار في تكبير الترجمة. احفظ اختيارك، ثم راجعه خلال محادثة عادية في الجلسة التالية للتأكد من أنه يناسب طريقة لعبك.`,
    aliases: ["Subtitles", "Speaker Names", "خلفية الترجمة", "تكبير النص"], tags: ["settings", "accessibility", "UI"],
    related: ["game-audio-dialogue-media-balance", "gta-vi-settings-menu-navigation-guide"],
    srcUrls: [["ViceManual — subtitles captured on PS5", "https://vicemanual.com/gta-6-how-to/subtitles"]],
  },
  {
    slug: "minimap-compass-gps-visibility",
    en: "Keep navigation visible without crowding every corner of the screen",
    ar: "اظهر أدوات الملاحة التي تحتاجها دون ازدحام الشاشة",
    sEn: "Compare minimap, compass, and turn indicators on a short route.",
    sAr: "قارن الخريطة المصغرة والبوصلة وإرشادات الانعطاف على مسار قصير.",
    bEn: `Settings > UI > Navigation contains Minimap and Compass modes On, Dynamic, and Off. The documented GPS Route option controls the route display, while GPS Turn Indicators offers On, Highways, or Off. Minimap Size has its own setting.

Choose a nearby destination with two or three turns. Drive it with the current setup and note what you actually consult: the road, the minimap, or the large direction prompt. Change only the element that is missing or distracting, then repeat the route.

If you miss turns because the map is hard to read, compare a larger map before adding more indicators. If you prefer fewer overlays, keep enough guidance to complete the test without repeatedly pausing.

Try the same layout on foot after the drive. Navigation needs can change between an intersection and a close search around a building. Retain the controls that help you make the next decision, then revisit visual clutter after you know the area better.`,
    bAr: `يضم قسم Settings ثم UI ثم Navigation أوضاع On وDynamic وOff للخريطة المصغرة Minimap والبوصلة Compass. ويتحكم GPS Route في عرض المسار، بينما يقدم GPS Turn Indicators خيارات On وHighways وOff. ولحجم الخريطة المصغرة إعداد مستقل.

اختر وجهة قريبة تحتاج انعطافين أو ثلاثة. اسلك الطريق بإعدادك الحالي ولاحظ ما تعتمد عليه فعلًا: الطريق نفسه، أم الخريطة، أم إشارة الاتجاه الكبيرة؟ غيّر العنصر الذي ينقصك أو يشتتك فقط، ثم أعد المسار.

إذا كنت تفوّت المنعطفات لأن الخريطة صعبة القراءة، قارن حجمًا أكبر قبل إضافة مؤشرات أكثر. وإذا أردت تقليل العناصر على الشاشة، احتفظ بتوجيه يكفي لإكمال التجربة دون فتح القوائم كل لحظة.

بعد القيادة، جرّب التوزيع نفسه وأنت تمشي. احتياجاتك عند تقاطع تختلف عن البحث حول مبنى، وقد تكتشف أن عنصرًا يفيد في أحدهما أكثر من الآخر. احتفظ بما يساعدك على اتخاذ الخطوة التالية، ثم راجع ازدحام الشاشة لاحقًا عندما تصبح المنطقة مألوفة لك.`,
    aliases: ["Minimap", "Compass", "GPS Turn Indicators", "الخريطة تختفي"], tags: ["settings", "navigation", "UI"],
    related: ["hold-down-for-gps", "driving-camera-follow-height", "metric-units-clock-format"],
    srcUrls: [["GTA6Map — UI navigation screenshots", "https://www.gta6map.net/wiki/gta-6/guides/gta-6-hud-ui-settings"]],
  },
  {
    slug: "reticle-visibility-center-dot",
    en: "Make the reticle visible before changing your aim",
    ar: "وضّح علامة التصويب قبل تعديل حساسية اليد",
    sEn: "Compare size, visibility, and a persistent center point against different backgrounds.",
    sAr: "قارن الحجم والوضوح ونقطة المنتصف فوق خلفيات مختلفة.",
    bEn: `ViceManual's captured UI > Reticle menu includes Reticle Size, Reticle Shape, separate equipped/aiming visibility sliders, and Persistent Center Dot. The dot stays at the screen centre; it is separate from the weapon's reticle options.

Aim at a bright wall, a dark surface, and a busy background without firing. Decide whether the problem is losing the marker, confusing its shape, or moving past your intended point. Only the last of those directly suggests an input-calibration problem.

Compare one visibility or size adjustment, then repeat the three backgrounds. Try the weapon equipped and while aiming, since the menu separates those situations. Keep the smallest clear marker that lets you follow the subject comfortably.

If you use the centre dot, spend a short ordinary session with it before deciding. A cleaner screenshot and a readable playing view have different priorities. Save the version that helps you place the marker consistently, rather than judging it only in a static menu preview.`,
    bAr: `توثّق صور ViceManual في UI ثم Reticle خيارات Reticle Size وReticle Shape، ومنزلقي وضوح منفصلين لحمل السلاح والتصويب، وخيار Persistent Center Dot. تبقى النقطة في منتصف الشاشة، وهي منفصلة عن إعدادات شكل علامة السلاح.

صوّب دون إطلاق إلى جدار مضيء وسطح داكن وخلفية مزدحمة. حدد هل المشكلة أنك تفقد العلامة، أم يصعب تمييز شكلها، أم أنك تتجاوز النقطة المطلوبة بحركة اليد. الحالة الأخيرة فقط تدعوك مباشرة إلى مراجعة استجابة التحكم.

قارن تعديلًا واحدًا في الحجم أو الوضوح، ثم أعد الخلفيات الثلاث. جرّب وأنت تحمل السلاح وعند التصويب، لأن القائمة تفرّق بين الحالتين. احتفظ بأصغر علامة واضحة تساعدك على متابعة الموضوع بسهولة.

إذا فعّلت نقطة المنتصف، اختبرها في جلسة قصيرة قبل الحكم. احتياجات الصورة النظيفة للنشر تختلف عن احتياجات الرؤية أثناء اللعب. اختر ما يساعدك على وضع العلامة بصورة ثابتة، بدل الاكتفاء بمظهرها فوق معاينة ساكنة في القائمة.`,
    aliases: ["Reticle", "Persistent Center Dot", "الكروسهير", "نقطة التصويب"], tags: ["settings", "UI", "aiming"],
    related: ["aim-look-sensitivity-practice", "targeting-lock-on-partial-free-aim"],
    srcUrls: [["ViceManual — captured reticle controls", "https://vicemanual.com/gta-6-how-to/crosshair"]],
  },
  {
    slug: "metric-units-clock-format",
    en: "Use kilometres, Celsius, kilograms, and a 24-hour clock",
    ar: "غيّر الوحدات إلى كيلومتر ومئوي وكيلوجرام وتوقيت 24 ساعة",
    sEn: "Make distances and time easier to interpret while exploring Leonida.",
    sAr: "اقرأ المسافات والوقت بوحدات مألوفة أثناء استكشاف Leonida.",
    bEn: `ViceManual's PS5 capture locates Units of Measurement near the bottom of Settings > UI. Its four controls are Distance, Weight, Temperature, and Clock Format; available alternatives include Metric, Kilograms, Celsius, and 24 Hour.

Choose the conventions you understand at a glance, then check an actual navigation distance and a displayed time. The purpose is to reduce mental conversion while following a route or planning your next stop.

When writing a community guide, include the unit beside every measurement. A bare number copied from someone else's screenshot can be misleading when their display uses a different convention. Keep the original measurement in your notes if you convert it for a caption.

For a route comparison, use the same start and destination after changing the display. This is a presentation preference, not evidence that the journey itself changed. If you share a timed challenge, state whether the time is an in-game clock reading or real elapsed time.`,
    bAr: `تحدد لقطة ViceManual على PS5 مجموعة Units of Measurement قرب أسفل Settings ثم UI. تضم Distance وWeight وTemperature وClock Format، مع بدائل تشمل Metric وKilograms وCelsius و24 Hour.

اختر النظام الذي تفهمه بسرعة، ثم راجع مسافة ملاحة ووقتًا ظاهرًا داخل اللعبة. الفائدة أن تقل حاجتك إلى التحويل الذهني أثناء اتباع الطريق أو التخطيط للتوقف التالي.

وعند كتابة دليل للمجتمع، ضع الوحدة بجوار كل قياس. نقل رقم مجرد من صورة لاعب آخر قد يسبب التباسًا إذا كان يستخدم نظامًا مختلفًا. احتفظ بالقياس الأصلي في ملاحظاتك عندما تحوله إلى وحدة أخرى في التعليق، حتى تستطيع مراجعة التحويل عند الحاجة.

إذا قارنت طريقًا قبل التعديل وبعده، استخدم نقطة البداية والوجهة نفسيهما. هذه تفضيلات لطريقة العرض، وليست دليلًا على تغير الرحلة نفسها. وفي التحديات المرتبطة بالوقت، وضّح هل تقصد قراءة الساعة داخل اللعبة أم المدة الحقيقية التي استغرقتها التجربة؛ هذا التفصيل يجعل مقارنة النتائج بين اللاعبين أوضح.`,
    aliases: ["كيلومتر", "مئوي", "24 Hour", "Units of Measurement"], tags: ["settings", "navigation", "UI"],
    related: ["minimap-compass-gps-visibility"],
    srcUrls: [["ViceManual — Units of Measurement captured on PS5", "https://vicemanual.com/gta-6-how-to/change-units"]],
  },
  {
    slug: "game-audio-dialogue-media-balance",
    en: "Balance dialogue, radio, and effects without raising everything",
    ar: "وازن الحوار والراديو والمؤثرات دون رفع كل الأصوات",
    sEn: "Identify the sound that masks speech, then change its own slider.",
    sAr: "حدد الصوت الذي يغطي الكلام ثم عدّل منزلقه الخاص.",
    bEn: `The documented Audio menu separates Master, SFX, UI, Dialogue, Music, and Media levels. Media covers sources such as radio and television. The same tab includes GPS Voice and Mute Licensed Music.

Choose a familiar conversation and listen at your normal device volume. If speech is difficult to follow, identify the competing sound before making a change. Compare a small reduction in that source with the original mix; avoid raising the entire output just to make one line clearer.

Test both a quiet exchange and one with movement or background activity. Then check a short recording if you intend to publish a clip: the mix you hear through your playback setup may not be the impression you get on a phone.

Keep notes for the specific setup you tested, such as speakers or headphones. If preparing a stream, review the licensed-music control as well, and listen to a sample recording before the full session. Preserve the starting mix so ordinary play remains easy to restore.`,
    bAr: `تفصل قائمة Audio الموثقة بين Master وSFX وUI وDialogue وMusic وMedia. يغطي Media مصادر مثل الراديو والتلفزيون، وتضم الصفحة نفسها GPS Voice وMute Licensed Music.

اختر حوارًا مألوفًا واستمع بمستوى الصوت المعتاد في جهازك. إذا كان الكلام غير واضح، حدد الصوت المنافس قبل التعديل. قارن خفضًا بسيطًا لهذا المصدر بالمزيج الأصلي، بدل رفع الصوت الكلي لمجرد توضيح جملة واحدة.

اختبر تبادلًا هادئًا وآخر تجري خلفه حركة أو أصوات محيطة. وإذا كنت ستنشر مقطعًا، راجع تسجيلًا قصيرًا على الجوال أيضًا؛ الانطباع عبر نظام الاستماع لديك قد يختلف عن مشاهدة النسخة المنشورة.

دوّن وسيلة الاستماع التي استخدمتها، مثل سماعات الرأس أو مكبرات الشاشة. وعند تجهيز بث، راجع خيار الموسيقى المرخصة واستمع إلى عينة قبل الجلسة الكاملة. احتفظ بالمزيج الأصلي كي تستطيع العودة إلى إعداد اللعب المعتاد، وقيّم وضوح الحوار والمؤثرات معًا بدل الاعتماد على أعلى قيمة ممكنة.`,
    aliases: ["Dialogue", "Media Volume", "الصوت منخفض", "Mute Licensed Music"], tags: ["settings", "audio", "streaming"],
    related: ["subtitles-speakers-background-readability", "ps5-record-gta-vi-discoveries"],
    srcUrls: [["GTA6Map — documented Audio menu", "https://www.gta6map.net/wiki/gta-6/guides/gta-6-audio-settings"]],
  },
  {
    slug: "auto-drive-cinematic-route-controls",
    en: "Try Auto Drive on a short cinematic journey",
    ar: "جرّب القيادة التلقائية في رحلة سينمائية قصيرة",
    sEn: "Set a destination and learn the handover prompt before taking a long trip.",
    sAr: "حدد وجهة وتعلّم أمر استعادة التحكم قبل رحلة طويلة.",
    bEn: `In GTA6Map's documented PS5 playthrough, set a destination and start moving, hold D-pad Down and press Options for cinematic view, then hold the displayed Enable Auto Drive button: Circle in that capture. L2/R2 select three speeds; the Disable Auto Drive prompt hands control back.

For your first attempt, choose a short familiar road and watch the route rather than leaving the screen. Practise returning to manual control before relying on the feature for a longer journey. Follow the prompt shown by your current control layout if its button differs.

If the action is unavailable, check that the destination and cinematic view are active before changing unrelated settings. Try the same route in a calm situation so you can separate a missing prerequisite from a navigation problem.

Keep this experiment distinct from driving practice. It lets you observe a journey, but it does not teach the braking point for a difficult corner. Record the location if a route repeatedly produces an unexpected manoeuvre.`,
    bAr: `في تجربة GTA6Map الموثقة على PS5، حدد وجهة وابدأ الحركة، ثم اضغط D-pad Down مطولًا مع Options للعرض السينمائي، واضغط مطولًا زر Enable Auto Drive الظاهر؛ وهو Circle في اللقطة. يختار L2 وR2 بين ثلاث سرعات، ويعيد أمر Disable Auto Drive التحكم إليك.

اختر في المحاولة الأولى طريقًا قصيرًا تعرفه، وراقب المسار بدل ترك الشاشة. تدرّب على استعادة القيادة اليدوية قبل الاعتماد على الميزة في رحلة طويلة. وإذا اختلف زر الأمر في مخطط تحكمك، اتبع ما يظهر على الشاشة.

عندما لا يتاح التنفيذ، تحقق من الوجهة والعرض السينمائي قبل تغيير إعدادات أخرى. جرّب المسار نفسه في موقف هادئ حتى تميز بين شرط ناقص وبين مشكلة في اختيار الطريق.

افصل هذه التجربة عن تدريب القيادة؛ فهي تسمح بمشاهدة الرحلة، لكنها لا تعلمك متى تبدأ الفرملة عند منعطف صعب. إذا تكررت مناورة غير متوقعة في المكان نفسه، سجّل موضعها وظروفها لتستطيع وصفها ومقارنتها بمحاولة أخرى.`,
    aliases: ["Auto Drive", "قيادة تلقائية", "Cinematic Camera"], tags: ["settings", "driving", "navigation"],
    related: ["hold-down-for-gps", "driving-braking-corner-practice", "dualsense-adaptive-driving-feedback"],
    srcUrls: [["GTA6Map — firsthand PS5 Auto Drive demonstration", "https://www.gta6map.net/wiki/gta-6/guides/gta-6-how-to-enable-auto-drive"]],
  },
  {
    slug: "input-assists-taps-holds-minigames",
    en: "Reduce repeated taps and long holds in the gameplay controls",
    ar: "خفف الضغط المتكرر والإمساك الطويل في التحكم",
    sEn: "Choose help for the specific input that makes an activity awkward.",
    sAr: "اختر المساعدة التي تناسب نوع الضغط الصعب عليك.",
    bEn: `The documented Gameplay > Accessibility group includes Tap Assist, Hold Assist, and Hold Delay. Aiming can use Press instead of Hold. Simplified Mini Games changes input requirements for activities including exercise, hotwiring, and basketball.

Start by naming the difficult action: repeated presses, maintaining pressure, or unintentionally triggering a hold. Pick the corresponding setting and practise the same action outside a high-pressure situation. Do not change all the assistance options together if you want to understand which one helps.

Check both entering and leaving an action after changing its input style. For a toggle, make sure the second press behaves as expected before using it during a demanding sequence. Write down the change so another person using the controller knows what to expect.

Try one familiar activity after setup. Judge success by whether you can complete the intended input reliably and comfortably, not by copying another player's accessibility choices. Restore any option that introduces more confusion than it removes.`,
    bAr: `تضم مجموعة Gameplay ثم Accessibility الموثقة خيارات Tap Assist وHold Assist وHold Delay. ويمكن ضبط Aiming على Press بدل Hold، كما يغيّر Simplified Mini Games متطلبات الإدخال في أنشطة تشمل التمرين وتشغيل السيارة وكرة السلة.

ابدأ بتسمية الفعل الصعب عليك: ضغطات متكررة، أم استمرار الضغط، أم تشغيل أمر مطول دون قصد؟ اختر الإعداد المرتبط به وجرّب الفعل نفسه في موقف هادئ. لا تعدّل كل خيارات المساعدة معًا إذا أردت معرفة الخيار الذي أفادك.

بعد تغيير طريقة الإدخال، اختبر بدء الفعل وإنهاءه. وإذا أصبح الضغط يعمل كتبديل، تأكد من سلوك الضغطة التالية قبل استخدامه في موقف سريع. دوّن التغيير حتى يعرف لاعب آخر يستخدم اليد نفسها ما الذي يتوقعه.

اختر نشاطًا مألوفًا وجرّبه بعد الضبط. قيّم النتيجة بقدرتك على تنفيذ المدخلات المقصودة بثبات وراحة، وليس بمدى مطابقتها لإعدادات شخص آخر. وإذا أضاف خيار ارتباكًا أكثر مما أزال، أعده ثم اختبر بديلًا واحدًا.`,
    aliases: ["Tap Assist", "Hold Assist", "Simplified Mini Games", "تسهيل الضغط"], tags: ["settings", "accessibility", "controls"],
    related: ["accessibility-easy-mode", "movement-speed-walk-jog-run", "ps5-assist-controller-single-player"],
    srcUrls: [["GTA6Map — documented accessibility input options", "https://www.gta6map.net/wiki/gta-6/guides/gta-6-accessibility-options"]],
  },
  {
    slug: "display-flashes-contrast-effects",
    en: "Control bright flashes and visual clutter inside the game",
    ar: "اضبط الومضات والمؤثرات البصرية من داخل اللعبة",
    sEn: "Review display effects separately from your television's brightness.",
    sAr: "راجع مؤثرات العرض بصورة مستقلة عن سطوع التلفزيون.",
    bEn: `The documented Display menu offers a Dark alternative for Flashbang, a Brightness Reduction filter, and High Contrast Shaders. It also separates screen-effect intensity for player status, hits, and awareness cues.

Identify the particular effect you want to change before adjusting overall brightness. Compare the relevant option in a familiar scene, keeping the television setup unchanged. If an overlay is distracting, reduce its intensity gradually and check that you can still notice useful feedback.

Treat high contrast as a different visual presentation, not a general image-quality upgrade. Test whether it helps you distinguish the objects that matter during play. Keep a screenshot of the original display setup for an easy comparison.

After changing several categories over time, review them together in a short normal session. A preference that looks good in a quiet location may hide information in a busier scene. Choose the combination you can read comfortably; these controls do not establish a higher frame-rate mode.`,
    bAr: `تُظهر قائمة Display الموثقة بديل Dark لخيار Flashbang، ومرشح Brightness Reduction، وخيار High Contrast Shaders. كما تفصل شدة مؤثرات حالة اللاعب والضربات وتنبيهات الوعي بالمخاطر.

حدد التأثير الذي تريد تغييره قبل تعديل السطوع العام. قارن خياره في مشهد مألوف مع إبقاء إعداد التلفزيون ثابتًا. وإذا كان مؤثر يغطي الصورة ويشتتك، خفف شدته تدريجيًا وتأكد من أنك ما زلت تلاحظ المعلومات المفيدة التي يصاحبها.

تعامل مع التباين المرتفع بوصفه طريقة عرض مختلفة، وجرّب هل يساعدك على تمييز العناصر المهمة أثناء اللعب. احتفظ بصورة للإعداد الأصلي لتكون المقارنة والعودة إليه سهلة.

عندما تتراكم تعديلاتك مع الوقت، راجعها معًا في جلسة عادية قصيرة. فقد يبدو اختيار واضحًا في منطقة هادئة لكنه يخفي معلومة تحتاجها في مشهد مزدحم. اعتمد المزيج الذي تقرؤه براحة، وافصل هذه الخيارات البصرية عن أوضاع الأداء؛ وجودها لا يثبت أنها ترفع معدل الإطارات.`,
    aliases: ["Flashbang Dark", "Brightness Reduction", "High Contrast Shaders", "الومضات"], tags: ["settings", "display", "accessibility"],
    related: ["camera-shake-bob-sway-comfort", "ps5-hdr-setup-for-gta-vi"],
    srcUrls: [["GTA6Map — documented Display effects", "https://www.gta6map.net/wiki/gta-6/guides/gta-6-display-settings"]],
  },
  {
    slug: "dualsense-adaptive-driving-feedback",
    en: "Understand the PS5 throttle resistance and Adaptive Speed Limiter",
    ar: "افهم مقاومة دعسة PS5 وخيار Adaptive Speed Limiter",
    sEn: "Compare ordinary throttle input with the trigger's resistance point.",
    sAr: "قارن الضغط المعتاد بنقطة المقاومة في زر التسارع.",
    bEn: `GTA VI's PS5 Controller menu separates Adaptive Triggers Resistance, Adaptive Triggers Vibration, and Adaptive Speed Limiter. The limiter's documented behavior uses holding R2 at its resistance point to maintain a road-appropriate pace. It is distinct from cinematic Auto Drive.

On a clear, familiar road, first notice the resistance point without forcing the trigger fully down. Compare a gentle press with a deeper one, while watching speed and keeping steering simple. Then change only the limiter setting and repeat the route to understand its contribution.

If you want less trigger feedback, review resistance and vibration separately. Keep a note of both states so a change in tactile feedback is not confused with a change in vehicle handling.

Repeat the exercise after switching cars before assuming the same amount of pressure will produce the same result. These are the game's DualSense options on PS5. This guide does not assume an Xbox controller has the same resistance mechanism, or that a speed limiter steers the vehicle for you.`,
    bAr: `تفصل قائمة Controller في نسخة PS5 بين Adaptive Triggers Resistance وAdaptive Triggers Vibration وAdaptive Speed Limiter. ويستخدم محدد السرعة، وفق الوصف الموثق، تثبيت R2 عند نقطة مقاومته للحفاظ على وتيرة مناسبة للطريق. وهو مختلف عن Auto Drive السينمائي.

على طريق واضح تعرفه، لاحظ نقطة المقاومة أولًا دون دفع الزر مباشرة إلى نهايته. قارن ضغطًا خفيفًا بضغط أعمق، وراقب السرعة مع إبقاء التوجيه بسيطًا. بعدها غيّر خيار محدد السرعة وحده وأعد المسار لتفهم أثره.

إذا أردت تخفيف إحساس الزر، راجع المقاومة والاهتزاز بصورة مستقلة. دوّن حالة الخيارين كي لا تخلط تغير الإحساس في إصبعك بتغير طريقة توجيه السيارة.

أعد التجربة عندما تغيّر المركبة قبل افتراض أن الضغط نفسه سيعطيك النتيجة ذاتها. هذه خيارات DualSense داخل اللعبة على PS5؛ لا نفترض أن يد Xbox تملك آلية المقاومة نفسها، ولا أن محدد السرعة يوجّه السيارة بدلًا عنك. افصل ضغط التسارع عن حركة التوجيه عند تقييم تجربتك.`,
    aliases: ["Adaptive Speed Limiter", "مقاومة R2", "Adaptive Triggers", "دعسة البنزين"], tags: ["settings", "PS5", "driving"],
    related: ["driving-braking-corner-practice", "auto-drive-cinematic-route-controls", "driving-camera-follow-height"],
    videos: ["Jk-6qrO6hqQ"],
    srcUrls: [["AllThingsHow — PS5 adaptive-trigger menu screenshots", "https://allthings.how/gta-6-controller-settings-adaptive-triggers-sensitivity/"], ["GTA6Map — documented Adaptive Speed Limiter description", "https://www.gta6map.net/wiki/gta-6/guides/gta-6-controller-settings"], ["Octorious — settings video, speed limiter at 3:49", "https://www.youtube.com/watch?v=Jk-6qrO6hqQ"]],
  },
  {
    slug: "in-game-motion-blur-comparison",
    en: "Compare GTA VI motion blur on your own display",
    ar: "قارن ضبابية الحركة داخل GTA VI على شاشتك",
    sEn: "Use the same camera movement to judge detail and perceived smoothness.",
    sAr: "استخدم حركة الكاميرا نفسها لتقييم التفاصيل وإحساس السلاسة.",
    bEn: `The photographed Display tab contains Motion Blur Strength. It changes the blur applied during movement; the available slider lets you compare a reduced effect with a stronger one.

Choose a scene with thin edges, lettering, and a nearby object. Stand in the same place and rotate the camera at a repeatable speed. Compare your original value with one lower setting, then with one higher setting. Notice both the readability of details and how the movement looks to you.

Leave television processing and controller sensitivity unchanged during this comparison. Otherwise it becomes difficult to tell which change produced the result. Use ordinary movement as a second test, not only a rapid camera spin.

Keep the value that suits your actual screen and viewing distance. A preference for clearer individual frames can differ from a preference for the appearance of continuous motion. This in-game setting is separate from television interpolation and does not, by itself, demonstrate an increase in rendered frames.`,
    bAr: `تُظهر قائمة Display المصورة خيار Motion Blur Strength، الذي يغيّر الضبابية المضافة أثناء الحركة. يسمح المنزلق بمقارنة تأثير مخفف مع تأثير أقوى.

اختر مشهدًا يحتوي حواف رفيعة وكتابة وعنصرًا قريبًا. قف في المكان نفسه وحرّك الكاميرا بسرعة تستطيع تكرارها. قارن قيمتك الأصلية بقيمة أقل، ثم بقيمة أعلى. راقب قراءة التفاصيل وإحساس الحركة معًا، بدل الحكم من صورة ثابتة فقط.

اترك معالجة التلفزيون وحساسية اليد كما هما خلال المقارنة، حتى تعرف أي تعديل أحدث الفرق. بعد الدوران بالكاميرا، جرّب حركة عادية في المكان نفسه؛ دوران سريع جدًا قد لا يمثل معظم وقتك داخل اللعبة.

احتفظ بالقيمة المناسبة لشاشتك ومسافة جلوسك. تفضيل وضوح الإطار المفرد قد يختلف عن تفضيل شكل الحركة المتصلة. هذا إعداد داخل اللعبة مستقل عن الإطارات الوسيطة التي قد يولدها التلفزيون، ولا يدل تغييره وحده على زيادة عدد الإطارات التي يرسمها الجهاز.`,
    aliases: ["Motion Blur Strength", "موشن بلر", "ضبابية الحركة"], tags: ["settings", "display", "motion blur"],
    related: ["camera-shake-bob-sway-comfort", "gta-vi-ps5-pro-features-frame-rate"],
    srcUrls: [["GTA Bites — photographed Display settings", "https://www.gtabites.com/gta-6-best-settings"]],
  },
  {
    slug: "driving-braking-corner-practice",
    en: "Improve cornering before changing every controller setting",
    ar: "حسّن دخول المنعطفات قبل تغيير كل إعدادات اليد",
    sEn: "A repeatable driving drill separates approach speed, steering, and camera problems.",
    sAr: "تدريب قصير يفرّق بين سرعة الدخول والتوجيه ومشكلة الكاميرا.",
    bEn: `GAMES.GG's driving guide distinguishes vehicle handling from camera sensitivity and recommends practising braking before a turn. Its observations also warn that different vehicles need different stopping and steering expectations.

Use this simple drill: pick a quiet corner and one car, then make three attempts at progressively lower approach speeds. Start from the same landmark each time. Note whether you cross the outside edge, overcorrect with the stick, or lose sight of the exit.

Choose the cleanest attempt and repeat it before adding speed. If it stays consistent, try a small increase. If you still cannot see the exit, review the camera separately; if the car turns farther than intended, test a smaller steering input before changing the whole control profile.

Stop the exercise after a collision and restore a comparable starting condition. Changing vehicle condition, route, camera, and input settings together makes the result difficult to interpret. Judge progress by repeatable clean corners rather than the fastest single attempt.`,
    bAr: `يفرّق دليل القيادة في GAMES.GG بين استجابة المركبة وحساسية الكاميرا، ويوصي بتدريب الفرملة قبل المنعطف. كما ينبه إلى اختلاف توقعات التوقف والتوجيه عند تغيير نوع المركبة.

جرّب هذا التدريب: اختر منعطفًا هادئًا وسيارة واحدة، ثم نفذ ثلاث محاولات بسرعات دخول أقل تدريجيًا. ابدأ من العلامة نفسها كل مرة، وسجّل هل خرجت إلى الطرف الخارجي، أم بالغت في تصحيح العصا، أم فقدت رؤية مخرج المنعطف.

اختر أنظف محاولة وكررها قبل زيادة السرعة. إذا بقيت النتيجة ثابتة، جرّب زيادة صغيرة. وإذا تعذرت رؤية المخرج، راجع الكاميرا بصورة مستقلة؛ أما إذا انعطفت السيارة أكثر مما قصدت، فاختبر إدخالًا أصغر قبل تغيير ملف التحكم كاملًا.

بعد الاصطدام، أعد حالة البداية إلى وضع يمكن مقارنته. تغيير حالة المركبة والطريق والكاميرا والإعدادات معًا يجعل النتيجة صعبة التفسير. قيّم تقدمك بعدد المنعطفات النظيفة التي تستطيع تكرارها، وليس بأسرع محاولة منفردة نجحت مرة واحدة.`,
    aliases: ["القيادة صعبة", "الفرملة", "دخول المنعطف", "handling"], tags: ["driving", "practice", "beginner"],
    related: ["driving-camera-follow-height", "dualsense-adaptive-driving-feedback", "controller-deadzone-drift-check"],
    srcUrls: [["GAMES.GG — driving controls and handling guide", "https://games.gg/grand-theft-auto-vi/guides/grand-theft-auto-6-driving-guide-controls-handling/"]],
  },
];

export default build("tips", guides.map((entry) => ({
  ...entry, status: "confirmed" as const, date: "2026-11-21T22:00:00Z",
})));
