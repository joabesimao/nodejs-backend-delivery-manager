import { InvalidParamError } from "../../errors";
import { CivilDateValidation } from "./civil-date-validation";

const makeSut = (): CivilDateValidation => new CivilDateValidation("refillDate");

describe("CivilDateValidation", () => {
  test("Should return null if field is absent", () => {
    expect(makeSut().validate({})).toBeFalsy();
  });

  test("Should accept a civil date or an instant with offset", () => {
    expect(makeSut().validate({ refillDate: "2026-11-18" })).toBeFalsy();
    expect(makeSut().validate({ refillDate: "2026-11-19T01:00:00.000Z" })).toBeFalsy();
  });

  test("Should return InvalidParamError for invalid or ambiguous values", () => {
    expect(makeSut().validate({ refillDate: "2026-02-30" })).toEqual(new InvalidParamError("refillDate"));
    expect(makeSut().validate({ refillDate: "2026-11-18T10:00:00" })).toEqual(new InvalidParamError("refillDate"));
    expect(makeSut().validate({ refillDate: "abc" })).toEqual(new InvalidParamError("refillDate"));
  });
});
