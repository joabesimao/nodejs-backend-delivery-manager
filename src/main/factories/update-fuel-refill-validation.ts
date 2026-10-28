import { ValidationComposite, PositiveNumberValidation } from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeUpdateFuelRefillValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["km", "liters", "pricePerLiter", "totalValue"]) {
    validations.push(new PositiveNumberValidation(field));
  }
  return new ValidationComposite(validations);
};
