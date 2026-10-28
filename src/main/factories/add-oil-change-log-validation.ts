import { ValidationComposite, RequireFieldsValidation, PositiveNumberValidation } from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeAddOilChangeLogValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["vehicleId", "deliverymanId", "km", "changeDate"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(new PositiveNumberValidation("km"));
  return new ValidationComposite(validations);
};
