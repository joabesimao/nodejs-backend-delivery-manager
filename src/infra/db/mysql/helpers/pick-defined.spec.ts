import { pickDefined } from "./pick-defined";

describe("pickDefined()", () => {
  test("Should keep only the allowed keys", () => {
    const source = { id: 99, name: "any_name", status: false };
    expect(pickDefined(source, ["name"])).toEqual({ name: "any_name" });
  });

  test("Should skip undefined values", () => {
    const source: { name?: string; phone?: string } = { name: "any_name", phone: undefined };
    expect(pickDefined(source, ["name", "phone"])).toEqual({ name: "any_name" });
  });

  test("Should keep falsy values that are not undefined", () => {
    const source = { cpf: "", brand: null as string | null, cityId: 0, active: false };
    expect(pickDefined(source, ["cpf", "brand", "cityId", "active"])).toEqual({
      cpf: "",
      brand: null,
      cityId: 0,
      active: false,
    });
  });

  test("Should return an empty object if source is undefined", () => {
    expect(pickDefined(undefined as { name?: string }, ["name"])).toEqual({});
  });
});
