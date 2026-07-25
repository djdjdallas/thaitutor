const {
  buildLessonSteps,
  isTileOrderCorrect,
  syllables,
  mulberry32,
  MCQ_CHOICES,
} = require("./lessonSteps");

function card(id, roman, en) {
  return { id, thai: `t-${id}`, roman, en, note: "", category: "x" };
}

// A lesson of two short words (audio) and two long phrases (tiles).
const LESSON = [
  card("a", "dii", "good"),
  card("b", "mâak", "very"),
  card("c", "khǎw náam plào", "plain water please"),
  card("d", "an níi thâo rài", "how much is this"),
];

// A larger pool so MCQ distractors can always be topped up.
const POOL = [
  ...LESSON,
  card("p1", "pai", "go"),
  card("p2", "maa", "come"),
  card("p3", "gin", "eat"),
  card("p4", "nawn", "sleep"),
  card("p5", "duu", "look"),
];

describe("buildLessonSteps", () => {
  const steps = buildLessonSteps(LESSON, POOL, mulberry32(42));

  it("produces teach steps first, one per card, in teaching order", () => {
    const teach = steps.slice(0, LESSON.length);
    expect(teach.every((s) => s.type === "teach")).toBe(true);
    expect(teach.map((s) => s.card.id)).toEqual(["a", "b", "c", "d"]);
  });

  it("quizzes every card once with MCQ and once with audio-or-tiles", () => {
    const mcq = steps.filter((s) => s.type === "mcq");
    const third = steps.filter((s) => s.type === "audio" || s.type === "tiles");
    expect(mcq.map((s) => s.card.id).sort()).toEqual(["a", "b", "c", "d"]);
    expect(third.map((s) => s.card.id).sort()).toEqual(["a", "b", "c", "d"]);
    expect(steps).toHaveLength(LESSON.length * 3);
  });

  it("uses tiles for 3+ syllable cards and audio for short ones", () => {
    const byId = Object.fromEntries(
      steps.filter((s) => s.type === "audio" || s.type === "tiles").map((s) => [s.card.id, s.type])
    );
    expect(byId).toEqual({ a: "audio", b: "audio", c: "tiles", d: "tiles" });
  });

  it("gives every choice step 4 options including the answer, no duplicate glosses", () => {
    for (const s of steps.filter((x) => x.type === "mcq" || x.type === "audio")) {
      expect(s.options).toHaveLength(MCQ_CHOICES);
      expect(s.options.filter((o) => o.id === s.card.id)).toHaveLength(1);
      expect(new Set(s.options.map((o) => o.en)).size).toBe(MCQ_CHOICES);
    }
  });

  it("shuffles tiles into a not-already-solved order covering every syllable", () => {
    for (const s of steps.filter((x) => x.type === "tiles")) {
      expect(s.tiles.map((t) => t.text).sort()).toEqual(syllables(s.card).sort());
      expect(isTileOrderCorrect(s.tiles, s.card)).toBe(false);
    }
  });

  it("is deterministic for a fixed seed", () => {
    const again = buildLessonSteps(LESSON, POOL, mulberry32(42));
    expect(again.map((s) => `${s.type}:${s.card.id}`)).toEqual(
      steps.map((s) => `${s.type}:${s.card.id}`)
    );
  });
});

describe("isTileOrderCorrect", () => {
  const c = card("c", "khǎw náam plào", "plain water please");
  const tiles = (texts) => texts.map((text, i) => ({ key: `${i}`, text }));

  it("accepts the exact syllable order", () => {
    expect(isTileOrderCorrect(tiles(["khǎw", "náam", "plào"]), c)).toBe(true);
  });

  it("rejects wrong order and wrong length", () => {
    expect(isTileOrderCorrect(tiles(["náam", "khǎw", "plào"]), c)).toBe(false);
    expect(isTileOrderCorrect(tiles(["khǎw", "náam"]), c)).toBe(false);
  });

  it("judges duplicate syllables by position, not identity", () => {
    const dup = card("d", "glâi glâi", "nearby");
    expect(isTileOrderCorrect(tiles(["glâi", "glâi"]), dup)).toBe(true);
  });
});
