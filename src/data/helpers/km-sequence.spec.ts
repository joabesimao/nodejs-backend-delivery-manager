import { findKmNeighbors, isKmBetweenNeighbors, isKmSequenceValid } from "./km-sequence";

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

describe("findKmNeighbors / isKmBetweenNeighbors", () => {
  const entries = [
    { id: 3, km: 1500, date: new Date("2026-09-30") },
    { id: 1, km: 800, date: new Date("2026-09-10") },
    { id: 2, km: 1000, date: new Date("2026-09-20") },
  ];

  test("Should return the entries around the date", () => {
    expect(findKmNeighbors(entries, new Date("2026-09-25"))).toEqual({ previous: entries[2], next: entries[0] });
  });

  test("Should return no previous before the first entry and no next after the last", () => {
    expect(findKmNeighbors(entries, new Date("2026-09-01"))).toEqual({ previous: undefined, next: entries[1] });
    expect(findKmNeighbors(entries, new Date("2026-10-01"))).toEqual({ previous: entries[0], next: undefined });
  });

  test("Should place a new entry after the entries with the same date", () => {
    expect(findKmNeighbors(entries, new Date("2026-09-20"))).toEqual({ previous: entries[2], next: entries[0] });
  });

  test("Should require km strictly between the neighbors", () => {
    const neighbors = findKmNeighbors(entries, new Date("2026-09-25"));
    expect(isKmBetweenNeighbors(neighbors, 1200)).toBe(true);
    expect(isKmBetweenNeighbors(neighbors, 1000)).toBe(false);
    expect(isKmBetweenNeighbors(neighbors, 1500)).toBe(false);
    expect(isKmBetweenNeighbors({}, 0)).toBe(true);
  });
});
