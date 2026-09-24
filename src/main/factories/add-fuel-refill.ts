import { Controller } from "../../presentation/protocols/controller";
import { FuelRefillMysqlRepository } from "../../infra/db/mysql/fuel-refill-repository/fuel-refill-repository";
import { DbAddFuelRefill } from "../../data/usescases/fuel-refill-usecases/add-fuel-refill/db-add-fuel-refill";
import { AddFuelRefillController } from "../../presentation/controllers/fuel-refill-controllers/add-fuel-refill/add-fuel-refill";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { makeAddFuelRefillValidation } from "./add-fuel-refill-validation";

export const makeAddFuelRefillController = (): Controller => {
  const fuelRefillRepository = new FuelRefillMysqlRepository(prisma);
  const addFuelRefill = new DbAddFuelRefill(fuelRefillRepository, fuelRefillRepository);
  const validation = makeAddFuelRefillValidation();
  return new AddFuelRefillController(addFuelRefill, validation);
};
