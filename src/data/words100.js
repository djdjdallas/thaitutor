// "Top 100 Words" pack — the most common everyday Thai words NOT already in the
// starter deck. The pack's lessons (see lessons.js) mix these with the starter
// cards they overlap with (ไป, กิน, น้ำ...), so the path teaches a true top-100
// without duplicating any card in the database.
//
// Same conventions as seedDeck.js: Paiboon-style romanization, tone mark on the
// vowel (mid unmarked · low à · falling â · high á · rising ǎ), doubled vowels
// are long, syllables space-separated. เ-อ / เ-ิ is written "oe" (ngoen, doen),
// เ-ย is "oei" (loei).
//
// prettier-ignore: one card per line so the deck stays scannable and diffable.
// prettier-ignore
export const WORDS_100 = [
  // People & pronouns
  { id: "w1",  thai: "ฉัน",      roman: "chǎn",          en: "I / me (female or informal)", note: "Female speakers use chǎn where males say phǒm.", category: "words" },
  { id: "w2",  thai: "เขา",      roman: "kháo",          en: "he / she", note: "Spelled with a rising tone but spoken high in everyday Thai.", category: "words" },
  { id: "w3",  thai: "เรา",      roman: "rao",           en: "we / us", note: "Also used casually to mean 'I' among friends.", category: "words" },
  { id: "w4",  thai: "มัน",      roman: "man",           en: "it", note: "Can sound rude about people — save it for things and animals.", category: "words" },
  { id: "w5",  thai: "คน",       roman: "khon",          en: "person / people", note: "Also the classifier for counting people: sǎwng khon = two people.", category: "words" },
  { id: "w6",  thai: "เพื่อน",    roman: "phêuan",        en: "friend", note: "", category: "words" },
  { id: "w7",  thai: "ครอบครัว",  roman: "khrâwp khruua", en: "family", note: "", category: "words" },
  { id: "w8",  thai: "เด็ก",      roman: "dèk",           en: "child", note: "", category: "words" },
  { id: "w9",  thai: "ผู้ชาย",    roman: "phûu chaai",    en: "man", note: "", category: "words" },
  { id: "w10", thai: "ผู้หญิง",   roman: "phûu yǐng",     en: "woman", note: "", category: "words" },

  // Core verbs I
  { id: "w11", thai: "เป็น",     roman: "pen",           en: "to be (someone/something)", note: "phǒm pen khruu = I am a teacher.", category: "words" },
  { id: "w12", thai: "มี",       roman: "mii",           en: "to have / there is", note: "mii ... mǎi? = is there ...? A hugely useful question frame.", category: "words" },
  { id: "w13", thai: "ได้",      roman: "dâai",          en: "can / to get", note: "After a verb it means 'can': pai dâai = (I) can go.", category: "words" },
  { id: "w14", thai: "จะ",       roman: "jà",            en: "will (future marker)", note: "Goes before the verb: jà pai = will go.", category: "words" },
  { id: "w15", thai: "อยู่",      roman: "yùu",           en: "to be at / to stay", note: "yùu thîi nǎi? = where is it / where are you?", category: "words" },
  { id: "w16", thai: "มา",       roman: "maa",           en: "to come", note: "", category: "words" },
  { id: "w17", thai: "ทำ",       roman: "tham",          en: "to do / to make", note: "", category: "words" },
  { id: "w18", thai: "พูด",      roman: "phûut",         en: "to speak", note: "", category: "words" },
  { id: "w19", thai: "รู้",       roman: "rúu",           en: "to know (a fact)", note: "mâi rúu = I don't know — you'll use this daily.", category: "words" },

  // Core verbs II
  { id: "w20", thai: "ดื่ม",      roman: "dèum",          en: "to drink", note: "", category: "words" },
  { id: "w21", thai: "ซื้อ",      roman: "séu",           en: "to buy", note: "", category: "words" },
  { id: "w22", thai: "ดู",        roman: "duu",           en: "to look / to watch", note: "", category: "words" },
  { id: "w23", thai: "เห็น",     roman: "hěn",           en: "to see", note: "", category: "words" },
  { id: "w24", thai: "ฟัง",      roman: "fang",          en: "to listen", note: "", category: "words" },
  { id: "w25", thai: "นอน",      roman: "nawn",          en: "to sleep / to lie down", note: "", category: "words" },
  { id: "w26", thai: "นั่ง",      roman: "nâng",          en: "to sit", note: "", category: "words" },
  { id: "w27", thai: "เดิน",     roman: "doen",          en: "to walk", note: "", category: "words" },
  { id: "w28", thai: "ชอบ",      roman: "châwp",         en: "to like", note: "", category: "words" },

  // More verbs & wants
  { id: "w29", thai: "รัก",      roman: "rák",           en: "to love", note: "", category: "words" },
  { id: "w30", thai: "อยาก",     roman: "yàak",          en: "to want to (do something)", note: "yàak + verb: yàak gin = want to eat. For things, use ao.", category: "words" },
  { id: "w31", thai: "ต้อง",     roman: "tâwng",         en: "must / have to", note: "", category: "words" },
  { id: "w32", thai: "ช่วย",     roman: "chûai",         en: "to help", note: "Starts polite requests: chûai ... nàwy = please help me ...", category: "words" },
  { id: "w33", thai: "รอ",       roman: "raw",           en: "to wait", note: "", category: "words" },
  { id: "w34", thai: "ถาม",      roman: "thǎam",         en: "to ask", note: "", category: "words" },
  { id: "w35", thai: "บอก",      roman: "bàwk",          en: "to tell", note: "", category: "words" },
  { id: "w36", thai: "ให้",      roman: "hâi",           en: "to give / for", note: "", category: "words" },

  // Describing things
  { id: "w37", thai: "ดี",        roman: "dii",           en: "good", note: "", category: "words" },
  { id: "w38", thai: "ใหญ่",     roman: "yài",           en: "big", note: "", category: "words" },
  { id: "w39", thai: "เล็ก",     roman: "lék",           en: "small", note: "", category: "words" },
  { id: "w40", thai: "ร้อน",     roman: "ráwn",          en: "hot", note: "For weather and things. Spicy-hot is phèt.", category: "words" },
  { id: "w41", thai: "เย็น",     roman: "yen",           en: "cold / cool", note: "náam yen = cold water. Also 'evening' in tawn yen.", category: "words" },
  { id: "w42", thai: "ใหม่",     roman: "mài",           en: "new", note: "Low tone. mâi (falling) = not — tone is the whole difference.", category: "words" },
  { id: "w43", thai: "เก่า",     roman: "gào",           en: "old (things)", note: "For people use gàe. gào is for objects.", category: "words" },
  { id: "w44", thai: "สวย",      roman: "sǔai",          en: "beautiful / pretty", note: "Rising tone. Flat sûai (falling) means 'unlucky' — mind the tone!", category: "words" },
  { id: "w45", thai: "เร็ว",     roman: "reo",           en: "fast", note: "High tone in speech: reo reo! = hurry up!", category: "words" },
  { id: "w46", thai: "ช้า",      roman: "cháa",          en: "slow", note: "", category: "words" },

  // Amounts & degree
  { id: "w47", thai: "มาก",      roman: "mâak",          en: "very / a lot", note: "Goes after what it modifies: à ròi mâak = very delicious.", category: "words" },
  { id: "w48", thai: "น้อย",     roman: "náwy",          en: "few / little", note: "", category: "words" },
  { id: "w49", thai: "หมด",      roman: "mòt",           en: "all gone / used up", note: "mòt láew = all gone (the food's finished, sold out...).", category: "words" },
  { id: "w50", thai: "ทุก",      roman: "thúk",          en: "every", note: "thúk wan = every day.", category: "words" },
  { id: "w51", thai: "บาง",      roman: "baang",         en: "some", note: "", category: "words" },
  { id: "w52", thai: "อีก",      roman: "ìik",           en: "more / again", note: "ao ìik = (I) want more.", category: "words" },
  { id: "w53", thai: "ด้วย",     roman: "dûai",          en: "too / also", note: "Tacked on the end: ao náam dûai = water too, please.", category: "words" },

  // Time words
  { id: "w54", thai: "วันนี้",    roman: "wan níi",       en: "today", note: "", category: "words" },
  { id: "w55", thai: "พรุ่งนี้",   roman: "phrûng níi",    en: "tomorrow", note: "", category: "words" },
  { id: "w56", thai: "เมื่อวาน",  roman: "mêua waan",     en: "yesterday", note: "", category: "words" },
  { id: "w57", thai: "ตอนนี้",    roman: "tawn níi",      en: "now", note: "", category: "words" },
  { id: "w58", thai: "เดี๋ยว",    roman: "dǐao",          en: "in a moment / soon", note: "dǐao maa = be right back.", category: "words" },
  { id: "w59", thai: "กลางคืน",  roman: "glaang kheun",  en: "night", note: "", category: "words" },
  { id: "w60", thai: "วัน",       roman: "wan",           en: "day", note: "", category: "words" },
  { id: "w61", thai: "เวลา",     roman: "wee laa",       en: "time", note: "", category: "words" },
  { id: "w62", thai: "ปี",        roman: "pii",           en: "year", note: "", category: "words" },
  { id: "w63", thai: "ชั่วโมง",   roman: "chûa moong",    en: "hour", note: "", category: "words" },

  // Question words & connectors
  { id: "w64", thai: "อะไร",     roman: "à rai",         en: "what?", note: "Questions keep normal word order: nîi à rai = what's this?", category: "words" },
  { id: "w65", thai: "ใคร",      roman: "khrai",         en: "who?", note: "", category: "words" },
  { id: "w66", thai: "ทำไม",     roman: "tham mai",      en: "why?", note: "", category: "words" },
  { id: "w67", thai: "เมื่อไหร่",  roman: "mêua rài",      en: "when?", note: "", category: "words" },
  { id: "w68", thai: "ยังไง",     roman: "yang ngai",     en: "how?", note: "Casual form of yàang rai — this is what you'll actually hear.", category: "words" },
  { id: "w69", thai: "และ",      roman: "láe",           en: "and", note: "In casual speech people often use gàp instead.", category: "words" },
  { id: "w70", thai: "หรือ",     roman: "rěu",           en: "or", note: "", category: "words" },
  { id: "w71", thai: "แต่",      roman: "tàe",           en: "but", note: "", category: "words" },
  { id: "w72", thai: "กับ",      roman: "gàp",           en: "with / and", note: "", category: "words" },

  // Places & getting around
  { id: "w73", thai: "ที่นี่",     roman: "thîi nîi",      en: "here", note: "", category: "words" },
  { id: "w74", thai: "ที่นั่น",    roman: "thîi nân",      en: "there", note: "", category: "words" },
  { id: "w75", thai: "บ้าน",     roman: "bâan",          en: "house / home", note: "glàp bâan = go home.", category: "words" },
  { id: "w76", thai: "โรงแรม",   roman: "roong raem",    en: "hotel", note: "", category: "words" },
  { id: "w77", thai: "ร้าน",      roman: "ráan",          en: "shop / restaurant", note: "ráan aa hǎan = restaurant (food shop).", category: "words" },
  { id: "w78", thai: "ตลาด",     roman: "tà làat",       en: "market", note: "", category: "words" },
  { id: "w79", thai: "รถ",       roman: "rót",           en: "car / vehicle", note: "rót fai = train ('fire vehicle'), rót mee = bus.", category: "words" },
  { id: "w80", thai: "ถนน",      roman: "thà nǒn",       en: "road / street", note: "", category: "words" },
  { id: "w81", thai: "ซ้าย",     roman: "sáai",          en: "left", note: "", category: "words" },
  { id: "w82", thai: "ขวา",      roman: "khwǎa",         en: "right", note: "", category: "words" },

  // Food & everyday things
  { id: "w83", thai: "กาแฟ",     roman: "gaa fae",       en: "coffee", note: "", category: "words" },
  { id: "w84", thai: "ชา",       roman: "chaa",          en: "tea", note: "chaa yen = Thai iced tea, the orange one.", category: "words" },
  { id: "w85", thai: "ไก่",      roman: "gài",           en: "chicken", note: "", category: "words" },
  { id: "w86", thai: "หมู",      roman: "mǔu",           en: "pork / pig", note: "", category: "words" },
  { id: "w87", thai: "ปลา",      roman: "plaa",          en: "fish", note: "", category: "words" },
  { id: "w88", thai: "ผลไม้",    roman: "phǒn lá máai",  en: "fruit", note: "", category: "words" },
  { id: "w89", thai: "เงิน",     roman: "ngoen",         en: "money", note: "", category: "words" },
  { id: "w90", thai: "บาท",      roman: "bàat",          en: "baht (Thai currency)", note: "", category: "words" },
];
