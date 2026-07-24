// Pure date math for daily reminders (no expo imports, fully unit-testable).
//
// We schedule concrete one-off notifications for the next N days instead of a
// single repeating one, because a repeating trigger can't skip today once the
// Listening block is done — and a reminder to do something you already did
// teaches people to ignore reminders. The schedule is re-armed on every app
// launch and every block toggle, so the 7-day horizon refreshes constantly;
// it only runs dry if the app isn't opened at all for a week.

export const REMINDER_DAYS = 7;
export const TIME_STEP_MINUTES = 30;

// "19:00" -> { hour: 19, minute: 0 }. Invalid input falls back to 19:00.
export function parseTime(str) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(str || "");
  if (!m) return { hour: 19, minute: 0 };
  const hour = Math.min(23, Math.max(0, parseInt(m[1], 10)));
  const minute = Math.min(59, Math.max(0, parseInt(m[2], 10)));
  return { hour, minute };
}

export function formatTime({ hour, minute }) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(hour)}:${pad(minute)}`;
}

// Step a "HH:MM" string by +/- minutes, wrapping around midnight.
export function shiftTime(str, deltaMinutes) {
  const { hour, minute } = parseTime(str);
  let total = (hour * 60 + minute + deltaMinutes) % (24 * 60);
  if (total < 0) total += 24 * 60;
  return formatTime({ hour: Math.floor(total / 60), minute: total % 60 });
}

// The concrete Dates to schedule: one per day at the chosen local time,
// starting today. Today is dropped if its time already passed or if the
// Listening block is already done (nothing to nag about).
export function computeReminderDates({ now, time, skipToday = false, days = REMINDER_DAYS }) {
  const { hour, minute } = parseTime(time);
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, hour, minute, 0, 0);
    if (d <= now) continue; // today's slot already passed
    if (i === 0 && skipToday) continue; // already studied today
    out.push(d);
  }
  return out;
}
