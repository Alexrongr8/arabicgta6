import { build } from "./helpers";

export default build("funny", [
  {
    slug: "sahara-truck-crash-rescue",
    status: "confirmed",
    featured: true,
    en: "The Sahara truck crash: the driver runs, you're the hero",
    ar: "حادث شاحنة Sahara: السواق هرب، وأنت البطل",
    sEn: "A sedan smashes into a Sahara delivery truck, the truck driver bolts, and the other driver is stuck in a burning car — what happens next went viral.",
    sAr: "سيارة تصدم شاحنة توصيل Sahara، سواق الشاحنة يهرب، والثاني محبوس في سيارة تحترق — واللي صار بعدها انتشر بقوة.",
    bEn: `One of the first viral moments after launch: right next to Jason, a sedan slams into the side of a Sahara delivery truck. The truck driver simply runs away, leaving the other driver trapped in a car that's catching fire.

Most players stop and pull him out — and the rescued driver's reaction is what got people talking: he immediately clocks that the truck belongs to Sahara, the game's obvious parody of Amazon, and reacts accordingly.

It's a great example of how many small scripted-but-random scenes are scattered around Leonida. When you hear a crash or a scream, press L3 + R3 (Xbox: LS + RS) to look toward it.`,
    bAr: `من أول المواقف اللي انتشرت بعد الإطلاق: جنب Jason بالضبط، سيارة صغيرة تدخل في جنب شاحنة توصيل تابعة لـ Sahara. سواق الشاحنة يهرب على طول، ويترك السواق الثاني محبوس في سيارة بدت تولّع.

أغلب اللاعبين يوقفون ويطلّعونه — والطريف ردة فعله بعدها: أول ما يطلع ينتبه إن الشاحنة تابعة لـ Sahara، وهي نسخة اللعبة الساخرة من Amazon، ويعلّق عليها بطريقته.

الموقف هذا مثال على كثرة المشاهد العشوائية المنتشرة في Leonida. لما تسمع حادث أو صراخ، اضغط L3 + R3 (إكس بوكس: LS + RS) وتلف الكاميرا على مكانه.`,
    aliases: ["Sahara", "Amazon", "truck crash", "حادث", "شاحنة"],
    tags: ["NPC", "viral"],
    related: ["focus-l3-r3-find-noise", "dynamic-world-events"],
    src: ["ladFunny"],
  },
  {
    slug: "polar-bear-escapes-truck",
    status: "rumor",
    en: "A polar bear escapes from a truck… in Leonida",
    ar: "دب قطبي يهرب من شاحنة… في Leonida!",
    sEn: "Players report a polar bear breaking loose from a truck — in a state modelled on Florida.",
    sAr: "لاعبين يقولون شافوا دب قطبي يطلع من شاحنة — في ولاية نسخة من فلوريدا!",
    bEn: `Among the random encounters players are sharing is a polar bear getting loose from a truck in the middle of Leonida's heat. Where and how often it triggers isn't nailed down yet, so treat it as a lucky find if you see it.`,
    bAr: `من المواقف العشوائية اللي يتناقلها اللاعبين: دب قطبي يفلت من شاحنة وسط حر Leonida. وين ومتى يصير بالضبط لسه مو مؤكد، فلو شفته اعتبر نفسك محظوظ.`,
    aliases: ["polar bear", "bear", "دب", "دب قطبي"],
    tags: ["animals", "random"],
    related: ["jet-ski-dog"],
    src: ["funnyNpc"],
  },
  {
    slug: "jet-ski-dog-rescue",
    status: "rumor",
    en: "Rescued at sea by a dog on a jet ski",
    ar: "كلب على جت سكي ينقذك في البحر",
    sEn: "Swim out far enough and a goggle-wearing dog on a jet ski may come to pick you up.",
    sAr: "اسبح بعيد وممكن يجيك كلب لابس نظارة على جت سكي ويشيلك.",
    bEn: `It sounds made up, but several players describe the same thing: swim far from the shore, hear barking, and a dog in goggles pulls up on a jet ski to "rescue" you. It's become one of the most shared moments of launch week. See also the Secrets entry for what we know about triggering it.`,
    bAr: `تبان خرافة، بس أكثر من لاعب يوصف نفس الشي: تسبح بعيد عن الشاطئ، تسمع نباح، ويجيك كلب لابس نظارة سباحة على جت سكي "ينقذك". صار من أكثر المواقف انتشاراً بأسبوع الإطلاق. شوف موضوعه في قسم الأسرار لطريقة التفعيل.`,
    aliases: ["dog", "jet ski", "كلب", "جت سكي"],
    tags: ["animals", "viral"],
    related: ["jet-ski-dog"],
    src: ["funnyNpc", "gsEggs"],
  },
  {
    slug: "lizard-throwing",
    status: "confirmed",
    en: "Throwing lizards at strangers",
    ar: "رمي السحالي على الناس",
    sEn: "Pick up a random lizard, throw it at someone, enjoy the reaction.",
    sAr: "التقط سحلية عشوائية، ارمها على أحد، واستمتع بردة الفعل.",
    bEn: `Leonida lets you throw objects at people just to see what they do — trash, and yes, lizards you happen to find lying around. The NPC reactions are half the fun, and players have been collecting the best ones on social media.`,
    bAr: `Leonida تخليك ترمي أشياء على الناس بس عشان تشوف وش بيسوون — زبالة، وإيه حتى السحالي اللي تلقاها بالطريق. ردود فعل الناس نص المتعة، واللاعبين صاروا يجمعون أحسنها في السوشال ميديا.`,
    aliases: ["lizard", "سحلية", "سحالي"],
    tags: ["NPC"],
    related: ["throw-lizards-at-people"],
    src: ["kotakuDetails"],
  },
  {
    slug: "trailer-spiderman-npc",
    status: "rumor",
    en: "Fans 'found Spider-Man' on Vice Beach in the trailer",
    ar: "المعجبين 'لقوا سبايدر مان' في شاطئ Vice Beach بالتريلر",
    sEn: "A shadowy beachgoer under an umbrella in the trailer looked just like Spider-Man to half the internet.",
    sAr: "شخص في الظل تحت مظلة بالتريلر شافه نص الإنترنت كأنه سبايدر مان.",
    bEn: `Before launch, fans went frame by frame through the trailers and spotted a beachgoer sitting in deep shade under an umbrella whose silhouette looked uncannily like Spider-Man. It's almost certainly just lighting, but "I just found Spider-Man in the GTA 6 trailer" became a meme of its own.`,
    bAr: `قبل الإطلاق، المعجبين حللوا التريلرات لقطة لقطة، ولقوا شخص جالس تحت مظلة في ظل قوي، شكله يشبه سبايدر مان بشكل غريب. غالباً مجرد إضاءة، بس جملة "لقيت سبايدر مان في تريلر GTA 6" صارت ميم لحالها.`,
    aliases: ["Spider-Man", "Spiderman", "سبايدر مان"],
    tags: ["trailer", "meme"],
    related: ["trailer-1-december-2023"],
    src: ["sportskeedaSpidey"],
  },
]);
