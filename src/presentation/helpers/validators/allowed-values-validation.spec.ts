import { InvalidParamError } from "../../errors";
import { AllowedValuesValidation } from "./allowed-values-validation";

const makeSut = (): AllowedValuesValidation => {
  return new AllowedValuesValidation("role", ["admin", "user"]);
};

describe("AllowedValues Validation", () => {
  test("Should return an InvalidParamError if value is not allowed", () => {
    const sut = makeSut();
    const error = sut.validate({ role: "not_allowed_role" });
    expect(error).toEqual(new InvalidParamError("role"));
  });

  test("Should not return if value is allowed", () => {
    const sut = makeSut();
    const error = sut.validate({ role: "admin" });
    expect(error).toBeFalsy();
  });

  test("Should not return if field is not provided (optional field)", () => {
    const sut = makeSut();
    const error = sut.validate({});
    expect(error).toBeFalsy();
  });
});
