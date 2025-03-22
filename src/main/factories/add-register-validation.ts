import {
  ValidationComposite,
  RequireFieldsValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeAddRegisterValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["client", "address"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  for (const field of ["name", "lastName", "phone"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  for (const field of [
    "street",
    "neighborhood",
    "numberHouse",
    "reference",
    "city",
  ]) {
    validations.push(new RequireFieldsValidation(field));
  }

  return new ValidationComposite(validations);
};
