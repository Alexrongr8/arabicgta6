# Radar research policy (automatic news discovery)

Owner request, 22 Nov 2026: Claude defines **what** the paid API researches, **which sources** it trusts, **how** a finding is verified before it is published, and **how duplicates are rejected**. This is the contract for `scripts/update.ts` / `scripts/enrich.ts`. Anything not allowed here stays off.

Current state: the workflow only runs when the repo variable `CONTENT_AUTOMATION_ENABLED` is exactly `true` (unset today). No OpenAI key is installed. Budget: OpenAI organization hard limit 120 USD/month (enforcement can lag slightly; don't treat it as an exact cut-off).

## 1. Budget and schedule

| Setting | Start value | Why |
|---|---|---|
| Schedule | every 3 h (`7 */3 * * *`) | 8 runs/day, up to248 in a31-day month |
| `RADAR_BEAMS` | one beam per run, rotating (see §2) | one discovery request per run |
| `UPDATE_MAX_ITEMS` | 1 | at most one new article per run |
| `ENRICH_PER_RUN` | 0 | old articles are never rewritten automatically |
| Tool calls | 1 web search per request, `search_context_size: low`, `reasoning: low` | bounded cost per request |
| Retries | none (`maxRetries: 0`) | every paid call counted once |
| Fatal errors | spend limit / quota / auth / unknown model → stop the whole run, no success log | |

Scheduled ceiling: ≤2requests/run → ≤16/day and ≤496 in a31-day month, excluding separately initiated manual commands. This is a request bound, not a dollar estimate. Review actual `[usage]` logs and account billing before changing any setting.

## 2. Topics (beams), in rotation order

Run one beam per scheduled run, cycling through this list (run number mod 6). Each beam has a fixed purpose; the model must not wander outside it.

1. **official** — Rockstar Newswire, Rockstar Support, Take-Two investor releases, PlayStation Blog, Xbox Wire. Patches, title updates, events, official tips, platform features.
2. **patches & bugs** — title-update notes, known issues, confirmed glitch fixes/patched exploits. Every glitch article must say which build it was tested on (or "unknown").
3. **gameplay discoveries** — secrets, easter eggs, money methods, collectibles, hidden places, found by players. Only with video or screenshot evidence.
4. **settings & hardware** — PS5/Xbox settings, TV/HDR, Remote Play, accessibility, translation helpers. Manufacturer or platform documentation preferred. Never present TV/stream frame interpolation as game FPS; never claim DLSS or frame generation applies to a PS5 just because it streams to a PC.
5. **community & creators** — big creators (incl. Arab streamers) only when their clip shows a new in-game fact or a notable event. No drama/gossip articles.
6. **Arabic coverage** — what Arab players are asking (Arabic YouTube, X, Reddit Arabic threads) to choose the next guide topic. This beam proposes topics; it does not publish facts on its own.

Out of scope, never published: leaks of unreleased content presented as fact, personal information about developers or players, piracy/cheating tools/mod menus for online play, rumours about release dates of other games, monetised-link spam.

### Arab creators to monitor (exact identities)

Identity verified from public channel metadata on 22 Nov 2026 (Codex research). Always use the exact channel id / profile URL — never a free-text name search. A channel being real proves *who posted*, not that a gameplay claim is true: inspect the relevant segment before reporting a game fact, and classify trailer reactions separately from gameplay and discoveries.

| Creator | Priority | Profiles | Rule |
|---|---|---|---|
| Bilal Fadili | high | YouTube `UCw81FIQlzaVxgiQKiqTuCBQ` (@BilalFadili) | |
| BanderitaX | high | YouTube `UCxEGVXh6fi-XYo58NZrbIHQ` (@BanderitaX) | Keep AboFlah evidence separate; one creator never confirms the other. Don't embed age/access-restricted videos. |
| Rima (RimaOsta) | high | YouTube `UCFlp8ti7kvEMbiqAE8Zazag` (@RimaOsta) | Exact channel id only — "Rima" alone matches other people. |
| 3mr | high | kick.com/3mr; YouTube `UC6gTOqPVfx6g6Cmi8Ah80pA` (@3mrdiab) | Prefer Kick. Never resolve by the musician of the same name. |
| Drb7h | medium-high | kick.com/drb7h | Don't turn cached live/view counts into claims. |
| Xzit Thamer | medium | YouTube `UCUwf9tuytTCVP6SzMaGwDVA` (@xzit_thamer) | Reactions ≠ gameplay facts. |
| SXB (SHoNgxBoNg) | medium | kick.com/SXB; YouTube `UC5hnxbraFmMPxv63U4hCwTQ` (@SHoNgxxBoNg) | General GTA/RP streams are not automatically GTA VI. |
| AboFlah | medium | YouTube `UCqq5n-Oe-r1EEHI3yvhVJcA` (@AboFlah), `UCRu9mro2nPafhMxVy2CRfXA` (@Aboflah_Gaming) | Check date and actual footage; prefer the gaming channel; don't duplicate one clip across both channels. |

Monitoring terms: "GTA 6", "GTA VI", "قراند 6", "قراند6", "جاتا 6".

## 3. Source priority

Tier decides the highest status badge an article may receive.

| Tier | Sources | Max status |
|---|---|---|
| A — official | rockstargames.com, support.rockstargames.com, take2games.com, blog.playstation.com, news.xbox.com, manufacturer docs (Sony, Microsoft, LG, Samsung, NVIDIA…) | `official` |
| B — in-game evidence | a video/screenshot that visibly shows the thing in the released game (YouTube, Reddit post with media, X/Instagram/TikTok clip) | `confirmed` |
| C — established press | IGN, GameSpot, Eurogamer, Polygon, PC Gamer, VGC, GamesRadar, Push Square, Pure Xbox, Rock Paper Shotgun, Kotaku, The Verge, Arabic: True Gaming, Saudi Gamer | `confirmed` only if they show in-game evidence, else `rumor` |
| D — wikis & databases | GTA Fandom wiki, GTABase, MeowDB, GTATracker | used to cross-check names/stats, never as the only source |
| E — social text only | posts without media, forum claims, "insiders" | `rumor` at most, and never in the daily card / featured row |

A lead needs **one tier A or B source, or two independent tier C sources**. D and E alone never publish.

## 4. Verification gates before inserting an article

All must pass; otherwise the lead is dropped or kept for review (never "published anyway"):

1. **Retrieved, not invented.** Each source URL must appear in the response's actual web-search results (`include: ["web_search_call.action.sources"]`). URLs the model wrote but did not retrieve are removed; if none remain, drop.
2. **Reachable.** Each kept source answers 200 through `safeGet` (public HTTPS, no private destinations).
3. **Bilingual and complete.** Non-empty Arabic and English title, summary and body; Arabic body ≥ 600 chars; in-game names in English.
4. **Status honesty.** Badge ≤ the tier ceiling above. A `rumor`/`leak` item may not *assert* that it is official or confirmed (headline/summary claiming "رسمي"/"مؤكد"/"official"/"confirmed"); this is a reviewed claim check, not a word blacklist — honest wording such as "not confirmed" / "غير مؤكد" must stay.
5. **Spoilers.** Story outcomes, deaths, endings, character fates → `category: choices` or tag `story-spoilers` (the site then hides details behind the warning).
6. **Image.** Cover comes from the source page's own og:image (through `safeGet`) or the official category fallback. Never a generated image, never an image of a different vehicle/weapon/place.
7. **No numbers without a source.** Prices, stats, dates, percentages only when the source shows them.

## 5. Deduplication

A lead is a duplicate if **any** of these hold:

1. **Same canonical URL.** Canonicalise before comparing: lowercase host, drop `www.`, drop `#fragment` and tracking parameters (`utm_*`, `fbclid`, `gclid`, `si`, `feature`, `ref`), keep identity parameters. YouTube: `youtu.be/ID`, `youtube.com/watch?v=ID`, `/shorts/ID`, `/embed/ID` → `youtube:ID` (different IDs must stay different). X/Twitter: `x.com|twitter.com/<user>/status/<id>` → `x:<id>`. Reddit: `/comments/<id>/` → `reddit:<id>`.
2. **Same story.** Title similarity ≥ 0.75 against existing English titles, or ≥ 0.7 against another lead in the same run.
3. **Same thing in the catalog.** A "new car/weapon/animal" lead whose name already exists in `data/catalog-*.ts` is not a new article (it can be a catalog update for a human to review).
4. **Same video.** Any `youtube:ID` already present in an article's `videos` or sources.

## 6. Checkpoints and failures

- The "last successful run" timestamp only advances when every active beam succeeded. A failed beam is retried by the next run with the same window.
- An editor (article-writing) failure keeps the lead for the next run instead of losing it.
- Every run logs: beam, requests, input/output tokens, search calls, leads, accepted, rejected-by-gate (with gate number).
- Spend-limit / quota / auth errors stop immediately and are reported; nothing else runs after them.

## 7. Before switching it on

1. Owner installs the new OpenAI key as GitHub secret `OPENAI_API_KEY` (never in chat or the repo).
2. Set repo variables `OPENAI_MODEL`/`OPENAI_RADAR_MODEL` (cheap model, confirmed available on the account), `RADAR_BEAMS`, `UPDATE_MAX_ITEMS=1`, `ENRICH_PER_RUN=0`.
3. Complete offline tests first. The workflow deliberately skips **both** scheduled and manual runs while `CONTENT_AUTOMATION_ENABLED` is not `true`.
4. Only when the owner is ready to activate paid work, set `CONTENT_AUTOMATION_ENABLED=true`, dispatch one watched run and inspect `[usage]`, source checks and review outcomes. Disable it again if the result is unexpected. No activation is performed by installing this code.

## 8. Initial implementation and review boundary

- Exactly one beam per run: `RADAR_BEAMS=rotate` (or unset), or one explicit policy ID: `official`, `patches-bugs`, `gameplay-discoveries`, `settings-hardware`, `community-creators`, `arabic-coverage`. Legacy `web`, `all`, multiple beams and `UPDATE_MAX_ITEMS>1` fail before paid work. `UPDATE_MAX_ITEMS=0` makes no paid request. `ENRICH_PER_RUN` must be0/unset.
- Fresh work costs at most one discovery plus one editor request. A pending editor retry skips discovery and uses one request. The SDK has no automatic retries and a hard two-request ceiling per process. Manual enrichment/image review uses one request. No script/API smoke test is part of CI.
- Per-beam windows and the selected pending lead are persisted as bounded JSON in the existing private `update_runs` table (`kind=radar_state`). A pending lead is saved before paying the editor. Three consumed editor attempts lead to a human review record, never an infinite retry loop. A crash after article insertion recovers by stable slug/source dedupe. Normal workflow runs must remain serialized under the existing `content-update` concurrency group; simultaneous local invocations are unsupported.
- The existing `update_runs.note` also stores `kind=radar_review` records. These are private review proposals, **never automatically published on a later run**. There is no public review UI or automatic approval path. An authorized editor inspects the record, sources and relevant footage, then separately makes the reviewed change. Keep the newest `radar_state` if pruning logs. The state retains100 recent reviewed URL keys to suppress immediate repeat research; older proposals can be rediscovered.
- Official text remains eligible for automatic publication only after actual completed web-tool retrieval metadata, reachable source text, bounded verbatim support excerpts for every required field, numeric support and the other gates pass. A title/URL alone is not evidence. The text gate is a structural proof check, not a guarantee of semantic truth: a model can still misinterpret a source. Inspect early outputs and usage before expanding operation.
- Video/screenshots, press independence, creator observations, story spoilers, map coordinates and uncertain status claims require human review. The gameplay/creator beams always hold drafts for visual review even if an official link is included. Arabic coverage generates topic proposals only. Existing catalog entities become catalog-update proposals. Honest “not confirmed”/“غير مؤكد” wording is retained; there is no word blacklist that changes it into certainty.
- Kept source pages are bounded to six fetch chains, each with a5-second full-response deadline and750KB streamed byte cap through `safeGet`; redirects remain subject to its public-network boundary. Source text extraction is capped at400,000 characters. Protected pages, login challenges, PDFs and video-only evidence that cannot supply matching text are held. A correct source being unavailable never becomes permission to publish without it.
- Covers use the established category fallback (`image=null`) in this initial automated path. `npm run catalog-images -- --review --count=1 [--key=vehicle:NAME]` researches at most one missing entity and records up to three retrieved page previews as **unverified** candidates. It never changes `catalog-images.json`; a plausible og:image is not proof of identity or GTA VI provenance.
- `npm run enrich -- --review --slug=<existing-slug>` creates one private proposal. It does not update an existing article, image, metadata, source list or search text. Automatic `enrichBatch` refuses nonzero counts. Adding `--dry` to radar/enrichment/image review still calls the paid model but suppresses database writes; it is not an offline test command.
- Full known-item dedupe is paginated (500/page, reviewed hard limit20,000), including source identities, raw embedded video IDs, English title similarity and catalog names. A failed page aborts before paid work; the runner never silently treats the first server-limited page as the whole catalog.

Offline validation: `npx tsx --test scripts/tests/radar-policy.test.ts`. These fixtures inject all AI, source and database dependencies; no real provider, source fetch, email or database request is made.
