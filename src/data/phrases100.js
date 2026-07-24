// "Top 100 Phrases" pack — everyday ready-to-say sentences, grouped by
// situation. As with the words pack, the lessons mix these with the starter
// phrases they overlap with (ไม่เป็นไร, ไม่เผ็ด, สบายดีไหม...), so the pack is a
// true top-100 without duplicate cards.
//
// Romanization conventions match seedDeck.js / words100.js. Where a phrase has
// an open slot (your name, your country) the Thai shows "…" but the roman stays
// clean so the tile exercise splits into speakable syllables only.
//
// prettier-ignore: one card per line so the deck stays scannable and diffable.
// prettier-ignore
export const PHRASES_100 = [
  // Meeting people
  { id: "p1",  thai: "คุณชื่ออะไร",        roman: "khun chêu à rai",             en: "what's your name?", note: "", category: "phrases" },
  { id: "p2",  thai: "ผมชื่อ…",           roman: "phǒm chêu",                   en: "my name is… (male speaker)", note: "Follow with your name.", category: "phrases" },
  { id: "p3",  thai: "ฉันชื่อ…",           roman: "chǎn chêu",                   en: "my name is… (female speaker)", note: "Follow with your name.", category: "phrases" },
  { id: "p4",  thai: "ยินดีที่ได้รู้จัก",      roman: "yin dii thîi dâai rúu jàk",   en: "nice to meet you", note: "", category: "phrases" },
  { id: "p5",  thai: "คุณมาจากไหน",       roman: "khun maa jàak nǎi",           en: "where are you from?", note: "", category: "phrases" },
  { id: "p6",  thai: "ผมมาจากอเมริกา",    roman: "phǒm maa jàak à mee rí gaa",  en: "I'm from America", note: "Swap in your country: ang grìt = England, yîi pùn = Japan.", category: "phrases" },
  { id: "p7",  thai: "แล้วคุณล่ะ",         roman: "láew khun lâ",                en: "and you?", note: "Bounce any question back: sà baai dii mǎi? ... láew khun lâ?", category: "phrases" },
  { id: "p8",  thai: "เจอกันใหม่",         roman: "joe gan mài",                 en: "see you again / see you later", note: "", category: "phrases" },
  { id: "p9",  thai: "โชคดี",             roman: "chôok dii",                   en: "good luck / take care", note: "A warm way to say goodbye.", category: "phrases" },

  // Politeness & basics
  { id: "p10", thai: "ขอบคุณมาก",         roman: "khàwp khun mâak",             en: "thank you very much", note: "", category: "phrases" },
  { id: "p11", thai: "ด้วยความยินดี",      roman: "dûai khwaam yin dii",         en: "you're welcome / with pleasure", note: "", category: "phrases" },
  { id: "p12", thai: "ขอทางหน่อย",        roman: "khǎw thaang nàwy",            en: "excuse me (let me through)", note: "For squeezing past people. For apologies use khǎw thôot.", category: "phrases" },
  { id: "p13", thai: "ไม่รู้",              roman: "mâi rúu",                     en: "(I) don't know", note: "", category: "phrases" },
  { id: "p14", thai: "ไม่แน่ใจ",           roman: "mâi nâe jai",                 en: "(I'm) not sure", note: "", category: "phrases" },
  { id: "p15", thai: "แน่นอน",            roman: "nâe nawn",                    en: "of course / certainly", note: "", category: "phrases" },
  { id: "p16", thai: "ได้เลย",            roman: "dâai loei",                   en: "sure, go ahead", note: "", category: "phrases" },
  { id: "p17", thai: "ไม่ได้",             roman: "mâi dâai",                    en: "cannot / not allowed", note: "", category: "phrases" },
  { id: "p18", thai: "เดี๋ยวก่อน",          roman: "dǐao gàwn",                   en: "wait a moment / hold on", note: "", category: "phrases" },

  // Language & understanding
  { id: "p19", thai: "คุณพูดภาษาอังกฤษได้ไหม", roman: "khun phûut phaa sǎa ang grìt dâai mǎi", en: "do you speak English?", note: "", category: "phrases" },
  { id: "p20", thai: "ผมพูดไทยไม่เก่ง",     roman: "phǒm phûut thai mâi gèng",    en: "my Thai isn't good", note: "Instantly earns goodwill — and slower, clearer Thai.", category: "phrases" },
  { id: "p21", thai: "พูดอีกครั้งได้ไหม",    roman: "phûut ìik khráng dâai mǎi",   en: "can you say that again?", note: "", category: "phrases" },
  { id: "p22", thai: "อันนี้เรียกว่าอะไร",    roman: "an níi rîak wâa à rai",       en: "what is this called?", note: "Point at anything and grow your vocab on the spot.", category: "phrases" },
  { id: "p23", thai: "แปลว่าอะไร",         roman: "plae wâa à rai",              en: "what does it mean?", note: "", category: "phrases" },
  { id: "p24", thai: "เขียนให้หน่อยได้ไหม",  roman: "khǐan hâi nàwy dâai mǎi",     en: "can you write it down for me?", note: "", category: "phrases" },
  { id: "p25", thai: "ผมกำลังเรียนภาษาไทย", roman: "phǒm gam lang rian phaa sǎa thai", en: "I'm learning Thai", note: "gam lang + verb = currently doing.", category: "phrases" },
  { id: "p26", thai: "เข้าใจแล้ว",          roman: "khâo jai láew",               en: "got it / now I understand", note: "láew marks a change of state — 'now'.", category: "phrases" },

  // At the restaurant
  { id: "p27", thai: "ขอเมนูหน่อย",        roman: "khǎw mee nuu nàwy",           en: "menu, please", note: "khǎw ... nàwy is THE polite request frame. Reuse it endlessly.", category: "phrases" },
  { id: "p28", thai: "เอาอันนี้",           roman: "ao an níi",                   en: "I'll take this one", note: "Point and say it. Works everywhere.", category: "phrases" },
  { id: "p29", thai: "ขอน้ำเปล่า",         roman: "khǎw náam plào",              en: "plain water, please", note: "", category: "phrases" },
  { id: "p30", thai: "อร่อยมาก",           roman: "à ròi mâak",                  en: "very delicious", note: "Cooks light up when you say this.", category: "phrases" },
  { id: "p31", thai: "เช็คบิล",            roman: "chék bin",                    en: "check, please", note: "Or gèp ngoen nàwy at street stalls.", category: "phrases" },
  { id: "p32", thai: "ขออีกหน่อย",         roman: "khǎw ìik nàwy",               en: "a little more, please", note: "", category: "phrases" },
  { id: "p33", thai: "ไม่ใส่พริก",          roman: "mâi sài phrík",               en: "no chili, please", note: "sài = to put in. mâi sài X = don't add X.", category: "phrases" },
  { id: "p34", thai: "อิ่มแล้ว",            roman: "ìm láew",                     en: "I'm full", note: "", category: "phrases" },
  { id: "p35", thai: "กินเจ",             roman: "gin jee",                     en: "(I) eat vegetarian/vegan", note: "Strictly 'jay' Buddhist vegan; commonly understood as vegetarian.", category: "phrases" },

  // Shopping
  { id: "p36", thai: "อันนี้เท่าไหร่",       roman: "an níi thâo rài",             en: "how much is this one?", note: "", category: "phrases" },
  { id: "p37", thai: "ลดได้ไหม",           roman: "lót dâai mǎi",                en: "can you lower the price?", note: "Smile when you haggle — it's a game, not a fight.", category: "phrases" },
  { id: "p38", thai: "แพงไป",             roman: "phaeng pai",                  en: "too expensive", note: "pai after an adjective = 'too ...'.", category: "phrases" },
  { id: "p39", thai: "ขอดูหน่อย",          roman: "khǎw duu nàwy",               en: "can I take a look?", note: "", category: "phrases" },
  { id: "p40", thai: "มีสีอื่นไหม",         roman: "mii sǐi èun mǎi",             en: "do you have another color?", note: "mii ... mǎi = do you have ...?", category: "phrases" },
  { id: "p41", thai: "มีใหญ่กว่านี้ไหม",     roman: "mii yài gwàa níi mǎi",        en: "do you have a bigger one?", note: "gwàa = more than; yài gwàa níi = bigger than this.", category: "phrases" },
  { id: "p42", thai: "รับบัตรไหม",         roman: "ráp bàt mǎi",                 en: "do you take cards?", note: "", category: "phrases" },
  { id: "p43", thai: "แค่ดูเฉยๆ",          roman: "khâe duu chǒei chǒei",        en: "just looking", note: "", category: "phrases" },
  { id: "p44", thai: "ถูกมาก",            roman: "thùuk mâak",                  en: "very cheap", note: "thùuk also means 'correct' — context does the work.", category: "phrases" },

  // Taxi & directions
  { id: "p45", thai: "ไปสนามบิน",         roman: "pai sà nǎam bin",             en: "to the airport, please", note: "pai + place is all a taxi needs.", category: "phrases" },
  { id: "p46", thai: "เลี้ยวซ้าย",          roman: "líao sáai",                   en: "turn left", note: "", category: "phrases" },
  { id: "p47", thai: "เลี้ยวขวา",          roman: "líao khwǎa",                  en: "turn right", note: "", category: "phrases" },
  { id: "p48", thai: "ตรงไป",             roman: "trong pai",                   en: "go straight", note: "", category: "phrases" },
  { id: "p49", thai: "จอดที่นี่",           roman: "jàwt thîi nîi",               en: "stop here", note: "", category: "phrases" },
  { id: "p50", thai: "ไกลไหม",            roman: "glai mǎi",                    en: "is it far?", note: "glai (mid) = far, glâi (falling) = near. Pure tone difference!", category: "phrases" },
  { id: "p51", thai: "ใกล้ๆ",             roman: "glâi glâi",                   en: "nearby / very close", note: "", category: "phrases" },
  { id: "p52", thai: "อยู่ที่ไหน",          roman: "yùu thîi nǎi",                en: "where is (it)?", note: "Name the thing first: hâwng náam yùu thîi nǎi?", category: "phrases" },
  { id: "p53", thai: "ถึงแล้ว",            roman: "thěung láew",                 en: "we've arrived", note: "", category: "phrases" },
  { id: "p54", thai: "ห้องน้ำอยู่ไหน",      roman: "hâwng náam yùu nǎi",          en: "where's the bathroom?", note: "", category: "phrases" },

  // Small talk
  { id: "p55", thai: "คุณทำงานอะไร",      roman: "khun tham ngaan à rai",       en: "what do you do (for work)?", note: "", category: "phrases" },
  { id: "p56", thai: "ผมเป็นนักท่องเที่ยว",  roman: "phǒm pen nák thâwng thîao",   en: "I'm a tourist", note: "nák + verb = person who does it: nák rian = student.", category: "phrases" },
  { id: "p57", thai: "มาเมืองไทยครั้งแรก",  roman: "maa meuang thai khráng râek", en: "(it's my) first time in Thailand", note: "", category: "phrases" },
  { id: "p58", thai: "ชอบเมืองไทยมาก",    roman: "châwp meuang thai mâak",      en: "I love Thailand", note: "The single best small-talk line you can own.", category: "phrases" },
  { id: "p59", thai: "อากาศร้อนมาก",      roman: "aa gàat ráwn mâak",           en: "the weather is so hot", note: "Thailand's universal conversation starter.", category: "phrases" },
  { id: "p60", thai: "คุณอายุเท่าไหร่",     roman: "khun aa yú thâo rài",         en: "how old are you?", note: "Normal small talk in Thailand, not rude.", category: "phrases" },
  { id: "p61", thai: "แต่งงานหรือยัง",      roman: "tàeng ngaan rěu yang",        en: "are you married (yet)?", note: "Also standard small talk — expect to hear it.", category: "phrases" },
  { id: "p62", thai: "มีแฟนไหม",          roman: "mii faen mǎi",                en: "do you have a boyfriend/girlfriend?", note: "faen covers both — borrowed from English 'fan'.", category: "phrases" },
  { id: "p63", thai: "สนุกมาก",           roman: "sà nùk mâak",                 en: "so much fun", note: "sà nùk — having fun — is a core Thai value.", category: "phrases" },
  { id: "p64", thai: "เหนื่อยมาก",         roman: "nèuai mâak",                  en: "(I'm) very tired", note: "", category: "phrases" },

  // Time & plans
  { id: "p65", thai: "กี่โมงแล้ว",          roman: "gìi moong láew",              en: "what time is it?", note: "", category: "phrases" },
  { id: "p66", thai: "เจอกันพรุ่งนี้",       roman: "joe gan phrûng níi",          en: "see you tomorrow", note: "", category: "phrases" },
  { id: "p67", thai: "ไปกันเถอะ",         roman: "pai gan thòe",                en: "let's go", note: "", category: "phrases" },
  { id: "p68", thai: "เดี๋ยวมา",           roman: "dǐao maa",                    en: "be right back", note: "", category: "phrases" },
  { id: "p69", thai: "รอสักครู่",           roman: "raw sàk khrûu",               en: "one moment, please", note: "The polite version you'll hear from staff constantly.", category: "phrases" },
  { id: "p70", thai: "ขอโทษที่มาสาย",     roman: "khǎw thôot thîi maa sǎai",    en: "sorry I'm late", note: "", category: "phrases" },
  { id: "p71", thai: "ว่างไหม",            roman: "wâang mǎi",                   en: "are you free?", note: "", category: "phrases" },
  { id: "p72", thai: "ไม่ว่าง",            roman: "mâi wâang",                   en: "(I'm) busy / not free", note: "", category: "phrases" },
  { id: "p73", thai: "อีกห้านาที",          roman: "ìik hâa naa thii",            en: "five more minutes", note: "", category: "phrases" },
  { id: "p74", thai: "วันนี้วันอะไร",        roman: "wan níi wan à rai",           en: "what day is it today?", note: "", category: "phrases" },

  // Help & emergencies
  { id: "p75", thai: "ช่วยด้วย",           roman: "chûai dûai",                  en: "help!", note: "The emergency shout. Learn it and hope you never need it.", category: "phrases" },
  { id: "p76", thai: "ช่วยหน่อยได้ไหม",     roman: "chûai nàwy dâai mǎi",         en: "can you help me?", note: "The calm, everyday version of asking for help.", category: "phrases" },
  { id: "p77", thai: "โทรเรียกตำรวจ",      roman: "thoo rîak tam rùat",          en: "call the police", note: "", category: "phrases" },
  { id: "p78", thai: "ไปโรงพยาบาล",       roman: "pai roong phá yaa baan",      en: "to the hospital", note: "", category: "phrases" },
  { id: "p79", thai: "ผมหลงทาง",          roman: "phǒm lǒng thaang",            en: "I'm lost", note: "", category: "phrases" },
  { id: "p80", thai: "ไม่สบาย",           roman: "mâi sà baai",                 en: "(I'm) sick / unwell", note: "Literally 'not well' — the everyday way to say you're ill.", category: "phrases" },
  { id: "p81", thai: "ปวดหัว",            roman: "pùat hǔa",                    en: "headache", note: "pùat + body part = it hurts.", category: "phrases" },
  { id: "p82", thai: "ปวดท้อง",           roman: "pùat tháwng",                 en: "stomachache", note: "", category: "phrases" },
  { id: "p83", thai: "ระวัง",             roman: "rá wang",                     en: "watch out! / be careful", note: "", category: "phrases" },
  { id: "p84", thai: "กระเป๋าหาย",         roman: "grà pǎo hǎai",                en: "my bag is lost", note: "hǎai = lost/disappeared. Works for anything: passport = náng sěu doen thaang.", category: "phrases" },

  // Feelings & reactions
  { id: "p85", thai: "ดีมาก",             roman: "dii mâak",                    en: "very good", note: "", category: "phrases" },
  { id: "p86", thai: "เยี่ยมมาก",          roman: "yîam mâak",                   en: "excellent!", note: "", category: "phrases" },
  { id: "p87", thai: "ไม่ชอบ",            roman: "mâi châwp",                   en: "(I) don't like it", note: "", category: "phrases" },
  { id: "p88", thai: "ชอบมาก",           roman: "châwp mâak",                  en: "(I) love it", note: "", category: "phrases" },
  { id: "p89", thai: "ดีใจมาก",           roman: "dii jai mâak",                en: "(I'm) so happy", note: "dii jai — literally 'good heart'.", category: "phrases" },
  { id: "p90", thai: "เสียใจด้วย",         roman: "sǐa jai dûai",                en: "(I'm) sorry to hear that", note: "sǐa jai — 'broken heart' — for sympathy, not apologies.", category: "phrases" },
  { id: "p91", thai: "สุดยอด",            roman: "sùt yâwt",                    en: "awesome! / the best", note: "", category: "phrases" },
  { id: "p92", thai: "น่ารัก",             roman: "nâa rák",                     en: "cute", note: "nâa + verb = worth doing: nâa gin = looks tasty.", category: "phrases" },
  { id: "p93", thai: "สวยมาก",            roman: "sǔai mâak",                   en: "very beautiful", note: "", category: "phrases" },
  { id: "p94", thai: "โอเค",              roman: "oo khee",                     en: "okay", note: "Yes, it's just 'OK' — fully adopted into Thai.", category: "phrases" },
];
