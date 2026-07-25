// Content integrity tests for the Learn path and the card catalog. These are
// the guardrails that let us keep authoring cards/lessons by hand: every id a
// lesson references must exist, both Top-100 packs must be exactly 100 unique
// cards, and every card in the catalog must be reachable through some lesson.

const { FULL_DECK } = require("./deck");
const { SEED_DECK } = require("./seedDeck");
const { WORDS_100 } = require("./words100");
const { PHRASES_100 } = require("./phrases100");
const { UNITS, ALL_LESSONS } = require("./lessons");

const deckIds = new Set(FULL_DECK.map((c) => c.id));

describe("card catalog", () => {
  it("has globally unique card ids", () => {
    expect(deckIds.size).toBe(FULL_DECK.length);
  });

  it("assigns a unique global sort to every card", () => {
    const sorts = FULL_DECK.map((c) => c.sort);
    expect(new Set(sorts).size).toBe(FULL_DECK.length);
  });

  it("keeps the starter deck first so existing users' deck order is stable", () => {
    const starterIds = SEED_DECK.map((c) => c.id);
    expect(FULL_DECK.slice(0, starterIds.length).map((c) => c.id)).toEqual(starterIds);
  });

  it("uses only the documented romanization alphabet", () => {
    // a-z, spaces, and tone/length-marked vowels. Catches stray characters
    // (ellipses, IPA, capitals) sneaking into hand-authored romanizations.
    const allowed = /^[a-z àáâǎèéêěìíîǐòóôǒùúûǔ]+$/;
    const bad = FULL_DECK.filter((c) => !allowed.test(c.roman)).map((c) => `${c.id}: ${c.roman}`);
    expect(bad).toEqual([]);
  });
});

describe("lesson references", () => {
  it("only references cards that exist", () => {
    for (const lesson of ALL_LESSONS) {
      for (const id of lesson.cardIds) {
        if (!deckIds.has(id)) {
          throw new Error(`Lesson ${lesson.id} references unknown card "${id}"`);
        }
      }
    }
  });

  it("never repeats a card within a lesson and never repeats lesson ids", () => {
    const lessonIds = new Set();
    for (const lesson of ALL_LESSONS) {
      expect(new Set(lesson.cardIds).size).toBe(lesson.cardIds.length);
      expect(lessonIds.has(lesson.id)).toBe(false);
      lessonIds.add(lesson.id);
    }
  });

  it("covers every card in the catalog with at least one lesson", () => {
    const covered = new Set(ALL_LESSONS.flatMap((l) => l.cardIds));
    const orphans = FULL_DECK.filter((c) => !covered.has(c.id)).map((c) => c.id);
    expect(orphans).toEqual([]);
  });
});

describe("the Top-100 packs", () => {
  function packCards(unitId) {
    const unit = UNITS.find((u) => u.id === unitId);
    return unit.lessons.flatMap((l) => l.cardIds);
  }

  it("Top 100 Words is exactly 100 unique cards", () => {
    const ids = packCards("words100");
    expect(new Set(ids).size).toBe(100);
    expect(ids).toHaveLength(100);
  });

  it("Top 100 Phrases is exactly 100 unique cards", () => {
    const ids = packCards("phrases100");
    expect(new Set(ids).size).toBe(100);
    expect(ids).toHaveLength(100);
  });

  it("pack cards live in their pack category or the starter deck (no dupes)", () => {
    const starterIds = new Set(SEED_DECK.map((c) => c.id));
    const wordIds = new Set(WORDS_100.map((c) => c.id));
    const phraseIds = new Set(PHRASES_100.map((c) => c.id));
    for (const id of packCards("words100")) {
      expect(wordIds.has(id) || starterIds.has(id)).toBe(true);
    }
    for (const id of packCards("phrases100")) {
      expect(phraseIds.has(id) || starterIds.has(id)).toBe(true);
    }
  });
});
