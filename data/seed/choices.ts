import { build } from "./helpers";

const SPOILER = {
  en: "⚠️ Spoiler warning: this page discusses story events.",
  ar: "⚠️ تنبيه حرق: الصفحة فيها أحداث من القصة.",
};

export default build("choices", [
  {
    slug: "lie-to-lucia-brian-retirement",
    status: "confirmed",
    featured: true,
    en: "Lying to Lucia: what happens if you hide Brian's retirement",
    ar: "لو كذبت على لوسيا: وش يصير لو خبّيت عنها تقاعد Brian؟",
    sEn: "Telling Lucia the truth about Brian retiring helps your relationship; keeping it to yourself makes it drop later.",
    sAr: "لو قلت للوسيا الحقيقة عن تقاعد Brian علاقتكم تتحسن، ولو خبّيت عنها تنزل العلاقة بعدين.",
    bEn: `${SPOILER.en}

At one point Jason learns that Brian Heder is planning to retire. The game lets you choose whether Jason tells Lucia about it or keeps it to himself.

- Tell her: the relationship between Jason and Lucia improves.
- Keep it secret: nothing seems to happen right away, but guides report the relationship drops later on when the truth catches up with you.

It's one of several small moments where honesty with your partner pays off. Guides agree these relationship changes are tied to specific story moments rather than a hidden "lie meter" running all the time.`,
    bAr: `${SPOILER.ar}

في نقطة من القصة يعرف Jason إن Brian Heder ناوي يتقاعد. واللعبة تخيرك: Jason يقول للوسيا أو يخبّي عنها.

- لو قلت لها: العلاقة بين Jason و Lucia تتحسن.
- لو خبّيت: ما يصير شي على طول، لكن الأدلة تقول إن العلاقة تنزل بعدين لما تنكشف الحقيقة.

هذي من اللحظات الصغيرة اللي الصراحة فيها مع شريكك تفرق. والأدلة متفقة إن تغيّر العلاقة مرتبط بلحظات معينة في القصة، مو بعداد "كذب" شغال طول الوقت.`,
    aliases: ["lie", "Lucia", "Brian", "كذب", "لوسيا", "علاقة"],
    tags: ["spoiler", "relationship"],
    facts: [
      ["Tell the truth", "تقول الحقيقة", "Relationship ↑", "العلاقة ↑"],
      ["Hide it", "تخبّي", "Relationship ↓ later", "العلاقة ↓ بعدين"],
    ],
    related: ["lucia-caminos", "brian-heder", "jason-lucia-relationship-trust"],
    src: ["beebomChoices", "meowChoices"],
  },
  {
    slug: "coming-home-preparations",
    status: "confirmed",
    en: "'Coming Home': the little things that make Lucia happy",
    ar: "مهمة 'Coming Home': الأشياء الصغيرة اللي تفرّح لوسيا",
    sEn: "Preparing for Lucia's return — necklace, flowers, groceries, a haircut — raises Jason's relationship level.",
    sAr: "تجهيزك لرجعة Lucia — عقد، ورد، أغراض البيت، قصة شعر — يرفع مستوى علاقة Jason معها.",
    bEn: `${SPOILER.en}

Before Lucia comes home, Jason can prepare: buy a necklace, pick up flowers, stock the fridge with groceries and get a haircut. Each preparation raises the relationship level between them.

Skipping them doesn't block the story, but you miss an easy relationship boost.`,
    bAr: `${SPOILER.ar}

قبل ما ترجع Lucia للبيت، يقدر Jason يجهّز: يشتري عقد، يجيب ورد، يعبّي الثلاجة أغراض، ويقص شعره. كل وحدة من هذي ترفع مستوى العلاقة بينهم.

لو ما سويتها القصة تكمل عادي، بس تفوّت عليك زيادة سهلة في العلاقة.`,
    aliases: ["Coming Home", "necklace", "flowers", "هدية", "ورد", "عقد"],
    tags: ["spoiler", "relationship"],
    related: ["lucia-caminos", "jason-duval"],
    src: ["beebomChoices", "ggChoices"],
  },
  {
    slug: "shayna-fate",
    status: "confirmed",
    en: "Shayna's fate depends on Lucia",
    ar: "مصير Shayna بيد لوسيا",
    sEn: "In Lucia's Cellerica storyline, doing nothing about Shayna's situation can get her killed.",
    sAr: "في قصة Lucia في Cellerica، لو ما سويتي شي بخصوص Shayna ممكن تنقتل.",
    bEn: `${SPOILER.en}

During Lucia's dialogue in Cellerica, you're faced with Shayna's situation. Guides report that if Lucia does nothing, Shayna can end up dead — one of the clearest examples of inaction having a real cost in GTA VI.`,
    bAr: `${SPOILER.ar}

خلال حوار Lucia في Cellerica، تواجه موقف Shayna. الأدلة تقول إن Lucia لو ما تدخلت، Shayna ممكن تنتهي مقتولة — من أوضح الأمثلة في GTA VI إن السكوت له ثمن.`,
    aliases: ["Shayna", "Cellerica", "شاينا"],
    tags: ["spoiler", "character death"],
    related: ["lucia-caminos"],
    src: ["beebomChoices"],
  },
  {
    slug: "bridge-ending-choices",
    status: "confirmed",
    en: "The bridge finale: how your last choices change the ending",
    ar: "نهاية الجسر: كيف اختياراتك الأخيرة تغيّر النهاية",
    sEn: "The ending depends on the final bridge choices — and one wrong move during 'Swim For It' gets Jason and Lucia shot.",
    sAr: "النهاية تعتمد على اختياراتك فوق الجسر — وحركة غلط وحدة في 'Swim For It' تخلي الشرطة تطلق على Jason و Lucia.",
    bEn: `${SPOILER.en}

The finale on the bridge is where your choices matter most. Guides say the ending depends on the decisions you make there.

One documented outcome: if you choose the "Swim For It" option and Jason leaves the car armed, police open fire and Jason and Lucia are shot dead. If you want the better outcome, think twice before stepping out with a gun in hand.`,
    bAr: `${SPOILER.ar}

النهاية فوق الجسر هي أكثر مكان تفرق فيه اختياراتك. الأدلة تقول إن النهاية تعتمد على قراراتك هناك.

ومن النتائج الموثقة: لو اخترت "Swim For It" و Jason نزل من السيارة وهو ماسك سلاح، الشرطة تطلق النار ويموتون Jason و Lucia. لو تبغى نهاية أحسن، فكّر مرتين قبل ما تنزل والسلاح بيدك.`,
    aliases: ["ending", "bridge", "Swim For It", "النهاية", "الجسر"],
    tags: ["spoiler", "ending"],
    related: ["jason-duval", "lucia-caminos"],
    src: ["beebomChoices", "meowChoices"],
  },
  {
    slug: "jason-lucia-relationship-trust",
    status: "rumor",
    en: "Is there a hidden 'trust meter' between Jason and Lucia?",
    ar: "هل فيه 'عداد ثقة' مخفي بين Jason و Lucia؟",
    sEn: "Some sites describe a trust rating affected by lying and selfish choices; the most reliable guides only confirm mission-specific relationship changes.",
    sAr: "بعض المواقع تتكلم عن عداد ثقة يتأثر بالكذب والأنانية، لكن أوثق الأدلة تأكد بس تغييرات علاقة مرتبطة بمهمات معينة.",
    bEn: `You'll see claims that GTA VI has a full trust system: lying to one character as the other, ignoring warnings in missions or acting selfishly supposedly lowers a trust rating that changes combat support and dialogue.

What's actually confirmed is narrower: specific moments (like telling Lucia about Brian or preparing for 'Coming Home') raise or lower the relationship, and some final choices change the ending. At least one site admits its trust details come from leaked debug data, so treat the broader "trust meter" as unverified until Rockstar or more guides confirm it.`,
    bAr: `بتشوف كلام إن GTA VI فيها نظام ثقة كامل: الكذب على شخصية وأنت تلعب بالثانية، أو تجاهل التحذيرات بالمهمات، أو الأنانية، كلها تنزّل عداد ثقة يأثر على المساعدة بالقتال والحوارات.

لكن المؤكد فعلاً أضيق من كذا: لحظات معينة (مثل إنك تقول للوسيا عن Brian أو تجهّز لمهمة Coming Home) ترفع أو تنزل العلاقة، وبعض الاختيارات الأخيرة تغيّر النهاية. وموقع واحد على الأقل يعترف إن تفاصيل الثقة عنده من بيانات مسربة، فاعتبر "عداد الثقة" الشامل غير مؤكد لين تأكده Rockstar أو أدلة أكثر.`,
    aliases: ["trust", "relationship", "ثقة", "علاقة"],
    tags: ["relationship", "mechanics"],
    related: ["lie-to-lucia-brian-retirement", "coming-home-preparations"],
    src: ["athRelationship", "trustSystem"],
  },
  {
    slug: "what-happens-if-you-kill",
    status: "confirmed",
    en: "What happens if you kill people?",
    ar: "وش يصير لو قتلت ناس؟",
    sEn: "No general morality penalty has been found — killing mainly brings police heat. Story deaths depend on specific choices.",
    sAr: "ما انكشف أي عقاب أخلاقي عام — القتل أساساً يجيب لك الشرطة. والموت في القصة مرتبط باختيارات معينة.",
    bEn: `So far, no guide has found a general "karma" system that punishes you for killing random people in GTA VI. The usual consequence is the law: your wanted level rises and the police come for you.

Where killing (or letting someone die) matters is in specific story moments — like Shayna's fate or the bridge finale. If you want to keep someone alive in a fight, press L3 + R3 (Xbox: LS + RS) while aiming to highlight non-lethal areas.`,
    bAr: `لين الحين، ما فيه دليل لقى نظام "كارما" عام يعاقبك لو قتلت ناس عشوائيين في GTA VI. العاقبة المعتادة هي القانون: مستوى المطاردة يرتفع والشرطة تجيك.

القتل (أو إنك تخلي أحد يموت) يفرق فعلاً في لحظات معينة بالقصة — مثل مصير Shayna أو نهاية الجسر. ولو تبغى أحد يبقى حي في القتال، اضغط L3 + R3 (إكس بوكس: LS + RS) وأنت تصوّب عشان تبين الأماكن غير القاتلة.`,
    aliases: ["kill", "karma", "wanted", "قتل", "الشرطة"],
    tags: ["mechanics"],
    related: ["non-lethal-takedowns", "shayna-fate", "bridge-ending-choices"],
    src: ["beebomChoices", "ggChoices"],
  },
]);
