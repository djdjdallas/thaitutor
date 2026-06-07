// Local-time date helpers.
//
// We deliberately AVOID `Date.prototype.toISOString()` for "today", because it
// converts to UTC first — which can push your local "today" onto the wrong
// calendar day (e.g. it's still Tuesday for you, but already Wednesday in UTC).
// Everything here works in the device's local timezone and uses plain
// "YYYY-MM-DD" strings, which sort and compare correctly as text.

function pad(n) {
  return String(n).padStart(2, "0");
}

// "YYYY-MM-DD" for a given Date, in LOCAL time.
export function toDateStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Today's local date as "YYYY-MM-DD".
export function todayStr() {
  return toDateStr(new Date());
}

// Parse a "YYYY-MM-DD" string into a LOCAL Date at midnight.
// (new Date("2024-01-01") parses as UTC midnight — we don't want that.)
export function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Shift a date string by `delta` days (can be negative). Returns "YYYY-MM-DD".
export function shiftDay(str, delta) {
  const d = parseDate(str);
  d.setDate(d.getDate() + delta);
  return toDateStr(d);
}

// Whole days from `a` to `b` (both "YYYY-MM-DD"). Positive if b is later.
// Uses UTC math on the parsed local-midnight dates purely to count days
// without DST hour drift; the day boundaries themselves are still local.
export function daysBetween(a, b) {
  const da = parseDate(a);
  const db = parseDate(b);
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const utcA = Date.UTC(da.getFullYear(), da.getMonth(), da.getDate());
  const utcB = Date.UTC(db.getFullYear(), db.getMonth(), db.getDate());
  return Math.round((utcB - utcA) / MS_PER_DAY);
}
