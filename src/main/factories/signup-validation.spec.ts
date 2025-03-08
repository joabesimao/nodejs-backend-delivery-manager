import { ValidationComposite } from "../../presentation/helpers/validator/validation-composite";
import { makeSignupValidation } from "./signup-validation";
import { RequireFieldsValidation } from "../../presentation/helpers/validator/require-field-validation";
import { CompareFieldsValidation } from "../../presentation/helpers/validator/compare-fields-validation";
import { Validation } from "../../presentation/helpers/validator/validation";
import { EmailValidation } from "../../presentation/helpers/validator/email-validation";
import { EmailValidator } from "../../presentation/protocols/email-validator";

jest.mock("../../presentation/helpers/validator/validation-composite");

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
