import { EmailValidator } from "../../protocols/email-validator";
import { EmailValidation } from "./email-validation";
import { InvalidParamError } from "../../errors";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid(email: string): Promise<boolean> {
      return await new Promise((resolve) => resolve(true));
    }
  }
  return new EmailValidatorStub();
};

interface SutTypes {
  sut: EmailValidation;

  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();

  const sut = new EmailValidation("email", emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe("Email validation", () => {
  test("Should call emailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    await sut.validate({ email: "any_email@email.com" });
    expect(isValidSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("Should throw if emailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest
      .spyOn(emailValidatorStub, "isValid")
      .mockRejectedValueOnce(new Error());

    await expect(sut.validate({ email: "any_email@email.com" })).rejects.toThrow();
  });

  test("Should return an InvalidParamError if emailValidator returns falsy", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest
      .spyOn(emailValidatorStub, "isValid")
      .mockResolvedValueOnce(false);
    const error = await sut.validate({ email: "invalid_email@email.com" });
    expect(error).toEqual(new InvalidParamError("email"));
  });

  test("Should return undefined if emailValidator returns true", async () => {
    const { sut } = makeSut();
    const error = await sut.validate({ email: "any_email@email.com" });
    expect(error).toBeUndefined();
  });
});
