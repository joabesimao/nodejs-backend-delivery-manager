import { InvalidParamError } from "../../errors";
import { EmailValidator } from "../../protocols/email-validator";
import { OptionalEmailValidation } from "./optional-email-validation";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid(email: string): Promise<boolean> {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeSut = (): { sut: OptionalEmailValidation; emailValidatorStub: EmailValidator } => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new OptionalEmailValidation("email", emailValidatorStub);
  return { sut, emailValidatorStub };
};

describe("Optional email validation", () => {
  test("Should not call emailValidator if field is absent", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const error = await sut.validate({});
    expect(isValidSpy).not.toHaveBeenCalled();
    expect(error).toBeUndefined();
  });

  test("Should return an InvalidParamError if emailValidator returns false", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockResolvedValueOnce(false);
    const error = await sut.validate({ email: "invalid_email" });
    expect(error).toEqual(new InvalidParamError("email"));
  });

  test("Should return undefined if emailValidator returns true", async () => {
    const { sut } = makeSut();
    const error = await sut.validate({ email: "any_email@email.com" });
    expect(error).toBeUndefined();
  });
});
