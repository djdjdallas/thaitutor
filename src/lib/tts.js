// Text-to-speech wrapper. This is how you HEAR a card pronounced.
//
// expo-speech uses the phone's built-in OS voice engine, so it works offline
// AS LONG AS the device has a Thai voice installed:
//   - iOS ships a Thai voice by default.
//   - Android: the user may need to install the Google TTS Thai voice once
//     (Settings -> System -> Languages & input -> Text-to-speech). We surface
//     a gentle hint in the UI if speaking silently fails.
//
// Note: this is OS TTS, not a neural voice. It's clear enough to learn from but
// not studio quality. Phase 3 (Whisper) adds the "check MY pronunciation" loop.

import * as Speech from "expo-speech";

export function speakThai(text) {
  // Stop anything currently playing so taps don't stack up.
  Speech.stop();
  Speech.speak(text, {
    language: "th-TH",
    rate: 0.85, // slightly slowed so beginners can catch the syllables
    pitch: 1.0,
  });
}

export function stopSpeaking() {
  Speech.stop();
}

// Best-effort check: do we have any Thai voice on this device?
// Used to decide whether to show the "install a Thai voice" hint.
export async function hasThaiVoice() {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.some((v) => (v.language || "").toLowerCase().startsWith("th"));
  } catch {
    return true; // if the check itself fails, don't nag the user
  }
}
