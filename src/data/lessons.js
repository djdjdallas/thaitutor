// The Learn path: units -> lessons -> card ids.
//
// Lessons reference cards by id, so a lesson can freely mix pack cards with
// starter-deck cards. That's how the two "Top 100" packs stay honest: where a
// top-100 entry already exists in the starter deck (ไป, กิน, ไม่เผ็ด...), the
// lesson points at the existing card instead of duplicating it. Tests enforce
// that both packs cover exactly 100 unique cards.
//
// Completing a lesson unlocks its cards into the SRS review deck. Lessons
// unlock sequentially within a unit; units are always open, so learners can
// jump to the topic they need today.

export const UNITS = [
  {
    id: "greetings",
    title: "Greetings",
    subtitle: "Hello, thanks, and being polite",
    icon: "smile",
    lessons: [
      { id: "gr1", title: "First words", cardIds: ["g1", "g2", "g3", "g4", "g5"] },
      { id: "gr2", title: "How are you?", cardIds: ["g6", "g7", "g8", "g9", "g10"] },
    ],
  },
  {
    id: "essentials",
    title: "Essentials",
    subtitle: "Yes, no, and 'no worries'",
    icon: "star",
    lessons: [
      { id: "es1", title: "The essentials", cardIds: ["y1", "y2", "y3", "y4", "y5", "y6"] },
    ],
  },
  {
    id: "food",
    title: "Food",
    subtitle: "Eat well, order bravely",
    icon: "coffee",
    lessons: [
      {
        id: "fd1",
        title: "Street-food survival",
        cardIds: ["f1", "f2", "f3", "f4", "f5", "f6", "f7"],
      },
    ],
  },
  {
    id: "survival",
    title: "Survival",
    subtitle: "Ask, want, and find the bathroom",
    icon: "compass",
    lessons: [
      { id: "sv1", title: "Getting things", cardIds: ["s1", "s2", "s3", "s4", "s5"] },
      { id: "sv2", title: "Wanting things", cardIds: ["s6", "s7", "s8", "s9"] },
    ],
  },
  {
    id: "numbers",
    title: "Numbers",
    subtitle: "One through ten",
    icon: "hash",
    lessons: [
      { id: "nm1", title: "One to five", cardIds: ["n1", "n2", "n3", "n4", "n5"] },
      { id: "nm2", title: "Six to ten", cardIds: ["n6", "n7", "n8", "n9", "n10"] },
    ],
  },
  {
    id: "words100",
    title: "Top 100 Words",
    subtitle: "The words you'll hear every single day",
    icon: "book",
    lessons: [
      {
        id: "wl1",
        title: "People & pronouns",
        cardIds: ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9", "w10"],
      },
      {
        id: "wl2",
        title: "Core verbs I",
        cardIds: ["w11", "w12", "w13", "w14", "w15", "w16", "s5", "w17", "w18", "w19"],
      },
      {
        id: "wl3",
        title: "Core verbs II",
        cardIds: ["f3", "w20", "w21", "w22", "w23", "w24", "w25", "w26", "w27", "w28"],
      },
      {
        id: "wl4",
        title: "Wants & requests",
        cardIds: ["w29", "w30", "w31", "w32", "w33", "w34", "w35", "w36", "s6", "s8"],
      },
      {
        id: "wl5",
        title: "Describing things",
        cardIds: ["w37", "w38", "w39", "w40", "w41", "w42", "w43", "w44", "w45", "w46"],
      },
      {
        id: "wl6",
        title: "Amounts & degree",
        cardIds: ["w47", "w48", "s9", "w49", "w50", "w51", "w52", "w53", "s1", "s2"],
      },
      {
        id: "wl7",
        title: "Time words",
        cardIds: ["w54", "w55", "w56", "w57", "w58", "w59", "w60", "w61", "w62", "w63"],
      },
      {
        id: "wl8",
        title: "Questions & connectors",
        cardIds: ["w64", "w65", "w66", "w67", "w68", "s3", "w69", "w70", "w71", "w72"],
      },
      {
        id: "wl9",
        title: "Places & getting around",
        cardIds: ["w73", "w74", "w75", "w76", "w77", "w78", "w79", "w80", "w81", "w82"],
      },
      {
        id: "wl10",
        title: "Food & everyday things",
        cardIds: ["f1", "f2", "w83", "w84", "w85", "w86", "w87", "w88", "w89", "w90"],
      },
    ],
  },
  {
    id: "phrases100",
    title: "Top 100 Phrases",
    subtitle: "Ready-to-say sentences for real situations",
    icon: "message-circle",
    lessons: [
      {
        id: "pl1",
        title: "Meeting people",
        cardIds: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "g6", "p8", "p9"],
      },
      {
        id: "pl2",
        title: "Politeness & basics",
        cardIds: ["p10", "p11", "y3", "p12", "p13", "p14", "p15", "p16", "p17", "p18"],
      },
      {
        id: "pl3",
        title: "Language & understanding",
        cardIds: ["p19", "p20", "y5", "y6", "p21", "p22", "p23", "p24", "p25", "p26"],
      },
      {
        id: "pl4",
        title: "At the restaurant",
        cardIds: ["p27", "p28", "f7", "p29", "p30", "p31", "p32", "p33", "p34", "p35"],
      },
      {
        id: "pl5",
        title: "Shopping",
        cardIds: ["p36", "p37", "p38", "p39", "p40", "p41", "p42", "p43", "p44", "s7"],
      },
      {
        id: "pl6",
        title: "Taxi & directions",
        cardIds: ["p45", "p46", "p47", "p48", "p49", "p50", "p51", "p52", "p53", "p54"],
      },
      {
        id: "pl7",
        title: "Small talk",
        cardIds: ["p55", "p56", "p57", "p58", "p59", "p60", "p61", "p62", "p63", "p64"],
      },
      {
        id: "pl8",
        title: "Time & plans",
        cardIds: ["p65", "p66", "p67", "p68", "p69", "p70", "p71", "p72", "p73", "p74"],
      },
      {
        id: "pl9",
        title: "Help & emergencies",
        cardIds: ["p75", "p76", "p77", "p78", "p79", "p80", "p81", "p82", "p83", "p84"],
      },
      {
        id: "pl10",
        title: "Feelings & reactions",
        cardIds: ["p85", "p86", "p87", "p88", "p89", "p90", "p91", "p92", "p93", "p94"],
      },
    ],
  },
  {
    id: "speaklikethai",
    title: "Speak Like a Thai",
    subtitle: "Particles, slang, and street Thai textbooks skip",
    icon: "mic",
    lessons: [
      {
        id: "stl1",
        title: "Magic particles",
        cardIds: ["st1", "st2", "st3", "st4", "st5", "st6", "st7"],
      },
      {
        id: "stl2",
        title: "Street contractions",
        cardIds: ["st8", "st9", "st10", "st11", "st12", "st13", "st14"],
      },
      {
        id: "stl3",
        title: "Slang & reactions",
        cardIds: ["st15", "st16", "st17", "st18", "st19", "st20", "st21"],
      },
      {
        id: "stl4",
        title: "Everyday street lines",
        cardIds: ["st22", "st23", "st24", "st25", "st26", "st27"],
      },
    ],
  },
  {
    id: "dating",
    title: "Dating",
    subtitle: "Compliments, dates, and sweet talk (for him)",
    icon: "heart",
    lessons: [
      {
        id: "dtl1",
        title: "Breaking the ice",
        cardIds: ["dt1", "dt2", "dt3", "dt4", "dt5", "dt6"],
      },
      {
        id: "dtl2",
        title: "Asking her out",
        cardIds: ["p71", "dt7", "dt8", "dt9", "dt10", "dt11", "dt12"],
      },
      {
        id: "dtl3",
        title: "Sweet talk",
        cardIds: ["dt13", "dt14", "dt15", "dt16", "dt17", "dt18", "dt19"],
      },
    ],
  },
];

// Flat list of every lesson, in path order, for sequencing and lookups.
export const ALL_LESSONS = UNITS.flatMap((u) => u.lessons);
