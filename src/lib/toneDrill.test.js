const { buildDrillRounds, DRILL_ROUNDS } = require("./toneDrill");
const { mulberry32 } = require("./lessonSteps");
const { TONE_SETS } = require("../data/tonePairs");

describe("tone pair data", () => {
  it("every set has 2+ words with distinct tones and distinct Thai", () => {
    for (const set of TONE_SETS) {
      expect(set.words.length).toBeGreaterThanOrEqual(2);
      expect(new Set(set.words.map((w) => w.tone)).size).toBe(set.words.length);
      expect(new Set(set.words.map((w) => w.thai)).size).toBe(set.words.length);
    }
  });

  it("uses only the five tone names", () => {
    const valid = new Set(["mid", "low", "falling", "high", "rising"]);
    for (const set of TONE_SETS) {
      for (const w of set.words) expect(valid.has(w.tone)).toBe(true);
    }
  });
});

describe("buildDrillRounds", () => {
  const rounds = buildDrillRounds(TONE_SETS, DRILL_ROUNDS, mulberry32(7));

  it("builds the requested number of rounds", () => {
    expect(rounds).toHaveLength(DRILL_ROUNDS);
  });

  it("each round's answer is among its options, and options are the whole set", () => {
    for (const r of rounds) {
      expect(r.options).toContain(r.answer);
      expect(r.options.map((w) => w.thai).sort()).toEqual(r.set.words.map((w) => w.thai).sort());
    }
  });

  it("covers every set before repeating any", () => {
    const firstCycle = rounds.slice(0, TONE_SETS.length).map((r) => r.set.id);
    expect(new Set(firstCycle).size).toBe(TONE_SETS.length);
  });

  it("never asks the same word twice in a row", () => {
    for (let i = 1; i < rounds.length; i++) {
      expect(rounds[i].answer.thai).not.toBe(rounds[i - 1].answer.thai);
    }
  });

  it("is deterministic for a fixed seed", () => {
    const again = buildDrillRounds(TONE_SETS, DRILL_ROUNDS, mulberry32(7));
    expect(again.map((r) => r.answer.thai)).toEqual(rounds.map((r) => r.answer.thai));
  });
});
