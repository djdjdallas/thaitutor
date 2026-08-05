// "Speak Like a Thai" pack — the colloquial layer textbooks skip: the final
// particles that make sentences sound warm instead of robotic, the street
// contractions everyone actually says, and the slang/reactions you'll hear in
// every Thai conversation. Inspired by the "speak like a native" genre of
// Thai-teaching YouTube lessons.
//
// Romanization conventions match seedDeck.js / words100.js / phrases100.js.
//
// prettier-ignore: one card per line so the deck stays scannable and diffable.
// prettier-ignore
export const SPEAK_LIKE_THAI = [
  // Magic particles
  { id: "st1",  thai: "นะ",           roman: "ná",                  en: "(softener) okay? / you know", note: "Tack onto anything to sound warm: khàwp khun ná.", category: "casual" },
  { id: "st2",  thai: "สิ",           roman: "sì",                  en: "(urging) go on! / of course", note: "gin sì = eat up! Friendly push, not bossy.", category: "casual" },
  { id: "st3",  thai: "เลย",          roman: "loei",                en: "(emphasis) totally / right away", note: "à ròi mâak loei = SO delicious. Cranks anything up.", category: "casual" },
  { id: "st4",  thai: "จ้า",          roman: "jâa",                 en: "(friendly particle) yeah~ / sure~", note: "Sweet, casual stand-in for khráp/khâ between friends.", category: "casual" },
  { id: "st5",  thai: "อ่ะ",          roman: "à",                   en: "(casual particle) ...though / ...eh", note: "Ends half of all street sentences: ao à = I'll take it.", category: "casual" },
  { id: "st6",  thai: "มั้ง",          roman: "máng",                en: "probably / I guess", note: "châi máng = yeah... probably? Instant native flavor.", category: "casual" },
  { id: "st7",  thai: "หรอ",          roman: "rǎw",                 en: "oh really? / huh?", note: "jing rǎw = seriously?! The everyday surprised follow-up.", category: "casual" },

  // Street contractions
  { id: "st8",  thai: "ยังไง",         roman: "yang ngai",           en: "how? / in what way? (casual)", note: "Street version of textbook yàang rai — nobody says the long form.", category: "casual" },
  { id: "st9",  thai: "ป่ะ",          roman: "pà",                  en: "...or not? (casual question tag)", note: "Chopped from rěu plào: pai pà = wanna go?", category: "casual" },
  { id: "st10", thai: "ใช่ป่ะ",        roman: "châi pà",             en: "right? / am I right?", note: "", category: "casual" },
  { id: "st11", thai: "ไปไหนมา",      roman: "pai nǎi maa",         en: "where've you been?", note: "A greeting, not an interrogation — any casual answer works.", category: "casual" },
  { id: "st12", thai: "กินข้าวยัง",     roman: "gin khâao yang",      en: "eaten yet?", note: "The real Thai 'how are you' between friends.", category: "casual" },
  { id: "st13", thai: "เดี๋ยวนะ",       roman: "dǐao ná",             en: "hold on a sec", note: "", category: "casual" },
  { id: "st14", thai: "ไม่อะ",         roman: "mâi à",               en: "nah", note: "Casual 'no thanks' — soft because of the à.", category: "casual" },

  // Slang & reactions
  { id: "st15", thai: "555",          roman: "hâa hâa hâa",         en: "hahaha (Thai 'lol')", note: "5 is hâa, so texting 555 = hahaha.", category: "casual" },
  { id: "st16", thai: "เจ๋ง",          roman: "jěng",                en: "awesome / cool", note: "", category: "casual" },
  { id: "st17", thai: "แซ่บ",          roman: "sâep",                en: "deliciously spicy / hot (slang)", note: "Isaan slang — works for food and for a hot look: sâep mâak!", category: "casual" },
  { id: "st18", thai: "ชิวชิว",        roman: "chiu chiu",           en: "chill / easygoing", note: "Borrowed from English 'chill'. wan níi chiu chiu = taking it easy today.", category: "casual" },
  { id: "st19", thai: "จริงดิ",        roman: "jing dì",             en: "seriously?! / for real?", note: "", category: "casual" },
  { id: "st20", thai: "โอ้โห",         roman: "ôo hǒo",              en: "whoa! / wow!", note: "", category: "casual" },
  { id: "st21", thai: "เว่อร์",         roman: "wôe",                 en: "over the top / extra", note: "From English 'over': wôe à = you're so extra.", category: "casual" },

  // Everyday street lines
  { id: "st22", thai: "ตามใจ",        roman: "taam jai",            en: "up to you / as you like", note: "Literally 'follow (your) heart'.", category: "casual" },
  { id: "st23", thai: "แล้วแต่",        roman: "láew tàe",            en: "whatever works / it depends", note: "láew tàe khun = it's up to you.", category: "casual" },
  { id: "st24", thai: "เอาจริง",       roman: "ao jing",             en: "for real / no joke", note: "ao jing rǎw = wait, seriously?", category: "casual" },
  { id: "st25", thai: "สู้ๆ",           roman: "sûu sûu",             en: "you got this! / keep fighting!", note: "The all-purpose Thai cheer — literally 'fight fight'.", category: "casual" },
  { id: "st26", thai: "ไม่ไหวแล้ว",    roman: "mâi wǎi láew",        en: "I can't anymore", note: "Exhausted, stuffed full, or laughing too hard — all covered.", category: "casual" },
  { id: "st27", thai: "เป็นไงบ้าง",     roman: "pen ngai bâang",      en: "how's it going? (casual)", note: "Street version of sà baai dii mǎi.", category: "casual" },
];
