// Tone drill round builder (pure, unit-testable). A round = one tone set with
// one member secretly chosen as "what you'll hear"; the player picks which
// word it was from the set.

export const DRILL_ROUNDS = 10;

function shuffled(arr, rng) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Build `count` rounds, cycling through shuffled copies of the sets so every
// set appears before any repeats, and never asking the exact same word twice
// in a row.
export function buildDrillRounds(sets, count = DRILL_ROUNDS, rng = Math.random) {
  const rounds = [];
  let bag = [];
  let lastAnswer = null;
  while (rounds.length < count) {
    if (bag.length === 0) bag = shuffled(sets, rng);
    const set = bag.pop();
    let answer = set.words[Math.floor(rng() * set.words.length)];
    if (lastAnswer && answer.thai === lastAnswer.thai) {
      answer = set.words[(set.words.indexOf(answer) + 1) % set.words.length];
    }
    lastAnswer = answer;
    rounds.push({ set, answer, options: shuffled(set.words, rng) });
  }
  return rounds;
}
