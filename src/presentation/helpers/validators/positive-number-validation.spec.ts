import { InvalidParamError } from "../../errors";
import { PositiveNumberValidation } from "./positive-number-validation";

const makeSut = (): PositiveNumberValidation => new PositiveNumberValidation("km");

describe("PositiveNumberValidation", () => {
  test("Should return null if field is absent", () => {
    const sut = makeSut();
    const error = sut.validate({});
    expect(error).toBeFalsy();
  });

  test("Should return InvalidParamError if value is not a number", () => {
    const sut = makeSut();
    const error = sut.validate({ km: "not_a_number" });
    expect(error).toEqual(new InvalidParamError("km"));
  });

  test("Should return InvalidParamError if value is zero", () => {
    const sut = makeSut();
    const error = sut.validate({ km: 0 });
    expect(error).toEqual(new InvalidParamError("km"));
  });

  test("Should return InvalidParamError if value is negative", () => {
    const sut = makeSut();
    const error = sut.validate({ km: -10 });
    expect(error).toEqual(new InvalidParamError("km"));
  });

  test("Should return null if value is a positive number", () => {
    const sut = makeSut();
    const error = sut.validate({ km: 100 });
    expect(error).toBeFalsy();
  });
});
