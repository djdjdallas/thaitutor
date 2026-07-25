import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, space, radius, shadow, font } from "../theme";
import { shiftDay } from "../lib/dates";

// The Stats screen: proof of work. Lifetime totals, a 14-day activity strip,
// where the deck sits in the Leitner boxes, and an 8-week listening heatmap.
// All plain Views — no chart library for four simple visuals.
export default function StatsScreen({ stats, onClose }) {
  const { totals, daily, boxes, listening, freezes, today, streak, unlocked, mastered } = stats;

  const accuracy = totals.total > 0 ? Math.round((totals.correct / totals.total) * 100) : null;

  // Last 14 days, oldest first, joined against the per-day review counts.
  const byDate = Object.fromEntries(daily.map((d) => [d.date, d]));
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const date = shiftDay(today, -i);
    const row = byDate[date];
    days.push({ date, total: row?.total || 0, correct: row?.correct || 0 });
  }
  const maxDay = Math.max(1, ...days.map((d) => d.total));

  // 8 weeks (56 days) ending today, split into rows of 7 for the heatmap.
  const listeningSet = new Set(listening);
  const freezeSet = new Set(freezes);
  const weeks = [];
  for (let w = 7; w >= 0; w--) {
    const row = [];
    for (let d = 6; d >= 0; d--) {
      const date = shiftDay(today, -(w * 7 + d));
      row.push({
        date,
        done: listeningSet.has(date),
        frozen: !listeningSet.has(date) && freezeSet.has(date),
      });
    }
    weeks.push(row);
  }

  const maxBox = Math.max(1, ...Object.values(boxes));

  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <Pressable
          onPress={onClose}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Close stats"
        >
          <Feather name="x" size={22} color={colors.textTertiary} />
        </Pressable>
        <Text style={s.title}>Your stats</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Headline tiles */}
        <View style={s.tileRow}>
          <StatTile
            icon={<MaterialCommunityIcons name="fire" size={18} color={colors.accent} />}
            value={String(streak)}
            label="day streak"
          />
          <StatTile
            icon={<Feather name="layers" size={16} color={colors.accent} />}
            value={String(totals.total)}
            label="reviews"
          />
          <StatTile
            icon={<Feather name="target" size={16} color={colors.accent} />}
            value={accuracy === null ? "—" : `${accuracy}%`}
            label="accuracy"
          />
          <StatTile
            icon={<Feather name="award" size={16} color={colors.accent} />}
            value={`${mastered}/${unlocked}`}
            label="mastered"
          />
        </View>

        {/* 14-day activity */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Reviews · last 14 days</Text>
          <View style={s.barRow} accessibilityLabel="Daily review counts for the last two weeks">
            {days.map((d) => (
              <View key={d.date} style={s.barCol}>
                <View style={s.barTrack}>
                  {d.total > 0 && (
                    <View style={[s.barSeg, s.barWrong, { flex: d.total - d.correct }]} />
                  )}
                  {d.correct > 0 && <View style={[s.barSeg, s.barRight, { flex: d.correct }]} />}
                  <View style={{ flex: maxDay - d.total }} />
                </View>
              </View>
            ))}
          </View>
          <View style={s.legendRow}>
            <View style={[s.legendDot, { backgroundColor: colors.accent }]} />
            <Text style={s.legendText}>correct</Text>
            <View style={[s.legendDot, { backgroundColor: "#d6d3d1" }]} />
            <Text style={s.legendText}>missed</Text>
          </View>
        </View>

        {/* Box distribution */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Where your words live</Text>
          {[1, 2, 3, 4, 5].map((b) => (
            <View key={b} style={s.boxRow} accessibilityLabel={`Box ${b}: ${boxes[b]} words`}>
              <Text style={s.boxLabel}>{b === 5 ? "box 5 ★" : `box ${b}`}</Text>
              <View style={s.boxTrack}>
                <View
                  style={[
                    s.boxFill,
                    b === 5 && { backgroundColor: colors.accentDark },
                    { width: `${(boxes[b] / maxBox) * 100}%` },
                  ]}
                />
              </View>
              <Text style={s.boxCount}>{boxes[b]}</Text>
            </View>
          ))}
          <Text style={s.cardFoot}>
            Higher boxes rest longer between reviews. Box 5 = mastered.
          </Text>
        </View>

        {/* Listening heatmap */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Listening · last 8 weeks</Text>
          <View style={{ gap: 4 }}>
            {weeks.map((row) => (
              <View key={row[0].date} style={s.heatRow}>
                {row.map((cell) => (
                  <View
                    key={cell.date}
                    accessibilityLabel={`${cell.date}: ${
                      cell.done ? "done" : cell.frozen ? "freeze" : "missed"
                    }`}
                    style={[s.heatCell, cell.done && s.heatDone, cell.frozen && s.heatFrozen]}
                  />
                ))}
              </View>
            ))}
          </View>
          <Text style={s.cardFoot}>Oldest week on top · blue = a streak freeze covered you.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function StatTile({ icon, value, label }) {
  return (
    <View style={s.tile} accessibilityLabel={`${value} ${label}`}>
      {icon}
      <Text style={s.tileValue}>{value}</Text>
      <Text style={s.tileLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.md,
  },
  title: { fontSize: font.h2, fontWeight: "600", color: colors.textPrimary },

  tileRow: { flexDirection: "row", gap: 8, marginBottom: space.sm },
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
    gap: 4,
    ...shadow.sm,
  },
  tileValue: { fontSize: font.h2, fontWeight: "700", color: colors.textPrimary },
  tileLabel: { fontSize: font.tiny, color: colors.textTertiary },

  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
    ...shadow.sm,
  },
  cardTitle: {
    fontSize: font.small,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 12,
  },
  cardFoot: { fontSize: font.tiny, color: colors.textTertiary, marginTop: 10, lineHeight: 16 },

  barRow: { flexDirection: "row", gap: 4, height: 72, alignItems: "flex-end" },
  barCol: { flex: 1, height: "100%" },
  barTrack: { flex: 1, flexDirection: "column-reverse", borderRadius: 3, overflow: "hidden" },
  barSeg: { width: "100%" },
  barRight: { backgroundColor: colors.accent },
  barWrong: { backgroundColor: "#d6d3d1" },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: font.tiny, color: colors.textTertiary, marginRight: 8 },

  boxRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  boxLabel: { fontSize: font.tiny, color: colors.textSecondary, width: 48 },
  boxTrack: {
    flex: 1,
    height: 10,
    backgroundColor: "#f0f0ef",
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  boxFill: { height: "100%", backgroundColor: colors.accent, borderRadius: radius.pill },
  boxCount: {
    fontSize: font.tiny,
    fontWeight: "600",
    color: colors.textPrimary,
    width: 28,
    textAlign: "right",
  },

  heatRow: { flexDirection: "row", gap: 4 },
  heatCell: { flex: 1, aspectRatio: 1, borderRadius: 4, backgroundColor: "#f0f0ef" },
  heatDone: { backgroundColor: colors.accent },
  heatFrozen: { backgroundColor: "#bae6fd" },
});
