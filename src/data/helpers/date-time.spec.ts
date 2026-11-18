import {
  businessDayKey,
  businessDayRange,
  businessWeekdayLabel,
  defaultBusinessRange,
  parseBusinessPeriodEnd,
  parseBusinessPeriodStart,
  parseCivilDate,
  parseDateOnly,
  parseInstant,
  shiftDateOnly,
} from "./date-time";

describe("parseInstant", () => {
  test("Should parse ISO with Z or offset", () => {
    expect(parseInstant("2026-11-18T23:10:00.000Z")?.toISOString()).toBe("2026-11-18T23:10:00.000Z");
    expect(parseInstant("2026-11-18T20:10:00-03:00")?.toISOString()).toBe("2026-11-18T23:10:00.000Z");
  });

  test("Should reject values without offset or invalid", () => {
    expect(parseInstant("2026-11-18T20:10:00")).toBeNull();
    expect(parseInstant("2026-11-18")).toBeNull();
    expect(parseInstant("abc")).toBeNull();
    expect(parseInstant(undefined)).toBeNull();
  });
});

describe("parseDateOnly", () => {
  test("Should return UTC midnight for a valid civil date", () => {
    expect(parseDateOnly("2026-11-18")?.toISOString()).toBe("2026-11-18T00:00:00.000Z");
  });

  test("Should reject invalid civil dates", () => {
    expect(parseDateOnly("2026-02-30")).toBeNull();
    expect(parseDateOnly("18/11/2026")).toBeNull();
  });
});

describe("businessDayKey", () => {
  test("Should keep a 21:30 order in the same Sao Paulo day", () => {
    expect(businessDayKey(new Date("2026-11-19T00:30:00.000Z"))).toBe("2026-11-18");
  });

  test("Should move to the next day at Sao Paulo midnight", () => {
    expect(businessDayKey(new Date("2026-11-19T03:00:00.000Z"))).toBe("2026-11-19");
  });
});

describe("businessDayRange", () => {
  test("Should map civil days to a half-open UTC range", () => {
    const range = businessDayRange("2026-11-18", "2026-11-18");
    expect(range.startDate.toISOString()).toBe("2026-11-18T03:00:00.000Z");
    expect(range.endDate.toISOString()).toBe("2026-11-19T03:00:00.000Z");
  });

  test("Should cross month and year boundaries", () => {
    const range = businessDayRange("2026-12-31", "2026-12-31");
    expect(range.endDate.toISOString()).toBe("2027-01-01T03:00:00.000Z");
  });
});

describe("shiftDateOnly / defaultBusinessRange / businessWeekdayLabel", () => {
  test("Should shift civil dates", () => {
    expect(shiftDateOnly("2026-03-01", -1)).toBe("2026-02-28");
  });

  test("Should build the last N days ending today in Sao Paulo", () => {
    const range = defaultBusinessRange(7, new Date("2026-11-19T00:30:00.000Z"));
    expect(range.startDate.toISOString()).toBe("2026-11-12T03:00:00.000Z");
    expect(range.endDate.toISOString()).toBe("2026-11-19T03:00:00.000Z");
  });

  test("Should label the weekday in Sao Paulo", () => {
    expect(businessWeekdayLabel(new Date("2026-11-19T00:30:00.000Z"))).toBe("qua");
  });
});

describe("parseCivilDate", () => {
  test("Should keep civil dates and UTC-midnight instants as they are", () => {
    expect(parseCivilDate("2026-11-18")?.toISOString()).toBe("2026-11-18T00:00:00.000Z");
    expect(parseCivilDate("2026-11-18T00:00:00.000Z")?.toISOString()).toBe("2026-11-18T00:00:00.000Z");
  });

  test("Should use the Sao Paulo day for other instants", () => {
    expect(parseCivilDate("2026-11-19T01:00:00.000Z")?.toISOString()).toBe("2026-11-18T00:00:00.000Z");
    expect(parseCivilDate("2026-11-18T15:00:00.000Z")?.toISOString()).toBe("2026-11-18T00:00:00.000Z");
  });

  test("Should reject invalid or ambiguous values", () => {
    expect(parseCivilDate("2026-11-18T10:00:00")).toBeNull();
    expect(parseCivilDate("abc")).toBeNull();
    expect(parseCivilDate(undefined)).toBeNull();
  });
});

describe("parseBusinessPeriodStart / parseBusinessPeriodEnd", () => {
  test("Should map civil dates to the Sao Paulo day boundaries", () => {
    expect(parseBusinessPeriodStart("2026-11-01")?.toISOString()).toBe("2026-11-01T03:00:00.000Z");
    expect(parseBusinessPeriodEnd("2026-11-07")?.toISOString()).toBe("2026-11-08T03:00:00.000Z");
  });

  test("Should keep instants with offset and ignore invalid values", () => {
    expect(parseBusinessPeriodStart("2026-11-01T03:00:00.000Z")?.toISOString()).toBe("2026-11-01T03:00:00.000Z");
    expect(parseBusinessPeriodEnd("2026-11-07T10:00:00")).toBeUndefined();
    expect(parseBusinessPeriodEnd(["2026-11-07"])).toBeUndefined();
    expect(parseBusinessPeriodStart("")).toBeUndefined();
  });
});
