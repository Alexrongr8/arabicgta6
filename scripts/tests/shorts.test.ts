import test from "node:test";
import assert from "node:assert/strict";
import { acceptTitle, extractIds, shortsFeed } from "../lib/shorts";

test("GTA 6 titles in English and Arabic are accepted", () => {
  for (const t of ["GTA 6 Gun Stores Have a Hidden Secret...", "أسرار رهيبة في لعبة قراند 6 🔥", "Grand Theft Auto VI Launch Trailer", "Airports in GTA 6 are Insane"]) assert.ok(acceptTitle(t), t);
});
test("spam, live streams, hashtag-only and unrelated titles are rejected", () => {
  for (const t of ["GTA 5 funny moments", "#gta #gta6 #shorts", "🔴 LIVE - GTA 6 now", "GTA 6 mod menu download free", "لا تشاهد هذه اللقطة في GTA 6 🔞", "考验#GTA6 #露西亚卡米诺斯 #罪恶城", ""]) assert.ok(!acceptTitle(t), t);
});
test("search pages yield only /shorts/ ids; feeds yield entries", () => {
  assert.deepEqual(extractIds('"videoId":"aaaaaaaaaaa" href="/shorts/bbbbbbbbbbb" "/shorts/bbbbbbbbbbb"', true), ["bbbbbbbbbbb"]);
  assert.deepEqual(extractIds("<yt:videoId>ccccccccccc</yt:videoId>"), ["ccccccccccc"]);
  assert.equal(shortsFeed("UC6VcWc1rAoWdBCM0JxrRQ3A"), "https://www.youtube.com/feeds/videos.xml?playlist_id=UUSH6VcWc1rAoWdBCM0JxrRQ3A");
});
