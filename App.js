import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

import { colors, radius, font } from "./src/theme";
import { todayStr, shiftDay } from "./src/lib/dates";
import {
  initDatabase, getDeck, getDueCards, getLog, setBlock,
  recordReview, countMastered, getListeningDates,
} from "./src/db/database";
import { maybeSync } from "./src/lib/supabaseSync";
import TodayScreen from "./src/components/TodayScreen";
import ReviewScreen from "./src/components/ReviewScreen";

// Streak = consecutive days the protected Listening block was done, ending
// today (or yesterday, so it doesn't drop to 0 before you've studied today).
function computeStreak(dates, today) {
  const set = new Set(dates);
  const done = (d) => set.has(d);
  let cur = done(today) ? today : shiftDay(today, -1);
  if (!done(cur)) return 0;
  let count = 0;
  while (done(cur)) {
    count++;
    cur = shiftDay(cur, -1);
  }
  return count;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("today");

  const [log, setLog] = useState({ listening: false, speaking: false, vocab: false, freeplay: false });
  const [streak, setStreak] = useState(0);
  const [dueCount, setDueCount] = useState(0);
  const [mastered, setMastered] = useState(0);
  const [total, setTotal] = useState(0);

  const [reviewQueue, setReviewQueue] = useState([]);
  const [sessionDone, setSessionDone] = useState(false);

  const today = todayStr();

  // Pull all derived state out of SQLite. Cheap (tiny dataset), so we just
  // call this after any write rather than hand-tuning each piece of state.
  async function loadAll() {
    const deck = await getDeck();
    const due = await getDueCards(today);
    const todayLog = await getLog(today);
    const listening = await getListeningDates();
    setTotal(deck.length);
    setDueCount(due.length);
    setLog(todayLog);
    setStreak(computeStreak(listening, today));
    setMastered(await countMastered());
  }

  useEffect(() => {
    (async () => {
      await initDatabase();
      await loadAll();
      setReady(true);
    })();
  }, []);

  async function toggleBlock(key) {
    await setBlock(today, key, !log[key]);
    await maybeSync(); // no-op until Phase 2
    await loadAll();
  }

  async function startReview() {
    const due = await getDueCards(today);
    setReviewQueue(due);
    setSessionDone(false);
    setView("review");
  }

  async function gradeCard(card, correct) {
    await recordReview(card.id, card.box, correct, today);
  }

  async function finishSession() {
    await setBlock(today, "vocab", true); // completing review checks off the Vocab block
    await maybeSync();
    setSessionDone(true);
    setReviewQueue([]);
    await loadAll();
  }

  if (!ready) {
    return (
      <View style={s.loading}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
        <StatusBar style="dark" />

        {/* Segmented tabs */}
        <View style={s.tabs}>
          <TabButton active={view === "today"} onPress={() => setView("today")} icon="calendar" label="Today" />
          <TabButton
            active={view === "review"}
            onPress={() => { setSessionDone(false); setView("review"); }}
            icon="book-open"
            label={dueCount ? `Review (${dueCount})` : "Review"}
          />
        </View>

        <View style={{ flex: 1 }}>
          {view === "today" ? (
            <TodayScreen
              streak={streak}
              log={log}
              dueCount={dueCount}
              mastered={mastered}
              total={total}
              onToggle={toggleBlock}
              onStartReview={startReview}
            />
          ) : (
            <ReviewScreen
              queue={reviewQueue}
              sessionDone={sessionDone}
              dueCount={dueCount}
              onGrade={gradeCard}
              onStart={startReview}
              onReplayDone={finishSession}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TabButton({ active, onPress, icon, label }) {
  return (
    <Pressable onPress={onPress} style={[s.tab, active && s.tabActive]}>
      <Feather name={icon} size={16} color={active ? colors.textPrimary : colors.textTertiary} />
      <Text style={[s.tabLabel, active && s.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  tabs: { flexDirection: "row", gap: 4, backgroundColor: "#f0f0ef", borderRadius: radius.md, padding: 4, marginHorizontal: 20, marginTop: 8 },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 10, borderRadius: radius.sm },
  tabActive: { backgroundColor: colors.surface },
  tabLabel: { fontSize: font.small, fontWeight: "500", color: colors.textTertiary },
  tabLabelActive: { color: colors.textPrimary },
});
