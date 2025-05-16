import {
  ValidationComposite,
  RequireFieldsValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeAddAddressValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of [
    "street",
    "city",
    "neighborhood",
    "numberHouse",
    "reference",
  ]) {
    validations.push(new RequireFieldsValidation(field));
  }
  return new ValidationComposite(validations);
};
