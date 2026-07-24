import React from "react";
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, space, radius, font } from "../theme";
import { speakThai } from "../lib/tts";

// "How do I read the English letters?" — a legend for the romanization system.
// Every row is tappable so the learner can HEAR each tone while reading its
// mark; the marks only mean something once they're attached to sounds.
const TONES = [
  { mark: "a", name: "mid", hint: "steady, flat", thai: "มา", roman: "maa", en: "come" },
  {
    mark: "à",
    name: "low",
    hint: "starts low, stays low",
    thai: "ไก่",
    roman: "gài",
    en: "chicken",
  },
  {
    mark: "â",
    name: "falling",
    hint: "drops, like scolding 'no!'",
    thai: "ไม่",
    roman: "mâi",
    en: "not",
  },
  { mark: "á", name: "high", hint: "pitched up, tense", thai: "น้ำ", roman: "náam", en: "water" },
  {
    mark: "ǎ",
    name: "rising",
    hint: "swoops up, like asking 'yes?'",
    thai: "หมู",
    roman: "mǔu",
    en: "pork",
  },
];

export default function PronunciationGuide({ visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.headerRow}>
            <Text style={s.title}>How to read the sounds</Text>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close the pronunciation guide"
            >
              <Feather name="x" size={22} color={colors.textTertiary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={s.intro}>
              The English letters are a pronunciation guide. The accent mark on the vowel is the
              TONE — in Thai, tone changes the word's meaning. Tap a row to hear it.
            </Text>

            {TONES.map((t) => (
              <Pressable
                key={t.name}
                onPress={() => speakThai(t.thai)}
                accessibilityRole="button"
                accessibilityLabel={`${t.name} tone, ${t.hint}. Example: ${t.roman}, ${t.en}. Tap to hear.`}
                style={({ pressed }) => [s.row, pressed && { backgroundColor: colors.accentSoft }]}
              >
                <Text style={s.mark}>{t.mark}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.toneName}>
                    {t.name} <Text style={s.toneHint}>— {t.hint}</Text>
                  </Text>
                  <Text style={s.example}>
                    {t.thai} · {t.roman} · {t.en}
                  </Text>
                </View>
                <Feather name="volume-2" size={16} color={colors.textTertiary} />
              </Pressable>
            ))}

            <View style={s.extra}>
              <Text style={s.extraLine}>
                <Text style={s.extraKey}>Double vowels</Text> are held longer: mâak, dii, khǎao.
              </Text>
              <Text style={s.extraLine}>
                <Text style={s.extraKey}>Spaces</Text> separate syllables: sà nǎam bin = three
                beats.
              </Text>
              <Text style={s.extraLine}>
                <Text style={s.extraKey}>When in doubt,</Text> trust the audio — the letters are the
                map, the sound is the territory.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// The small "?" trigger that opens the guide, shown wherever romanization
// appears prominently.
export function GuideTrigger({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="How do I read the pronunciation letters?"
      style={({ pressed }) => [s.trigger, pressed && { backgroundColor: colors.accentSoft }]}
    >
      <Feather name="help-circle" size={13} color={colors.textTertiary} />
      <Text style={s.triggerText}>how to read this</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: space.md,
    maxHeight: "85%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { fontSize: font.h2, fontWeight: "600", color: colors.textPrimary },
  intro: { fontSize: font.small, color: colors.textSecondary, lineHeight: 20, marginBottom: 12 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
  },
  mark: {
    fontSize: 26,
    fontWeight: "600",
    color: colors.accentDark,
    width: 30,
    textAlign: "center",
  },
  toneName: { fontSize: font.body, fontWeight: "600", color: colors.textPrimary },
  toneHint: { fontWeight: "400", color: colors.textSecondary, fontSize: font.small },
  example: { fontSize: font.small, color: colors.textTertiary, marginTop: 2 },

  extra: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    marginTop: 10,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
  },
  extraLine: { fontSize: font.small, color: colors.textSecondary, lineHeight: 20 },
  extraKey: { fontWeight: "600", color: colors.textPrimary },

  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  triggerText: { fontSize: font.tiny, color: colors.textTertiary },
});
