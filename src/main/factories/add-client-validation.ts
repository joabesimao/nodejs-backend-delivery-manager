import {
  ValidationComposite,
  RequireFieldsValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeAddClientValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "lastName", "phone"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  return new ValidationComposite(validations);
};
