// Lesson step generator (pure functions, no React/RN imports).
//
// A lesson runs in three passes over its cards, Brilliant-style — you meet each
// word, then immediately have to *use* it two different ways:
//   1. teach  — see/hear the card, no quiz.
//   2. mcq    — "which one means X?" pick the Thai from 4 options.
//   3. tiles  — rebuild the phrase from shuffled syllable tiles (3+ syllables),
//      audio  — or, for short words, pick the meaning of what you hear.
//
// Randomness is injected (rng) so tests can be deterministic; callers default
// to Math.random.

export const MCQ_CHOICES = 4;
const TILE_MIN_SYLLABLES = 3;

// Small seeded PRNG (mulberry32) for deterministic tests.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(arr, rng) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function syllables(card) {
  return (card.roman || "").split(" ").filter(Boolean);
}

// 3 wrong options for a card: same-lesson cards first (they're the ones you're
// actually confusing right now), topped up from the full deck. Never two
// options with the same English gloss.
function pickDistractors(card, lessonCards, pool, rng) {
  const seen = new Set([card.id]);
  const seenEn = new Set([card.en]);
  const out = [];
  const take = (candidates) => {
    for (const c of shuffled(candidates, rng)) {
      if (out.length >= MCQ_CHOICES - 1) return;
      if (seen.has(c.id) || seenEn.has(c.en)) continue;
      seen.add(c.id);
      seenEn.add(c.en);
      out.push(c);
    }
  };
  take(lessonCards);
  take(pool);
  return out;
}

// Build the full step list for a lesson.
//   cards — the lesson's card objects, in teaching order.
//   pool  — the whole deck, used to top up MCQ distractors.
export function buildLessonSteps(cards, pool, rng = Math.random) {
  const steps = [];

  for (const card of cards) {
    steps.push({ type: "teach", card });
  }

  for (const card of shuffled(cards, rng)) {
    const options = shuffled([card, ...pickDistractors(card, cards, pool, rng)], rng);
    steps.push({ type: "mcq", card, options });
  }

  for (const card of shuffled(cards, rng)) {
    if (syllables(card).length >= TILE_MIN_SYLLABLES) {
      steps.push({ type: "tiles", card, tiles: shuffleTiles(card, rng) });
    } else {
      const options = shuffled([card, ...pickDistractors(card, cards, pool, rng)], rng);
      steps.push({ type: "audio", card, options });
    }
  }

  return steps;
}

// Tiles are {key, text}: the key makes duplicate syllables (glâi glâi)
// distinct list items, while correctness is checked on text order.
function shuffleTiles(card, rng) {
  const tiles = syllables(card).map((text, i) => ({ key: `${i}-${text}`, text }));
  // Re-shuffle until the tiles aren't accidentally in solved order (always
  // possible to avoid with 3+ tiles unless every tile is the same syllable).
  const allSame = tiles.every((t) => t.text === tiles[0].text);
  let out = shuffled(tiles, rng);
  for (let tries = 0; !allSame && tries < 20 && isTileOrderCorrect(out, card); tries++) {
    out = shuffled(tiles, rng);
  }
  return out;
}

// A tile answer is right when the chosen texts spell the roman in order.
export function isTileOrderCorrect(chosenTiles, card) {
  const target = syllables(card);
  if (chosenTiles.length !== target.length) return false;
  return chosenTiles.every((t, i) => t.text === target[i]);
}
