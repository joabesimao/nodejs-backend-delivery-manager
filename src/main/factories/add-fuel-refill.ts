import { Controller } from "../../presentation/protocols/controller";
import { DbAddFuelRefill } from "../../data/usescases/fuel-refill-usecases/add-fuel-refill/db-add-fuel-refill";
import { AddFuelRefillController } from "../../presentation/controllers/fuel-refill-controllers/add-fuel-refill/add-fuel-refill";
import { makeAddFuelRefillValidation } from "./add-fuel-refill-validation";
import { NotifyingAddFuelRefill } from "../../data/usescases/fuel-refill-usecases/add-fuel-refill/notifying-add-fuel-refill";
import { MANAGER_ROLES } from "../config/roles";
import { makeNotifyAccounts } from "./notify-accounts";
import { makeFuelRefillRepository, makeNotificationRepository, makeOilChangeRepository } from "./repositories";

export const makeAddFuelRefillController = (): Controller => {
  const fuelRefillRepository = makeFuelRefillRepository();
  const dbAddFuelRefill = new DbAddFuelRefill(fuelRefillRepository, fuelRefillRepository, fuelRefillRepository);
  const addFuelRefill = new NotifyingAddFuelRefill(
    dbAddFuelRefill,
    makeOilChangeRepository(),
    makeNotificationRepository(),
    makeNotifyAccounts(),
    MANAGER_ROLES
  );
  const validation = makeAddFuelRefillValidation();
  return new AddFuelRefillController(addFuelRefill, validation);
};
