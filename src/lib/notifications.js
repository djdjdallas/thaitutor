// Thin expo-notifications wrapper for the daily study reminder. All date math
// lives in reminderTimes.js (pure + tested); this file owns the platform bits:
// permissions, the Android channel, and (re)scheduling.
//
// Everything here is best-effort: notifications failing must never break the
// app (it's offline-first and fully usable without them), so callers can
// fire-and-forget these.

import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { computeReminderDates } from "./reminderTimes";

// Show reminders as banners even if the app happens to be foregrounded.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Daily reminder",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

// Ask for permission (no-op if already granted). Returns true when usable.
export async function requestReminderPermission() {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const asked = await Notifications.requestPermissionsAsync();
    return !!asked.granted;
  } catch (e) {
    console.warn("Notification permission check failed:", e);
    return false;
  }
}

// Re-arm the reminder schedule to match current state. Called on boot, on the
// settings changing, and whenever the Listening block flips — so "skip today
// once you've studied" stays true without any background code.
export async function rearmReminders({ enabled, time, listeningDoneToday, now = new Date() }) {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!enabled) return;
    await ensureChannel();
    const dates = computeReminderDates({ now, time, skipToday: listeningDoneToday });
    for (const date of dates) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Thai time 🇹🇭",
          body: "Your Listening block is still open today — keep the streak alive.",
        },
        trigger: Platform.OS === "android" ? { date, channelId: "reminders" } : { date },
      });
    }
  } catch (e) {
    console.warn("Failed to (re)schedule reminders:", e);
  }
}
