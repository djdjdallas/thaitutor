// Tiny haptics wrapper. Grading a card or answering a lesson step gets a
// physical tick — success feels different from a miss, which makes fast
// review sessions satisfying without looking at the feedback text.
//
// Strictly best-effort: haptics can fail (web, simulators, disabled in OS
// settings) and none of that may ever break a review session.

import * as Haptics from "expo-haptics";

export function answerFeedback(correct) {
  try {
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  } catch {
    // No haptics available — silently fine.
  }
}
