// Static vocab content. This is the TRUSTWORTHY source of Thai (you verify it),
// as opposed to anything a small on-device model generates later.
// Thai script is authoritative for pronunciation; `roman` is an approximate aid.
//
// `sort` preserves display order. `category` is for future filtering/lessons.
export const SEED_DECK = [
  { id: "g1", thai: "สวัสดี", roman: "sawatdee", en: "hello / goodbye", note: "Add khrap (male) or kha (female) on the end to be polite.", category: "greetings" },
  { id: "g2", thai: "ครับ", roman: "khrap", en: "polite particle (male speaker)", note: "You end sentences with this. Female speakers use kha.", category: "greetings" },
  { id: "g3", thai: "ค่ะ / คะ", roman: "kha", en: "polite particle (female speaker)", note: "", category: "greetings" },
  { id: "g4", thai: "ขอบคุณ", roman: "khop khun", en: "thank you", note: "", category: "greetings" },
  { id: "g5", thai: "ขอโทษ", roman: "kho thot", en: "sorry / excuse me", note: "", category: "greetings" },
  { id: "g6", thai: "สบายดีไหม", roman: "sabai dee mai", en: "how are you?", note: "The 'mai' on the end turns it into a question.", category: "greetings" },
  { id: "g7", thai: "สบายดี", roman: "sabai dee", en: "I'm fine / I'm well", note: "", category: "greetings" },
  { id: "g8", thai: "คุณ", roman: "khun", en: "you", note: "", category: "greetings" },
  { id: "g9", thai: "ผม", roman: "phom", en: "I / me (male speaker)", note: "", category: "greetings" },
  { id: "g10", thai: "ชื่อ", roman: "cheu", en: "name", note: "", category: "greetings" },

  { id: "y1", thai: "ใช่", roman: "chai", en: "yes", note: "", category: "essentials" },
  { id: "y2", thai: "ไม่", roman: "mai", en: "no / not", note: "", category: "essentials" },
  { id: "y3", thai: "ไม่เป็นไร", roman: "mai pen rai", en: "it's okay / no worries", note: "The unofficial national phrase. Use it constantly.", category: "essentials" },
  { id: "y4", thai: "เข้าใจ", roman: "khao jai", en: "(I) understand", note: "", category: "essentials" },
  { id: "y5", thai: "ไม่เข้าใจ", roman: "mai khao jai", en: "(I) don't understand", note: "", category: "essentials" },
  { id: "y6", thai: "พูดช้าๆ", roman: "phut cha cha", en: "please speak slowly", note: "", category: "essentials" },

  { id: "f1", thai: "น้ำ", roman: "nam", en: "water", note: "", category: "food" },
  { id: "f2", thai: "ข้าว", roman: "khao", en: "rice / food", note: "", category: "food" },
  { id: "f3", thai: "กิน", roman: "gin", en: "to eat", note: "", category: "food" },
  { id: "f4", thai: "หิว", roman: "hiw", en: "hungry", note: "", category: "food" },
  { id: "f5", thai: "อร่อย", roman: "aroi", en: "delicious", note: "", category: "food" },
  { id: "f6", thai: "เผ็ด", roman: "phet", en: "spicy", note: "", category: "food" },
  { id: "f7", thai: "ไม่เผ็ด", roman: "mai phet", en: "not spicy", note: "Clutch phrase. Thai spicy is a different universe.", category: "food" },

  { id: "s1", thai: "เท่าไหร่", roman: "thao rai", en: "how much?", note: "", category: "survival" },
  { id: "s2", thai: "แพง", roman: "phaeng", en: "expensive", note: "", category: "survival" },
  { id: "s3", thai: "ที่ไหน", roman: "thee nai", en: "where?", note: "", category: "survival" },
  { id: "s4", thai: "ห้องน้ำ", roman: "hong nam", en: "toilet / bathroom", note: "", category: "survival" },
  { id: "s5", thai: "ไป", roman: "pai", en: "to go", note: "", category: "survival" },
  { id: "s6", thai: "เอา", roman: "ao", en: "to want / to take", note: "", category: "survival" },
  { id: "s7", thai: "ไม่เอา", roman: "mai ao", en: "(I) don't want", note: "", category: "survival" },
  { id: "s8", thai: "ขอ", roman: "kho", en: "may I have... (polite request)", note: "", category: "survival" },
  { id: "s9", thai: "นิดหน่อย", roman: "nit noi", en: "a little bit", note: "", category: "survival" },

  { id: "n1", thai: "หนึ่ง", roman: "nueng", en: "1", note: "", category: "numbers" },
  { id: "n2", thai: "สอง", roman: "song", en: "2", note: "", category: "numbers" },
  { id: "n3", thai: "สาม", roman: "saam", en: "3", note: "", category: "numbers" },
  { id: "n4", thai: "สี่", roman: "see", en: "4", note: "", category: "numbers" },
  { id: "n5", thai: "ห้า", roman: "haa", en: "5", note: "555 = 'haha' in Thai texting, since 5 is 'haa'.", category: "numbers" },
  { id: "n6", thai: "หก", roman: "hok", en: "6", note: "", category: "numbers" },
  { id: "n7", thai: "เจ็ด", roman: "jet", en: "7", note: "", category: "numbers" },
  { id: "n8", thai: "แปด", roman: "paet", en: "8", note: "", category: "numbers" },
  { id: "n9", thai: "เก้า", roman: "kao", en: "9", note: "", category: "numbers" },
  { id: "n10", thai: "สิบ", roman: "sip", en: "10", note: "", category: "numbers" },
].map((c, i) => ({ ...c, sort: i }));
