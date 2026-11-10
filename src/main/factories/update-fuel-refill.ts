import { Controller } from "../../presentation/protocols/controller";
import { DbUpdateFuelRefill } from "../../data/usescases/fuel-refill-usecases/update-fuel-refill/db-update-fuel-refill";
import { UpdateFuelRefillController } from "../../presentation/controllers/fuel-refill-controllers/update-fuel-refill/update-fuel-refill";
import { makeUpdateFuelRefillValidation } from "./update-fuel-refill-validation";
import { makeFuelRefillRepository } from "./repositories";

export const makeUpdateFuelRefillController = (): Controller => {
  const fuelRefillRepository = makeFuelRefillRepository();
  const updateFuelRefill = new DbUpdateFuelRefill(
    fuelRefillRepository,
    fuelRefillRepository,
    fuelRefillRepository,
    fuelRefillRepository
  );
  const validation = makeUpdateFuelRefillValidation();
  return new UpdateFuelRefillController(updateFuelRefill, validation);
};
