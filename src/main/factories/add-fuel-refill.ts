import { Controller } from "../../presentation/protocols/controller";
import { FuelRefillMysqlRepository } from "../../infra/db/mysql/fuel-refill-repository/fuel-refill-repository";
import { DbAddFuelRefill } from "../../data/usescases/fuel-refill-usecases/add-fuel-refill/db-add-fuel-refill";
import { AddFuelRefillController } from "../../presentation/controllers/fuel-refill-controllers/add-fuel-refill/add-fuel-refill";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { makeAddFuelRefillValidation } from "./add-fuel-refill-validation";
import { NotifyingAddFuelRefill } from "../../data/usescases/fuel-refill-usecases/add-fuel-refill/notifying-add-fuel-refill";
import { OilChangeMysqlRepository } from "../../infra/db/mysql/oil-change-repository/oil-change-repository";
import { MANAGER_ROLES } from "../config/roles";
import { makeNotificationRepository, makeNotifyAccounts } from "./notify-accounts";

export const makeAddFuelRefillController = (): Controller => {
  const fuelRefillRepository = new FuelRefillMysqlRepository(prisma);
  const dbAddFuelRefill = new DbAddFuelRefill(fuelRefillRepository, fuelRefillRepository, fuelRefillRepository);
  const addFuelRefill = new NotifyingAddFuelRefill(
    dbAddFuelRefill,
    new OilChangeMysqlRepository(prisma),
    makeNotificationRepository(),
    makeNotifyAccounts(),
    MANAGER_ROLES
  );
  const validation = makeAddFuelRefillValidation();
  return new AddFuelRefillController(addFuelRefill, validation);
};
