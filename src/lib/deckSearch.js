// Deck search (pure, unit-testable). The one non-obvious requirement: tone
// marks must not block matching. Nobody types "mâi" on a phone keyboard, so
// queries and romanizations are both stripped to plain ASCII before comparing —
// "mai" finds mài, mâi, and máai alike. Thai script and English glosses match
// by plain substring.

// Strip combining diacritics (tone marks) and lowercase: "mâi" -> "mai".
export function normalizeRoman(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Filter the deck by a free-text query against Thai, romanization, and English.
// An empty/whitespace query returns the whole deck.
export function searchDeck(deck, query) {
  const q = (query || "").trim();
  if (!q) return deck;
  const qRoman = normalizeRoman(q);
  const qLower = q.toLowerCase();
  return deck.filter(
    (c) =>
      c.thai.includes(q) ||
      normalizeRoman(c.roman).includes(qRoman) ||
      (c.en || "").toLowerCase().includes(qLower) ||
      (c.note || "").toLowerCase().includes(qLower)
  );
}
