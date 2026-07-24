import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, space, radius, shadow, font } from "../theme";
import { speakThai } from "../lib/tts";
import { isTileOrderCorrect } from "../lib/lessonSteps";

// A full-screen lesson session: teach steps, then MCQ / audio / tile quizzes
// with instant feedback. Every answer gets checked before you can move on,
// and the correct Thai is spoken at check time so the sound stays attached to
// the meaning. Finishing hands control back to App, which unlocks the
// lesson's cards into the SRS.
export default function LessonScreen({ lesson, steps, onComplete, onExit }) {
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  // Per-step answer state, reset on every advance.
  const [selectedId, setSelectedId] = useState(null);
  const [chosenTiles, setChosenTiles] = useState([]);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  const step = steps[index];

  // Teach and audio steps speak on arrival — hearing before reading is the
  // same ear-first principle as the review screen's audio-first mode.
  useEffect(() => {
    if (!finished && step && (step.type === "teach" || step.type === "audio")) {
      speakThai(step.card.thai);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, finished]);

  function advance() {
    if (index + 1 >= steps.length) {
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setSelectedId(null);
    setChosenTiles([]);
    setChecked(false);
    setCorrect(false);
  }

  function checkChoice(option) {
    if (checked) return;
    setSelectedId(option.id);
    setChecked(true);
    setCorrect(option.id === step.card.id);
    speakThai(step.card.thai);
  }

  function checkTiles() {
    if (checked) return;
    setChecked(true);
    setCorrect(isTileOrderCorrect(chosenTiles, step.card));
    speakThai(step.card.thai);
  }

  if (finished) {
    return (
      <View style={s.doneWrap}>
        <View style={s.doneCard}>
          <View style={s.doneIcon}>
            <Feather name="check" size={28} color={colors.accentDark} />
          </View>
          <Text style={s.doneTitle}>Lesson complete</Text>
          <Text style={s.doneSub}>
            {lesson.cardIds.length} words from “{lesson.title}” are now unlocked in Review. The SRS
            will bring them back right when you're about to forget them.
          </Text>
          <Pressable
            onPress={() => onComplete(lesson)}
            accessibilityRole="button"
            accessibilityLabel="Finish the lesson and unlock these words for review"
            style={({ pressed }) => [
              s.primaryBtn,
              pressed && { backgroundColor: colors.accentDark },
            ]}
          >
            <Text style={s.primaryBtnText}>Finish</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={s.wrap}>
      {/* Header: exit, title, progress bar */}
      <View style={s.header}>
        <Pressable
          onPress={onExit}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Exit the lesson. Progress in this lesson is not saved."
        >
          <Feather name="x" size={22} color={colors.textTertiary} />
        </Pressable>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${(index / steps.length) * 100}%` }]} />
        </View>
        <Text style={s.stepCount}>
          {index + 1}/{steps.length}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {step.type === "teach" && <TeachStep card={step.card} />}
        {step.type === "mcq" && (
          <ChoiceStep
            prompt={`Which one means “${step.card.en}”?`}
            options={step.options}
            renderOption={(o) => (
              <>
                <Text style={s.choiceThai}>{o.thai}</Text>
                <Text style={s.choiceRoman}>{o.roman}</Text>
              </>
            )}
            step={step}
            selectedId={selectedId}
            checked={checked}
            onPick={checkChoice}
          />
        )}
        {step.type === "audio" && (
          <ChoiceStep
            prompt="What did you hear?"
            replayCard={step.card}
            options={step.options}
            renderOption={(o) => <Text style={s.choiceEn}>{o.en}</Text>}
            step={step}
            selectedId={selectedId}
            checked={checked}
            onPick={checkChoice}
          />
        )}
        {step.type === "tiles" && (
          <TileStep step={step} chosen={chosenTiles} setChosen={setChosenTiles} checked={checked} />
        )}

        {/* Feedback after checking */}
        {checked && (
          <View style={[s.feedback, correct ? s.feedbackGood : s.feedbackBad]}>
            <Feather
              name={correct ? "check-circle" : "x-circle"}
              size={18}
              color={correct ? colors.success : colors.danger}
            />
            <View style={{ flex: 1 }}>
              <Text style={[s.feedbackTitle, { color: correct ? colors.success : colors.danger }]}>
                {correct ? "Correct!" : "Not quite"}
              </Text>
              <Text style={s.feedbackAnswer}>
                {step.card.thai} · {step.card.roman} · {step.card.en}
              </Text>
              {!correct && !!step.card.note && <Text style={s.feedbackNote}>{step.card.note}</Text>}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer action */}
      {step.type === "teach" ? (
        <Pressable
          onPress={advance}
          accessibilityRole="button"
          accessibilityLabel="Continue to the next step"
          style={({ pressed }) => [s.primaryBtn, pressed && { backgroundColor: colors.accentDark }]}
        >
          <Text style={s.primaryBtnText}>Continue</Text>
        </Pressable>
      ) : checked ? (
        <Pressable
          onPress={advance}
          accessibilityRole="button"
          accessibilityLabel="Continue to the next step"
          style={({ pressed }) => [s.primaryBtn, pressed && { backgroundColor: colors.accentDark }]}
        >
          <Text style={s.primaryBtnText}>Continue</Text>
        </Pressable>
      ) : step.type === "tiles" ? (
        <Pressable
          onPress={checkTiles}
          disabled={chosenTiles.length !== step.tiles.length}
          accessibilityRole="button"
          accessibilityState={{ disabled: chosenTiles.length !== step.tiles.length }}
          accessibilityLabel="Check your answer"
          style={({ pressed }) => [
            s.primaryBtn,
            chosenTiles.length !== step.tiles.length && s.btnDisabled,
            pressed && { backgroundColor: colors.accentDark },
          ]}
        >
          <Text style={s.primaryBtnText}>Check</Text>
        </Pressable>
      ) : (
        <Text style={s.footerHint}>Tap an answer</Text>
      )}
    </View>
  );
}

// A new word: hear it, see it, read the note, move on.
function TeachStep({ card }) {
  return (
    <View style={s.teachCard}>
      <Text style={s.newWordTag}>NEW WORD</Text>
      <Text style={s.teachThai}>{card.thai}</Text>
      <Pressable
        onPress={() => speakThai(card.thai)}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`Play pronunciation of ${card.thai}`}
        style={s.speakRow}
      >
        <Feather name="volume-2" size={18} color={colors.textTertiary} />
        <Text style={s.teachRoman}>{card.roman}</Text>
      </Pressable>
      <Text style={s.teachEn}>{card.en}</Text>
      {!!card.note && <Text style={s.teachNote}>{card.note}</Text>}
    </View>
  );
}

// Shared four-option chooser used by both MCQ (pick the Thai) and audio (pick
// the meaning of what you heard).
function ChoiceStep({
  prompt,
  replayCard,
  options,
  renderOption,
  step,
  selectedId,
  checked,
  onPick,
}) {
  return (
    <View>
      <Text style={s.prompt}>{prompt}</Text>
      {replayCard && (
        <Pressable
          onPress={() => speakThai(replayCard.thai)}
          accessibilityRole="button"
          accessibilityLabel="Replay the audio"
          style={({ pressed }) => [s.replayBtn, pressed && { backgroundColor: colors.accentSoft }]}
        >
          <Feather name="volume-2" size={20} color={colors.accentDark} />
          <Text style={s.replayText}>Replay</Text>
        </Pressable>
      )}
      <View style={s.choices}>
        {options.map((o) => {
          const isAnswer = o.id === step.card.id;
          const isSelected = o.id === selectedId;
          return (
            <Pressable
              key={o.id}
              onPress={() => onPick(o)}
              disabled={checked}
              accessibilityRole="button"
              accessibilityLabel={o.thai ? `${o.thai}, ${o.roman}` : o.en}
              style={({ pressed }) => [
                s.choice,
                pressed && !checked && { borderColor: colors.accentBorder },
                checked && isAnswer && s.choiceRight,
                checked && isSelected && !isAnswer && s.choiceWrong,
              ]}
            >
              {renderOption(o)}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// Rebuild the phrase from shuffled syllable tiles. Tap a pool tile to add it,
// tap a chosen tile to put it back.
function TileStep({ step, chosen, setChosen, checked }) {
  const chosenKeys = new Set(chosen.map((t) => t.key));
  const pool = step.tiles.filter((t) => !chosenKeys.has(t.key));

  return (
    <View>
      <Text style={s.prompt}>Say it in Thai: “{step.card.en}”</Text>
      <Pressable
        onPress={() => speakThai(step.card.thai)}
        accessibilityRole="button"
        accessibilityLabel="Play the phrase you are building"
        style={({ pressed }) => [s.replayBtn, pressed && { backgroundColor: colors.accentSoft }]}
      >
        <Feather name="volume-2" size={20} color={colors.accentDark} />
        <Text style={s.replayText}>Hear it</Text>
      </Pressable>

      <View style={s.answerRow} accessibilityLabel="Your answer, in order">
        {chosen.length === 0 && <Text style={s.answerHint}>Tap the syllables in order</Text>}
        {chosen.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => !checked && setChosen(chosen.filter((x) => x.key !== t.key))}
            disabled={checked}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${t.text}`}
            style={[s.tile, s.tileChosen]}
          >
            <Text style={s.tileText}>{t.text}</Text>
          </Pressable>
        ))}
      </View>

      <View style={s.poolRow}>
        {pool.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => !checked && setChosen([...chosen, t])}
            disabled={checked}
            accessibilityRole="button"
            accessibilityLabel={`Add ${t.text}`}
            style={s.tile}
          >
            <Text style={s.tileText}>{t.text}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },
  body: { paddingBottom: 16 },

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

  // Teach
  teachCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    ...shadow.sm,
  },
  newWordTag: {
    fontSize: font.tiny,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.accentDark,
    marginBottom: 12,
  },
  teachThai: { fontSize: 42, fontWeight: "600", color: colors.textPrimary, textAlign: "center" },
  speakRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  teachRoman: { fontSize: 18, color: colors.textSecondary },
  teachEn: { fontSize: 20, color: colors.textPrimary, marginTop: space.md, textAlign: "center" },
  teachNote: {
    fontSize: font.small,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: "center",
    lineHeight: 20,
  },

  // Choices
  prompt: { fontSize: font.h2, fontWeight: "600", color: colors.textPrimary, marginBottom: 12 },
  replayBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
  },
  replayText: { fontSize: font.small, fontWeight: "500", color: colors.accentDark },
  choices: { gap: 8 },
  choice: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  choiceRight: { borderColor: colors.success, backgroundColor: colors.successSoft },
  choiceWrong: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  choiceThai: { fontSize: 22, fontWeight: "500", color: colors.textPrimary },
  choiceRoman: { fontSize: font.small, color: colors.textTertiary, marginTop: 2 },
  choiceEn: { fontSize: font.body, color: colors.textPrimary },

  // Tiles
  answerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minHeight: 52,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: space.md,
    alignItems: "center",
  },
  answerHint: { fontSize: font.small, color: colors.textTertiary },
  poolRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tile: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    ...shadow.sm,
  },
  tileChosen: { borderColor: colors.accentBorder, backgroundColor: colors.accentSoft },
  tileText: { fontSize: 17, color: colors.textPrimary },

  // Feedback
  feedback: {
    flexDirection: "row",
    gap: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 14,
    marginTop: space.md,
  },
  feedbackGood: { backgroundColor: colors.successSoft, borderColor: colors.success },
  feedbackBad: { backgroundColor: colors.dangerSoft, borderColor: colors.danger },
  feedbackTitle: { fontSize: font.body, fontWeight: "600" },
  feedbackAnswer: { fontSize: font.body, color: colors.textPrimary, marginTop: 2 },
  feedbackNote: { fontSize: font.small, color: colors.textSecondary, marginTop: 4, lineHeight: 19 },

  // Footer
  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    ...shadow.sm,
  },
  btnDisabled: { opacity: 0.4 },
  primaryBtnText: { fontSize: font.body, fontWeight: "600", color: "#fff" },
  footerHint: {
    fontSize: font.small,
    color: colors.textTertiary,
    textAlign: "center",
    paddingVertical: 14,
  },

  // Completion
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
  doneTitle: { fontSize: font.h2, fontWeight: "600", color: colors.textPrimary },
  doneSub: {
    fontSize: font.small,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
});
