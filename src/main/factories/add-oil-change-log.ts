import { Controller } from "../../presentation/protocols/controller";
import { DbAddOilChangeLog } from "../../data/usescases/oil-change-usecases/add-oil-change-log/db-add-oil-change-log";
import { AddOilChangeLogController } from "../../presentation/controllers/oil-change-controllers/add-oil-change-log/add-oil-change-log";
import { makeAddOilChangeLogValidation } from "./add-oil-change-log-validation";
import { NotifyingAddOilChangeLog } from "../../data/usescases/oil-change-usecases/add-oil-change-log/notifying-add-oil-change-log";
import { MANAGER_ROLES } from "../config/roles";
import { makeNotifyAccounts } from "./notify-accounts";
import { makeNotificationRepository, makeOilChangeRepository } from "./repositories";

export const makeAddOilChangeLogController = (): Controller => {
  const oilChangeRepository = makeOilChangeRepository();
  const dbAddOilChangeLog = new DbAddOilChangeLog(oilChangeRepository, oilChangeRepository, oilChangeRepository);
  const addOilChangeLog = new NotifyingAddOilChangeLog(
    dbAddOilChangeLog,
    makeNotificationRepository(),
    makeNotifyAccounts(),
    MANAGER_ROLES
  );
  const validation = makeAddOilChangeLogValidation();
  return new AddOilChangeLogController(addOilChangeLog, validation);
};
