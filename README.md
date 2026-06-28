# Thai Tutor — Phase 1

An offline-first Thai learning app. Tracks your 4 daily study blocks + streak, and
drills a seeded vocab deck with a Leitner spaced-repetition system. Everything lives
in on-device SQLite, so it works with zero WiFi. Tap any card to hear it spoken, or
flip on **audio-first** review to train your ear before your eyes.

Built with Expo (managed workflow), JavaScript, expo-sqlite, expo-speech.

## Who it's for

Beginner-to-early-intermediate learners who want a **daily habit loop** for Thai,
not a course. The deck is ~42 survival words/phrases (greetings, food, numbers,
getting around) with tone-marked romanization, aimed at travelers and new
residents who need to be understood out loud, fast. If you want grammar drills or
a huge dictionary, this isn't that — it's a streak + SRS + listening tracker.

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
App.js                      Root: DB init, state, tabs, streak math
index.js                    Entry point
src/
  theme.js                  Design tokens (neutral base + amber accent, 8px grid)
  data/seedDeck.js          ~42 survival words/phrases, tone-marked (static content)
  db/database.js            SQLite schema, migrations, seeding, settings, queries
  db/database.test.js       DB tests against in-memory node:sqlite (expo mocked)
  lib/
    dates.js                Local-time date helpers (no UTC bugs)
    dates.test.js           Unit tests for the date math
    srs.js                  Leitner box logic + due-date helper (pure functions)
    srs.test.js             Unit tests for due-date + box promotion logic
    tts.js                  expo-speech wrapper (Thai pronunciation playback)
    supabaseSync.js         STUB for Phase 2 cloud backup (RLS schema in comments)
  components/
    TodayScreen.js          Streak, weekly dots, blocks, next-due, category mastery
    ReviewScreen.js         SRS flashcard flip + grading + speak + audio-first mode
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
  `card_state` / `daily_log` is your progress. On every launch the deck content is
  re-synced (UPSERT) from `seedDeck.js` while progress rows are left untouched
  (`INSERT OR IGNORE`), so vocab fixes and new cards reach existing users without
  wiping anyone's streak or SRS history. Schema changes go through versioned
  migrations gated on SQLite's `user_version`.
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
- **Small, fixed deck.** ~42 cards, no in-app deck editing or import yet.
- **No reminders/notifications.** The streak is a nudge, but nothing pings you.

## Release checklist

- [ ] `npm test`, `npm run lint`, `npm run format:check` all green
- [ ] Smoke-test on a physical iOS device and a physical Android device (TTS,
      streak rollover at local midnight, DB recovery screen)
- [ ] Confirm a fresh install seeds the deck and an upgrade preserves progress
- [ ] Capture and commit the screenshots above
- [ ] Bump `version` in `package.json` and `app.json`
- [ ] Set app icon + splash in `assets/` and verify `app.json` config
- [ ] Build with EAS and validate store metadata (privacy: data stays on-device)
