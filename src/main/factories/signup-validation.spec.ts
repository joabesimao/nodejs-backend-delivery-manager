import {
  ValidationComposite,
  CompareFieldsValidation,
  EmailValidation,
  RequireFieldsValidation,
} from "../../presentation/helpers/validators";
import { makeSignupValidation } from "./signup-validation";
import { Validation } from "../../presentation/protocols/validation";
import { EmailValidator } from "../../presentation/protocols/email-validator";

jest.mock("../../presentation/helpers/validators/validation-composite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid(email: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new EmailValidatorStub();
};

describe("Signup validation Factory", () => {
  test("Should call ValidationComposite with all validations", async () => {
    makeSignupValidation();
    const validations: Validation[] = [];
    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequireFieldsValidation(field));
    }
    validations.push(
      new CompareFieldsValidation("password", "passwordConfirmation")
    );
    validations.push(new EmailValidation("email", makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
