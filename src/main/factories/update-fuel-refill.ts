import { Controller } from "../../presentation/protocols/controller";
import { FuelRefillMysqlRepository } from "../../infra/db/mysql/fuel-refill-repository/fuel-refill-repository";
import { DbUpdateFuelRefill } from "../../data/usescases/fuel-refill-usecases/update-fuel-refill/db-update-fuel-refill";
import { UpdateFuelRefillController } from "../../presentation/controllers/fuel-refill-controllers/update-fuel-refill/update-fuel-refill";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { makeUpdateFuelRefillValidation } from "./update-fuel-refill-validation";

export const makeUpdateFuelRefillController = (): Controller => {
  const fuelRefillRepository = new FuelRefillMysqlRepository(prisma);
  const updateFuelRefill = new DbUpdateFuelRefill(
    fuelRefillRepository,
    fuelRefillRepository,
    fuelRefillRepository,
    fuelRefillRepository
  );
  const validation = makeUpdateFuelRefillValidation();
  return new UpdateFuelRefillController(updateFuelRefill, validation);
};
