# Thai Tutor — Phase 1

An offline-first Thai learning app. Tracks your 4 daily study blocks + streak, and
drills a seeded vocab deck with a Leitner spaced-repetition system. Everything lives
in on-device SQLite, so it works with zero WiFi. Tap any card to hear it spoken.

Built with Expo (managed workflow), JavaScript, expo-sqlite, expo-speech.

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
  data/seedDeck.js          ~42 survival words/phrases (static, trusted content)
  db/database.js            SQLite schema, seeding, all queries (offline)
  lib/
    dates.js                Local-time date helpers (no UTC bugs)
    dates.test.js           Unit tests for the date math
    srs.js                  Leitner box logic (pure functions)
    srs.test.js             Unit tests for due-date + box promotion logic
    tts.js                  expo-speech wrapper (Thai pronunciation playback)
    supabaseSync.js         STUB for Phase 2 cloud backup (RLS schema in comments)
  components/
    TodayScreen.js          Streak, daily blocks, due-review nudge, voice hint
    ReviewScreen.js         SRS flashcard flip + grading + speak button
```

## Development

```bash
npm test            # run the unit tests (dates + SRS logic)
npm run lint        # eslint (Expo config + Prettier-aware)
npm run format      # auto-format with Prettier
npm run format:check # verify formatting in CI
```

Pure logic (`dates.js`, `srs.js`) is unit-tested. Formatting is owned by
Prettier; the `seedDeck` table is intentionally `prettier-ignore`d so it stays
a scannable one-card-per-line layout.

## Key design decisions (the "why")

- **Content and progress are separate tables.** `cards` is static, trusted vocab.
  `card_state` / `daily_log` is your progress. On every launch the deck content is
  re-synced (UPSERT) from `seedDeck.js` while progress rows are left untouched
  (`INSERT OR IGNORE`), so vocab fixes and new cards reach existing users without
  wiping anyone's streak or SRS history. Schema changes go through versioned
  migrations gated on SQLite's `user_version`.
- **The app never dead-ends on a bad DB.** If init/migration throws, you get a
  recovery screen (retry, or reset-and-reseed) instead of a frozen spinner.
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
