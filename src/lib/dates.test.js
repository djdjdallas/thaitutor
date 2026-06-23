import { toDateStr, todayStr, parseDate, shiftDay, daysBetween } from "./dates";

describe("toDateStr", () => {
  it("zero-pads month and day", () => {
    expect(toDateStr(new Date(2024, 0, 5))).toBe("2024-01-05");
  });

  it("uses local calendar fields, not UTC", () => {
    // Late-evening local time must NOT roll over to the next UTC day.
    const d = new Date(2024, 2, 15, 23, 30); // Mar 15, 11:30pm local
    expect(toDateStr(d)).toBe("2024-03-15");
  });
});

describe("todayStr", () => {
  it("matches toDateStr(new Date())", () => {
    expect(todayStr()).toBe(toDateStr(new Date()));
  });
});

describe("parseDate", () => {
  it("returns a local-midnight Date", () => {
    const d = parseDate("2024-06-23");
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(5); // June (0-indexed)
    expect(d.getDate()).toBe(23);
    expect(d.getHours()).toBe(0);
  });

  it("round-trips through toDateStr", () => {
    expect(toDateStr(parseDate("2024-12-31"))).toBe("2024-12-31");
  });
});

describe("shiftDay", () => {
  it("moves forward", () => {
    expect(shiftDay("2024-01-01", 1)).toBe("2024-01-02");
  });

  it("moves backward", () => {
    expect(shiftDay("2024-01-01", -1)).toBe("2023-12-31");
  });

  it("crosses month boundaries", () => {
    expect(shiftDay("2024-01-31", 1)).toBe("2024-02-01");
  });

  it("handles leap day", () => {
    expect(shiftDay("2024-02-28", 1)).toBe("2024-02-29");
    expect(shiftDay("2023-02-28", 1)).toBe("2023-03-01");
  });

  it("is identity for a zero shift", () => {
    expect(shiftDay("2024-06-23", 0)).toBe("2024-06-23");
  });
});

describe("daysBetween", () => {
  it("is zero for the same day", () => {
    expect(daysBetween("2024-06-23", "2024-06-23")).toBe(0);
  });

  it("is positive when b is later", () => {
    expect(daysBetween("2024-06-23", "2024-06-30")).toBe(7);
  });

  it("is negative when b is earlier", () => {
    expect(daysBetween("2024-06-30", "2024-06-23")).toBe(-7);
  });

  it("counts across a DST boundary without hour drift", () => {
    // US spring-forward is in March; the day count must still be exact.
    expect(daysBetween("2024-03-09", "2024-03-11")).toBe(2);
  });

  it("counts across a year boundary", () => {
    expect(daysBetween("2023-12-31", "2024-01-01")).toBe(1);
  });
});
