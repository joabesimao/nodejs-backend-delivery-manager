import { EmailValidator } from "../../protocols/email-validator";
import { EmailValidation } from "./email-validation";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid(email: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
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

    sut.validate({ email: "any_email@email.com" });
    expect(isValidSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("Should throw if emailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest
      .spyOn(emailValidatorStub, "isValid")
      .mockReturnValueOnce(new Error() as any);

    expect(sut.validate).toThrow();
  });
});
