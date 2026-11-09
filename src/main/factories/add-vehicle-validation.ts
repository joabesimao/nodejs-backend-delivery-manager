import { ValidationComposite, RequireFieldsValidation, PlateDuplicateValidation } from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { VehicleMysqlRepository } from "../../infra/db/mysql/vehicle-repository/vehicle-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeAddVehicleValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["plate", "model"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(new PlateDuplicateValidation(new VehicleMysqlRepository(prisma)));
  return new ValidationComposite(validations);
};
