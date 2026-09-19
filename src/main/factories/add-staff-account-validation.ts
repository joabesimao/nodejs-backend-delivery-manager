import {
  AllowedValuesValidation,
  CompareFieldsValidation,
  EmailValidation,
  RequireFieldsValidation,
  ValidationComposite,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeAddStaffAccountValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of [
    "name",
    "email",
    "password",
    "passwordConfirmation",
    "role",
  ]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(
    new CompareFieldsValidation("password", "passwordConfirmation"),
  );
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  validations.push(
    new AllowedValuesValidation("role", [
      "admin",
      "gerente_estoque",
      "entregador",
      "user",
    ]),
  );
  return new ValidationComposite(validations);
};
