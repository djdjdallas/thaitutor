// Tests for the offline DB layer. We run the REAL database.js against an
// in-memory SQLite database (Node's built-in `node:sqlite`) by mocking the
// `expo-sqlite` module with a thin adapter that mirrors the async API the code
// uses. The seed deck is mocked with a small mutable fixture so we can simulate
// content fixes / new cards on a "relaunch".

const { DatabaseSync } = require("node:sqlite");

// expo-sqlite-shaped adapter backed by one in-memory node:sqlite connection.
function makeAdapter() {
  const raw = new DatabaseSync(":memory:");
  return {
    async execAsync(sql) {
      raw.exec(sql);
    },
    async runAsync(sql, params = []) {
      return raw.prepare(sql).run(...params);
    },
    async getFirstAsync(sql, params = []) {
      return raw.prepare(sql).get(...params);
    },
    async getAllAsync(sql, params = []) {
      return raw.prepare(sql).all(...params);
    },
    async withTransactionAsync(cb) {
      raw.exec("BEGIN");
      try {
        await cb();
        raw.exec("COMMIT");
      } catch (e) {
        raw.exec("ROLLBACK");
        throw e;
      }
    },
  };
}

// The mock factories read `global` so babel-plugin-jest-hoist doesn't complain
// about out-of-scope references.
jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(async () => global.__ADAPTER__),
}));
jest.mock("../data/deck", () => ({ FULL_DECK: [] }));

function card(id, sort, extra = {}) {
  return {
    id,
    thai: `t${id}`,
    roman: `r${id}`,
    en: `e${id}`,
    note: "",
    category: "x",
    sort,
    ...extra,
  };
}

let db; // freshly-required database module per fixture
let seed; // the mocked FULL_DECK holder

function setupFixture(cards) {
  jest.resetModules();
  global.__ADAPTER__ = makeAdapter();
  seed = require("../data/deck");
  seed.FULL_DECK.length = 0;
  seed.FULL_DECK.push(...cards);
  db = require("./database");
}

describe("initDatabase / seeding", () => {
  it("seeds every card at box 1 on a fresh install", async () => {
    setupFixture([card("a", 0), card("b", 1)]);
    await db.initDatabase();

    const deck = await db.getDeck();
    expect(deck).toHaveLength(2);
    expect(deck.map((c) => c.id)).toEqual(["a", "b"]);
    expect(deck.every((c) => c.box === 1)).toBe(true);
  });

  it("orders the deck by sort", async () => {
    setupFixture([card("b", 1), card("a", 0)]);
    await db.initDatabase();
    const deck = await db.getDeck();
    expect(deck.map((c) => c.id)).toEqual(["a", "b"]);
  });
});

describe("syncSeedDeck on relaunch", () => {
  it("preserves progress, updates content, and adds new cards", async () => {
    setupFixture([card("a", 0, { roman: "old" })]);
    await db.initDatabase();

    // Promote card "a" to box 3.
    await db.recordReview("a", 1, true, "2024-06-23"); // -> box 2
    await db.recordReview("a", 2, true, "2024-06-24"); // -> box 3

    // Simulate a content fix + a brand-new card, then relaunch's sync.
    seed.FULL_DECK[0].roman = "new";
    seed.FULL_DECK.push(card("c", 1));
    await db.syncSeedDeck();

    const deck = await db.getDeck();
    const a = deck.find((c) => c.id === "a");
    const c = deck.find((c) => c.id === "c");

    expect(a.box).toBe(3); // progress untouched (INSERT OR IGNORE)
    expect(a.last_reviewed).toBe("2024-06-24");
    expect(a.roman).toBe("new"); // content corrected (UPSERT)
    expect(c).toBeDefined();
    expect(c.box).toBe(1); // new card gets a fresh box-1 state
  });
});

describe("resetDatabase", () => {
  it("wipes progress and re-seeds from scratch", async () => {
    setupFixture([card("a", 0)]);
    await db.initDatabase();
    await db.recordReview("a", 1, true, "2024-06-23"); // box 2

    await db.resetDatabase();

    const deck = await db.getDeck();
    expect(deck).toHaveLength(1);
    expect(deck[0].box).toBe(1);
    expect(deck[0].last_reviewed).toBeNull();
  });
});

describe("review + mastery", () => {
  it("counts cards that reached the top box", async () => {
    setupFixture([card("a", 0), card("b", 1)]);
    await db.initDatabase();
    expect(await db.countMastered()).toBe(0);

    // Drive "a" from box 1 to box 5.
    let box = 1;
    for (const day of ["01", "02", "03", "04"]) {
      box = await db.recordReview("a", box, true, `2024-06-${day}`);
    }
    expect(box).toBe(5);
    expect(await db.countMastered()).toBe(1);
  });

  it("drops a missed card back to box 1", async () => {
    setupFixture([card("a", 0)]);
    await db.initDatabase();
    await db.recordReview("a", 1, true, "2024-06-23"); // box 2
    const box = await db.recordReview("a", 2, false, "2024-06-24"); // miss -> box 1
    expect(box).toBe(1);
  });
});

describe("settings (v2 migration)", () => {
  it("returns the fallback before a setting is written", async () => {
    setupFixture([card("a", 0)]);
    await db.initDatabase();
    expect(await db.getSetting("audioFirst", "0")).toBe("0");
  });

  it("round-trips a setting and survives a deck re-sync", async () => {
    setupFixture([card("a", 0)]);
    await db.initDatabase();

    await db.setSetting("audioFirst", "1");
    expect(await db.getSetting("audioFirst", "0")).toBe("1");

    // A relaunch re-syncs the deck; settings live in their own table and persist.
    await db.syncSeedDeck();
    expect(await db.getSetting("audioFirst", "0")).toBe("1");
  });

  it("coerces non-string values to text on write", async () => {
    setupFixture([card("a", 0)]);
    await db.initDatabase();
    await db.setSetting("n", 42);
    expect(await db.getSetting("n")).toBe("42");
  });

  it("clears settings on a full reset", async () => {
    setupFixture([card("a", 0)]);
    await db.initDatabase();
    await db.setSetting("audioFirst", "1");
    await db.resetDatabase();
    expect(await db.getSetting("audioFirst", "0")).toBe("0");
  });
});

describe("card unlocking + lesson progress (v3 migration)", () => {
  it("seeds cards locked on a fresh install, so nothing is due before a lesson", async () => {
    setupFixture([card("a", 0), card("b", 1)]);
    await db.initDatabase();

    const deck = await db.getDeck();
    expect(deck.every((c) => !c.unlocked)).toBe(true);
    expect(await db.getDueCards("2024-06-23")).toEqual([]);
  });

  it("completing a lesson unlocks its cards into the due queue", async () => {
    setupFixture([card("a", 0), card("b", 1), card("c", 2)]);
    await db.initDatabase();

    await db.completeLesson("l1", "2024-06-23", ["a", "b"]);

    const due = await db.getDueCards("2024-06-23");
    expect(due.map((c) => c.id).sort()).toEqual(["a", "b"]);
    expect(await db.getCompletedLessons()).toEqual(["l1"]);
  });

  it("keeps the original completion date when a lesson is replayed", async () => {
    setupFixture([card("a", 0)]);
    await db.initDatabase();
    await db.completeLesson("l1", "2024-06-23", ["a"]);
    await db.completeLesson("l1", "2024-06-25", ["a"]);

    const row = await global.__ADAPTER__.getFirstAsync(
      "SELECT completed_at FROM lesson_progress WHERE lesson_id = ?",
      ["l1"]
    );
    expect(row.completed_at).toBe("2024-06-23");
  });

  it("grandfathers pre-path installs: existing card_state rows migrate as unlocked", async () => {
    // Build a v2-era database by hand (no `unlocked` column, no lesson table),
    // with one reviewed card, then boot the current code against it.
    jest.resetModules();
    global.__ADAPTER__ = makeAdapter();
    await global.__ADAPTER__.execAsync(`
      CREATE TABLE cards (id TEXT PRIMARY KEY NOT NULL, thai TEXT, roman TEXT,
        en TEXT, note TEXT, category TEXT, sort INTEGER);
      CREATE TABLE card_state (card_id TEXT PRIMARY KEY NOT NULL,
        box INTEGER NOT NULL DEFAULT 1, last_reviewed TEXT);
      CREATE TABLE daily_log (date TEXT PRIMARY KEY NOT NULL,
        listening INTEGER NOT NULL DEFAULT 0, speaking INTEGER NOT NULL DEFAULT 0,
        vocab INTEGER NOT NULL DEFAULT 0, freeplay INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE settings (key TEXT PRIMARY KEY NOT NULL, value TEXT);
      INSERT INTO cards VALUES ('a', 'ta', 'ra', 'ea', '', 'x', 0);
      INSERT INTO card_state (card_id, box, last_reviewed) VALUES ('a', 3, '2024-06-20');
      PRAGMA user_version = 2;
    `);
    seed = require("../data/deck");
    seed.FULL_DECK.length = 0;
    seed.FULL_DECK.push(card("a", 0), card("z", 1)); // "z" ships with the update
    db = require("./database");
    await db.initDatabase();

    const deck = await db.getDeck();
    const a = deck.find((c) => c.id === "a");
    const z = deck.find((c) => c.id === "z");
    expect(a.unlocked).toBe(1); // pre-existing progress stays reviewable
    expect(a.box).toBe(3);
    expect(z.unlocked).toBe(0); // newly shipped cards wait for their lesson
  });

  it("clears lesson progress on a full reset", async () => {
    setupFixture([card("a", 0)]);
    await db.initDatabase();
    await db.completeLesson("l1", "2024-06-23", ["a"]);

    await db.resetDatabase();

    expect(await db.getCompletedLessons()).toEqual([]);
    const deck = await db.getDeck();
    expect(deck[0].unlocked).toBe(0);
  });
});

describe("review history + stats (v4 migration)", () => {
  it("logs every grade and reports totals + per-day counts", async () => {
    setupFixture([card("a", 0), card("b", 1)]);
    await db.initDatabase();

    await db.recordReview("a", 1, true, "2024-06-23");
    await db.recordReview("b", 1, false, "2024-06-23");
    await db.recordReview("a", 2, true, "2024-06-24");

    expect(await db.getReviewTotals()).toEqual({ total: 3, correct: 2 });

    const daily = await db.getDailyReviewCounts("2024-06-23");
    expect(daily).toEqual([
      { date: "2024-06-23", total: 2, correct: 1 },
      { date: "2024-06-24", total: 1, correct: 1 },
    ]);

    // fromDate filters older history out.
    expect(await db.getDailyReviewCounts("2024-06-24")).toHaveLength(1);
  });

  it("reports the box distribution of unlocked cards only", async () => {
    setupFixture([card("a", 0), card("b", 1), card("c", 2)]);
    await db.initDatabase();
    await db.completeLesson("l1", "2024-06-23", ["a", "b"]); // c stays locked

    await db.recordReview("a", 1, true, "2024-06-23"); // a -> box 2

    expect(await db.getBoxDistribution()).toEqual({ 1: 1, 2: 1, 3: 0, 4: 0, 5: 0 });
  });

  it("round-trips freeze days idempotently and clears them on reset", async () => {
    setupFixture([card("a", 0)]);
    await db.initDatabase();

    await db.addFreezeDay("2024-06-22");
    await db.addFreezeDay("2024-06-22"); // duplicate is a no-op
    expect(await db.getFreezeDates()).toEqual(["2024-06-22"]);

    await db.resetDatabase();
    expect(await db.getFreezeDates()).toEqual([]);
    expect(await db.getReviewTotals()).toEqual({ total: 0, correct: 0 });
  });
});

describe("daily log", () => {
  it("round-trips a block and reports listening dates", async () => {
    setupFixture([card("a", 0)]);
    await db.initDatabase();

    let log = await db.getLog("2024-06-23");
    expect(log).toEqual({ listening: false, speaking: false, vocab: false, freeplay: false });

    await db.setBlock("2024-06-23", "listening", true);
    await db.setBlock("2024-06-23", "speaking", true);
    log = await db.getLog("2024-06-23");
    expect(log.listening).toBe(true);
    expect(log.speaking).toBe(true);
    expect(log.vocab).toBe(false);

    await db.setBlock("2024-06-24", "listening", true);
    const dates = await db.getListeningDates();
    expect(dates.sort()).toEqual(["2024-06-23", "2024-06-24"]);
  });
});
