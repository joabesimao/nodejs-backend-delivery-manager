import { ValidationComposite } from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeUpdateVehicleValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  return new ValidationComposite(validations);
};
