import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, space, radius, shadow, font } from "../theme";
import { parseDate } from "../lib/dates";

// Single-letter weekday for a "YYYY-MM-DD" string (Sun-first).
const WEEKDAY = ["S", "M", "T", "W", "T", "F", "S"];
function weekdayLetter(dateStr) {
  return WEEKDAY[parseDate(dateStr).getDay()];
}

// The four daily study blocks. Listening is the protected non-negotiable
// (it's what the streak is based on).
export const BLOCKS = [
  {
    key: "listening",
    label: "Listening",
    sub: "Comprehensible input ~45 min",
    icon: "headphones",
    protected: true,
  },
  { key: "speaking", label: "Speaking", sub: "Tutor / shadowing ~30 min", icon: "message-circle" },
  { key: "vocab", label: "Vocab + Script", sub: "SRS review ~30 min", icon: "layers" },
  { key: "freeplay", label: "Free-play", sub: "Music, show, texting", icon: "music" },
];

export default function TodayScreen({
  streak,
  log,
  dueCount,
  mastered,
  total,
  voiceMissing,
  week = [],
  nextDue = null,
  categories = [],
  freezeBank = 0,
  reminderEnabled = false,
  reminderTime = "19:00",
  onToggle,
  onStartReview,
  onStartToneDrill,
  onOpenStats,
  onToggleReminder,
  onShiftReminderTime,
}) {
  const blocksDone = BLOCKS.filter((b) => log[b.key]).length;
  // Idle-state subtitle for the review nudge: lead with when the next batch
  // lands (more motivating than a static mastered count), fall back to mastery.
  const caughtUpSub = nextDue
    ? `Next batch ${nextDue} · ${mastered}/${total} mastered`
    : `${mastered}/${total} words mastered`;

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>เรียนภาษาไทย</Text>
          <Text style={s.subtitle}>Daily Thai tracker</Text>
        </View>
        <View style={s.headerRight}>
          <Pressable
            onPress={onOpenStats}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Open your stats"
            style={({ pressed }) => [s.statsBtn, pressed && { backgroundColor: colors.accentSoft }]}
          >
            <Feather name="bar-chart-2" size={18} color={colors.textSecondary} />
          </Pressable>
          <View
            style={s.streakChip}
            accessibilityLabel={`${streak} day streak${
              freezeBank > 0
                ? `, ${freezeBank} streak ${freezeBank === 1 ? "freeze" : "freezes"} banked`
                : ""
            }`}
          >
            <MaterialCommunityIcons
              name="fire"
              size={20}
              color={streak > 0 ? colors.accent : colors.textTertiary}
            />
            <View>
              <Text style={s.streakNum}>{streak}</Text>
              <Text style={s.streakLabel}>day streak</Text>
            </View>
            {freezeBank > 0 && (
              <View style={s.freezeChip}>
                <MaterialCommunityIcons name="snowflake" size={12} color="#0284c7" />
                <Text style={s.freezeCount}>{freezeBank}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Thai voice missing hint. We only nag when the device check actually
          came back empty (mostly Android without the Google TTS Thai pack). */}
      {voiceMissing && (
        <View style={s.voiceWarn} accessibilityRole="alert">
          <Feather name="volume-x" size={18} color={colors.accentDark} />
          <View style={{ flex: 1 }}>
            <Text style={s.voiceWarnTitle}>No Thai voice installed</Text>
            <Text style={s.voiceWarnSub}>
              Card playback won't speak yet. On Android: Settings → System → Languages &amp; input →
              Text-to-speech → install a Thai voice.
            </Text>
          </View>
        </View>
      )}

      {/* Progress summary */}
      <View style={s.card}>
        <View style={s.rowBetween}>
          <Text style={s.muted}>Today's blocks</Text>
          <Text style={s.strong}>
            {blocksDone}/{BLOCKS.length}
          </Text>
        </View>
        <View style={s.track}>
          <View style={[s.fill, { width: `${(blocksDone / BLOCKS.length) * 100}%` }]} />
        </View>
      </View>

      {/* Weekly listening strip: a filled dot for each of the last 7 days you
          finished the protected Listening block. */}
      {week.length > 0 && (
        <View style={s.card}>
          <Text style={[s.muted, { marginBottom: 12 }]}>This week's listening</Text>
          <View style={s.weekRow}>
            {week.map((d) => (
              <View
                key={d.date}
                style={s.weekCol}
                accessibilityLabel={`${d.date}: ${
                  d.done ? "done" : d.frozen ? "covered by a streak freeze" : "missed"
                }`}
              >
                <View
                  style={[
                    s.weekDot,
                    d.done && s.weekDotDone,
                    d.frozen && s.weekDotFrozen,
                    d.isToday && s.weekDotToday,
                  ]}
                >
                  {d.done && <Feather name="check" size={12} color="#fff" />}
                  {d.frozen && (
                    <MaterialCommunityIcons name="snowflake" size={12} color="#0284c7" />
                  )}
                </View>
                <Text style={[s.weekDay, d.isToday && s.weekDayToday]}>
                  {weekdayLetter(d.date)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Due review nudge */}
      <Pressable
        onPress={onStartReview}
        disabled={dueCount === 0}
        accessibilityRole="button"
        accessibilityState={{ disabled: dueCount === 0 }}
        accessibilityLabel={
          dueCount > 0
            ? `${dueCount} cards due. Start your review.`
            : `All caught up. ${mastered} of ${total} words mastered.`
        }
        style={({ pressed }) => [
          s.nudge,
          dueCount > 0 ? s.nudgeActive : s.nudgeIdle,
          pressed && dueCount > 0 && { backgroundColor: colors.accentDark },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[s.nudgeTitle, dueCount === 0 && { color: colors.textTertiary }]}>
            {dueCount > 0 ? `${dueCount} cards due` : "All caught up"}
          </Text>
          <Text style={[s.nudgeSub, dueCount === 0 && { color: colors.textTertiary }]}>
            {dueCount > 0 ? "Tap to start your review" : caughtUpSub}
          </Text>
        </View>
        {dueCount > 0 && <Feather name="chevron-right" size={22} color="#fff" />}
      </Pressable>

      {/* Daily blocks */}
      <View style={{ gap: 12 }}>
        {BLOCKS.map((b) => {
          const done = !!log[b.key];
          return (
            <Pressable
              key={b.key}
              onPress={() => onToggle(b.key)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done }}
              accessibilityLabel={`${b.label}. ${b.sub}.${b.protected ? " Protected: this is what your streak counts." : ""}`}
              style={[s.block, done && s.blockDone]}
            >
              <View style={[s.iconWrap, done ? s.iconWrapDone : s.iconWrapIdle]}>
                <Feather
                  name={b.icon}
                  size={20}
                  color={done ? colors.accent : colors.textTertiary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={s.blockTitleRow}>
                  <Text style={s.blockLabel}>{b.label}</Text>
                  {b.protected && <Text style={s.tag}>PROTECT</Text>}
                </View>
                <Text style={s.blockSub}>{b.sub}</Text>
              </View>
              <View style={[s.checkbox, done && s.checkboxDone]}>
                {done && <Feather name="check" size={14} color="#fff" />}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Tone trainer: quick minimal-pair ear drill, separate from the blocks. */}
      <Pressable
        onPress={onStartToneDrill}
        accessibilityRole="button"
        accessibilityLabel="Tone trainer. A quick ear drill on tone pairs like far and near."
        style={({ pressed }) => [
          s.block,
          { marginTop: space.sm },
          pressed && { backgroundColor: colors.accentSoft },
        ]}
      >
        <View style={[s.iconWrap, s.iconWrapIdle]}>
          <MaterialCommunityIcons name="waveform" size={22} color={colors.textTertiary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.blockLabel}>Tone trainer</Text>
          <Text style={s.blockSub}>2-min ear drill · glai or glâi — far or near?</Text>
        </View>
        <Feather name="chevron-right" size={20} color={colors.textTertiary} />
      </Pressable>

      {/* Daily reminder: local notification at a fixed time, skipped on days
          Listening is already done. */}
      <View style={[s.card, { marginTop: space.sm, marginBottom: 0 }]}>
        <View style={s.reminderRow}>
          <View style={[s.iconWrap, reminderEnabled ? s.iconWrapDone : s.iconWrapIdle]}>
            <Feather
              name="bell"
              size={20}
              color={reminderEnabled ? colors.accent : colors.textTertiary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.blockLabel}>Daily reminder</Text>
            <Text style={s.blockSub}>
              {reminderEnabled
                ? `Nudges you at ${reminderTime} if Listening isn't done`
                : "Get a nudge if Listening isn't done"}
            </Text>
          </View>
          <Pressable
            onPress={onToggleReminder}
            accessibilityRole="switch"
            accessibilityState={{ checked: reminderEnabled }}
            accessibilityLabel="Daily reminder"
            hitSlop={8}
            style={[s.checkbox, reminderEnabled && s.checkboxDone]}
          >
            {reminderEnabled && <Feather name="check" size={14} color="#fff" />}
          </Pressable>
        </View>
        {reminderEnabled && (
          <View style={s.timeRow}>
            <Pressable
              onPress={() => onShiftReminderTime(-1)}
              accessibilityRole="button"
              accessibilityLabel="Reminder 30 minutes earlier"
              hitSlop={8}
              style={s.timeBtn}
            >
              <Feather name="minus" size={16} color={colors.textSecondary} />
            </Pressable>
            <Text style={s.timeText}>{reminderTime}</Text>
            <Pressable
              onPress={() => onShiftReminderTime(1)}
              accessibilityRole="button"
              accessibilityLabel="Reminder 30 minutes later"
              hitSlop={8}
              style={s.timeBtn}
            >
              <Feather name="plus" size={16} color={colors.textSecondary} />
            </Pressable>
          </View>
        )}
      </View>

      {/* Mastery by category: how much of each topic has reached the top box. */}
      {categories.length > 0 && (
        <View style={[s.card, { marginTop: space.sm }]}>
          <Text style={[s.muted, { marginBottom: 12 }]}>Mastery by category</Text>
          <View style={{ gap: 10 }}>
            {categories.map((c) => {
              const pct = c.total > 0 ? (c.mastered / c.total) * 100 : 0;
              return (
                <View
                  key={c.category}
                  accessibilityLabel={`${c.category}: ${c.mastered} of ${c.total} mastered`}
                >
                  <View style={s.catRow}>
                    <Text style={s.catLabel}>{c.category}</Text>
                    <Text style={s.catCount}>
                      {c.mastered}/{c.total}
                    </Text>
                  </View>
                  <View style={s.catTrack}>
                    <View style={[s.catFill, { width: `${pct}%` }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <Text style={s.footnote}>
        Your streak counts days you finish the Listening block.{"\n"}Miss everything else, keep that
        one.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: space.md,
  },
  title: { fontSize: font.h1, fontWeight: "600", color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: font.small, color: colors.textTertiary, marginTop: 4 },
  streakChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...shadow.sm,
  },
  streakNum: { fontSize: 18, fontWeight: "600", color: colors.textPrimary, lineHeight: 20 },
  streakLabel: { fontSize: font.tiny, color: colors.textTertiary },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  statsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  freezeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#e0f2fe",
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 2,
  },
  freezeCount: { fontSize: font.tiny, fontWeight: "600", color: "#0284c7" },

  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
    ...shadow.sm,
  },

  voiceWarn: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.sm,
    marginBottom: space.sm,
  },
  voiceWarnTitle: { fontSize: font.small, fontWeight: "600", color: colors.textPrimary },
  voiceWarnSub: { fontSize: font.tiny, color: colors.textSecondary, marginTop: 2, lineHeight: 16 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  muted: { fontSize: font.small, color: colors.textSecondary },
  strong: { fontSize: font.small, fontWeight: "600", color: colors.textPrimary },
  track: { height: 8, backgroundColor: "#f0f0ef", borderRadius: radius.pill, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: colors.accent, borderRadius: radius.pill },

  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  weekCol: { alignItems: "center", gap: 6 },
  weekDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0ef",
    alignItems: "center",
    justifyContent: "center",
  },
  weekDotDone: { backgroundColor: colors.accent },
  weekDotFrozen: { backgroundColor: "#e0f2fe" },
  weekDotToday: { borderWidth: 2, borderColor: colors.accentDark },
  weekDay: { fontSize: font.tiny, color: colors.textTertiary },
  weekDayToday: { color: colors.textPrimary, fontWeight: "600" },

  catRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  catLabel: { fontSize: font.small, color: colors.textSecondary, textTransform: "capitalize" },
  catCount: { fontSize: font.small, fontWeight: "600", color: colors.textPrimary },
  catTrack: {
    height: 6,
    backgroundColor: "#f0f0ef",
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  catFill: { height: "100%", backgroundColor: colors.accent, borderRadius: radius.pill },

  nudge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  nudgeActive: { backgroundColor: colors.accent, ...shadow.sm },
  nudgeIdle: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
  nudgeTitle: { fontSize: font.body, fontWeight: "600", color: "#fff" },
  nudgeSub: { fontSize: font.small, color: "#fef3c7", marginTop: 2 },

  block: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.sm,
  },
  blockDone: { borderColor: colors.accentBorder },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapIdle: { backgroundColor: "#f5f5f4" },
  iconWrapDone: { backgroundColor: colors.accentSoft },
  blockTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  blockLabel: { fontSize: font.body, fontWeight: "500", color: colors.textPrimary },
  tag: {
    fontSize: 10,
    letterSpacing: 0.5,
    color: colors.textSecondary,
    backgroundColor: "#f5f5f4",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  blockSub: { fontSize: font.small, color: colors.textTertiary, marginTop: 2 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d4d4d4",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: colors.accent, borderColor: colors.accent },

  reminderRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  timeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: font.h2,
    fontWeight: "600",
    color: colors.textPrimary,
    fontVariant: ["tabular-nums"],
    minWidth: 64,
    textAlign: "center",
  },

  footnote: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: "center",
    marginTop: space.md,
    lineHeight: 18,
  },
});
