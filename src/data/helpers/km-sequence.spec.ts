import { isKmSequenceValid } from "./km-sequence";

describe("isKmSequenceValid", () => {
  test("Should return true when km grows with the date", () => {
    expect(
      isKmSequenceValid([
        { id: 2, km: 1500, date: new Date("2026-09-20") },
        { id: 1, km: 1000, date: new Date("2026-09-10") },
      ])
    ).toBe(true);
  });

  test("Should return false when a later entry has lower or equal km", () => {
    expect(
      isKmSequenceValid([
        { id: 1, km: 1000, date: new Date("2026-09-10") },
        { id: 2, km: 1000, date: new Date("2026-09-20") },
      ])
    ).toBe(false);
  });

  test("Should break date ties by id", () => {
    const date = new Date("2026-09-10");
    expect(isKmSequenceValid([{ id: 2, km: 900, date }, { id: 1, km: 1000, date }])).toBe(false);
    expect(isKmSequenceValid([{ id: 2, km: 1100, date }, { id: 1, km: 1000, date }])).toBe(true);
  });
});
