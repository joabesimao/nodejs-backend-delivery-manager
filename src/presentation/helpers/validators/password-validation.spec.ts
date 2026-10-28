import { InvalidParamError, WeakPasswordError } from "../../errors";
import { PasswordValidation } from "./password-validation";

describe("PasswordValidation", () => {
  describe("required", () => {
    const makeSut = (): PasswordValidation => new PasswordValidation("password");

    test("Should return InvalidParamError if password is absent", () => {
      const sut = makeSut();
      expect(sut.validate({})).toEqual(new InvalidParamError("password"));
    });

    test("Should return InvalidParamError if password is not a string", () => {
      const sut = makeSut();
      expect(sut.validate({ password: { $ne: "" } })).toEqual(
        new InvalidParamError("password")
      );
    });

    test("Should return WeakPasswordError if password has less than 8 characters", () => {
      const sut = makeSut();
      expect(sut.validate({ password: "1234567" })).toEqual(new WeakPasswordError());
    });

    test("Should return WeakPasswordError if password exceeds 72 bytes", () => {
      const sut = makeSut();
      expect(sut.validate({ password: "ç".repeat(37) })).toEqual(
        new WeakPasswordError()
      );
    });

    test("Should not return if password is valid", () => {
      const sut = makeSut();
      expect(sut.validate({ password: "12345678" })).toBeFalsy();
      expect(sut.validate({ password: "a".repeat(72) })).toBeFalsy();
    });
  });

  describe("optional", () => {
    const makeSut = (): PasswordValidation =>
      new PasswordValidation("password", true);

    test("Should not return if password is absent", () => {
      const sut = makeSut();
      expect(sut.validate({})).toBeFalsy();
      expect(sut.validate({ password: null })).toBeFalsy();
      expect(sut.validate({ password: "" })).toBeFalsy();
    });

    test("Should validate the password when it is present", () => {
      const sut = makeSut();
      expect(sut.validate({ password: "123" })).toEqual(new WeakPasswordError());
    });
  });
});
