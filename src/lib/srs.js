// Leitner spaced-repetition system.
//
// Every card lives in a "box" (1-5). The box decides how long the card rests
// before it's due again. Get a card right -> it moves up a box and you see it
// less often. Get it wrong -> it drops to box 1 and you drill it daily.
//
// Why this works: it spends your limited review time on the words you're about
// to forget, instead of the ones you already know cold. Same principle as Anki.

import { daysBetween } from "./dates";

// Rest period (in days) per box. Box 1 = due every day until you promote it.
export const BOX_INTERVAL = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };
export const MAX_BOX = 5;

// A card is due if it's brand new, or it has rested long enough for its box.
export function isDue(card, today) {
  if (!card.last_reviewed) return true;
  return daysBetween(card.last_reviewed, today) >= BOX_INTERVAL[card.box];
}

// Where a card goes after you grade it.
export function nextBox(currentBox, correct) {
  if (!correct) return 1; // missed -> back to daily drilling
  return Math.min(MAX_BOX, currentBox + 1);
}
