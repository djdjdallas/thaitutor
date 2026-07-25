const {
  computeStreak,
  computeWeek,
  findBridgeDay,
  freezeAward,
  FREEZE_BANK_CAP,
} = require("./streak");

const set = (...dates) => new Set(dates);

describe("computeStreak", () => {
  it("counts consecutive covered days ending today", () => {
    expect(computeStreak(set("2024-06-21", "2024-06-22", "2024-06-23"), "2024-06-23")).toBe(3);
  });

  it("doesn't drop to 0 before today is studied (ends yesterday)", () => {
    expect(computeStreak(set("2024-06-21", "2024-06-22"), "2024-06-23")).toBe(2);
  });

  it("is 0 when both today and yesterday are uncovered", () => {
    expect(computeStreak(set("2024-06-20"), "2024-06-23")).toBe(0);
  });

  it("counts frozen days the same as studied days (covered = union)", () => {
    const covered = set("2024-06-20", "2024-06-21", "2024-06-22", "2024-06-23");
    expect(computeStreak(covered, "2024-06-23")).toBe(4);
  });
});

describe("findBridgeDay", () => {
  it("bridges a single missed yesterday on a live streak", () => {
    expect(findBridgeDay(set("2024-06-21"), "2024-06-23")).toBe("2024-06-22");
  });

  it("does nothing when yesterday is covered", () => {
    expect(findBridgeDay(set("2024-06-22"), "2024-06-23")).toBeNull();
  });

  it("won't resurrect a streak dead for 2+ days", () => {
    expect(findBridgeDay(set("2024-06-19"), "2024-06-23")).toBeNull();
    expect(findBridgeDay(set(), "2024-06-23")).toBeNull();
  });
});

describe("freezeAward", () => {
  it("awards one freeze at each 7-day milestone", () => {
    expect(freezeAward(6, 0, 0)).toEqual({ earned: 0, milestone: 0 });
    expect(freezeAward(7, 0, 0)).toEqual({ earned: 1, milestone: 1 });
    expect(freezeAward(14, 1, 1)).toEqual({ earned: 1, milestone: 2 });
  });

  it("doesn't re-award an already-passed milestone", () => {
    expect(freezeAward(8, 1, 1)).toEqual({ earned: 0, milestone: 1 });
  });

  it("caps the bank", () => {
    expect(freezeAward(21, 0, FREEZE_BANK_CAP)).toEqual({ earned: 0, milestone: 3 });
    expect(freezeAward(21, 0, FREEZE_BANK_CAP - 1)).toEqual({ earned: 1, milestone: 3 });
  });

  it("lowers the milestone mark after a broken streak so earning restarts", () => {
    expect(freezeAward(0, 3, 1)).toEqual({ earned: 0, milestone: 0 });
    // ...and the next 7-day run earns again from the lowered mark.
    expect(freezeAward(7, 0, 1)).toEqual({ earned: 1, milestone: 1 });
  });
});

describe("computeWeek", () => {
  it("tags each of the last 7 days as done, frozen, or missed", () => {
    const week = computeWeek(set("2024-06-23", "2024-06-21"), set("2024-06-22"), "2024-06-23");
    expect(week).toHaveLength(7);
    const byDate = Object.fromEntries(week.map((d) => [d.date, d]));
    expect(byDate["2024-06-23"]).toMatchObject({ done: true, frozen: false, isToday: true });
    expect(byDate["2024-06-22"]).toMatchObject({ done: false, frozen: true });
    expect(byDate["2024-06-20"]).toMatchObject({ done: false, frozen: false });
    expect(week[6].date).toBe("2024-06-23"); // oldest -> today ordering
  });
});
