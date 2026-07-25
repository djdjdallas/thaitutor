# Thai Tutor — Phase 1

An offline-first Thai learning app with two loops:

- **Learn** — a Brilliant-style lesson path. Units of bite-sized interactive
  lessons (hear the word, pick the meaning, rebuild the phrase from syllable
  tiles) that teach ~240 cards: a starter deck plus **Top 100 Words** and
  **Top 100 Phrases** packs.
- **Review** — a Leitner spaced-repetition system. Finishing a lesson unlocks
  its cards into the SRS rotation, so review load ramps up as you learn instead
  of dumping the whole deck on day one. Missed cards repeat at the end of the
  same session until you get them right. Flip the direction toggle for
  **production practice** (see English, say the Thai out loud, then check).
- **Deck** — a searchable browser over the whole catalog for the "wait, how do
  I say...?" moment. Search ignores tone marks ("mai" finds mâi and mài), and
  every row plays its audio on tap.

Plus the Today screen: 4 daily study blocks + streak, a **tone trainer**
(minimal-pair ear drills — glai or glâi, far or near?), and an optional **daily
reminder** notification that skips days you've already studied. Everything lives
in on-device SQLite, so it works with zero WiFi. Tap any card to hear it spoken,
flip on **audio-first** review to train your ear before your eyes, and tap
"how to read this" anywhere for the tone-mark pronunciation guide.

Built with Expo (managed workflow), JavaScript, expo-sqlite, expo-speech.

## Who it's for

Beginner-to-early-intermediate learners who want a **daily habit loop** for Thai.
The content is survival-focused (greetings, food, numbers, taxi, shopping,
emergencies) with tone-marked romanization, aimed at travelers and new residents
who need to be understood out loud, fast. If you want grammar theory or a huge
dictionary, this isn't that — it's lessons + streak + SRS + listening.

## Screenshots

> _Screenshots are captured from a running build and are not committed yet._ To
> generate them, run the app (below), open the **Today** and **Review** tabs, and
> capture with your simulator (`Cmd+S` on iOS Simulator, the camera button on the
> Android emulator). Drop the images in `assets/screenshots/` and link them here:
>
> | Today  | Review | Audio-first |
> | ------ | ------ | ----------- |
> | _todo_ | _todo_ | _todo_      |

## Run it

```bash
cd thai-tutor
npm install
npx expo start
```

Then press `i` (iOS simulator), `a` (Android emulator), or scan the QR with Expo Go.

> Phase 1 runs in **Expo Go** because it uses no custom native modules. Phase 2/3
> (on-device LLM + Whisper) will require a **development build** via EAS, since those
> ship native code. The architecture is already split so that transition is clean.

## What's here

```
App.js                      Root: DB init, state, tabs, streak math, lesson session
index.js                    Entry point
src/
  theme.js                  Design tokens (neutral base + amber accent, 8px grid)
  data/
    seedDeck.js             ~42 starter words/phrases, tone-marked (static content)
    words100.js             Top 100 Words pack (90 new cards; 10 shared w/ starter)
    phrases100.js           Top 100 Phrases pack (94 new cards; 6 shared w/ starter)
    deck.js                 Merged card catalog with one global sort order
    lessons.js              The Learn path: units -> lessons -> card ids
    lessons.test.js         Content guardrails (ids exist, packs are exactly 100...)
    tonePairs.js            Minimal-pair sets for the tone trainer (มา/หมา/ม้า...)
  db/database.js            SQLite schema, migrations, seeding, settings, queries
  db/database.test.js       DB tests against in-memory node:sqlite (expo mocked)
  lib/
    dates.js                Local-time date helpers (no UTC bugs)
    dates.test.js           Unit tests for the date math
    srs.js                  Leitner box logic + due-date helper (pure functions)
    srs.test.js             Unit tests for due-date + box promotion logic
    lessonSteps.js          Lesson step generator: teach/MCQ/audio/tiles (pure)
    lessonSteps.test.js     Unit tests for step generation + tile checking
    toneDrill.js            Tone drill round builder (pure)
    toneDrill.test.js       Unit tests for round building + tone-set data
    deckSearch.js           Tone-mark-insensitive deck search (pure)
    deckSearch.test.js      Unit tests for normalization + matching
    reminderTimes.js        Reminder schedule date math (pure, local-time)
    reminderTimes.test.js   Unit tests for time stepping + 7-day scheduling
    notifications.js        expo-notifications wrapper (permissions, re-arming)
    tts.js                  expo-speech wrapper (Thai pronunciation playback)
    supabaseSync.js         STUB for Phase 2 cloud backup (RLS schema in comments)
  components/
    TodayScreen.js          Streak, weekly dots, blocks, tone trainer, reminder
    PathScreen.js           The Learn path: units, sequential lesson unlocks
    LessonScreen.js         Full-screen lesson runner with instant feedback
    ReviewScreen.js         SRS flip + grading + relearn + audio-first + EN→TH mode
    DeckScreen.js           Searchable card browser with tap-to-hear
    ToneDrillScreen.js      Hear-it-pick-it minimal-pair tone drill (10 rounds)
    PronunciationGuide.js   "How to read the sounds" tone-mark legend (modal)
```

## Development

```bash
npm test            # run all tests (dates, SRS, and the DB layer)
npm run lint        # eslint (Expo config + Prettier-aware)
npm run format      # auto-format with Prettier
npm run format:check # verify formatting in CI
```

Pure logic (`dates.js`, `srs.js`) is unit-tested. The DB layer is tested against
an in-memory SQLite database (Node's built-in `node:sqlite`) with `expo-sqlite`
mocked, so seeding, migrations, and the progress-preserving re-sync are verified
without a device. Formatting is owned by Prettier; the `seedDeck` table is
intentionally `prettier-ignore`d so it stays a scannable one-card-per-line layout.

## Key design decisions (the "why")

- **Content and progress are separate tables.** `cards` is static, trusted vocab.
  `card_state` / `daily_log` / `lesson_progress` is your progress. On every launch
  the deck content is re-synced (UPSERT) from the merged catalog in `deck.js`
  while progress rows are left untouched (`INSERT OR IGNORE`), so vocab fixes and
  new cards reach existing users without wiping anyone's streak or SRS history.
  Schema changes go through versioned migrations gated on SQLite's `user_version`.
- **Lessons gate the SRS.** Cards seed locked and unlock when their lesson is
  completed, so review load trickles in as you learn instead of 240 cards being
  due on install. Installs that predate the Learn path are grandfathered in by
  the v3 migration (their existing cards stay unlocked). The Top-100 packs
  reference starter-deck cards where they overlap (ไป, กิน, ไม่เผ็ด...), so each
  pack is a true, de-duplicated 100 — enforced by tests.
- **Lessons are data, the engine is one component.** A lesson is just an ordered
  list of card ids; `lessonSteps.js` generates the teach/quiz sequence from the
  cards themselves (tiles for 3+ syllable phrases, listening quizzes for short
  words). Adding a unit is pure JSON authoring, no new UI.
- **The app never dead-ends on a bad DB.** If init/migration throws, you get a
  recovery screen (retry, or reset-and-reseed) instead of a frozen spinner.
- **Settings live in their own key/value table.** The audio-first preference
  (and anything future) rides the same migration path and survives a deck
  re-sync, kept separate from both content and progress.
- **SQLite is the source of truth.** The app never blocks on a network. Supabase is
  an optional backup that syncs when online (Phase 2), not a dependency.
- **Streak is tied to the Listening block only.** It's the protected non-negotiable.
  Miss the other three on a chaotic day, keep the streak.
- **Local-time dates.** We avoid `toISOString()` because UTC conversion can land
  your "today" on the wrong calendar day depending on timezone.

## Roadmap

- **Phase 2:** CDN model download (expo-file-system + Cloudflare R2) and an
  on-device chat model (react-native-executorch) for offline Q&A, with a Claude API
  fallback when online. Flip on the Supabase sync stub for cross-device backup.
- **Phase 3:** Pronunciation loop — record yourself, transcribe on-device with
  whisper.rn, compare to the target card.

## Current limitations

- **TTS quality varies by device.** Playback uses the OS voice engine, so it's
  functional but not studio-grade. iOS ships a Thai voice; some Android devices
  need the Google TTS Thai pack installed (the app surfaces a hint when it's
  missing). There's no "check my pronunciation" loop yet — that's Phase 3.
- **Romanization is an aid, not gospel.** Thai script is authoritative; the
  tone-marked roman is a learning crutch and simplifies some vowels.
- **Single device, no accounts.** Progress is local to the device. Cross-device
  backup is the Phase 2 Supabase sync (currently a stub).
- **Fixed content.** ~240 curated cards across the starter deck and two Top-100
  packs; no in-app deck editing or import yet.
- **Lesson progress isn't mid-lesson resumable.** Exiting a lesson discards that
  run (lessons are short by design); completed lessons are saved.
- **Reminders schedule 7 days ahead.** The daily reminder books concrete local
  notifications for the next week (re-armed every launch and every block
  toggle, skipping today once Listening is done). If the app isn't opened for
  over a week, reminders pause until the next launch — a deliberate trade for
  being able to skip already-studied days with zero background code.

## Release checklist

- [ ] `npm test`, `npm run lint`, `npm run format:check` all green
- [ ] Smoke-test on a physical iOS device and a physical Android device (TTS,
      streak rollover at local midnight, DB recovery screen, a lesson end-to-end
      including tile + listening steps)
- [ ] Confirm a fresh install seeds the deck locked (Review points at Learn) and
      an upgrade preserves progress with existing cards still reviewable
- [ ] Capture and commit the screenshots above
- [ ] Bump `version` in `package.json` and `app.json`
- [ ] Set app icon + splash in `assets/` and verify `app.json` config
- [ ] Build with EAS and validate store metadata (privacy: data stays on-device)
