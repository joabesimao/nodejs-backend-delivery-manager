import { RequireFieldsValidation } from "../../presentation/helpers/validator/require-field-validation";
import { ValidationComposite } from "../../presentation/helpers/validator/validation-composite";
import { Validation } from "../../presentation/helpers/validator/validation";

export const makeSignupValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "email", "password", "passwordConfirmation"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  return new ValidationComposite(validations);
};
