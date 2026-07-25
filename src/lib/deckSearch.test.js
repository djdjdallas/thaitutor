const { normalizeRoman, searchDeck } = require("./deckSearch");

const DECK = [
  { id: "a", thai: "ไม่", roman: "mâi", en: "no / not", note: "" },
  { id: "b", thai: "ใหม่", roman: "mài", en: "new", note: "" },
  { id: "c", thai: "ไม้", roman: "máai", en: "wood", note: "" },
  { id: "d", thai: "น้ำ", roman: "náam", en: "water", note: "" },
  { id: "e", thai: "ขอบคุณ", roman: "khàwp khun", en: "thank you", note: "" },
  {
    id: "f",
    thai: "ค่ะ / คะ",
    roman: "khâ",
    en: "polite particle (female speaker)",
    note: "Falling tone for statements.",
  },
];

describe("normalizeRoman", () => {
  it("strips tone marks and lowercases", () => {
    expect(normalizeRoman("mâi")).toBe("mai");
    expect(normalizeRoman("Khǎaw Thôot")).toBe("khaaw thoot");
    expect(normalizeRoman("sǔai")).toBe("suai");
  });
});

describe("searchDeck", () => {
  it("returns everything for an empty or whitespace query", () => {
    expect(searchDeck(DECK, "")).toHaveLength(DECK.length);
    expect(searchDeck(DECK, "   ")).toHaveLength(DECK.length);
  });

  it("matches romanization without needing tone marks", () => {
    // mâi and mài both normalize to "mai"; máai is "maai" (long vowel), a
    // genuinely different spelling, so it needs the long-vowel query.
    expect(searchDeck(DECK, "mai").map((c) => c.id)).toEqual(["a", "b"]);
    expect(searchDeck(DECK, "maai").map((c) => c.id)).toEqual(["c"]);
  });

  it("still matches when the query itself has tone marks", () => {
    expect(searchDeck(DECK, "mâi").map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("matches Thai script and English glosses", () => {
    expect(searchDeck(DECK, "น้ำ").map((c) => c.id)).toEqual(["d"]);
    expect(searchDeck(DECK, "thank").map((c) => c.id)).toEqual(["e"]);
    expect(searchDeck(DECK, "WATER").map((c) => c.id)).toEqual(["d"]);
  });

  it("matches inside notes", () => {
    expect(searchDeck(DECK, "statements").map((c) => c.id)).toEqual(["f"]);
  });

  it("returns nothing for a miss", () => {
    expect(searchDeck(DECK, "zzz")).toEqual([]);
  });
});
