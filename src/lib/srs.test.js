import { BOX_INTERVAL, MAX_BOX, isDue, dueDate, nextBox } from "./srs";
import { shiftDay } from "./dates";

const TODAY = "2024-06-23";

describe("isDue", () => {
  it("is always due when never reviewed", () => {
    expect(isDue({ box: 1, last_reviewed: null }, TODAY)).toBe(true);
  });

  it("box 1 is due again the next day", () => {
    // Interval 0: reviewed yesterday -> due today.
    expect(isDue({ box: 1, last_reviewed: shiftDay(TODAY, -1) }, TODAY)).toBe(true);
  });

  it("box 1 reviewed today is still due (interval 0)", () => {
    expect(isDue({ box: 1, last_reviewed: TODAY }, TODAY)).toBe(true);
  });

  it("higher boxes are not due until their interval has elapsed", () => {
    // Box 3 rests 3 days.
    const card = { box: 3, last_reviewed: shiftDay(TODAY, -2) };
    expect(isDue(card, TODAY)).toBe(false);
  });

  it("becomes due exactly on the interval boundary", () => {
    const card = { box: 3, last_reviewed: shiftDay(TODAY, -BOX_INTERVAL[3]) };
    expect(isDue(card, TODAY)).toBe(true);
  });

  it("is due when overdue", () => {
    const card = { box: 5, last_reviewed: shiftDay(TODAY, -30) };
    expect(isDue(card, TODAY)).toBe(true);
  });

  it("box 5 is not due one day before its 14-day interval", () => {
    const card = { box: 5, last_reviewed: shiftDay(TODAY, -13) };
    expect(isDue(card, TODAY)).toBe(false);
  });
});

describe("dueDate", () => {
  it("is null for a never-reviewed card (due now)", () => {
    expect(dueDate({ box: 1, last_reviewed: null })).toBeNull();
  });

  it("box 1 is due again the day after review (interval 0)", () => {
    expect(dueDate({ box: 1, last_reviewed: "2024-06-23" })).toBe("2024-06-23");
  });

  it("adds the box interval to the last review date", () => {
    // Box 4 rests 7 days.
    expect(dueDate({ box: 4, last_reviewed: "2024-06-23" })).toBe(
      shiftDay("2024-06-23", BOX_INTERVAL[4])
    );
  });

  it("agrees with isDue on the boundary", () => {
    const card = { box: 3, last_reviewed: "2024-06-23" };
    const due = dueDate(card);
    expect(isDue(card, due)).toBe(true);
    expect(isDue(card, shiftDay(due, -1))).toBe(false);
  });
});

describe("nextBox", () => {
  it("promotes one box on a correct answer", () => {
    expect(nextBox(1, true)).toBe(2);
    expect(nextBox(3, true)).toBe(4);
  });

  it("caps promotion at MAX_BOX", () => {
    expect(nextBox(MAX_BOX, true)).toBe(MAX_BOX);
  });

  it("drops to box 1 on a miss, from any box", () => {
    expect(nextBox(1, false)).toBe(1);
    expect(nextBox(5, false)).toBe(1);
  });
});

describe("BOX_INTERVAL", () => {
  it("defines an interval for every box and is non-decreasing", () => {
    for (let b = 1; b <= MAX_BOX; b++) {
      expect(typeof BOX_INTERVAL[b]).toBe("number");
    }
    expect(BOX_INTERVAL[1]).toBe(0);
    for (let b = 2; b <= MAX_BOX; b++) {
      expect(BOX_INTERVAL[b]).toBeGreaterThanOrEqual(BOX_INTERVAL[b - 1]);
    }
  });
});
