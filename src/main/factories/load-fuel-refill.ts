import { Controller } from "../../presentation/protocols/controller";
import { DbLoadFuelRefill } from "../../data/usescases/fuel-refill-usecases/load-fuel-refill/db-load-fuel-refill";
import { LoadFuelRefillController } from "../../presentation/controllers/fuel-refill-controllers/load-fuel-refill/load-fuel-refill";
import { makeFuelRefillRepository } from "./repositories";

export const makeLoadFuelRefillController = (): Controller => {
  const fuelRefillRepository = makeFuelRefillRepository();
  const loadFuelRefill = new DbLoadFuelRefill(fuelRefillRepository);
  return new LoadFuelRefillController(loadFuelRefill);
};
