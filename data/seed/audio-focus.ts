import { build, type SeedInput } from "./helpers";

export const audioFocusDrafts: SeedInput[] = [
  {
    "slug": "ps5-audio-focus-dialogue-headphones",
    "status": "official",
    "en": "PS5 Audio Focus: try clearer dialogue through headphones",
    "ar": "Audio Focus على PS5: جرّب توضيح الحوار عبر السماعات",
    "sEn": "A console sound feature to compare with your in-game audio mix.",
    "sAr": "ميزة صوت في الجهاز، جرّبها مع إعدادات الصوت داخل اللعبة.",
    "bEn": "Connect headphones, then open Settings > Sound > Volume > Audio Focus and enable Use Audio Focus. Sony documents Boost Voices for character and chat voices, with Weak, Medium and Strong levels. Use Audio Preview and check headphone volume before playing.\n\nThe feature also offers low-pitch, high-pitch and quiet-sound presets. Sony's announcement specifies USB or analog-jack headphones; HDMI television speakers, receivers and soundbars are not supported. This is a PS5 system feature, not a GTA VI menu option.\n\nOur suggested comparison: save your current game-audio mix, replay a familiar conversation, and change one setting at a time. Start gently and keep the original setup if it sounds clearer to you. We have not measured a GTA VI-specific improvement. The attached PlayStation Asia video introduces the system update; it is not a game benchmark.",
    "bAr": "وصّل السماعات، ثم افتح Settings > Sound > Volume > Audio Focus وفعّل Use Audio Focus. توثق Sony خيار Boost Voices لأصوات الشخصيات والدردشة، بمستويات Weak وMedium وStrong. استخدم Audio Preview وراجع مستوى صوت السماعات قبل اللعب.\n\nتوجد أيضًا أوضاع للترددات المنخفضة والعالية والأصوات الهادئة. يحدد إعلان Sony سماعات USB أو المنفذ التناظري؛ لا يدعم سماعات التلفزيون أو المستقبلات أو الساوندبار عبر HDMI. الميزة تخص نظام PS5، وليست خيارًا داخل قوائم GTA VI.\n\nاقتراحنا للمقارنة: احفظ مزيج الصوت الحالي، وكرر حوارًا تعرفه، وغيّر إعدادًا واحدًا كل مرة. ابدأ بمستوى خفيف واحتفظ بالوضع الأصلي إذا كان أوضح لك. لم نقس تحسنًا خاصًا بـGTA VI. فيديو PlayStation Asia المرفق يعرّف بتحديث النظام، وليس اختبارًا لأداء اللعبة.",
    "aliases": [
      "توضيح الحوار",
      "صوت الخطوات",
      "Audio Focus",
      "Boost Voices",
      "سماعات بلايستيشن"
    ],
    "tags": [
      "PS5",
      "audio",
      "accessibility",
      "headphones"
    ],
    "related": [
      "game-audio-dialogue-media-balance",
      "subtitles-speakers-background-readability",
      "ps5-dualsense-button-remapping"
    ],
    "videos": [
      "6F_o7o6bilo"
    ],
    "srcUrls": [
      [
        "PlayStation — Audio Focus settings and headphone volume",
        "https://www.playstation.com/en-us/support/hardware/audio-focus-ps5/"
      ],
      [
        "PlayStation Blog — Audio Focus modes and supported connections",
        "https://blog.playstation.com/2025/04/23/new-ps5-system-software-update-features-audio-focus-and-the-return-of-the-classic-console-ui-customizations/"
      ],
      [
        "PlayStation Asia — system software update video",
        "https://www.youtube.com/watch?v=6F_o7o6bilo"
      ]
    ],
    "date": "2026-11-21T23:00:00Z"
  }
];
export default build("tips", audioFocusDrafts);
