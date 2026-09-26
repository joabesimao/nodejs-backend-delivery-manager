import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe("EmailValidator Adapter", () => {
  test("Should return false if validator returns false", async () => {
    const sut = new EmailValidatorAdapter();
    jest
      .spyOn(validator, "isEmail")
      .mockReturnValueOnce(false);
    const isValid = await sut.isValid("invalid_email@email.com");
    expect(isValid).toBe(false);
  });

  test("Should return true if validator returns true", async () => {
    const sut = new EmailValidatorAdapter();
    const isValid = await sut.isValid("invalid_email@email.com");
    expect(isValid).toBe(true);
  });

  test("Should return false without calling validator if email is not a string", async () => {
    const sut = new EmailValidatorAdapter();
    const emailSpy = jest.spyOn(validator, "isEmail");
    emailSpy.mockClear();
    for (const email of [123, { $ne: null }, ["a@b.com"], null, undefined]) {
      expect(await sut.isValid(email)).toBe(false);
    }
    expect(emailSpy).not.toHaveBeenCalled();
  });

  test("Should call validator with correct email", async () => {
    const sut = new EmailValidatorAdapter();
    const emailSpy = jest.spyOn(validator, "isEmail");
    await sut.isValid("valid_email@email.com");
    expect(emailSpy).toHaveBeenCalledWith("valid_email@email.com");
  });
});
