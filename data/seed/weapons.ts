import { build } from "./helpers";

const note = {
  en: "Locations come from community guides in the first days after launch and may differ slightly between sources.",
  ar: "المواقع من أدلة اللاعبين في أول أيام الإطلاق، وممكن تختلف شوي بين المصادر.",
};

export default build("weapons", [
  {
    slug: "donnies-hl-38",
    status: "confirmed",
    featured: true,
    en: "Donnie's H&L .38",
    ar: "مسدس دوني H&L .38",
    sEn: "Free unique revolver in the trunk of Donnie's red car during Chapter 1's 'Don Gone'. Missable!",
    sAr: "مسدس فريد مجاني في شنطة سيارة Donnie الحمرا بمهمة 'Don Gone' في الفصل الأول. يفوتك لو ما انتبهت!",
    bEn: `During the Chapter 1 mission "Don Gone", open the trunk of Donnie's red car before it gets destroyed — the H&L .38 is inside. If the car is wrecked first, the weapon is lost.

${note.en}`,
    bAr: `في مهمة "Don Gone" بالفصل الأول، افتح شنطة سيارة Donnie الحمرا قبل ما تتدمر — مسدس H&L .38 داخلها. لو تدمرت السيارة قبل، يروح عليك السلاح.

${note.ar}`,
    aliases: ["H&L 38", "Donnie revolver", "مسدس دوني"],
    tags: ["revolver", "missable"],
    facts: [
      ["Type", "النوع", "Revolver", "مسدس ريفولفر"],
      ["How to get", "طريقة الحصول", "Chapter 1, 'Don Gone'", "الفصل الأول، مهمة Don Gone"],
      ["Missable", "يفوت؟", "Yes", "نعم"],
    ],
    related: ["donnie"],
    src: ["keenWeapons"],
  },
  {
    slug: "hobo-marabunta-grande",
    status: "confirmed",
    en: "Hobo 'Marabunta Grande' shotgun",
    ar: "شوزن Hobo 'Marabunta Grande'",
    sEn: "Free unique shotgun in an open gun case at the back of Hamlet Storage.",
    sAr: "شوزن فريد مجاني في شنطة مفتوحة ورا Hamlet Storage.",
    bEn: `Go around the building to the rear entrance of Hamlet Storage. The shotgun is in an open gun case on the floor.

${note.en}`,
    bAr: `لف حول المبنى للمدخل الخلفي في Hamlet Storage. الشوزن موجود في شنطة سلاح مفتوحة على الأرض.

${note.ar}`,
    aliases: ["Marabunta Grande", "Hobo shotgun", "شوزن هوبو"],
    tags: ["shotgun", "free"],
    facts: [
      ["Type", "النوع", "Shotgun", "شوزن"],
      ["Location", "المكان", "Hamlet Storage (rear)", "Hamlet Storage (الخلف)"],
      ["Price", "السعر", "Free", "مجاني"],
    ],
    region: "Vice City",
    related: ["hamlet-storage", "hamlet", "backdoor-hobo"],
    src: ["keenWeapons"],
  },
  {
    slug: "gutterball-moreland-850",
    status: "confirmed",
    en: "Gutterball Moreland 850",
    ar: "شوزن Gutterball Moreland 850",
    sEn: "Unique shotgun in a gun case on a pool table at Kingpin Bowling, Port Gellhorn.",
    sAr: "شوزن فريد في شنطة على طاولة بلياردو في Kingpin Bowling ببورت جيلهورن.",
    bEn: `Head inside Kingpin Bowling in Port Gellhorn to the games and pool-table area. The Gutterball Moreland 850 sits in a gun case on a pool table.

${note.en}`,
    bAr: `ادخل Kingpin Bowling في Port Gellhorn وروح لمنطقة الألعاب وطاولات البلياردو. الشوزن في شنطة سلاح على طاولة بلياردو.

${note.ar}`,
    aliases: ["Gutterball", "Moreland 850", "قاتربول"],
    tags: ["shotgun"],
    facts: [
      ["Type", "النوع", "Shotgun", "شوزن"],
      ["Location", "المكان", "Kingpin Bowling, Port Gellhorn", "Kingpin Bowling، بورت جيلهورن"],
    ],
    region: "Port Gellhorn",
    related: ["kingpin-bowling", "port-gellhorn"],
    src: ["keenWeapons"],
  },
  {
    slug: "drug-mule-kz-59",
    status: "confirmed",
    en: "Drug Mule KZ-59",
    ar: "سلاح Drug Mule KZ-59",
    sEn: "Hidden underwater near a sunken ship off the north coast of the Riquezas Keys.",
    sAr: "مخبّا تحت الماء جنب سفينة غارقة شمال جزر Riquezas Keys.",
    bEn: `Dive off the north coast of the Riquezas Keys and look near the sunken ship — the Drug Mule KZ-59 is hidden on the seabed. Combine it with Kenton's treasure dives for an efficient trip.

${note.en}`,
    bAr: `غُص قبالة الساحل الشمالي لـ Riquezas Keys ودوّر جنب السفينة الغارقة — سلاح Drug Mule KZ-59 مخبّا في قاع البحر. اجمعها مع غطسات Kenton عشان توفر وقت.

${note.ar}`,
    aliases: ["KZ-59", "Drug Mule", "دراق ميول"],
    tags: ["underwater", "smg"],
    facts: [
      ["Location", "المكان", "Underwater, Riquezas Keys (north)", "تحت الماء، شمال Riquezas Keys"],
      ["Tip", "نصيحة", "Combine with treasure dives", "اجمعها مع غطسات الكنوز"],
    ],
    region: "Leonida Keys",
    related: ["riquezas-keys", "kenton-treasure-dives"],
    src: ["keenWeapons"],
  },
  {
    slug: "conspiracist-type-9",
    status: "confirmed",
    en: "Conspiracist Type 9 SMG",
    ar: "رشاش Conspiracist Type 9",
    sEn: "In an underground armoury beneath a mobile home in Balsero, south-west of Griffin Shooting Range.",
    sAr: "في مخزن سلاح تحت الأرض أسفل بيت متنقل في Balsero، جنوب غرب ميدان Griffin للرماية.",
    bEn: `Find the mobile home in Balsero, south-west of Griffin Shooting Range. Beneath it is an underground armoury holding the Conspiracist Type 9 SMG.

${note.en}`,
    bAr: `دوّر البيت المتنقل في Balsero جنوب غرب Griffin Shooting Range. تحته مخزن سلاح سري فيه رشاش Conspiracist Type 9.

${note.ar}`,
    aliases: ["Type 9", "Conspiracist", "Balsero", "Griffin Shooting Range"],
    tags: ["smg", "secret"],
    facts: [
      ["Type", "النوع", "SMG", "رشاش خفيف"],
      ["Location", "المكان", "Balsero bunker", "مخبأ Balsero"],
    ],
    related: ["belville-simulation-house"],
    src: ["keenWeapons"],
  },
  {
    slug: "backdoor-hobo",
    status: "confirmed",
    en: "'Backdoor' Hobo",
    ar: "شوزن 'Backdoor' Hobo",
    sEn: "Purchasable rare shotgun variant at Zenon's Pawn Shop in La Perle — $2,502.",
    sAr: "نسخة نادرة من الشوزن تنشرى من Zenon's Pawn Shop في La Perle بـ 2,502$.",
    bEn: `Not every rare gun is found lying around. The Backdoor Hobo is sold at Zenon's Pawn Shop in La Perle, northern Vice City, for $2,502.

${note.en}`,
    bAr: `مو كل الأسلحة النادرة تلقاها مرمية. Backdoor Hobo ينباع في Zenon's Pawn Shop في La Perle شمال Vice City بسعر 2,502 دولار.

${note.ar}`,
    aliases: ["Backdoor", "باك دور"],
    tags: ["shotgun", "shop"],
    facts: [
      ["Price", "السعر", "$2,502", "2,502$"],
      ["Shop", "المحل", "Zenon's Pawn Shop, La Perle", "Zenon's Pawn Shop، لابيرل"],
    ],
    region: "Vice City",
    related: ["zenons-pawn-shop", "hobo-marabunta-grande"],
    src: ["keenWeapons"],
  },
  {
    slug: "moneymaker-w-10",
    status: "confirmed",
    en: "Moneymaker W-10",
    ar: "سلاح Moneymaker W-10",
    sEn: "Rare variant sold at Tequesta Guns & Ammo for $1,557.",
    sAr: "نسخة نادرة تنباع في Tequesta Guns & Ammo بـ 1,557$.",
    bEn: `The Moneymaker W-10 can be bought at Tequesta Guns & Ammo in south-western Tequesta for $1,557.

${note.en}`,
    bAr: `Moneymaker W-10 تقدر تشتريه من Tequesta Guns & Ammo في جنوب غرب Tequesta بسعر 1,557 دولار.

${note.ar}`,
    aliases: ["W-10", "Moneymaker", "Tequesta Guns"],
    tags: ["shop"],
    facts: [
      ["Price", "السعر", "$1,557", "1,557$"],
      ["Shop", "المحل", "Tequesta Guns & Ammo", "Tequesta Guns & Ammo"],
    ],
    related: ["bae-luxs-w-10"],
    src: ["keenWeapons"],
  },
  {
    slug: "swamp-bait-akulus",
    status: "confirmed",
    en: "Swamp Bait Akulus revolver",
    ar: "مسدس Swamp Bait Akulus",
    sEn: "Free early-game unique revolver listed among the best early pickups.",
    sAr: "مسدس فريد مجاني من أفضل الأسلحة اللي تاخذها بدري.",
    bEn: `The Swamp Bait Akulus is a unique revolver that guides list among the best free early-game weapons. Exact pickup details vary between guides.

${note.en}`,
    bAr: `Swamp Bait Akulus مسدس فريد تحطّه الأدلة ضمن أفضل الأسلحة المجانية بداية اللعبة. تفاصيل مكانه تختلف بين الأدلة.

${note.ar}`,
    aliases: ["Akulus", "Swamp Bait", "سوامب بيت"],
    tags: ["revolver", "free"],
    src: ["keenWeapons", "space4Weapons"],
  },
  {
    slug: "cruel-huntsman-sm-69",
    status: "confirmed",
    en: "Cruel Huntsman's SM-69",
    ar: "قناصة Cruel Huntsman SM-69",
    sEn: "Unique hunting rifle found in Pelican Valley.",
    sAr: "بندقية صيد فريدة تلقاها في Pelican Valley.",
    bEn: `Guides list Cruel Huntsman's SM-69 as a free early unique weapon found in Pelican Valley.

${note.en}`,
    bAr: `الأدلة تذكر Cruel Huntsman's SM-69 كسلاح فريد مجاني بدري، تلقاه في Pelican Valley.

${note.ar}`,
    aliases: ["SM-69", "Huntsman", "Pelican Valley"],
    tags: ["rifle", "free"],
    src: ["keenWeapons"],
  },
  {
    slug: "bae-luxs-w-10",
    status: "rumor",
    en: "Bae-Lux's W-10",
    ar: "سلاح Bae-Lux's W-10",
    sEn: "Legendary weapon named after Bae-Luxe of Real Dimez — location not yet discovered.",
    sAr: "سلاح أسطوري باسم Bae-Luxe من Real Dimez — مكانه ما انكشف لين الآن.",
    bEn: `Weapon lists include a Bae-Lux's W-10, but as of the first days after launch no guide had confirmed where to get it. We'll update this page automatically when it's found.`,
    bAr: `قوائم الأسلحة فيها Bae-Lux's W-10، لكن لين أول أيام الإطلاق ما فيه دليل أكد مكانه. بنحدّث الصفحة تلقائياً أول ما ينكشف.`,
    aliases: ["Bae-Lux", "W-10"],
    tags: ["legendary", "unknown"],
    related: ["real-dimez", "moneymaker-w-10"],
    src: ["keenWeapons"],
  },
  {
    slug: "hawk-little-morgan-revolvers",
    status: "official",
    en: "Hawk & Little Morgan revolvers (Ultimate Edition)",
    ar: "مسدسات Hawk & Little Morgan (نسخة Ultimate)",
    sEn: "Vice City-inspired scoped revolver set exclusive to the Ultimate Edition.",
    sAr: "مجموعة مسدسات بمنظار مستوحاة من Vice City، حصرية لنسخة Ultimate.",
    bEn: `The Hawk & Little Morgan revolvers are an Ultimate Edition exclusive — a Vice City-inspired scoped revolver set. Ultimate content unlocks across the story chapters rather than all at once.`,
    bAr: `مسدسات Hawk & Little Morgan حصرية لنسخة Ultimate — مجموعة مسدسات بمنظار مستوحاة من Vice City. ومحتوى Ultimate يفتح مع تقدّم فصول القصة مو كله مرة وحدة.`,
    aliases: ["Hawk", "Little Morgan", "هوك"],
    tags: ["revolver", "Ultimate Edition"],
    related: ["price-and-editions"],
    src: ["space4Weapons", "pcgEditions"],
  },
]);
