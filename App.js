import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

import { colors, radius, font } from "./src/theme";
import { todayStr, shiftDay, daysBetween } from "./src/lib/dates";
import { isDue, dueDate, MAX_BOX } from "./src/lib/srs";
import {
  initDatabase,
  getDeck,
  getDueCards,
  getLog,
  setBlock,
  recordReview,
  countMastered,
  getListeningDates,
  resetDatabase,
  getSetting,
  setSetting,
} from "./src/db/database";
import { maybeSync } from "./src/lib/supabaseSync";
import { hasThaiVoice } from "./src/lib/tts";
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

// The last 7 days (oldest -> today) tagged with whether Listening was done, for
// the weekly dot strip.
function computeWeek(listeningSet, today) {
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const date = shiftDay(today, -i);
    out.push({ date, done: listeningSet.has(date), isToday: i === 0 });
  }
  return out;
}

// A friendly "when does the next card come back" label, or null if something is
// already due (the nudge handles that case).
function computeNextDue(deck, today) {
  let best = null;
  for (const c of deck) {
    if (isDue(c, today)) continue;
    const d = dueDate(c);
    if (d && (best === null || d < best)) best = d;
  }
  if (!best) return null;
  const days = daysBetween(today, best);
  return days <= 1 ? "tomorrow" : `in ${days} days`;
}

// Per-category {mastered, total}, preserving the deck's display order.
function computeCategoryMastery(deck) {
  const order = [];
  const map = {};
  for (const c of deck) {
    const key = c.category || "other";
    if (!map[key]) {
      map[key] = { category: key, mastered: 0, total: 0 };
      order.push(key);
    }
    map[key].total += 1;
    if (c.box >= MAX_BOX) map[key].mastered += 1;
  }
  return order.map((key) => map[key]);
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null); // set if DB init/load throws
  const [view, setView] = useState("today");

  const [log, setLog] = useState({
    listening: false,
    speaking: false,
    vocab: false,
    freeplay: false,
  });
  const [streak, setStreak] = useState(0);
  const [dueCount, setDueCount] = useState(0);
  const [mastered, setMastered] = useState(0);
  const [total, setTotal] = useState(0);
  const [voiceMissing, setVoiceMissing] = useState(false);
  const [week, setWeek] = useState([]);
  const [nextDue, setNextDue] = useState(null);
  const [categories, setCategories] = useState([]);
  const [audioFirst, setAudioFirst] = useState(false);

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
    setWeek(computeWeek(new Set(listening), today));
    setNextDue(computeNextDue(deck, today));
    setCategories(computeCategoryMastery(deck));
    setAudioFirst((await getSetting("audioFirst", "0")) === "1");
  }

  // Boot: open the DB, run migrations, load derived state. If anything throws
  // (corrupt DB, failed migration) we drop into a recovery screen instead of
  // leaving the user staring at a frozen spinner.
  async function boot() {
    setError(null);
    setReady(false);
    try {
      await initDatabase();
      await loadAll();
      setReady(true);
      // Best-effort, non-blocking: warn if no Thai TTS voice is installed.
      hasThaiVoice().then((ok) => setVoiceMissing(!ok));
    } catch (e) {
      console.warn("Database init failed:", e);
      setError(e);
    }
  }

  // Last resort from the recovery screen: wipe + re-seed, then boot again.
  async function recover() {
    setError(null);
    setReady(false);
    try {
      await resetDatabase();
      await loadAll();
      setReady(true);
    } catch (e) {
      console.warn("Database reset failed:", e);
      setError(e);
    }
  }

  useEffect(() => {
    boot(); // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function toggleAudioFirst() {
    const next = !audioFirst;
    setAudioFirst(next); // optimistic; persists below
    await setSetting("audioFirst", next ? "1" : "0");
  }

  async function finishSession() {
    await setBlock(today, "vocab", true); // completing review checks off the Vocab block
    await maybeSync();
    setSessionDone(true);
    setReviewQueue([]);
    await loadAll();
  }

  if (error) {
    return (
      <View style={s.loading}>
        <View style={s.errorCard}>
          <Feather name="alert-triangle" size={28} color={colors.accent} />
          <Text style={s.errorTitle}>Couldn't open your data</Text>
          <Text style={s.errorSub}>
            Something went wrong loading the database. You can try again, or reset it to start
            fresh. Resetting clears your streak and review progress.
          </Text>
          <Pressable
            onPress={boot}
            accessibilityRole="button"
            accessibilityLabel="Try loading your data again"
            style={({ pressed }) => [s.errBtn, pressed && { backgroundColor: colors.accentDark }]}
          >
            <Text style={s.errBtnText}>Try again</Text>
          </Pressable>
          <Pressable
            onPress={recover}
            accessibilityRole="button"
            accessibilityLabel="Reset the database and start fresh"
            style={s.errResetBtn}
          >
            <Text style={s.errResetText}>Reset and start fresh</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={s.loading} accessibilityLabel="Loading">
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
          <TabButton
            active={view === "today"}
            onPress={() => setView("today")}
            icon="calendar"
            label="Today"
          />
          <TabButton
            active={view === "review"}
            onPress={() => {
              setSessionDone(false);
              setView("review");
            }}
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
              voiceMissing={voiceMissing}
              week={week}
              nextDue={nextDue}
              categories={categories}
              onToggle={toggleBlock}
              onStartReview={startReview}
            />
          ) : (
            <ReviewScreen
              queue={reviewQueue}
              sessionDone={sessionDone}
              dueCount={dueCount}
              audioFirst={audioFirst}
              onToggleAudioFirst={toggleAudioFirst}
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
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={[s.tab, active && s.tabActive]}
    >
      <Feather name={icon} size={16} color={active ? colors.textPrimary : colors.textTertiary} />
      <Text style={[s.tabLabel, active && s.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 28,
    alignItems: "center",
    maxWidth: 360,
  },
  errorTitle: { fontSize: font.h2, fontWeight: "600", color: colors.textPrimary, marginTop: 12 },
  errorSub: {
    fontSize: font.small,
    color: colors.textTertiary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  errBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 20,
    alignSelf: "stretch",
    alignItems: "center",
  },
  errBtnText: { fontSize: font.body, fontWeight: "600", color: "#fff" },
  errResetBtn: { paddingVertical: 12, marginTop: 4 },
  errResetText: { fontSize: font.small, color: colors.textTertiary },
  tabs: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: "#f0f0ef",
    borderRadius: radius.md,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  tabActive: { backgroundColor: colors.surface },
  tabLabel: { fontSize: font.small, fontWeight: "500", color: colors.textTertiary },
  tabLabelActive: { color: colors.textPrimary },
});
