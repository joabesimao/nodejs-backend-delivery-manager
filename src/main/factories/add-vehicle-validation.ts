import { ValidationComposite, RequireFieldsValidation, PlateDuplicateValidation } from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { makeVehicleRepository } from "./repositories";

export const makeAddVehicleValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["plate", "model"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(new PlateDuplicateValidation(makeVehicleRepository()));
  return new ValidationComposite(validations);
};
