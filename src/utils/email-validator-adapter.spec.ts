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
      .mockResolvedValueOnce(false as unknown as never);
    const isValid = await sut.isValid("invalid_email@email.com");
    expect(isValid).toBe(false);
  });

  test("Should return true if validator returns true", async () => {
    const sut = new EmailValidatorAdapter();
    const isValid = await sut.isValid("invalid_email@email.com");
    expect(isValid).toBe(true);
  });

  test("Should call validator with correct email", async () => {
    const sut = new EmailValidatorAdapter();
    const emailSpy = jest.spyOn(validator, "isEmail");
    await sut.isValid("valid_email@email.com");
    expect(emailSpy).toHaveBeenCalledWith("valid_email@email.com");
  });
});
