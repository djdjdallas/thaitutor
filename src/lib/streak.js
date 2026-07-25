// Streak math + freeze (streak protection) logic. Pure functions over date
// strings and Sets, moved out of App.js so the freeze rules are unit-tested —
// streaks are the emotional core of the app, and a streak bug that wrongly
// zeroes someone's 40 days is the worst bug we could ship.
//
// The freeze model, kept deliberately simple and honest:
//   - You EARN one freeze each time your streak crosses another 7 days
//     (banked, capped at 2 — a safety net, not an infinite excuse).
//   - A freeze is SPENT automatically at launch to bridge exactly one missed
//     yesterday. Two or more missed days = the streak is genuinely over.
//   - Frozen days live in their own table; the honest study log is untouched.

import { shiftDay } from "./dates";

export const FREEZE_BANK_CAP = 2;
export const FREEZE_MILESTONE_DAYS = 7;

// Consecutive covered days ending today (or yesterday, so the streak doesn't
// read 0 before you've studied today). `covered` = studied ∪ frozen dates.
export function computeStreak(covered, today) {
  const done = (d) => covered.has(d);
  let cur = done(today) ? today : shiftDay(today, -1);
  if (!done(cur)) return 0;
  let count = 0;
  while (done(cur)) {
    count++;
    cur = shiftDay(cur, -1);
  }
  return count;
}

// The last 7 days (oldest -> today) for the weekly dot strip, each tagged with
// how it was covered: studied for real, bridged by a freeze, or missed.
export function computeWeek(listeningSet, freezeSet, today) {
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const date = shiftDay(today, -i);
    out.push({
      date,
      done: listeningSet.has(date),
      frozen: !listeningSet.has(date) && freezeSet.has(date),
      isToday: i === 0,
    });
  }
  return out;
}

// The single day a freeze should bridge, or null. Rules: only yesterday is
// bridgeable (today is still in play), and only if the day before it was
// covered — a freeze extends a live streak, it can't resurrect a dead one.
export function findBridgeDay(covered, today) {
  const yesterday = shiftDay(today, -1);
  if (covered.has(yesterday)) return null;
  if (!covered.has(shiftDay(today, -2))) return null;
  return yesterday;
}

// How many new freezes this streak has earned past the last awarded milestone,
// respecting the bank cap. Returns { earned, milestone } where `milestone` is
// the new high-water mark to persist. A broken streak lowers the mark so the
// next run can earn again.
export function freezeAward(streak, lastMilestone, bank) {
  const milestone = Math.floor(streak / FREEZE_MILESTONE_DAYS);
  if (milestone < lastMilestone) return { earned: 0, milestone };
  const earned = Math.min(milestone - lastMilestone, Math.max(0, FREEZE_BANK_CAP - bank));
  return { earned, milestone };
}
