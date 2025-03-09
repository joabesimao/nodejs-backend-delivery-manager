import {
  ValidationComposite,
  EmailValidation,
  RequireFieldsValidation,
} from "../../presentation/helpers/validators";
import { makeLoginValidation } from "./login-validation";
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

describe("Login validation Factory", () => {
  test("Should call ValidationComposite with all validations", async () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ["email", "password"]) {
      validations.push(new RequireFieldsValidation(field));
    }
    validations.push(new EmailValidation("email", makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
