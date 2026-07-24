// Tone minimal-pair sets: words that differ ONLY (or almost only) by tone.
// This is the hardest — and most Thai — listening skill there is, and it's
// exactly what romanization can't teach. Each set is drilled by ear: hear one
// word, pick which it was.
//
// These are the classic textbook sets, chosen because every member is a real,
// common word (several already live in the main deck). Tones follow the same
// marks as everywhere else: mid unmarked · low à · falling â · high á · rising ǎ.
//
// prettier-ignore: one word per line so each set reads as a table.
// prettier-ignore
export const TONE_SETS = [
  {
    id: "maa",
    words: [
      { thai: "มา",   roman: "maa",   tone: "mid",     en: "come" },
      { thai: "หมา",  roman: "mǎa",   tone: "rising",  en: "dog" },
      { thai: "ม้า",   roman: "máa",   tone: "high",    en: "horse" },
    ],
  },
  {
    id: "mai",
    words: [
      { thai: "ใหม่",  roman: "mài",   tone: "low",     en: "new" },
      { thai: "ไม่",   roman: "mâi",   tone: "falling", en: "not" },
      { thai: "ไม้",   roman: "máai",  tone: "high",    en: "wood" },
    ],
  },
  {
    id: "glai",
    words: [
      { thai: "ไกล",  roman: "glai",  tone: "mid",     en: "far" },
      { thai: "ใกล้",  roman: "glâi",  tone: "falling", en: "near" },
    ],
  },
  {
    id: "khaao",
    words: [
      { thai: "ข้าว",  roman: "khâao", tone: "falling", en: "rice" },
      { thai: "ข่าว",  roman: "khàao", tone: "low",     en: "news" },
      { thai: "ขาว",  roman: "khǎao", tone: "rising",  en: "white" },
    ],
  },
  {
    id: "seua",
    words: [
      { thai: "เสือ",  roman: "sěua",  tone: "rising",  en: "tiger" },
      { thai: "เสื้อ",  roman: "sêua",  tone: "falling", en: "shirt" },
      { thai: "เสื่อ",  roman: "sèua",  tone: "low",     en: "mat" },
    ],
  },
  {
    id: "suai",
    words: [
      { thai: "สวย",  roman: "sǔai",  tone: "rising",  en: "beautiful" },
      { thai: "ซวย",  roman: "suai",  tone: "mid",     en: "unlucky" },
    ],
  },
  {
    id: "khai",
    words: [
      { thai: "ไข่",   roman: "khài",  tone: "low",     en: "egg" },
      { thai: "ไข้",   roman: "khâi",  tone: "falling", en: "fever" },
    ],
  },
];
