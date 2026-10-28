import { Controller } from "../../presentation/protocols/controller";
import { FuelRefillMysqlRepository } from "../../infra/db/mysql/fuel-refill-repository/fuel-refill-repository";
import { DbLoadFuelRefill } from "../../data/usescases/fuel-refill-usecases/load-fuel-refill/db-load-fuel-refill";
import { LoadFuelRefillController } from "../../presentation/controllers/fuel-refill-controllers/load-fuel-refill/load-fuel-refill";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadFuelRefillController = (): Controller => {
  const fuelRefillRepository = new FuelRefillMysqlRepository(prisma);
  const loadFuelRefill = new DbLoadFuelRefill(fuelRefillRepository);
  return new LoadFuelRefillController(loadFuelRefill);
};
