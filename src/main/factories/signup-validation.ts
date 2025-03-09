import { RequireFieldsValidation } from "../../presentation/helpers/validator/require-field-validation";
import { ValidationComposite } from "../../presentation/helpers/validator/validation-composite";
import { Validation } from "../../presentation/protocols/validation";
import { CompareFieldsValidation } from "../../presentation/helpers/validator/compare-fields-validation";
import { EmailValidation } from "../../presentation/helpers/validator/email-validation";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSignupValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "email", "password", "passwordConfirmation"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(
    new CompareFieldsValidation("password", "passwordConfirmation")
  );
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
