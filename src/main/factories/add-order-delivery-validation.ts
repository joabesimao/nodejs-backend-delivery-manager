import {
  ValidationComposite,
  RequireFieldsValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeAddOrderDeliveryValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["registerId", "amount", "quantity"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  return new ValidationComposite(validations);
};
