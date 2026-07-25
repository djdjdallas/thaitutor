import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, space, radius, shadow, font } from "../theme";
import { speakThai } from "../lib/tts";
import { answerFeedback } from "../lib/haptics";
import PronunciationGuide, { GuideTrigger } from "./PronunciationGuide";

// `queue` is the list of due cards for this session, passed in from App.
// We track only the position + reveal state locally; grading bubbles up.
//
// Missed cards come back at the END of the same session (the relearn queue):
// you don't leave until you've gotten every card right once. Only the first
// encounter is graded — relearn repeats are drill, not double jeopardy for
// the SRS box.
//
// Audio-first mode trains the ear before the eye: the card auto-plays its Thai
// audio on arrival and the romanization stays hidden until you reveal, so you
// can't lean on the roman spelling.
//
// Direction flips the whole exercise: TH→EN is recognition (see Thai, recall
// the meaning); EN→TH is production (see English, say the Thai out loud, then
// check). Production is harder and is what actually gets you understood —
// the Thai plays on reveal so your attempt gets an immediate model answer.
export default function ReviewScreen({
  queue,
  sessionDone,
  dueCount,
  nothingUnlocked = false,
  audioFirst = false,
  direction = "th-en",
  onToggleAudioFirst,
  onToggleDirection,
  onGrade,
  onStart,
  onReplayDone,
  onGoLearn,
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [relearn, setRelearn] = useState([]); // missed cards, re-drilled at the end
  const [showGuide, setShowGuide] = useState(false);

  const reversed = direction === "en-th";
  const inSession = !!queue && queue.length > 0 && !sessionDone;
  const combined = inSession ? [...queue, ...relearn] : [];
  const card = inSession ? combined[index] : null;
  const isRelearn = inSession && index >= queue.length;

  // Auto-play when a new card arrives (or when the user flips audio-first on).
  // Only in TH→EN: in production mode the audio IS the answer.
  useEffect(() => {
    if (inSession && audioFirst && !reversed && card) speakThai(card.thai);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id, index, audioFirst, reversed, inSession]);

  // Hide the romanization until reveal in audio-first mode.
  const showRoman = !audioFirst || revealed;

  // Revealing in production mode speaks the model answer.
  function reveal() {
    setRevealed(true);
    if (reversed && card) speakThai(card.thai);
  }

  // Empty / start / finished state. A brand-new install has nothing unlocked
  // yet — point at the Learn path instead of promising cards tomorrow.
  if (!inSession) {
    const showLearnNudge = nothingUnlocked && !sessionDone;
    return (
      <View style={s.centerWrap}>
        <View style={s.emptyCard}>
          <View style={s.emptyIcon}>
            <Feather
              name={sessionDone ? "check" : showLearnNudge ? "map" : "book-open"}
              size={24}
              color={colors.accent}
            />
          </View>
          <Text style={s.emptyTitle}>
            {sessionDone
              ? "Session complete"
              : showLearnNudge
                ? "Nothing unlocked yet"
                : dueCount > 0
                  ? "Ready to review"
                  : "Nothing due"}
          </Text>
          <Text style={s.emptySub}>
            {sessionDone
              ? "Nice. Cards you knew moved up a box and will come back later."
              : showLearnNudge
                ? "Words enter review as you finish lessons. Do your first lesson on the Learn path to unlock your first batch."
                : dueCount > 0
                  ? `${dueCount} cards waiting.`
                  : "Come back tomorrow for your next batch."}
          </Text>
          {showLearnNudge ? (
            <Pressable
              onPress={onGoLearn}
              accessibilityRole="button"
              accessibilityLabel="Go to the Learn path"
              style={({ pressed }) => [
                s.primaryBtn,
                pressed && { backgroundColor: colors.accentDark },
              ]}
            >
              <Feather name="map" size={16} color="#fff" />
              <Text style={s.primaryBtnText}>Go to Learn</Text>
            </Pressable>
          ) : (
            dueCount > 0 && (
              <Pressable
                onPress={() => {
                  setIndex(0);
                  setRevealed(false);
                  setRelearn([]);
                  onStart();
                }}
                accessibilityRole="button"
                accessibilityLabel={sessionDone ? "Review again" : "Start review"}
                style={({ pressed }) => [
                  s.primaryBtn,
                  pressed && { backgroundColor: colors.accentDark },
                ]}
              >
                <Feather name="rotate-ccw" size={16} color="#fff" />
                <Text style={s.primaryBtnText}>
                  {sessionDone ? "Review again" : "Start review"}
                </Text>
              </Pressable>
            )
          )}
        </View>
      </View>
    );
  }

  function handleGrade(correct) {
    answerFeedback(correct);
    // Grade only first encounters; relearn repeats don't touch the SRS box.
    if (!isRelearn) onGrade(card, correct);
    // Any miss (even during relearn) sends the card to the back of the line.
    const nextRelearn = correct ? relearn : [...relearn, card];
    if (!correct) setRelearn(nextRelearn);
    if (index + 1 >= queue.length + nextRelearn.length) {
      onReplayDone(); // signals App to mark the session finished + vocab block done
    } else {
      setIndex(index + 1);
      setRevealed(false);
    }
  }

  return (
    <View style={s.wrap}>
      {/* Progress + box indicator. The total grows as misses join the relearn
          queue — the session isn't over until every card has been gotten right. */}
      <View style={s.progressRow}>
        <View style={s.boxRow}>
          <Text style={s.muted}>
            {index + 1} / {combined.length}
          </Text>
          {isRelearn && (
            <View style={s.relearnTag}>
              <Feather name="rotate-ccw" size={10} color={colors.accentDark} />
              <Text style={s.relearnText}>relearn</Text>
            </View>
          )}
        </View>
        <View style={s.boxRow}>
          <Text style={s.muted}>box {card.box}</Text>
          <View style={s.dots}>
            {[1, 2, 3, 4, 5].map((n) => (
              <View key={n} style={[s.dot, n <= card.box ? s.dotOn : s.dotOff]} />
            ))}
          </View>
        </View>
      </View>

      <PronunciationGuide visible={showGuide} onClose={() => setShowGuide(false)} />

      {/* Mode toggles (direction + audio-first) + pronunciation guide */}
      <View style={s.modeRow}>
        <View style={s.modeGroup}>
          <Pressable
            onPress={onToggleDirection}
            accessibilityRole="switch"
            accessibilityState={{ checked: reversed }}
            accessibilityLabel={
              reversed
                ? "Production mode: see English, recall the Thai. Tap to switch to recognition."
                : "Recognition mode: see Thai, recall the meaning. Tap to switch to production."
            }
            style={[s.modeToggle, reversed && s.modeToggleOn]}
            hitSlop={6}
          >
            <Feather
              name={reversed ? "corner-up-left" : "corner-up-right"}
              size={14}
              color={reversed ? colors.accentDark : colors.textTertiary}
            />
            <Text style={[s.modeText, reversed && s.modeTextOn]}>
              {reversed ? "EN → TH" : "TH → EN"}
            </Text>
          </Pressable>
          {!reversed && (
            <Pressable
              onPress={onToggleAudioFirst}
              accessibilityRole="switch"
              accessibilityState={{ checked: audioFirst }}
              accessibilityLabel="Audio-first mode: hear each card before seeing the romanization"
              style={[s.modeToggle, audioFirst && s.modeToggleOn]}
              hitSlop={6}
            >
              <Feather
                name="headphones"
                size={14}
                color={audioFirst ? colors.accentDark : colors.textTertiary}
              />
              <Text style={[s.modeText, audioFirst && s.modeTextOn]}>
                Audio-first {audioFirst ? "on" : "off"}
              </Text>
            </Pressable>
          )}
        </View>
        <GuideTrigger onPress={() => setShowGuide(true)} />
      </View>

      {/* Card (tap to reveal). In production mode the front is English and
          the Thai stays hidden until you've made your attempt out loud. */}
      <Pressable
        style={s.card}
        onPress={reveal}
        accessibilityRole="button"
        accessibilityLabel={
          revealed
            ? `${card.thai}, ${card.roman}, ${card.en}`
            : reversed
              ? `${card.en}. Say it in Thai, then tap to check.`
              : "Thai card, tap to reveal the meaning"
        }
      >
        {reversed && !revealed ? (
          <>
            <Text style={s.enFront}>{card.en}</Text>
            <Text style={s.tapHint}>Say it in Thai, then tap to check</Text>
          </>
        ) : (
          <>
            <Text style={s.thai}>{card.thai}</Text>

            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                speakThai(card.thai);
              }}
              style={s.speakBtn}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={showRoman ? `Play pronunciation of ${card.thai}` : "Replay audio"}
            >
              <Feather name="volume-2" size={18} color={colors.textTertiary} />
              <Text style={s.roman}>{showRoman ? card.roman : "tap to replay"}</Text>
            </Pressable>

            {revealed ? (
              <View style={s.answer}>
                <Text style={s.en}>{card.en}</Text>
                {!!card.note && <Text style={s.note}>{card.note}</Text>}
              </View>
            ) : (
              <Text style={s.tapHint}>
                {audioFirst ? "Listen, then tap to reveal" : "Tap to reveal"}
              </Text>
            )}
          </>
        )}
      </Pressable>

      {/* Grading */}
      {revealed ? (
        <View style={s.gradeRow}>
          <Pressable
            onPress={() => handleGrade(false)}
            accessibilityRole="button"
            accessibilityLabel="Missed it. Send this card back to daily drilling."
            style={({ pressed }) => [s.missBtn, pressed && { backgroundColor: "#f5f5f4" }]}
          >
            <Text style={s.missText}>Missed it</Text>
          </Pressable>
          <Pressable
            onPress={() => handleGrade(true)}
            accessibilityRole="button"
            accessibilityLabel="Got it. Move this card up a box."
            style={({ pressed }) => [s.gotBtn, pressed && { backgroundColor: colors.accentDark }]}
          >
            <Text style={s.gotText}>Got it</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={reveal}
          accessibilityRole="button"
          accessibilityLabel={reversed ? "Check the Thai answer" : "Reveal the meaning"}
          style={({ pressed }) => [s.revealBtn, pressed && { backgroundColor: "#000" }]}
        >
          <Text style={s.revealText}>{reversed ? "Check" : "Reveal"}</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 20 },
  centerWrap: { padding: 20 },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: space.sm,
  },
  muted: { fontSize: font.small, color: colors.textTertiary },
  boxRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  relearnTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  relearnText: { fontSize: font.tiny, fontWeight: "600", color: colors.accentDark },
  dots: { flexDirection: "row", gap: 3 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotOn: { backgroundColor: colors.accent },
  dotOff: { backgroundColor: "#e5e5e5" },

  modeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.sm,
  },
  modeGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
  modeToggle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  modeToggleOn: { borderColor: colors.accentBorder, backgroundColor: colors.accentSoft },
  modeText: { fontSize: font.tiny, fontWeight: "500", color: colors.textTertiary },
  modeTextOn: { color: colors.accentDark },

  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 260,
    marginBottom: space.sm,
    ...shadow.sm,
  },
  thai: {
    fontSize: 48,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  enFront: {
    fontSize: 26,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 36,
  },
  speakBtn: { flexDirection: "row", alignItems: "center", gap: 8 },
  roman: { fontSize: 18, color: colors.textTertiary },
  answer: {
    marginTop: space.md,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    width: "100%",
    alignItems: "center",
  },
  en: { fontSize: 20, color: colors.textPrimary, textAlign: "center" },
  note: {
    fontSize: font.small,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: "center",
    lineHeight: 20,
  },
  tapHint: { fontSize: font.small, color: colors.textTertiary, marginTop: space.md },

  gradeRow: { flexDirection: "row", gap: 12 },
  missBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  missText: { fontSize: font.body, fontWeight: "500", color: colors.textSecondary },
  gotBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    ...shadow.sm,
  },
  gotText: { fontSize: font.body, fontWeight: "500", color: "#fff" },
  revealBtn: {
    backgroundColor: colors.dark,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  revealText: { fontSize: font.body, fontWeight: "500", color: "#fff" },

  emptyCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 32,
    alignItems: "center",
    ...shadow.sm,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: font.h2, fontWeight: "600", color: colors.textPrimary, marginBottom: 4 },
  emptySub: {
    fontSize: font.small,
    color: colors.textTertiary,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: 20,
    paddingVertical: 10,
    ...shadow.sm,
  },
  primaryBtnText: { fontSize: font.body, fontWeight: "500", color: "#fff" },
});
