const {
  parseTime,
  formatTime,
  shiftTime,
  computeReminderDates,
  REMINDER_DAYS,
} = require("./reminderTimes");

describe("parseTime / formatTime / shiftTime", () => {
  it("round-trips a valid time and falls back to 19:00 on garbage", () => {
    expect(formatTime(parseTime("07:30"))).toBe("07:30");
    expect(formatTime(parseTime("23:59"))).toBe("23:59");
    expect(formatTime(parseTime("not a time"))).toBe("19:00");
    expect(formatTime(parseTime(null))).toBe("19:00");
  });

  it("steps forward and backward, wrapping around midnight", () => {
    expect(shiftTime("19:00", 30)).toBe("19:30");
    expect(shiftTime("19:00", -30)).toBe("18:30");
    expect(shiftTime("23:45", 30)).toBe("00:15");
    expect(shiftTime("00:15", -30)).toBe("23:45");
  });
});

describe("computeReminderDates", () => {
  // A fixed local "now": June 23, 2024 at 12:00.
  const noon = new Date(2024, 5, 23, 12, 0, 0);

  it("schedules one slot per day at the chosen time, starting today", () => {
    const dates = computeReminderDates({ now: noon, time: "19:00" });
    expect(dates).toHaveLength(REMINDER_DAYS);
    expect(dates[0].getDate()).toBe(23);
    expect(dates[0].getHours()).toBe(19);
    expect(dates[0].getMinutes()).toBe(0);
    expect(dates[6].getDate()).toBe(29);
  });

  it("drops today when its time has already passed", () => {
    const evening = new Date(2024, 5, 23, 20, 0, 0); // past 19:00
    const dates = computeReminderDates({ now: evening, time: "19:00" });
    expect(dates).toHaveLength(REMINDER_DAYS - 1);
    expect(dates[0].getDate()).toBe(24); // starts tomorrow
  });

  it("drops today when listening is already done", () => {
    const dates = computeReminderDates({ now: noon, time: "19:00", skipToday: true });
    expect(dates).toHaveLength(REMINDER_DAYS - 1);
    expect(dates[0].getDate()).toBe(24);
  });

  it("every returned date is in the future", () => {
    const lateNight = new Date(2024, 5, 23, 23, 30, 0);
    const dates = computeReminderDates({ now: lateNight, time: "08:00" });
    expect(dates.every((d) => d > lateNight)).toBe(true);
    expect(dates[0].getDate()).toBe(24);
    expect(dates[0].getHours()).toBe(8);
  });

  it("handles month boundaries", () => {
    const endOfMonth = new Date(2024, 5, 29, 12, 0, 0); // June 29
    const dates = computeReminderDates({ now: endOfMonth, time: "19:00" });
    const days = dates.map((d) => `${d.getMonth() + 1}-${d.getDate()}`);
    expect(days).toContain("7-1"); // rolls into July
  });
});
