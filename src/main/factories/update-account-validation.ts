import {
  AllowedValuesValidation,
  CompareFieldsValidation,
  OptionalEmailValidation,
  OptionalFieldTypeValidation,
  ValidationComposite,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeUpdateAccountValidation = (): ValidationComposite => {
  const validations: Validation[] = [
    new OptionalFieldTypeValidation("name", "string"),
    new OptionalEmailValidation("email", new EmailValidatorAdapter()),
    new OptionalFieldTypeValidation("active", "boolean"),
    new AllowedValuesValidation("role", [
      "admin",
      "gerente_estoque",
      "entregador",
      "user",
    ]),
    new CompareFieldsValidation("password", "passwordConfirmation"),
  ];
  return new ValidationComposite(validations);
};
