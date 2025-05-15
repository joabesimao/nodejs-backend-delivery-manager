import {
  ValidationComposite,
  RequireFieldsValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeAddOrderDeliveryValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["amount", "data", "quantity"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  return new ValidationComposite(validations);
};
