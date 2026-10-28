import { ValidationComposite, RequireFieldsValidation, PlateDuplicateValidation } from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { VehiclePlateDuplicateValidatorAdapter } from "../../utils/vehicle-plate-duplicate-validator-adapter";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeAddVehicleValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["plate", "model"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(new PlateDuplicateValidation(new VehiclePlateDuplicateValidatorAdapter(prisma)));
  return new ValidationComposite(validations);
};
