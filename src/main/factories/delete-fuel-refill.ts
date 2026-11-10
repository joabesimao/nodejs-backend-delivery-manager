import { Controller } from "../../presentation/protocols/controller";
import { DbDeleteFuelRefill } from "../../data/usescases/fuel-refill-usecases/delete-fuel-refill/db-delete-fuel-refill";
import { DeleteFuelRefillController } from "../../presentation/controllers/fuel-refill-controllers/delete-fuel-refill/delete-fuel-refill";
import { makeFuelRefillRepository } from "./repositories";

export const makeDeleteFuelRefillController = (): Controller => {
  const fuelRefillRepository = makeFuelRefillRepository();
  const deleteFuelRefill = new DbDeleteFuelRefill(fuelRefillRepository, fuelRefillRepository, fuelRefillRepository);
  return new DeleteFuelRefillController(deleteFuelRefill);
};
