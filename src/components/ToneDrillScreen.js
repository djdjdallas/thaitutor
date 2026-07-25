import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, space, radius, shadow, font } from "../theme";
import { speakThai } from "../lib/tts";
import { answerFeedback } from "../lib/haptics";

// The tone trainer: hear one word from a minimal-pair set, pick which it was.
// This drills the ONE thing romanization can't carry — your ear for tones —
// using word sets where tone is the entire difference in meaning (glai = far,
// glâi = near). Ten rounds, score at the end, no SRS involvement: it's a gym,
// not a test.
export default function ToneDrillScreen({ rounds, onDone }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null); // the chosen word, once answered
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const round = rounds[index];

  // The word plays on arrival — the whole exercise is ears-first.
  useEffect(() => {
    if (!finished && round) speakThai(round.answer.thai);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, finished]);

  function pick(word) {
    if (picked) return;
    const right = word.thai === round.answer.thai;
    setPicked(word);
    answerFeedback(right);
    if (right) setScore(score + 1);
  }

  function next() {
    if (index + 1 >= rounds.length) {
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setPicked(null);
  }

  if (finished) {
    return (
      <View style={s.doneWrap}>
        <View style={s.doneCard}>
          <View style={s.doneIcon}>
            <MaterialCommunityIcons name="waveform" size={28} color={colors.accentDark} />
          </View>
          <Text style={s.doneTitle}>
            {score} / {rounds.length}
          </Text>
          <Text style={s.doneSub}>
            {score === rounds.length
              ? "Perfect ear. Tones are becoming yours."
              : score >= rounds.length * 0.7
                ? "Strong. The pairs you missed are the ones worth replaying."
                : "Tones take hundreds of reps — every drill counts. Come back tomorrow."}
          </Text>
          <Pressable
            onPress={onDone}
            accessibilityRole="button"
            accessibilityLabel="Finish the tone drill"
            style={({ pressed }) => [
              s.primaryBtn,
              pressed && { backgroundColor: colors.accentDark },
            ]}
          >
            <Text style={s.primaryBtnText}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={s.wrap}>
      {/* Header: exit + progress */}
      <View style={s.header}>
        <Pressable
          onPress={onDone}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Exit the tone drill"
        >
          <Feather name="x" size={22} color={colors.textTertiary} />
        </Pressable>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${(index / rounds.length) * 100}%` }]} />
        </View>
        <Text style={s.stepCount}>
          {index + 1}/{rounds.length}
        </Text>
      </View>

      <Text style={s.prompt}>Which word did you hear?</Text>

      <Pressable
        onPress={() => speakThai(round.answer.thai)}
        accessibilityRole="button"
        accessibilityLabel="Replay the word"
        style={({ pressed }) => [s.bigReplay, pressed && { backgroundColor: colors.accentSoft }]}
      >
        <Feather name="volume-2" size={28} color={colors.accentDark} />
        <Text style={s.bigReplayText}>Tap to replay</Text>
      </Pressable>

      <View style={s.choices}>
        {round.options.map((w) => {
          const isAnswer = w.thai === round.answer.thai;
          const isPicked = picked && w.thai === picked.thai;
          return (
            <Pressable
              key={w.thai}
              onPress={() => pick(w)}
              disabled={!!picked}
              accessibilityRole="button"
              accessibilityLabel={`${w.roman}, ${w.tone} tone, ${w.en}`}
              style={({ pressed }) => [
                s.choice,
                pressed && !picked && { borderColor: colors.accentBorder },
                picked && isAnswer && s.choiceRight,
                picked && isPicked && !isAnswer && s.choiceWrong,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={s.choiceThai}>{w.thai}</Text>
                <Text style={s.choiceRoman}>
                  {w.roman} · {w.en}
                </Text>
              </View>
              <Text style={s.toneTag}>{w.tone}</Text>
            </Pressable>
          );
        })}
      </View>

      {picked && (
        <Pressable
          onPress={next}
          accessibilityRole="button"
          accessibilityLabel="Next word"
          style={({ pressed }) => [s.primaryBtn, pressed && { backgroundColor: colors.accentDark }]}
        >
          <Text style={s.primaryBtnText}>{index + 1 >= rounds.length ? "See score" : "Next"}</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },

  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: space.md },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f0f0ef",
    overflow: "hidden",
  },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: colors.accent },
  stepCount: { fontSize: font.tiny, color: colors.textTertiary, minWidth: 36, textAlign: "right" },

  prompt: { fontSize: font.h2, fontWeight: "600", color: colors.textPrimary, marginBottom: 12 },

  bigReplay: {
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: 24,
    marginBottom: space.md,
    ...shadow.sm,
  },
  bigReplayText: { fontSize: font.small, fontWeight: "500", color: colors.accentDark },

  choices: { gap: 8, flex: 1 },
  choice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  choiceRight: { borderColor: colors.success, backgroundColor: colors.successSoft },
  choiceWrong: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  choiceThai: { fontSize: 24, fontWeight: "500", color: colors.textPrimary },
  choiceRoman: { fontSize: font.small, color: colors.textTertiary, marginTop: 2 },
  toneTag: {
    fontSize: font.tiny,
    fontWeight: "600",
    color: colors.textSecondary,
    backgroundColor: "#f5f5f4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    overflow: "hidden",
  },

  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    ...shadow.sm,
  },
  primaryBtnText: { fontSize: font.body, fontWeight: "600", color: "#fff" },

  doneWrap: { flex: 1, padding: 20, justifyContent: "center" },
  doneCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 32,
    alignItems: "center",
    ...shadow.sm,
  },
  doneIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  doneTitle: { fontSize: 32, fontWeight: "700", color: colors.textPrimary },
  doneSub: {
    fontSize: font.small,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
});
