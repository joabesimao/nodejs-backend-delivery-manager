import { countByName, formatDeliverymanName, isValidDate, toValidRange } from "./dashboard-helpers";

describe("dashboard-helpers", () => {
  test("isValidDate rejects missing and invalid dates", () => {
    expect(isValidDate(new Date("2026-11-01"))).toBe(true);
    expect(isValidDate(new Date("x"))).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
  });

  test("toValidRange requires both valid dates", () => {
    const startDate = new Date("2026-11-01");
    const endDate = new Date("2026-11-07");
    expect(toValidRange({ startDate, endDate })).toEqual({ startDate, endDate });
    expect(toValidRange({ startDate })).toBeUndefined();
    expect(toValidRange({ startDate, endDate: new Date("x") })).toBeUndefined();
  });

  test("formatDeliverymanName joins and trims", () => {
    expect(formatDeliverymanName({ name: "João", lastName: "" })).toBe("João");
    expect(formatDeliverymanName({ name: "João", lastName: "Silva" })).toBe("João Silva");
  });

  test("countByName ignores empty names and sorts by value then name", () => {
    expect(countByName(["B", "A", undefined, "B", "", "C", "A"])).toEqual([
      { name: "A", value: 2 },
      { name: "B", value: 2 },
      { name: "C", value: 1 },
    ]);
  });
});
