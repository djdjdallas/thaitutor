import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, space, radius, shadow, font } from "../theme";
import { UNITS } from "../data/lessons";

// The Learn path: every unit is open, lessons unlock in order within their
// unit. Completing a lesson releases its cards into the SRS review deck, so
// the path is the front door for new vocabulary.
export default function PathScreen({ completedLessons, unlockedCount, onStartLesson }) {
  const totalLessons = UNITS.reduce((n, u) => n + u.lessons.length, 0);

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.wrap}>
      <View style={s.header}>
        <Text style={s.h1}>Learn</Text>
        <Text style={s.headerSub}>
          {completedLessons.size} of {totalLessons} lessons · {unlockedCount} words unlocked for
          review
        </Text>
      </View>

      {UNITS.map((unit) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          completedLessons={completedLessons}
          onStartLesson={onStartLesson}
        />
      ))}
    </ScrollView>
  );
}

function UnitCard({ unit, completedLessons, onStartLesson }) {
  const doneCount = unit.lessons.filter((l) => completedLessons.has(l.id)).length;

  return (
    <View style={s.unit}>
      <View style={s.unitHeader}>
        <View style={s.unitIcon}>
          <Feather name={unit.icon} size={16} color={colors.accentDark} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.unitTitle}>{unit.title}</Text>
          <Text style={s.unitSub}>{unit.subtitle}</Text>
        </View>
        <Text style={s.unitCount}>
          {doneCount}/{unit.lessons.length}
        </Text>
      </View>

      <View style={s.lessonList}>
        {unit.lessons.map((lesson, i) => {
          const done = completedLessons.has(lesson.id);
          // Sequential within the unit: a lesson opens when the previous one
          // is done. Done lessons stay replayable.
          const locked = !done && i > 0 && !completedLessons.has(unit.lessons[i - 1].id);
          const isNext = !done && !locked;
          return (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              done={done}
              locked={locked}
              isNext={isNext}
              onPress={() => onStartLesson(lesson)}
            />
          );
        })}
      </View>
    </View>
  );
}

function LessonRow({ lesson, done, locked, isNext, onPress }) {
  return (
    <Pressable
      onPress={locked ? undefined : onPress}
      disabled={locked}
      accessibilityRole="button"
      accessibilityState={{ disabled: locked }}
      accessibilityLabel={
        locked
          ? `${lesson.title}, locked. Finish the previous lesson first.`
          : done
            ? `${lesson.title}, completed. Tap to replay.`
            : `${lesson.title}, ${lesson.cardIds.length} words. Tap to start.`
      }
      style={({ pressed }) => [
        s.lessonRow,
        isNext && s.lessonRowNext,
        pressed && !locked && { backgroundColor: colors.accentSoft },
      ]}
    >
      <View style={[s.node, done && s.nodeDone, locked && s.nodeLocked]}>
        {done ? (
          <Feather name="check" size={14} color="#fff" />
        ) : locked ? (
          <Feather name="lock" size={12} color={colors.textTertiary} />
        ) : (
          <Feather name="play" size={12} color={colors.accentDark} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.lessonTitle, locked && { color: colors.textTertiary }]}>
          {lesson.title}
        </Text>
        <Text style={s.lessonMeta}>
          {lesson.cardIds.length} {lesson.cardIds.length === 1 ? "word" : "words"}
          {done ? " · replay" : ""}
        </Text>
      </View>
      {isNext && <Text style={s.startHint}>Start</Text>}
    </Pressable>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1 },
  wrap: { padding: 20, paddingBottom: 40, gap: space.sm },

  header: { marginBottom: 4 },
  h1: { fontSize: font.h1, fontWeight: "700", color: colors.textPrimary },
  headerSub: { fontSize: font.small, color: colors.textTertiary, marginTop: 4 },

  unit: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 16,
    ...shadow.sm,
  },
  unitHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  unitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  unitTitle: { fontSize: font.body, fontWeight: "600", color: colors.textPrimary },
  unitSub: { fontSize: font.tiny, color: colors.textTertiary, marginTop: 1 },
  unitCount: { fontSize: font.small, fontWeight: "500", color: colors.textTertiary },

  lessonList: { gap: 4 },
  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
  },
  lessonRowNext: { backgroundColor: colors.bg },
  node: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.accentBorder,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  nodeLocked: { backgroundColor: colors.bg, borderColor: colors.border },
  lessonTitle: { fontSize: font.body, color: colors.textPrimary },
  lessonMeta: { fontSize: font.tiny, color: colors.textTertiary, marginTop: 1 },
  startHint: { fontSize: font.small, fontWeight: "600", color: colors.accentDark },
});
