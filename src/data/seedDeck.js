// Static vocab content. This is the TRUSTWORTHY source of Thai (you verify it),
// as opposed to anything a small on-device model generates later.
// Thai script is authoritative for pronunciation; `roman` is an approximate aid.
//
// Romanization is Paiboon-style with tone marks on the vowel, so the cue carries
// the one thing ASCII spelling drops — the tone:
//   mid = unmarked (a) · low = à · falling = â · high = á · rising = ǎ
// Doubled vowels (aa, ii, uu) mark long vowels. Syllables are space-separated.
//
// `sort` preserves display order. `category` is for future filtering/lessons.
//
// prettier-ignore: kept as a one-card-per-line table so the deck stays scannable
// and easy to diff when content is added or corrected.
// prettier-ignore
export const SEED_DECK = [
  { id: "g1", thai: "สวัสดี", roman: "sà wàt dii", en: "hello / goodbye", note: "Add khráp (male) or khâ (female) on the end to be polite.", category: "greetings" },
  { id: "g2", thai: "ครับ", roman: "kráp", en: "polite particle (male speaker)", note: "You end sentences with this. Female speakers use khâ.", category: "greetings" },
  { id: "g3", thai: "ค่ะ / คะ", roman: "khâ", en: "polite particle (female speaker)", note: "Falling tone (khâ) for statements; high tone (khá) when asking.", category: "greetings" },
  { id: "g4", thai: "ขอบคุณ", roman: "khàwp khun", en: "thank you", note: "", category: "greetings" },
  { id: "g5", thai: "ขอโทษ", roman: "khǎw thôot", en: "sorry / excuse me", note: "", category: "greetings" },
  { id: "g6", thai: "สบายดีไหม", roman: "sà baai dii mǎi", en: "how are you?", note: "The 'mǎi' on the end turns it into a question.", category: "greetings" },
  { id: "g7", thai: "สบายดี", roman: "sà baai dii", en: "I'm fine / I'm well", note: "", category: "greetings" },
  { id: "g8", thai: "คุณ", roman: "khun", en: "you", note: "", category: "greetings" },
  { id: "g9", thai: "ผม", roman: "phǒm", en: "I / me (male speaker)", note: "", category: "greetings" },
  { id: "g10", thai: "ชื่อ", roman: "chêu", en: "name", note: "", category: "greetings" },

  { id: "y1", thai: "ใช่", roman: "châi", en: "yes", note: "", category: "essentials" },
  { id: "y2", thai: "ไม่", roman: "mâi", en: "no / not", note: "", category: "essentials" },
  { id: "y3", thai: "ไม่เป็นไร", roman: "mâi pen rai", en: "it's okay / no worries", note: "The unofficial national phrase. Use it constantly.", category: "essentials" },
  { id: "y4", thai: "เข้าใจ", roman: "khâo jai", en: "(I) understand", note: "", category: "essentials" },
  { id: "y5", thai: "ไม่เข้าใจ", roman: "mâi khâo jai", en: "(I) don't understand", note: "", category: "essentials" },
  { id: "y6", thai: "พูดช้าๆ", roman: "phûut cháa cháa", en: "please speak slowly", note: "", category: "essentials" },

  { id: "f1", thai: "น้ำ", roman: "náam", en: "water", note: "", category: "food" },
  { id: "f2", thai: "ข้าว", roman: "khâao", en: "rice / food", note: "", category: "food" },
  { id: "f3", thai: "กิน", roman: "gin", en: "to eat", note: "", category: "food" },
  { id: "f4", thai: "หิว", roman: "hǐu", en: "hungry", note: "", category: "food" },
  { id: "f5", thai: "อร่อย", roman: "à ròi", en: "delicious", note: "", category: "food" },
  { id: "f6", thai: "เผ็ด", roman: "phèt", en: "spicy", note: "", category: "food" },
  { id: "f7", thai: "ไม่เผ็ด", roman: "mâi phèt", en: "not spicy", note: "Clutch phrase. Thai spicy is a different universe.", category: "food" },

  { id: "s1", thai: "เท่าไหร่", roman: "thâo rài", en: "how much?", note: "", category: "survival" },
  { id: "s2", thai: "แพง", roman: "phaeng", en: "expensive", note: "", category: "survival" },
  { id: "s3", thai: "ที่ไหน", roman: "thîi nǎi", en: "where?", note: "", category: "survival" },
  { id: "s4", thai: "ห้องน้ำ", roman: "hâwng náam", en: "toilet / bathroom", note: "", category: "survival" },
  { id: "s5", thai: "ไป", roman: "pai", en: "to go", note: "", category: "survival" },
  { id: "s6", thai: "เอา", roman: "ao", en: "to want / to take", note: "", category: "survival" },
  { id: "s7", thai: "ไม่เอา", roman: "mâi ao", en: "(I) don't want", note: "", category: "survival" },
  { id: "s8", thai: "ขอ", roman: "khǎw", en: "may I have... (polite request)", note: "", category: "survival" },
  { id: "s9", thai: "นิดหน่อย", roman: "nít nàwy", en: "a little bit", note: "", category: "survival" },

  { id: "n1", thai: "หนึ่ง", roman: "nèung", en: "1", note: "", category: "numbers" },
  { id: "n2", thai: "สอง", roman: "sǎwng", en: "2", note: "", category: "numbers" },
  { id: "n3", thai: "สาม", roman: "sǎam", en: "3", note: "", category: "numbers" },
  { id: "n4", thai: "สี่", roman: "sìi", en: "4", note: "", category: "numbers" },
  { id: "n5", thai: "ห้า", roman: "hâa", en: "5", note: "555 = 'haha' in Thai texting, since 5 is 'hâa'.", category: "numbers" },
  { id: "n6", thai: "หก", roman: "hòk", en: "6", note: "", category: "numbers" },
  { id: "n7", thai: "เจ็ด", roman: "jèt", en: "7", note: "", category: "numbers" },
  { id: "n8", thai: "แปด", roman: "pàet", en: "8", note: "", category: "numbers" },
  { id: "n9", thai: "เก้า", roman: "kâo", en: "9", note: "", category: "numbers" },
  { id: "n10", thai: "สิบ", roman: "sìp", en: "10", note: "", category: "numbers" },
].map((c, i) => ({ ...c, sort: i }));
