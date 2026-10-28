import { Controller } from "../../presentation/protocols/controller";
import { FuelRefillMysqlRepository } from "../../infra/db/mysql/fuel-refill-repository/fuel-refill-repository";
import { DbDeleteFuelRefill } from "../../data/usescases/fuel-refill-usecases/delete-fuel-refill/db-delete-fuel-refill";
import { DeleteFuelRefillController } from "../../presentation/controllers/fuel-refill-controllers/delete-fuel-refill/delete-fuel-refill";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeDeleteFuelRefillController = (): Controller => {
  const fuelRefillRepository = new FuelRefillMysqlRepository(prisma);
  const deleteFuelRefill = new DbDeleteFuelRefill(fuelRefillRepository, fuelRefillRepository, fuelRefillRepository);
  return new DeleteFuelRefillController(deleteFuelRefill);
};
