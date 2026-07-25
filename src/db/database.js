// ---------------------------------------------------------------------------
// Offline database layer (expo-sqlite, next-gen async API).
//
// SQLite lives entirely on the device, so EVERYTHING here works with zero WiFi.
// This is your offline-first foundation and the source of truth in Phase 1.
//
// We split content from progress on purpose:
//   - `cards`      = static vocab content (seeded once, you trust it)
//   - `card_state` = the user's SRS progress per card (box + last review)
//   - `daily_log`  = which study blocks were done each day
// Keeping them separate means you can update/expand content later WITHOUT
// wiping someone's progress.
// ---------------------------------------------------------------------------

import * as SQLite from "expo-sqlite";
import { FULL_DECK } from "../data/deck";
import { isDue, nextBox } from "../lib/srs";

let db = null; // singleton connection

// Schema version. Bump this and add a matching block in `runMigrations()`
// whenever the table structure changes, so existing installs upgrade cleanly
// instead of silently running against an old schema.
const SCHEMA_VERSION = 4;

export async function initDatabase() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("thai.db");

  // WAL mode = better concurrent read/write performance on device.
  await db.execAsync("PRAGMA journal_mode = WAL;");

  await runMigrations();
  await syncSeedDeck();
  return db;
}

// Versioned schema migrations, gated on SQLite's built-in `user_version`
// counter. Each step runs exactly once per device and only ever moves forward,
// so we can evolve the schema later without wiping anyone's progress.
async function runMigrations() {
  const { user_version: version } = await db.getFirstAsync("PRAGMA user_version");

  if (version < 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY NOT NULL,
        thai TEXT NOT NULL,
        roman TEXT,
        en TEXT,
        note TEXT,
        category TEXT,
        sort INTEGER
      );

      CREATE TABLE IF NOT EXISTS card_state (
        card_id TEXT PRIMARY KEY NOT NULL,
        box INTEGER NOT NULL DEFAULT 1,
        last_reviewed TEXT,
        FOREIGN KEY (card_id) REFERENCES cards(id)
      );

      CREATE TABLE IF NOT EXISTS daily_log (
        date TEXT PRIMARY KEY NOT NULL,
        listening INTEGER NOT NULL DEFAULT 0,
        speaking INTEGER NOT NULL DEFAULT 0,
        vocab INTEGER NOT NULL DEFAULT 0,
        freeplay INTEGER NOT NULL DEFAULT 0
      );
    `);
  }

  if (version < 2) {
    // Key/value app settings (e.g. the audio-first review preference). Separate
    // from progress so it survives a deck re-sync and rides the migration path.
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT
      );
    `);
  }

  if (version < 3) {
    // The Learn path: cards start locked and enter the review rotation when
    // their lesson is completed. Rows that exist at migration time belong to
    // pre-path installs — grandfather them in as unlocked so nobody's due
    // queue disappears. (Fresh installs migrate before seeding, so their
    // cards seed locked.) `lesson_progress` records completed lessons.
    await db.execAsync(`
      ALTER TABLE card_state ADD COLUMN unlocked INTEGER NOT NULL DEFAULT 0;
      UPDATE card_state SET unlocked = 1;

      CREATE TABLE IF NOT EXISTS lesson_progress (
        lesson_id TEXT PRIMARY KEY NOT NULL,
        completed_at TEXT
      );
    `);
  }

  if (version < 4) {
    // `review_log` records every grade as it happens — the raw material for
    // the Stats screen (accuracy, activity). Append-only and tiny (a row is
    // ~30 bytes; a heavy year of study is under 1 MB).
    // `streak_freezes` records days the streak-protection bridged: a freeze
    // day is NOT a lie that you studied, it's an explicit "excused absence"
    // kept separate from daily_log so the honest record stays honest.
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS review_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        card_id TEXT NOT NULL,
        date TEXT NOT NULL,
        correct INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_review_log_date ON review_log(date);

      CREATE TABLE IF NOT EXISTS streak_freezes (
        date TEXT PRIMARY KEY NOT NULL
      );
    `);
  }

  // Future schema changes go here:
  // if (version < 5) { await db.execAsync(`ALTER TABLE ...`); }

  await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
}

// Reconcile the on-device content with the current SEED_DECK on every launch.
//
// The old version only seeded when `cards` was empty, which meant any later
// vocab fix or new card never reached users who already had data. Instead we:
//   - UPSERT card *content* so corrections and additions always propagate.
//   - INSERT OR IGNORE the per-card progress row, so existing boxes and review
//     history are never touched (only brand-new cards get a fresh box-1 state).
export async function syncSeedDeck() {
  await db.withTransactionAsync(async () => {
    for (const c of FULL_DECK) {
      await db.runAsync(
        `INSERT INTO cards (id, thai, roman, en, note, category, sort)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           thai     = excluded.thai,
           roman    = excluded.roman,
           en       = excluded.en,
           note     = excluded.note,
           category = excluded.category,
           sort     = excluded.sort`,
        [c.id, c.thai, c.roman, c.en, c.note || "", c.category || "", c.sort]
      );
      await db.runAsync(
        "INSERT OR IGNORE INTO card_state (card_id, box, last_reviewed) VALUES (?, 1, NULL)",
        [c.id]
      );
    }
  });
}

// Wipe everything and re-seed from scratch. Used by the recovery screen when
// the DB is corrupt or the user explicitly resets, so they're never stuck.
export async function resetDatabase() {
  if (!db) db = await SQLite.openDatabaseAsync("thai.db");
  await db.execAsync(`
    DROP TABLE IF EXISTS card_state;
    DROP TABLE IF EXISTS daily_log;
    DROP TABLE IF EXISTS settings;
    DROP TABLE IF EXISTS lesson_progress;
    DROP TABLE IF EXISTS review_log;
    DROP TABLE IF EXISTS streak_freezes;
    DROP TABLE IF EXISTS cards;
    PRAGMA user_version = 0;
  `);
  await runMigrations();
  await syncSeedDeck();
  return db;
}

// --- Settings (key/value) --------------------------------------------------

// Read a setting, or `fallback` if it was never set. Values are stored as text;
// callers encode/decode (e.g. "1"/"0" for booleans).
export async function getSetting(key, fallback = null) {
  const row = await db.getFirstAsync("SELECT value FROM settings WHERE key = ?", [key]);
  return row ? row.value : fallback;
}

export async function setSetting(key, value) {
  await db.runAsync(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [key, String(value)]
  );
}

// --- Deck queries ----------------------------------------------------------

// Full deck joined with progress, in display order.
export async function getDeck() {
  return db.getAllAsync(`
    SELECT c.id, c.thai, c.roman, c.en, c.note, c.category,
           s.box, s.last_reviewed, s.unlocked
    FROM cards c
    JOIN card_state s ON s.card_id = c.id
    ORDER BY c.sort
  `);
}

// Cards due for review today: unlocked by a lesson AND due per the SRS rule.
// Locked cards are invisible to review — they enter the rotation the moment
// their lesson is completed.
export async function getDueCards(today) {
  const deck = await getDeck();
  return deck.filter((card) => card.unlocked && isDue(card, today));
}

// Grade a card: move it up or back, stamp today's date, and append to the
// review history (the Stats screen's raw data).
export async function recordReview(cardId, currentBox, correct, today) {
  const box = nextBox(currentBox, correct);
  await db.runAsync("UPDATE card_state SET box = ?, last_reviewed = ? WHERE card_id = ?", [
    box,
    today,
    cardId,
  ]);
  await db.runAsync("INSERT INTO review_log (card_id, date, correct) VALUES (?, ?, ?)", [
    cardId,
    today,
    correct ? 1 : 0,
  ]);
  return box;
}

export async function countMastered() {
  const row = await db.getFirstAsync("SELECT COUNT(*) AS n FROM card_state WHERE box >= 5");
  return row ? row.n : 0;
}

// --- Lesson progress (the Learn path) --------------------------------------

// Ids of every completed lesson, for computing path state.
export async function getCompletedLessons() {
  const rows = await db.getAllAsync("SELECT lesson_id FROM lesson_progress");
  return rows.map((r) => r.lesson_id);
}

// Finish a lesson: record it and unlock its cards into the review rotation.
// Re-completing a lesson (replaying it) keeps the original completion date and
// is harmless to already-unlocked cards.
export async function completeLesson(lessonId, date, cardIds) {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      "INSERT OR IGNORE INTO lesson_progress (lesson_id, completed_at) VALUES (?, ?)",
      [lessonId, date]
    );
    for (const id of cardIds) {
      await db.runAsync("UPDATE card_state SET unlocked = 1 WHERE card_id = ?", [id]);
    }
  });
}

// --- Stats queries ---------------------------------------------------------

// Lifetime totals: reviews graded and how many were right.
export async function getReviewTotals() {
  const row = await db.getFirstAsync(
    "SELECT COUNT(*) AS total, COALESCE(SUM(correct), 0) AS correct FROM review_log"
  );
  return { total: row?.total || 0, correct: row?.correct || 0 };
}

// Per-day review counts since `fromDate` (inclusive): [{date, total, correct}].
export async function getDailyReviewCounts(fromDate) {
  return db.getAllAsync(
    `SELECT date, COUNT(*) AS total, COALESCE(SUM(correct), 0) AS correct
     FROM review_log WHERE date >= ? GROUP BY date ORDER BY date`,
    [fromDate]
  );
}

// How many unlocked cards sit in each Leitner box: {1: n, ..., 5: n}.
export async function getBoxDistribution() {
  const rows = await db.getAllAsync(
    "SELECT box, COUNT(*) AS n FROM card_state WHERE unlocked = 1 GROUP BY box"
  );
  const out = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of rows) out[r.box] = r.n;
  return out;
}

// --- Streak freezes --------------------------------------------------------

export async function getFreezeDates() {
  const rows = await db.getAllAsync("SELECT date FROM streak_freezes");
  return rows.map((r) => r.date);
}

export async function addFreezeDay(date) {
  await db.runAsync("INSERT OR IGNORE INTO streak_freezes (date) VALUES (?)", [date]);
}

// --- Daily log queries -----------------------------------------------------

const BLANK_LOG = { listening: false, speaking: false, vocab: false, freeplay: false };

export async function getLog(date) {
  const row = await db.getFirstAsync("SELECT * FROM daily_log WHERE date = ?", [date]);
  if (!row) return { ...BLANK_LOG };
  return {
    listening: !!row.listening,
    speaking: !!row.speaking,
    vocab: !!row.vocab,
    freeplay: !!row.freeplay,
  };
}

// Set a single block on/off for a date (upsert the whole row).
export async function setBlock(date, key, value) {
  const current = await getLog(date);
  current[key] = value;
  await db.runAsync(
    `INSERT INTO daily_log (date, listening, speaking, vocab, freeplay)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
       listening = excluded.listening,
       speaking  = excluded.speaking,
       vocab     = excluded.vocab,
       freeplay  = excluded.freeplay`,
    [date, +current.listening, +current.speaking, +current.vocab, +current.freeplay]
  );
  return current;
}

// All logged dates that completed the protected Listening block.
// Used to compute the streak in JS.
export async function getListeningDates() {
  const rows = await db.getAllAsync("SELECT date FROM daily_log WHERE listening = 1");
  return rows.map((r) => r.date);
}
