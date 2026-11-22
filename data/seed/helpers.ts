import type { CategorySlug, Item, Status } from "../../src/lib/types";
import { LOCS } from "./locations";
import IMAGES from "./images.json";

// Official Rockstar Games media (rockstargames.com/VI/media), stored in /public/img.
const OFFICIAL_IMAGES: Record<string, string> = {
  "lucia-caminos": "/img/lucia.webp",
  "jason-duval": "/img/jason-lucia.webp",
  "gta-6-release-november-19-2026": "/img/vice-city.webp",
  "day-one-sales-record-3-79-billion": "/img/cheetah.webp",
  "metacritic-99-score": "/img/jason-lucia.webp",
  "trailer-2-may-2025": "/img/vintage.webp",
  "price-and-editions": "/img/ultimate.webp",
  "which-edition-to-buy": "/img/ultimate.webp",
  "grotti-cheetah-95": "/img/cheetah.webp",
  "hawk-little-morgan-revolvers": "/img/revolvers.webp",
  "vice-city": "/img/vice-city.webp",
  leonida: "/img/vice-city.webp",
};

export interface SeedInput {
  slug: string;
  status: Status;
  en: string; // title
  ar: string;
  sEn: string; // summary
  sAr: string;
  bEn: string; // body (paragraphs separated by blank lines, "- " for bullets)
  bAr: string;
  aliases?: string[];
  tags?: string[];
  facts?: [string, string, string, string][]; // [key_en, key_ar, value_en, value_ar]
  region?: string;
  related?: string[];
  src?: (keyof typeof S)[];
  /** extra exact spots: [x, y, label_en, label_ar] in official-map pixels */
  spots?: [number, number, string, string][];
  /** extra sources not in S: [title, url] */
  srcUrls?: [string, string][];
  /** YouTube video IDs */
  videos?: string[];
  date?: string;
  featured?: boolean;
}

/** Shared source list (cited in the item pages). */
export const S = {
  takeTwoSales: { title: "Take-Two — GTA VI day-one sales press release", url: "https://www.take2games.com/ir/news/grand-theft-auto-vi-shatters-entertainment-box-office-records" },
  cnnSales: { title: "CNN — GTA VI launch sales", url: "https://www.cnn.com/2026/11/20/media/gta-vi-launch-sales-numbers" },
  forbesSales: { title: "Forbes — $3.8B on day one", url: "https://www.forbes.com/sites/antoniopequenoiv/2026/11/20/gta-6-raked-in-38-billion-sales-on-first-day-the-largest-entertainment-launch-ever/" },
  aljazeeraLaunch: { title: "Al Jazeera — GTA VI launches to rave reviews", url: "https://www.aljazeera.com/news/2026/11/19/grand-theft-auto-vi-launches-to-rave-reviews-after-13-year-wait" },
  cbsLaunch: { title: "CBS News — GTA 6 is ready to roll", url: "https://www.cbsnews.com/news/grand-theft-auto-6-release-date-price-what-to-know/" },
  cnbcLaunch: { title: "CNBC — GTA 6 launch impact", url: "https://www.cnbc.com/2026/11/14/gta-6-grand-theft-auto-launch.html" },
  vicePc: { title: "VICE — When is GTA 6 coming to PC?", url: "https://www.vice.com/en/article/gta-6-pc-online-release-date/" },
  tomsguide: { title: "Tom's Guide — GTA 6 everything we know", url: "https://www.tomsguide.com/us/grand-theft-auto-6-release-date-rumors,news-25578.html" },
  latinBugs: { title: "Latin Times — Metacritic 99 and launch issues", url: "https://www.latintimes.com/gta-6-metacritic-record-launch-bugs-psn-outage-601565" },
  yahooBugs: { title: "Yahoo Tech — GTA VI launch bugs", url: "https://tech.yahoo.com/gaming/articles/gta-vi-launch-plagued-bugs-181532288.html" },
  lwogBugs: { title: "Last Word on Gaming — launch bugs", url: "https://lastwordongaming.com/2026/11/19/gta-6-launch-bugs/" },
  gwBugs: { title: "GameWatcher — bugs and reviews debate", url: "https://www.gamewatcher.com/gta-6-launches-to-reports-of-bugs-and-review-bias" },
  forbesPatch: { title: "Forbes — GTA 6 second pre-launch update", url: "https://www.forbes.com/sites/brianmazique/2026/11/17/gta-6-just-got-a-second-update-before-anyone-can-play-it-and-rockstar-still-isnt-saying-what-it-changes/" },
  patchTracker: { title: "Of Zen and Computing — patch tracker", url: "https://www.ofzenandcomputing.com/gta-6-patch-notes-and-updates-tracker/" },
  windowsPrice: { title: "Windows Central — price confirmed", url: "https://www.windowscentral.com/gaming/grand-theft-auto-vi-price-confirmed-at-usd79-99-with-a-feature-locking-ultimate-edition-at-usd99-99-and-the-physical-edition-is-just-a-code-in-a-box" },
  shackPrice: { title: "Shacknews — price and editions", url: "https://www.shacknews.com/article/149778/grand-theft-auto-6-price-standard-ultimate-gta-6" },
  pcgEditions: { title: "PC Gamer — pre-order editions explained", url: "https://pcgamer.com/games/grand-theft-auto/gta-6-pre-order-editions-standard-ultimate/" },
  ladFunny: { title: "LADbible — GTA 6 NPC car-crash interaction", url: "https://ladbible.com/entertainment/gaming/gta-6-npc-interactions-107298-20261119" },
  funnyNpc: { title: "Tips and Tricks For — funny NPC moments", url: "https://tipsandtricksfor.com/gta-6-funny-npc-moments/" },
  sportskeedaSpidey: { title: "Sportskeeda — 'Spider-Man' NPC in the trailer", url: "https://sportskeeda.com/gta/i-just-found-spiderman-gta-6-trailer-gta-6-fans-react-strange-npc-caught-official-video" },
  beebomChoices: { title: "Beebom — all choices and how they impact your run", url: "https://beebom.com/gta-6-choices-consequences/" },
  meowChoices: { title: "MeowDB — choices and consequences by mission", url: "https://meowdb.com/gta6/choices" },
  ggChoices: { title: "Games.gg — all choices and consequences", url: "https://games.gg/grand-theft-auto-vi/guides/all-choices-and-consequences-in-gta-6/" },
  athRelationship: { title: "AllThings.How — the Jason & Lucia relationship mechanic", url: "https://allthings.how/gta-6-s-jason-and-lucia-deep-relationship-mechanic-explained/" },
  trustSystem: { title: "GTA Six Online — trust system explained", url: "https://gtasixonline.com/blog/gta-6-trust-system-lucia-jason-mechanic-explained" },
  gtabaseOps: { title: "GTABase — all Illegal Operation locations", url: "https://www.gtabase.com/gta-6/map/?feature=gang-operation" },
  powerpyxOps: { title: "PowerPyx — all illegal gang operations", url: "https://www.powerpyx.com/gta-6-all-illegal-gang-operations-locations/" },
  gtasixmapOps: { title: "GTA Six Map — where to find all gang hideouts", url: "https://www.gtasixmap.com/guides/gang-hideouts" },
  space4Safes: { title: "Space4Games — safe codes and locations", url: "https://space4games.com/en/games-en/gta-6-safe-codes-combinations-locations/" },
  boomKenton: { title: "GTA BOOM — Kenton's shipwreck locations", url: "https://www.gtaboom.com/gta-6-treasure-hunting-2b73" },
  keenKenton: { title: "KeenGamer — all 7 Kenton treasure sets", url: "https://www.keengamer.com/articles/guides/gta-6-all-7-kentons-treasure-set-locations-and-rewards/" },
  pyxMoses: { title: "PowerPyx — steal vehicles for Moses", url: "https://www.powerpyx.com/gta-6-steal-vehicles-for-moses-walkthrough/" },
  game8Moses: { title: "Game8 — Moses walkthrough", url: "https://game8.co/games/GTA-6/archives/638877" },
  grDonnie: { title: "GamesRadar — Clean Up After Donnie", url: "https://www.gamesradar.com/games/grand-theft-auto/gta-6-chapter-1-walkthrough/15/" },
  outputDonnie: { title: "Outputlag — Donnie's lost drugs: areas and payment", url: "https://outputlag.com/guides/gta-6-donnie-packages-drug-money/" },
  thumbDonnie: { title: "Thumb Wars — all lost drug packages in Chapter 1", url: "https://thethumbwars.com/gta-6-how-to-find-all-the-lost-drug-packages-in-chapter-1/" },
  streamsDay1: { title: "Streams Charts — GTA 6 first 24 hours recap", url: "https://streamscharts.com/news/gta-6-day1-recap" },
  streamsYT: { title: "Streams Charts — most-viewed YouTube launch streams", url: "https://streamscharts.com/news/gta-6s-most-viewed-youtube-streams" },
  yahooLive: { title: "Yahoo — GTA 6 live updates", url: "https://tech.yahoo.com/gaming/breaking-news/live/gta-6-release-live-updates-reviews-memes-and-more-as-gamers-explore-and-react-to-leonida-after-13-long-years-230554192.html" },
  vgcMeta: { title: "VGC — Metacritic removes fake GTA 6 user reviews", url: "https://www.videogameschronicle.com/news/metacritic-has-already-had-to-remove-fake-gta-6-user-reviews/" },
  pcgnBomb: { title: "PCGamesN — publisher on review bombing", url: "https://www.pcgamesn.com/grand-theft-auto-vi/publisher-review-bombing" },
  ibtLeaks: { title: "IBTimes — Rockstar's 'heartbreaking' statement on leaks", url: "https://www.ibtimes.co.uk/its-your-fault-you-deserve-it-gamers-show-no-mercy-over-rockstars-heartbreaking-gta-6-1816661" },
  mixedPc: { title: "Mixed — GTA 6 on PC next week? Leaked Xbox build claim", url: "https://mixed-news.com/en/gta-6-pc-leaked-xbox-build-cyberleek-modders-claim/" },
  riLeak: { title: "RockstarINTEL — huge 192GB leak", url: "https://rockstarintel.com/huge-192gb-gta-6-and-gta-online-leak-reveals-unreleased-content/" },
  ggLiberty: { title: "Games.gg — Liberty City DLC leak", url: "https://games.gg/news/gta-6-liberty-city-dlc-leak/" },
  grPreload: { title: "Gamereactor — dataminers dig into preload files", url: "https://www.gamereactor.eu/gta-6-preload-datamine-files/" },
  shatteredOnline: { title: "Shattered — Xbox Store lists 4 packages", url: "https://shattered.io/gta-6-online-leak-xbox-store-4-packages-2026/" },
  riMap: { title: "RockstarINTEL — full GTA VI map officially revealed", url: "https://rockstarintel.com/full-gta-vi-map-officially-revealed/" },
  rockstarMap: { title: "Rockstar Games — official Leonida map poster", url: "https://www.rockstargames.com/VI/media" },
  rockstarSite: { title: "Rockstar Games — Grand Theft Auto VI", url: "https://www.rockstargames.com/VI" },
  pcgMap: { title: "PC Gamer — charting the GTA 6 map", url: "https://www.pcgamer.com/games/grand-theft-auto/gta6-map" },
  insiderMap: { title: "Insider Gaming — every confirmed location", url: "https://insider-gaming.com/every-gta-6-location-confirmed-so-far-vice-city-included-more/" },
  mmoMap: { title: "MMO Culture — map guide", url: "https://mmoculture.com/tips-guides/gta-6-map-guide/" },
  grMap: { title: "GamesRadar — the GTA 6 map", url: "https://gamesradar.com/games/grand-theft-auto/gta-6-map-returns-to-vice-city-and-explores-the-riches-of-the-florida-lite-state-of-leonida-malt-liquor-painkillers-and-truck-stop-energy-drinks" },
  grCast: { title: "GamesRadar — characters and cast", url: "https://www.gamesradar.com/games/grand-theft-auto/gta-6-characters-cast/" },
  vgcCast: { title: "VGC — full cast confirmed", url: "https://www.videogameschronicle.com/guide/gta-6-full-cast-confirmed-every-actor-in-grand-theft-auto-6/" },
  srCast: { title: "Screen Rant — cast and voice actors", url: "https://screenrant.com/gta-6-cast-voice-actors/" },
  vgcMoney: { title: "VICE — how to make money fast", url: "https://www.vice.com/en/article/gta-6-how-to-make-money-fast/" },
  alcastMoney: { title: "AlcastHQ — early money, Chapter 1", url: "https://alcasthq.com/gta-6-make-money-early/" },
  g2aMoney: { title: "G2A News — money guide by chapter", url: "https://www.g2a.com/news/gta-6-news/gta-6-money-making-guide/" },
  boomMoney: { title: "GTA BOOM — make money early", url: "https://www.gtaboom.com/how-to-make-money-fast-and-early-in-gta-6-725c" },
  keenWeapons: { title: "KeenGamer — early unique weapon locations", url: "https://www.keengamer.com/articles/guides/gta-6-best-early-game-unique-weapon-locations/" },
  space4Weapons: { title: "Space4Games — all unique weapons", url: "https://space4games.com/en/games-en/gta-6-unique-weapons-locations-stats/" },
  skWeapons: { title: "Sportskeeda — hidden legendary weapons", url: "https://www.sportskeeda.com/gta/all-hidden-legendary-weapons-locations-gta-6" },
  gsEggs: { title: "GameSpot — easter eggs and where to find them", url: "https://www.gamespot.com/articles/gta-6-easter-eggs-list-and-locations/" },
  bfEggs: { title: "BuzzFeed — 23 easter eggs players found", url: "https://www.buzzfeed.com/mariamsharia/gta-6-easter-eggs-players-have-already-found" },
  gbEggs: { title: "GamingBible — 9 easter eggs", url: "https://www.gamingbible.com/news/gta-6-easter-eggs-778903-20261120" },
  gsWaink: { title: "GameSpot — all WAiNK curiosities", url: "https://www.gamespot.com/articles/all-waink-curiosities-in-gta-6/" },
  kotakuDetails: { title: "Kotaku — 18 coolest details players spotted", url: "https://kotaku.com/18-coolest-details-players-have-spotted-in-gta-6-so-far-2000758435" },
  unilad: { title: "UNILAD Tech — the Bikini Girl mystery", url: "https://www.uniladtech.com/gaming/gta-6-bikini-girl-where-to-find-leonida-700501-20261120" },
  gsCars: { title: "GameSpot — the fastest cars in GTA 6", url: "https://www.gamespot.com/articles/dont-blink-these-are-the-fastest-cars-in-gta-6/" },
  meowCars: { title: "MeowDB — cars ranked by stats", url: "https://meowdb.com/gta6/best-cars" },
  rareCars: { title: "ShowGamer — rarest cars", url: "https://showgamer.com/en/guides/8036-samye-redkie-mashiny-v-gta-6-gde-nayti-i-kak-poluchit-unikalnye-avto" },
  redbullCheats: { title: "Red Bull — all GTA 6 cheat codes", url: "https://www.redbull.com/us-en/gta-6-cheat-codes" },
  gsCheats: { title: "GameSpot — all cheats and how to unlock them", url: "https://www.gamespot.com/articles/all-gta-6-cheats-and-how-to-unlock-them/" },
  nerdsTips: { title: "Nerds Chalk — beginner tips for the Keys", url: "https://nerdschalk.com/gta-6-beginner-tips-first-hours-keys" },
  pushTips: { title: "Push Square — tips & tricks you need to know", url: "https://www.pushsquare.com/guides/gta-6-tips-and-tricks-you-need-to-know" },
  pushEasy: { title: "Push Square — accessibility options and easy mode", url: "https://www.pushsquare.com/news/2026/11/gta-6-has-an-easy-mode-buried-in-an-impressive-range-of-accessibility-options" },
  yahoo140: { title: "Yahoo — 8 tips from 140 hours of play", url: "https://tech.yahoo.com/gaming/articles/8-gta-6-tips-game-115452979.html" },
  g2aControls: { title: "G2A News — controls guide", url: "https://www.g2a.com/news/gta-6-news/gta-6-controls-guide-ps5-and-xbox/" },
  outputControls: { title: "Outputlag — every button on PS5 and Xbox", url: "https://outputlag.com/guides/gta-6-controls/" },
  wikiLeak: { title: "Wikipedia — 2022 Rockstar Games data breach", url: "https://en.wikipedia.org/wiki/2022_Rockstar_Games_data_breach" },
  wikiGame: { title: "Wikipedia — Grand Theft Auto VI", url: "https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI" },
} as const;

const DEFAULT_DATE = "2026-11-20T12:00:00Z";

export function build(category: CategorySlug, list: SeedInput[]): Item[] {
  return list.map((x) => ({
    slug: x.slug,
    category,
    status: x.status,
    title_en: x.en,
    title_ar: x.ar,
    summary_en: x.sEn,
    summary_ar: x.sAr,
    body_en: x.bEn.trim(),
    body_ar: x.bAr.trim(),
    aliases: x.aliases ?? [],
    tags: x.tags ?? [],
    facts: (x.facts ?? []).map(([k_en, k_ar, v_en, v_ar]) => ({ k_en, k_ar, v_en, v_ar })),
    location: LOCS[x.slug] ? { x: LOCS[x.slug][0], y: LOCS[x.slug][1] } : null,
    region: x.region ?? null,
    related: x.related ?? [],
    sources: [...(x.src ?? []).map((k) => ({ ...S[k] })), ...(x.srcUrls ?? []).map(([title, url]) => ({ title, url }))],
    published_at: x.date ?? DEFAULT_DATE,
    featured: x.featured ?? false,
    spots: (x.spots ?? []).map(([sx, sy, label_en, label_ar]) => ({ x: sx, y: sy, label_en, label_ar })),
    videos: x.videos ?? [],
    image: OFFICIAL_IMAGES[x.slug] ?? (IMAGES as Record<string, string>)[x.slug] ?? null,
  }));
}
