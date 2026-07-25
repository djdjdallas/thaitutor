import React, { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, space, radius, shadow, font } from "../theme";
import { speakThai } from "../lib/tts";
import { searchDeck } from "../lib/deckSearch";

// The Deck browser: every card in the catalog, searchable, tappable to hear.
// This is the "wait, how do I say...?" screen — the moment a traveler actually
// needs a word, they need lookup, not a lesson. Search ignores tone marks
// ("mai" finds mâi and mài) since phone keyboards can't type them.
export default function DeckScreen({ deck }) {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const results = searchDeck(deck, query);
  const unlockedCount = deck.filter((c) => c.unlocked).length;

  return (
    <View style={s.wrap}>
      <View style={s.searchBox}>
        <Feather name="search" size={16} color={colors.textTertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search Thai, sounds, or English…"
          placeholderTextColor={colors.textTertiary}
          autoCorrect={false}
          autoCapitalize="none"
          style={s.searchInput}
          accessibilityLabel="Search the deck"
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => setQuery("")}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Feather name="x-circle" size={16} color={colors.textTertiary} />
          </Pressable>
        )}
      </View>

      <Text style={s.countLine}>
        {query
          ? `${results.length} ${results.length === 1 ? "match" : "matches"}`
          : `${deck.length} words · ${unlockedCount} unlocked for review`}
      </Text>

      <FlatList
        data={results}
        keyExtractor={(c) => c.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <CardRow
            card={item}
            expanded={expandedId === item.id}
            onPress={() => {
              speakThai(item.thai);
              setExpandedId(expandedId === item.id ? null : item.id);
            }}
          />
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="inbox" size={22} color={colors.textTertiary} />
            <Text style={s.emptyText}>No matches. Try the sounds ("sawat") or English.</Text>
          </View>
        }
      />
    </View>
  );
}

function CardRow({ card, expanded, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${card.thai}, ${card.roman}, ${card.en}. Tap to hear${
        card.note ? " and see the note" : ""
      }.`}
      style={({ pressed }) => [s.row, pressed && { backgroundColor: colors.accentSoft }]}
    >
      <View style={s.rowMain}>
        <View style={{ flex: 1 }}>
          <View style={s.thaiLine}>
            <Text style={s.rowThai}>{card.thai}</Text>
            <Text style={s.rowRoman}>{card.roman}</Text>
          </View>
          <Text style={s.rowEn}>{card.en}</Text>
          {expanded && !!card.note && <Text style={s.rowNote}>{card.note}</Text>}
        </View>
        {card.unlocked ? (
          <View style={s.dots} accessibilityLabel={`Review progress: box ${card.box} of 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <View key={n} style={[s.dot, n <= card.box ? s.dotOn : s.dotOff]} />
            ))}
          </View>
        ) : (
          <Feather
            name="lock"
            size={14}
            color={colors.textTertiary}
            accessibilityLabel="Locked. Finish its lesson to add it to review."
          />
        )}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 20, paddingTop: space.sm },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...shadow.sm,
  },
  searchInput: { flex: 1, fontSize: font.body, color: colors.textPrimary, padding: 0 },
  countLine: { fontSize: font.tiny, color: colors.textTertiary, marginVertical: 10 },

  row: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: radius.sm,
  },
  rowMain: { flexDirection: "row", alignItems: "center", gap: 12 },
  thaiLine: { flexDirection: "row", alignItems: "baseline", gap: 10, flexWrap: "wrap" },
  rowThai: { fontSize: 20, fontWeight: "500", color: colors.textPrimary },
  rowRoman: { fontSize: font.small, color: colors.textSecondary },
  rowEn: { fontSize: font.small, color: colors.textTertiary, marginTop: 2 },
  rowNote: {
    fontSize: font.small,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 19,
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    padding: 8,
  },
  dots: { flexDirection: "row", gap: 3 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotOn: { backgroundColor: colors.accent },
  dotOff: { backgroundColor: "#e5e5e5" },

  empty: { alignItems: "center", gap: 10, paddingVertical: 40 },
  emptyText: { fontSize: font.small, color: colors.textTertiary, textAlign: "center" },
});
