import { Controller } from "../../presentation/protocols/controller";
import { OilChangeMysqlRepository } from "../../infra/db/mysql/oil-change-repository/oil-change-repository";
import { DbAddOilChangeLog } from "../../data/usescases/oil-change-usecases/add-oil-change-log/db-add-oil-change-log";
import { AddOilChangeLogController } from "../../presentation/controllers/oil-change-controllers/add-oil-change-log/add-oil-change-log";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { makeAddOilChangeLogValidation } from "./add-oil-change-log-validation";
import { NotifyingAddOilChangeLog } from "../../data/usescases/oil-change-usecases/add-oil-change-log/notifying-add-oil-change-log";
import { MANAGER_ROLES } from "../config/roles";
import { makeNotificationRepository, makeNotifyAccounts } from "./notify-accounts";

export const makeAddOilChangeLogController = (): Controller => {
  const oilChangeRepository = new OilChangeMysqlRepository(prisma);
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
