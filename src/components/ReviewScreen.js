import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, space, radius, shadow, font } from "../theme";
import { speakThai } from "../lib/tts";

// `queue` is the list of due cards for this session, passed in from App.
// We track only the position + reveal state locally; grading bubbles up.
export default function ReviewScreen({ queue, sessionDone, dueCount, onGrade, onStart, onReplayDone }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  // Empty / start / finished state.
  if (!queue || queue.length === 0 || sessionDone) {
    return (
      <View style={s.centerWrap}>
        <View style={s.emptyCard}>
          <View style={s.emptyIcon}>
            <Feather name={sessionDone ? "check" : "book-open"} size={24} color={colors.accent} />
          </View>
          <Text style={s.emptyTitle}>
            {sessionDone ? "Session complete" : dueCount > 0 ? "Ready to review" : "Nothing due"}
          </Text>
          <Text style={s.emptySub}>
            {sessionDone
              ? "Nice. Cards you knew moved up a box and will come back later."
              : dueCount > 0
              ? `${dueCount} cards waiting.`
              : "Come back tomorrow for your next batch."}
          </Text>
          {dueCount > 0 && (
            <Pressable
              onPress={() => { setIndex(0); setRevealed(false); onStart(); }}
              style={({ pressed }) => [s.primaryBtn, pressed && { backgroundColor: colors.accentDark }]}
            >
              <Feather name="rotate-ccw" size={16} color="#fff" />
              <Text style={s.primaryBtnText}>{sessionDone ? "Review again" : "Start review"}</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  const card = queue[index];

  function handleGrade(correct) {
    onGrade(card, correct);
    if (index + 1 >= queue.length) {
      onReplayDone(); // signals App to mark the session finished + vocab block done
    } else {
      setIndex(index + 1);
      setRevealed(false);
    }
  }

  return (
    <View style={s.wrap}>
      {/* Progress + box indicator */}
      <View style={s.progressRow}>
        <Text style={s.muted}>{index + 1} / {queue.length}</Text>
        <View style={s.boxRow}>
          <Text style={s.muted}>box {card.box}</Text>
          <View style={s.dots}>
            {[1, 2, 3, 4, 5].map((n) => (
              <View key={n} style={[s.dot, n <= card.box ? s.dotOn : s.dotOff]} />
            ))}
          </View>
        </View>
      </View>

      {/* Card (tap to reveal) */}
      <Pressable style={s.card} onPress={() => setRevealed(true)}>
        <Text style={s.thai}>{card.thai}</Text>

        <Pressable
          onPress={(e) => { e.stopPropagation?.(); speakThai(card.thai); }}
          style={s.speakBtn}
          hitSlop={10}
        >
          <Feather name="volume-2" size={18} color={colors.textTertiary} />
          <Text style={s.roman}>{card.roman}</Text>
        </Pressable>

        {revealed ? (
          <View style={s.answer}>
            <Text style={s.en}>{card.en}</Text>
            {!!card.note && <Text style={s.note}>{card.note}</Text>}
          </View>
        ) : (
          <Text style={s.tapHint}>Tap to reveal</Text>
        )}
      </Pressable>

      {/* Grading */}
      {revealed ? (
        <View style={s.gradeRow}>
          <Pressable onPress={() => handleGrade(false)} style={({ pressed }) => [s.missBtn, pressed && { backgroundColor: "#f5f5f4" }]}>
            <Text style={s.missText}>Missed it</Text>
          </Pressable>
          <Pressable onPress={() => handleGrade(true)} style={({ pressed }) => [s.gotBtn, pressed && { backgroundColor: colors.accentDark }]}>
            <Text style={s.gotText}>Got it</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={() => setRevealed(true)} style={({ pressed }) => [s.revealBtn, pressed && { backgroundColor: "#000" }]}>
          <Text style={s.revealText}>Reveal</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 20 },
  centerWrap: { padding: 20 },

  progressRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.sm },
  muted: { fontSize: font.small, color: colors.textTertiary },
  boxRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dots: { flexDirection: "row", gap: 3 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotOn: { backgroundColor: colors.accent },
  dotOff: { backgroundColor: "#e5e5e5" },

  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, paddingVertical: 40, paddingHorizontal: 24, alignItems: "center", justifyContent: "center", minHeight: 260, marginBottom: space.sm, ...shadow.sm },
  thai: { fontSize: 48, fontWeight: "600", color: colors.textPrimary, marginBottom: 12, textAlign: "center" },
  speakBtn: { flexDirection: "row", alignItems: "center", gap: 8 },
  roman: { fontSize: 18, color: colors.textTertiary },
  answer: { marginTop: space.md, paddingTop: space.md, borderTopWidth: 1, borderTopColor: colors.borderSoft, width: "100%", alignItems: "center" },
  en: { fontSize: 20, color: colors.textPrimary, textAlign: "center" },
  note: { fontSize: font.small, color: colors.textSecondary, marginTop: 12, textAlign: "center", lineHeight: 20 },
  tapHint: { fontSize: font.small, color: colors.textTertiary, marginTop: space.md },

  gradeRow: { flexDirection: "row", gap: 12 },
  missBtn: { flex: 1, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: 14, alignItems: "center" },
  missText: { fontSize: font.body, fontWeight: "500", color: colors.textSecondary },
  gotBtn: { flex: 1, backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 14, alignItems: "center", ...shadow.sm },
  gotText: { fontSize: font.body, fontWeight: "500", color: "#fff" },
  revealBtn: { backgroundColor: colors.dark, borderRadius: radius.md, paddingVertical: 14, alignItems: "center" },
  revealText: { fontSize: font.body, fontWeight: "500", color: "#fff" },

  emptyCard: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: 32, alignItems: "center", ...shadow.sm },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  emptyTitle: { fontSize: font.h2, fontWeight: "600", color: colors.textPrimary, marginBottom: 4 },
  emptySub: { fontSize: font.small, color: colors.textTertiary, textAlign: "center", marginBottom: 20, lineHeight: 20 },
  primaryBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.accent, borderRadius: radius.md, paddingHorizontal: 20, paddingVertical: 10, ...shadow.sm },
  primaryBtnText: { fontSize: font.body, fontWeight: "500", color: "#fff" },
});
