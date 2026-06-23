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
jest.mock("../data/seedDeck", () => ({ SEED_DECK: [] }));

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
let seed; // the mocked SEED_DECK holder

function setupFixture(cards) {
  jest.resetModules();
  global.__ADAPTER__ = makeAdapter();
  seed = require("../data/seedDeck");
  seed.SEED_DECK.length = 0;
  seed.SEED_DECK.push(...cards);
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
    seed.SEED_DECK[0].roman = "new";
    seed.SEED_DECK.push(card("c", 1));
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
