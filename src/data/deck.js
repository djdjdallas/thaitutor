// The full card catalog: starter deck + both Top-100 packs, with a single
// global sort order. This is what the database seeds/syncs from — the source
// files stay separate so each pack remains a scannable table on its own.

import { SEED_DECK } from "./seedDeck";
import { WORDS_100 } from "./words100";
import { PHRASES_100 } from "./phrases100";

export const FULL_DECK = [...SEED_DECK, ...WORDS_100, ...PHRASES_100].map((c, i) => ({
  ...c,
  sort: i,
}));
