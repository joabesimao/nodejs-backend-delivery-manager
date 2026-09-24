import { ValidationComposite, RequireFieldsValidation, PositiveNumberValidation } from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeAddFuelRefillValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["vehicleId", "deliverymanId", "km", "liters", "pricePerLiter", "totalValue", "refillDate"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(new PositiveNumberValidation("km"));
  validations.push(new PositiveNumberValidation("liters"));
  validations.push(new PositiveNumberValidation("pricePerLiter"));
  validations.push(new PositiveNumberValidation("totalValue"));
  return new ValidationComposite(validations);
};
